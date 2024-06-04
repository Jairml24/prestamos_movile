import React from "react"
import { Text,StyleSheet, View } from "react-native"


function Tittle({tittle}){
    return(
        <View style={styles.head}>
            <Text style={{ fontSize:22, color:'#ddd'}} >{tittle}</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    head:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#444',
        padding:15,
        textAlign:'center',
  
        marginBottom:20
    }
})

export default Tittle