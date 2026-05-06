import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'
import { StyleSheet} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Dashboardlayout= () => {
    const colorScheme = useColorScheme() // Select icons by background
    const theme = Colors[colorScheme] ?? Colors.light
  return ( 
    <Tabs 
    screenOptions={{headerShown: false, tabBarStyle: 
        {backgroundColor: theme.navBackground,
         paddingTop: 10,
         height: 90
         },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColorFocused
    }}
    >
    {/*Clock Tab */}
    <Tabs.Screen 
    name= "index" 
    options={{title: 'Clock', tabBarIcon: ({ focused }) => (
        <Ionicons
        size={24}
        name= { focused ? 'time' : 'time-outline'} //Icon name 
        color={ focused ? theme.iconColorFocused : theme.iconColor}
        />
    )}} />
     {/*Stats Tab */}
    <Tabs.Screen 
    name= "stats" 
    options={{title: 'Statistics', tabBarIcon: ({ focused }) => (
        <Ionicons
        size={24}
        name= { focused ? 'stats-chart' : 'stats-chart-outline'} //Icon name 
        color={ focused ? theme.iconColorFocused : theme.iconColor}
        />
    )}} />
     {/*Settings Tab */}
    <Tabs.Screen 
    name= "settings" 
    options={{title: 'Settings', tabBarIcon: ({ focused }) => (
        <Ionicons
        size={24}
        name= { focused ? 'settings-sharp' : 'settings-outline'} //Icon name 
        color={ focused ? theme.iconColorFocused : theme.iconColor}
        />
    )}} />

    </Tabs>
    )
}

export default Dashboardlayout

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