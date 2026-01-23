import { StyleSheet, Text} from 'react-native'
import Logo from '../assets/img/logo_light.png'
import {Link} from 'expo-router'

//themed components
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedLogo style={styles.img} />  
      <Text style={styles.title}>The number 1</Text>

      <Text style={{ marginTop: 10, marginBottom: 30}}>Los numero 1 en los bilboard </Text>

     <Link href="/about" style={styles.link}> About Page</Link>
      <Link href="/contact" style={styles.link}> Contact Page</Link>
    </ThemedView>
  )
}
export default Home

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
  img: {
    width: 60,
    height: 60,
    resizeMode: 'contain', 
  },
    link:{
        marginVertical: 10,
        borderBottomWidth: 1
    },
    /*
    card: {
        backgroundColor: '#eee',
        padding: 20,
        borderRadius: 5,
        boxShadow: '4px 4px rgba(0,0,0,0.1)'
    }*/
})
