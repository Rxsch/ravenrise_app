import React from 'react'
import {Link} from 'expo-router'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import {Colors} from "../constants/Colors"

const About = () => {
   

  return (
    <View style={[styles.container, { backgroundColor: theme.background}]}>
      <Text style={styles.title}>About Page</Text>

      <Link href="/" style={styles.link}> Back home</Link>
    </View>
  )
}

export default About

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