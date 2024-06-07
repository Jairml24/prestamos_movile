import { React, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text,View } from 'react-native'
import Tittle from "../components/Tittle.jsx"
import { useIsFocused } from '@react-navigation/native';
import { selectDeudaGeneral } from '../dataBase/db.js'

export default function LendingGeneral() {
  const [general, setGeneral] = useState({'total': 0.00, 'pagado':  0.00, 'faltante':  0.00})
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      async function check() {
        let montoTotal = 0, pagado = 0, faltante = 0;
        const deudaData = await selectDeudaGeneral()
        deudaData.forEach(dato => {
          montoTotal = dato.total + montoTotal
          pagado = dato.estado ? dato.total + pagado : pagado
          faltante = dato.estado ? faltante : dato.total + faltante
        })
        setGeneral({ 'total': montoTotal, 'pagado': pagado, 'faltante': faltante })
      }
      check()
    }
  }, [isFocused]);


  return (
    <>
      <Tittle tittle='Deuda general' />
      <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
        <View style={[styles.row, styles.pie]}>
          <Text style={styles.cell}>Deuda pagada</Text>
          <Text style={styles.cell}>S/. {general.pagado.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.pie]}>
          <Text style={styles.cell}>Deuda faltante:</Text>
          <Text style={styles.cell}>S/. {general.faltante.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.pie]}>
          <Text style={styles.cell}>Deuda total: </Text>
          <Text style={styles.cell}> S/. {general.total.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </>
  )
}
const styles = StyleSheet.create({

  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 17,
  },
  pie:{
      marginTop:10,
      backgroundColor:'#ddd',
      padding:15,
      color:'black',
      fontSize:17,
      fontWeight:'bold'
  },
  cell: {
      color: '#444',
      textAlign: 'center',
      fontSize: 24


  }
})