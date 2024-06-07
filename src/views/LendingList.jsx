import { React, useEffect, useState } from "react";
import { ScrollView, Text , Alert} from 'react-native'
import Card from "../components/Card"
import Tittle from "../components/Tittle"
import { useIsFocused } from '@react-navigation/native';
import { createTables, selectPrestamos, deletePrestamos } from '../dataBase/db.js'


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
                  const prestamosData = await selectPrestamos()
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

      <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
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
                deletePrestamo={deletePrestamo}
              />
            ))
            : <Text style={{ color: '#B03A2E',fontSize:20, padding:10}}>Sin registros</Text>
        }
      </ScrollView>
    </>
  );
}
