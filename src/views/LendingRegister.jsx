import { React, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native'
import Tittle from "../components/Tittle"
import { insertPrestamos ,insertDetallePrestamos} from '../dataBase/db.js'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addMonths } from 'date-fns';


export default function LendingRegister() {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [nombre, setNombre] = useState('');

  const [monto, setMonto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [cuotas, setCuotas] = useState('');
  const isFocused = useIsFocused();

  // campo fecha 
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios'); // Mostrar el selector en modal en iOS
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const hideDatePicker = () => {
    setShowPicker(false);
  };

  const storePrestamo = () => {
    if (validateFields()) {
      const registrar = async () => {
        const fecha = format(date, 'yyyy-MM-dd')
        let fechasPago = []
        let mensualidad = 0

        // guardando el prestamos 
        const idPrestamo=await insertPrestamos(nombre,format( date, 'yyyy-MM-dd'), monto, porcentaje, cuotas);    

        //obteniendo dechas de pago y montos
        if (cuotas > 0) {
          mensualidad = ((monto / cuotas) + ((monto / cuotas) * (porcentaje / 100)))
          for (let index = 0; index < cuotas; index++) {
            if (index == 0) {
              fechasPago.push(addMonths(date, 1));  
            }
            else{
              fechasPago.push(addMonths(fechasPago[index-1], 1));
            }
          }
        }
        else {
          fechasPago.push(addMonths(date, 1)); 
          mensualidad = monto
        }

        // guardando el detalle del prestamos 
        for (let j = 0; j < fechasPago.length; j++) {
          await insertDetallePrestamos(idPrestamo,j+1,format( fechasPago[j], 'yyyy-MM-dd'), mensualidad);
        }
        
        // limpiando campos y redirigiendo a prestamso
        cleanFields()
        navigation.navigate('LendingList');
      }
      registrar()
    }
    else {
      setErrorMessage('Por favor, complete todos los campos.');
    }
  }

  useEffect(() => {
    if (isFocused) {
      cleanFields()
    }
  }, [isFocused])

  const cleanFields = () => {
    setNombre('')
    setMonto('')
    setPorcentaje('')
    setCuotas('')
    setDate(new Date())
    setErrorMessage('');
  }
  const validateFields = () => {
    if (nombre === '' ||  monto === '' || porcentaje === '' || cuotas === '') {
      return false
    }
    return true
  }
  return (
    <>
      <Tittle tittle='Nuevo prestamo' />
      <View style={styles.container}>
        {errorMessage !== '' && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          onChangeText={text => setNombre(text)}
          value={nombre}
          placeholderTextColor="gray"
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text style={styles.text}>{format(date, 'yyyy-MM-dd')}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
          />
        )}
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
        <Button onPress={storePrestamo} style={{ width: 100, padding: 10 }} title='Registrar'  />
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    color: 'black',
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,

  },
  containerDate: {
    width: "100%",
  },

  text: {
    fontSize: 18,
    color: 'gray',
    textAlignVertical: 'bottom'
  },
});
