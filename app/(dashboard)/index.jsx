import { StyleSheet, Text } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedLogo style={styles.img} />
      <Spacer height={20} />
      <Text style={styles.title}>The number 1</Text>
      <Spacer height={10} />
      <ThemedText>Los numero 1 en los bilboard</ThemedText>
      <Spacer />
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:     { fontWeight: 'bold', fontSize: 18 },
  img:       { width: 60, height: 60, resizeMode: 'contain' },
  link:      { marginVertical: 10, borderBottomWidth: 1 },
})