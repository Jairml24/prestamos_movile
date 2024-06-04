import React from "react"
import { Text,StyleSheet,Linking  } from "react-native"

function Author(){
    const handlePress = () => {
        Linking.openURL('https://jonatandev.netlify.app/');
      };
    return(
        <Text onPress={handlePress} style={styles.author}>Desarrollado en ReactNative por JJML</Text>
    )
}

const styles=StyleSheet.create({
    author:{
        position:'absolute',
        fontSize:16,
        color:'#bbb',
        padding:15,
        textAlign:'center',
        bottom:3,
        right:3
    }
})

export default Author