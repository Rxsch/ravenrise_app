import { StyleSheet} from 'react-native'
import React from 'react'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

const Profile = () => {
  return (
   <ThemedView style ={styles.container}>
    
    <ThemedText title={true} style={styles.heading}>
     Your Email
    </ThemedText>
    <Spacer/>
    <ThemedText> Be more efficient with raven</ThemedText>
    <Spacer/>
    </ThemedView>
  )
}

export default Profile

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

})