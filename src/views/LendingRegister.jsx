import {React,useState,useRef, useEffect} from "react";
import { View, TextInput, StyleSheet, Button,Text } from 'react-native'
import Tittle from "../components/Tittle"
import { conexionDB, createTables,insertPrestamos} from '../dataBase/db.js'
import { useNavigation ,useIsFocused} from '@react-navigation/native';


export default function LendingRegister() {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [cuotas, setCuotas] = useState('');
  const isFocused = useIsFocused();

  const storePrestamo = () => {
    if(validateFields()){
      const registrar=async ()=>{
        await insertPrestamos(nombre, '2024-06-04', monto, porcentaje, cuotas);
        cleanFields()
        navigation.navigate('LendingList');
      }   
      registrar()
    }
    else{
      setErrorMessage('Por favor, complete todos los campos.');
    } 
  }

  useEffect(()=>{
    if (isFocused) {
      cleanFields()
    }
  },[isFocused])

  const cleanFields=()=>{
    setNombre('')
    setFecha('')
    setMonto('')
    setPorcentaje('')
    setCuotas('')
    setErrorMessage('');
  }
  const validateFields = () => {
    if (nombre === '' || fecha === '' || monto === '' || porcentaje === '' || cuotas === '') {
      return false
    }
    return true
  }
  return (
    <>
      <Tittle tittle='Registrar nuevo prestamo' />
      <View style={styles.container}>
       {errorMessage !== '' && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          onChangeText={text => setNombre(text)}
          value={nombre}
          placeholderTextColor="gray"
     />
        <TextInput
          style={styles.input}
          placeholder="Fecha"
          onChangeText={text => setFecha(text)}
          value={fecha}
           placeholderTextColor="gray"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Monto"
          onChangeText={text => setMonto(text)}
          value={monto}
           placeholderTextColor="gray"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Tasa de interés (%)"
          onChangeText={text => setPorcentaje(text)}
          value={porcentaje}
           placeholderTextColor="gray"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Meses de prestamo"
          onChangeText={text => setCuotas(text)}
          value={cuotas}
           placeholderTextColor="gray"
          keyboardType="numeric"
        />
        <Button onPress={storePrestamo} title='Registrar' />
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    color:'black',
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
