//This page is uses the right colors depending on the theme
import { View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ThemedView = ({style, children, ...props}) => {
    const colorScheme = useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light
  return (
  <View
    style={[{ backgroundColor: theme.background }, style]}
    {...props}
  >
    {children}
  </View>
)
}
export default ThemedView
