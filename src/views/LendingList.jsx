import { React, useEffect, useState } from "react";
import { ScrollView, Text, Alert, TouchableOpacity, View, StyleSheet } from 'react-native'
import Card from "../components/Card"
import Tittle from "../components/Tittle"
import { useIsFocused } from '@react-navigation/native';
import { createTables, selectPrestamos, deletePrestamos } from '../dataBase/db.js'


export default function LendingList() {
  const [prestamos, setPrestamos] = useState([])
  const [estadoPrestamo, setEstadoPrestamos] = useState(false)
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      async function check() {
        setEstadoPrestamos(false)
        await createTables()
        const prestamosData = await selectPrestamos(false)
        setPrestamos(prestamosData)
      }
      check()
    }
  }, [isFocused]);

  const cambiarEstado = async (newState) => {
    async function check() {
      setEstadoPrestamos(newState)
      const prestamosData = await selectPrestamos(newState)
      setPrestamos(prestamosData)
    }
    check()
  }

  const deletePrestamo = (id) => {
    Alert.alert(
      '¿ESTA SEGURO QUE DESEA ELIMINAR EL REGISTRO?',
      'Recuerda que si lo eliminas tambien se eliminara su detalle',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Si', onPress: async () => {
            await deletePrestamos(id)
            const prestamosData = await selectPrestamos(false)
            setPrestamos(prestamosData)
          }
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <Tittle tittle='Lista de prestamos' />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, marginTop: -20, }}>
        <TouchableOpacity style={[styles.boton, estadoPrestamo ? null : styles.botonSeleccionado]} onPress={() => cambiarEstado(false)}>
          <Text style={[styles.texto, estadoPrestamo ? null : styles.textoSeleccionado]}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, estadoPrestamo ? styles.botonSeleccionado : null]} onPress={() => cambiarEstado(true)}>
          <Text style={[styles.texto, estadoPrestamo ? styles.textoSeleccionado : null]}>Cerrados</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
        {
          prestamos.length > 0 ?
            prestamos.map(prestamo => (
              <Card
                key={prestamo.id_prestamo}
                id={prestamo.id_prestamo}
                nombres={prestamo.nombre}
                fecha={prestamo.fecha}
                interes={prestamo.porcentaje}
                monto={prestamo.monto}
                tipo={prestamo.tipo}
                estado={prestamo.estado}
                deletePrestamo={deletePrestamo}
              />
            ))
            : <Text style={{ color: '#B03A2E', fontSize: 20, padding: 10 }}>Sin registros</Text>
        }
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  boton: {
    borderWidth: 1,
    borderColor: '#444',
    width: '45%',
    paddingVertical: 7
  },
  botonSeleccionado: {
    backgroundColor: '#FA8072'
  },
  texto: {
    color: '#444',
    textAlign: 'center',
    fontSize: 15
  },
  textoSeleccionado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
})