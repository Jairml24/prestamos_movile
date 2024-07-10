import { React, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native'
import Tittle from "../components/Tittle"
import { insertPrestamos, insertDetallePrestamos } from '../dataBase/db.js'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addMonths, addDays } from 'date-fns';
import RNPickerSelect from "react-native-picker-select";


export default function LendingRegister() {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');

  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [cuotas, setCuotas] = useState('');

  const isFocused = useIsFocused();
  const [tipo, setTipo] = useState(null);
  const [tipoInteres, setTipoInteres] = useState(null);
  const [tipoCuotas, setTipoCuotas] = useState(null);
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

  const changeTipo = (value) => {
    if (value === '0') {
      cleanFields()
    }
    else {
      setPorcentaje('0')
      setCuotas('0')
      setTipoInteres('0')
      setTipoCuotas('0')
    }
    setTipo(value)
  }

  const changeTipoInteres = (value) => {
    setTipoInteres(value)
  }
  const changeTipoCuotas = (value) => {
    setTipoCuotas(value)
  }


  const storePrestamo = () => {
    if (validateFields()) {
    const registrar = async () => {
      const fecha = format(date, 'yyyy-MM-dd')
      let fechasPago = []
      let monto_cuota = 0
      let tipoPrestamo = tipo === '0' ? true : false

      // guardando el prestamos 
      const idPrestamo = await insertPrestamos(nombre, format(date, 'yyyy-MM-dd'), monto, porcentaje, cuotas, tipoPrestamo);

      //obteniendo dechas de pago y montos
      if (cuotas > 0) {
        if(tipoInteres==='0'){
          monto_cuota = ((monto / cuotas) + ((monto / cuotas) * (porcentaje / 100)))
        }
        else{
          let interes_cuota=monto*(porcentaje / 100)
          monto_cuota = ((monto / cuotas) + interes_cuota)
        }

        // sacando los tipos de cuotas si por mes quincena semanal o diario para claular las cuotas y fechas 
        let suma, numero;

        switch (tipoCuotas) {
          case '0':
            suma = addMonths
            numero = 1
            break;
          case '1':
            suma = addDays
            numero = 15
            break;
          case '2':
            suma = addDays
            numero = 7
            break;
          case '3':
            suma = addDays
            numero = 1
            break;
        }

        for (let index = 0; index < cuotas; index++) {
          if (index == 0) {
            fechasPago.push(suma(date, numero));
          }
          else {

            fechasPago.push(suma(fechasPago[index - 1], numero));
          }
        }
      }
      else {
        fechasPago.push(date);
        monto_cuota = monto
      }

      // guardando el detalle del prestamos 
      for (let j = 0; j < fechasPago.length; j++) {
        await insertDetallePrestamos(idPrestamo, j + 1, format(fechasPago[j], 'yyyy-MM-dd'), monto_cuota, 0);
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
    setPorcentaje('')
    setCuotas('')
    setNombre('')
    setMonto('')
    setDate(new Date())
    setTipo(null)
    setTipoInteres(null)
    setTipoCuotas(null)
    setErrorMessage('');
  }
  const validateFields = () => {
    if (nombre === '' || monto === '' || porcentaje === '' || cuotas === '' || tipoInteres==null || tipoCuotas==null) {
      return false
    }
    return true
  }
  return (
    <>
      <Tittle tittle='Nuevo prestamo' />
      <View style={styles.container}>
        {errorMessage !== '' && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        <RNPickerSelect
          onValueChange={(value) => changeTipo(value)}
          items={[
            { label: 'Cuotas', value: '0' },
            { label: 'Normal', value: '1' },
          ]}
          placeholder={{ label: 'Tipo prestamo', value: null }}
          style={pickerSelectStyles}
          value={tipo}
        />
        {
          tipo === '0' && (
            <><RNPickerSelect
              onValueChange={(value) => changeTipoInteres(value)}
              items={[
                { label: 'Total', value: '0' },
                { label: 'Por Couta', value: '1' },
              ]}
              placeholder={{ label: 'Tipo de interes aplicable', value: null }}
              style={pickerSelectStyles}
              value={tipoInteres} /><RNPickerSelect
                onValueChange={(value) => changeTipoCuotas(value)}
                items={[
                  { label: 'Mensual', value: '0' },
                  { label: 'Quincenal', value: '1' },
                  { label: 'Semanal', value: '2' },
                  { label: 'Diario', value: '3' },
                ]}
                placeholder={{ label: 'Configuración de cuotas', value: null }}
                style={pickerSelectStyles}
                value={tipoCuotas} /></>
          )}
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
          style={[styles.input, tipo === '1' ? styles.inputHide : '']}
          placeholder="Tasa de interés (%)"
          onChangeText={text => setPorcentaje(text)}
          value={porcentaje}
          placeholderTextColor="gray"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, tipo === '1' ? styles.inputHide : '']}
          placeholder="Numero de cuotas"
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

  inputHide: {
    display: 'none'
  }
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  inputAndroidHidden: {
    display: 'none', // No se puede usar directamente en React Native
  },
  placeholder: {
    color: 'black',
  },
});