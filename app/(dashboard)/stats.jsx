import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { BarChart } from 'react-native-chart-kit'
import ThemedView from '../../components/ThemedView'

const PURPLE = '#A855F7'
const screenWidth = Dimensions.get('window').width - 48
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const getMonday = () => {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

const getWeekData = (sessions) => {
  const counts  = new Array(7).fill(0)
  const minutes = new Array(7).fill(0)
  const monday  = getMonday()

  sessions.forEach(s => {
    const d = new Date(s.date)
    const diffDays = Math.floor((d - monday) / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays < 7) {
      counts[diffDays]++
      minutes[diffDays] += s.duration
    }
  })

  return { counts, minutes }
}

const chartConfig = {
  backgroundGradientFrom: '#111',
  backgroundGradientTo: '#111',
  color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
  labelColor: () => '#555',
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForBackgroundLines: { stroke: '#1a1a1a' },
}

const Stats = () => {
  const [sessions, setSessions] = useState([])

  useFocusEffect(
    useCallback(() => {
      loadSessions()
    }, [])
  )

  const loadSessions = async () => {
    try {
      const raw = await AsyncStorage.getItem('@sessions')
      setSessions(raw ? JSON.parse(raw) : [])
    } catch (e) {
      console.error(e)
    }
  }

  const seedTestData = async () => {
    const monday = getMonday()
    const testSessions = [
      { date: new Date(monday.getTime()).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 1000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 + 1000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 + 2000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 * 2).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 * 4).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 * 4 + 1000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 * 4 + 2000).toISOString(), duration: 25 },
      { date: new Date(monday.getTime() + 86400000 * 4 + 3000).toISOString(), duration: 25 },
    ]
    await AsyncStorage.setItem('@sessions', JSON.stringify(testSessions))
    loadSessions()
  }

  const clearData = async () => {
    await AsyncStorage.removeItem('@sessions')
    loadSessions()
  }

  const today = new Date().toDateString()

  const todayCount = sessions.filter(
    s => new Date(s.date).toDateString() === today
  ).length

  const todayMinutes = sessions
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((acc, s) => acc + s.duration, 0)

  const { counts, minutes } = getWeekData(sessions)
  const weekTotal = minutes.reduce((a, b) => a + b, 0)

  const fmtTime = (mins) =>
    Math.floor(mins / 60) > 0
      ? `${Math.floor(mins / 60)}h ${mins % 60}m`
      : `${mins}m`

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>// stats</Text>

        {/* Botones de testing - borra antes de publicar */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <TouchableOpacity onPress={seedTestData} style={styles.seedBtn}>
            <Text style={styles.seedBtnText}>SEED TEST DATA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearData} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>CLEAR DATA</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{todayCount}</Text>
            <Text style={styles.cardLabel}>TODAY</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{fmtTime(todayMinutes)}</Text>
            <Text style={styles.cardLabel}>TODAY TIME</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{fmtTime(weekTotal)}</Text>
            <Text style={styles.cardLabel}>THIS WEEK</Text>
          </View>
        </View>

        {/* Sessions this week */}
        <Text style={styles.sectionLabel}>// sessions this week</Text>
        <View style={styles.chartWrap}>
          <BarChart
            data={{ labels: DAY_LABELS, datasets: [{ data: counts }] }}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
            fromZero
          />
        </View>

        {/* Minutes this week */}
        <Text style={styles.sectionLabel}>// focus minutes this week</Text>
        <View style={styles.chartWrap}>
          <BarChart
            data={{ labels: DAY_LABELS, datasets: [{ data: minutes }] }}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
            fromZero
          />
        </View>

        {/* Today by hour */}
        <Text style={styles.sectionLabel}>// today by hour</Text>
        <View style={styles.chartWrap}>
          <BarChart
            data={{
              labels: ['6a','9a','12p','3p','6p','9p'],
              datasets: [{
                data: [6, 9, 12, 15, 18, 21].map(hour =>
                  sessions.filter(s => {
                    const d = new Date(s.date)
                    return d.toDateString() === today && d.getHours() === hour
                  }).length
                )
              }]
            }}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
            fromZero
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  )
}

export default Stats

const styles = StyleSheet.create({
  container:    { flex: 1, paddingTop: 60, paddingHorizontal: 24 },
  title:        { fontSize: 20, color: PURPLE, letterSpacing: 3, marginBottom: 24 },
  grid:         { flexDirection: 'row', gap: 8, marginBottom: 32 },
  card:         { flex: 1, backgroundColor: '#111', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, padding: 12 },
  cardValue:    { fontSize: 18, fontWeight: '700', color: PURPLE },
  cardLabel:    { fontSize: 8, color: '#555', letterSpacing: 1.5, marginTop: 4 },
  sectionLabel: { fontSize: 10, color: '#555', letterSpacing: 3, marginBottom: 8 },
  chartWrap:    { backgroundColor: '#111', borderRadius: 8, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 24, overflow: 'hidden' },
  chart:        { borderRadius: 8 },
  seedBtn:      { flex: 1, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: PURPLE, padding: 8, borderRadius: 6 },
  seedBtnText:  { color: PURPLE, fontSize: 10, textAlign: 'center', letterSpacing: 1 },
  clearBtn:     { flex: 1, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#ff4455', padding: 8, borderRadius: 6 },
  clearBtnText: { color: '#ff4455', fontSize: 10, textAlign: 'center', letterSpacing: 1 },
})