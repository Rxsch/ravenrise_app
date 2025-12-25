import { View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ThemedCard = ({style, children, ...props}) => {
    const colorScheme = useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light
  return (
  <View
    style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
    {...props}
  >
    {children}
  </View>
)
}
export default ThemedCard

const styles= StyleSheet.create({
    card: {
        borderRadius: 5,
        padding: 20
    }
})