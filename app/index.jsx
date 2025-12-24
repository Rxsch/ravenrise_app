import { StyleSheet, Text, View, Image} from 'react-native'
import Logo from '../assets/logo_light.png'
import {Link} from 'expo-router'

const Home = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.img} />  
      <Text style={styles.title}>The number 1</Text>

      <Text style={{ marginTop: 10, marginBottom: 30}}>Alarm App Ola que ace</Text>

     <Link href="/about" style={styles.link}> About Page</Link>
      <Link href="/contact" style={styles.link}> Contact Page</Link>
    </View>
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
        height: 150,
        width: 150,
        marginVertical: 20,

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