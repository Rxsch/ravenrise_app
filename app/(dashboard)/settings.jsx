import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import ThemedView from '../../components/ThemedView'

const PURPLE = '#A855F7'

const DEFAULTS = { focus: 25, short: 5, long: 15, cycles: 4 }

const Settings = () => {
  const [durations, setDurations] = useState(DEFAULTS)
  const [saved, setSaved]         = useState(false)

  useFocusEffect(
    useCallback(() => {
      load()
    }, [])
  )

  const load = async () => {
    try {
      const raw = await AsyncStorage.getItem('@prefs')
      if (raw) {
        const prefs = JSON.parse(raw)
        if (prefs.durations) setDurations(prefs.durations)
      }
    } catch (e) { console.error(e) }
  }

  const save = async () => {
    try {
      await AsyncStorage.setItem('@prefs', JSON.stringify({ durations }))
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch (e) { console.error(e) }
  }

  const adj = (key, delta) => {
    const limits = { focus: [1,60], short: [1,30], long: [5,60], cycles: [1,10] }
    const [min, max] = limits[key]
    setDurations(prev => ({
      ...prev,
      [key]: Math.min(max, Math.max(min, prev[key] + delta))
    }))
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionLabel}>Durations</Text>
        {[
          { key: 'focus',  label: 'Focus',             sub: 'minutes per session' },
          { key: 'short',  label: 'Short Break',        sub: 'between sessions'   },
          { key: 'long',   label: 'Long Break',         sub: 'after full cycle'   },
          { key: 'cycles', label: 'Sessions per cycle', sub: 'before long break'  },
        ].map(item => (
          <View key={item.key} style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowSub}>{item.sub}</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => adj(item.key, -1)}>
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterVal}>{durations[item.key]}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => adj(item.key, 1)}>
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveBtn, saved && { borderColor: '#00ff88' }]}
          onPress={save}
        >
          <Text style={[styles.saveBtnText, saved && { color: '#00ff88' }]}>
            {saved ? '✓ saved' : '// save settings'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:      { flex: 1, paddingTop: 60, paddingHorizontal: 24 },
  title:          { fontSize: 40, color: PURPLE, letterSpacing: 3, marginBottom: 24, fontWeight: '800',
   },
  sectionLabel:   { fontSize: 10, color: PURPLE, letterSpacing: 3, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  row:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  rowLabel:       { fontSize: 13, color: '#e8e8e8' },
  rowSub:         { fontSize: 10, color: PURPLE, marginTop: 2 },
  counter:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn:     { width: 36, height: 36, borderRadius: 4, borderWidth: 1, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  counterBtnText: { color: '#e8e8e8', fontSize: 20, lineHeight: 24 },
  counterVal:     { fontSize: 20, color: PURPLE, fontWeight: '700', minWidth: 32, textAlign: 'center' },
  saveBtn:        { marginTop: 32, borderWidth: 1, borderColor: PURPLE, borderRadius: 8, padding: 14, alignItems: 'center' },
  saveBtnText:    { color: PURPLE, fontSize: 12, letterSpacing: 2 },
})