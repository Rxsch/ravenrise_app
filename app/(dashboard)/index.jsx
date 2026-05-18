import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

//Labels
const MODE_LABELS = {
  focus: 'FOCUS',
  short: 'SHORT BREAK',
  long:  'LONG BREAK',
}
//Colors of the modes
const MODE_COLORS = {
  focus: '#A855F7',
  short: '#00aaff',
  long:  '#ffaa00',
}
//Seconds to minutes function
const fmt = (secs) => {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const Home = () => {
  const [mode, setMode]         = useState('focus')
  const [running, setRunning]   = useState(false)
  const [session, setSession]   = useState(1)
  const [durations, setDurations] = useState({
    focus: 25 * 60,
    short: 5  * 60,
    long:  15 * 60,
    cycles: 4,
  })
  const [remaining, setRemaining] = useState(25 * 60)
  const intervalRef               = useRef(null)

  const color = MODE_COLORS[mode]

  // Carga preferencias de settings cada vez que vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      const loadPrefs = async () => {
        try {
          const raw = await AsyncStorage.getItem('@prefs')
          if (raw) {
            const prefs = JSON.parse(raw)
            if (prefs.durations) {
              const d = {
                focus:  prefs.durations.focus  * 60,
                short:  prefs.durations.short  * 60,
                long:   prefs.durations.long   * 60,
                cycles: prefs.durations.cycles,
              }
              setDurations(d)
              // Solo resetea el timer si no está corriendo
              if (!running) {
                setRemaining(d[mode])
              }
            }
          }
        } catch (e) { console.error(e) }
      }
      loadPrefs()
    }, [mode, running])
  )

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const handleComplete = () => {
    playSound()
    if (mode === 'focus') {
      switchMode(session % durations.cycles === 0 ? 'long' : 'short')
    } else {
      setSession(prev => {
        const next = prev + 1
        return next >= 51 ? 1 : next
      })
      switchMode('focus')
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setRemaining(durations[m])
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setRemaining(durations[mode])
  }

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/crowSoundEffect.mp3')
      )
      await sound.playAsync()
    } catch (e) { console.error(e) }
  }

  const progress = 1 - remaining / durations[mode]

  return (
    <ThemedView style={styles.container}>

      <View style={styles.topBar}>
        <ThemedLogo style={styles.logo} />
        <Text style={styles.sessionText}>
          Session <Text style={[styles.sessionNum, { color }]}>{session}</Text>
        </Text>
      </View>

      <View style={styles.modeTabs}>
        {['focus', 'short', 'long'].map(m => (
          <TouchableOpacity
            key={m}
            onPress={() => switchMode(m)}
            style={[styles.modeTab, mode === m && { borderColor: color, backgroundColor: color + '15' }]}
          >
            <Text style={[styles.modeTabText, mode === m && { color }]}>
              {m === 'focus' ? 'focus' : m === 'short' ? 'short' : 'long'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timerWrap}>
        <View style={[styles.ring, { borderColor: color + '30' }]}>
          <View style={styles.timerInner}>
            <Text style={[styles.timerText, { color }]}>{fmt(remaining)}</Text>
            <Text style={styles.modeLabel}>{MODE_LABELS[mode]}</Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: color, backgroundColor: color + '15' }]}
          onPress={reset}
        >
          <Ionicons name="refresh" size={22} color={color} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { borderColor: color, backgroundColor: color + '15' }]}
          onPress={() => setRunning(r => !r)}
        >
          <Ionicons name={running ? 'pause' : 'play'} size={28} color={color} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: color, backgroundColor: color + '15' }]}
          onPress={() => handleComplete()}
        >
          <Ionicons name="play-skip-forward" size={22} color={color} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>

    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  sessionText: {
    fontSize: 12,
    color: '#555',
    letterSpacing: 1,
  },
  sessionNum: {
    fontWeight: 'bold',
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  modeTabText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: '#555',
    textTransform: 'uppercase',
  },
  timerWrap: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ring: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modeLabel: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 3,
    marginTop: 6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
})