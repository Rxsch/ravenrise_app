import { StyleSheet} from 'react-native'
import React from 'react'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

const Stats = () => {
  return (
    // part should go here
   <ThemedView style ={styles.container}>
    
    <ThemedText title={true} style={styles.heading}>
     Your Email
    </ThemedText>
    <Spacer/>
    <ThemedText> Be more efficient with raven 2</ThemedText>
    <Spacer/>
    </ThemedView>
  )
}

export default Stats

const styles = StyleSheet.create({
   container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    heading:{
    fontWeight:"bold",
    fontsize: 10,
    textAlign: "center",
    },

})