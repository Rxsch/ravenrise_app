import { View, useColorScheme } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors'

const ThemedView = () => {
    const colorScheme = useColorScheme()
  return (
    <View>
      <Text>ThemedView</Text>
    </View>
  )
}

export default ThemedView