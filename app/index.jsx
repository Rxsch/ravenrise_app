import { StyleSheet, Text} from 'react-native'
import Logo from '../assets/img/logo_light.png'
import {Link} from 'expo-router'

//themed components
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'


const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedLogo/>
      <Spacer height={20} />
     
      <ThemedText style={styles.title} title={true}>
      The number 1
      </ThemedText>
     
      <Spacer height={10} />
      <ThemedText>Los numero 1 en los bilboard </ThemedText>
      <Spacer />
 
     <Link href="/about">
     <Text style={styles.link}> About Page </Text>
     </Link>
      <Link href="/contact">
      <Text style={styles.link}>
      Contact Page </Text>
      </Link>
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
