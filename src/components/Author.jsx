import React from "react"
import { Text,StyleSheet,Linking  } from "react-native"

function Author(){
    const handlePress = () => {
        Linking.openURL('https://jonatandev.netlify.app/');
      };
    return(
        <Text onPress={handlePress} style={styles.author}>Desarrollado por JJML</Text>
    )
}

const styles=StyleSheet.create({
    author:{
        fontSize:14,
        color:'#bbb',
        alignSelf:'center'
    }
})

export default Author