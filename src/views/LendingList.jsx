import { React, useEffect, useState } from "react";
import { ScrollView, Text } from 'react-native'
import Card from "../components/Card"
import Tittle from "../components/Tittle"
import Author from "../components/Author"
import { useIsFocused } from '@react-navigation/native';
import { conexionDB, createTables, selectPrestamos, deletePrestamos } from '../dataBase/db.js'

export default function LendingList() {
  const [prestamos, setPrestamos] = useState([])
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      async function check() {
        await createTables()
        const prestamosData = await selectPrestamos()
        setPrestamos(prestamosData)
      }
      check()
    }
  }, [isFocused]);

  return (
    <>
      <Tittle tittle='Lista de prestamos' />
      <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
        {
          prestamos.length > 0 ?
            prestamos.map(prestamo => (
              <Card
                key={prestamo.id_prestamo}
                id={prestamo.id_prestamo}
                nombres={prestamo.nombre}
                fecha={prestamo.fecha}
                monto={prestamo.monto}
              />
            ))
            : <Text style={{ color: 'blue' }}>Cargando...</Text>
        }
      </ScrollView>
      <Author />
    </>
  );
}
