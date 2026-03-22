//This page is uses the right colors depending on the theme
import { View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const ThemedView = ({style, children, safe=false, ...props}) => {
    const colorScheme = useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light
  
    if (!safe) return (
   <View
    style={[{ backgroundColor: theme.background }, style]}
    {...props}
  >
    {children}
   </View>
)
//Safe
const insets = useSafeAreaInsets()
return( 
    <View
     style= {[{
       backgroundColor: theme.background, 
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
     }, style]}
    {...props}
  >
    {children}
   </View>)
}
export default ThemedView
