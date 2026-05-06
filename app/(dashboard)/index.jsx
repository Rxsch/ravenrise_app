import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'

//Duration of modes
const DURATIONS = {
  focus: 25 * 60,
  short: 5  * 60,
  long:  15 * 60,
}
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
  const [mode, setMode]           = useState('focus') //Mode being used
  const [remaining, setRemaining] = useState(DURATIONS.focus) //Time left
  const [running, setRunning]     = useState(false) //
  const [session, setSession]     = useState(1)
  const intervalRef               = useRef(null)

  const color = MODE_COLORS[mode]

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
    if (mode === 'focus') {
      setSession(s => s + 1)
      switchMode(session % 4 === 0 ? 'long' : 'short')
    } else {
      switchMode('focus')
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setRemaining(DURATIONS[m])
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setRemaining(DURATIONS[mode])
  }

  const progress = 1 - remaining / DURATIONS[mode]

  return (
    <ThemedView style={styles.container}>

      <View style={styles.topBar}>
        <ThemedLogo style={styles.logo} />
        <Text style={styles.sessionText}>
          session <Text style={[styles.sessionNum, { color }]}>{session}</Text>
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
        <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
          <Text style={styles.secondaryBtnText}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { borderColor: color, backgroundColor: color + '15' }]}
          onPress={() => setRunning(r => !r)}
        >
          <Text style={[styles.playBtnText, { color }]}>
            {running ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleComplete()}>
          <Text style={styles.secondaryBtnText}>⏭</Text>
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
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
    marginBottom: 48,
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
  playBtnText: {
    fontSize: 26,
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  secondaryBtnText: {
    fontSize: 18,
    color: '#555',
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