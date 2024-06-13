import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Button, Modal, TextInput } from "react-native";
import Tittle from "../components/Tittle";
import { selectDetallePrestamos, updateStateCuotaPrestamo, insertDetallePrestamos, updatePrestamo, closePrestamo, cuotasNoPagadas ,selectPrestamo} from '../dataBase/db.js';
import { format } from 'date-fns';

function DetailCard() {
    const route = useRoute();
    const idPrestamo = route.params.id;
    const nombresDato = route.params.nombres;
    const interesDato = route.params.interes;
    const tipoDato = route.params.tipo;
    // const estadoDato = route.params.estado;
    const [estadoDato, setEstadoDato] = useState(route.params.estado);

    const [detalle, setDetalle] = useState([]);
    const [montos, setMontos] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [tipo, setTipo] = useState(null);
    const [monto, setMonto] = useState('');

    const toggleModal = () => {
        setMonto('')
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        async function fetchData() {
            await fetchDataAndUpdate();
        }
        fetchData();
    }, []);


    const updateStateCuota = (id, state, cuota) => {
        const mensaje = state ? ' FALTANTE' : ' PAGADA'
        Alert.alert(
            'ACTUALIZACIÓN DE LA CUOTA N°' + cuota,
            '¿Desea poner la cuota como:' + mensaje + ' ?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Si', onPress: async () => {
                        const fechaPagado = state ? null : format(new Date(), 'yyyy-MM-dd')
                        const e = await updateStateCuotaPrestamo(id, fechaPagado, !state);
                        await fetchDataAndUpdate();
                    }
                },
            ],
            { cancelable: false }
        );
    };


    const cerrarPrestamo = (id) => {
        Alert.alert(
            'CERRAR PRESTAMO',
            '¿Desea cerrar el prestamo?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Si', onPress: async () => {
                        const cuotas = await cuotasNoPagadas(id);
                        if (cuotas.length > 0) {
                            Alert.alert(
                                'ERROR',
                                'NO SE PUEDE CERRAR EL PRESTAMO PORQUE NO SE PAGARON TODAS LAS CUOTAS'
                            )
                        }
                        else {
                            await closePrestamo(id);
                            Alert.alert(
                                'EXITO',
                                'EL PRESTAMO SE CERRO CORRECTAMENTE'
                            )
                            setEstadoDato(!estadoDato)
                        }
                    }
                },
            ],
            { cancelable: false }
        );
    };
    const cerrarPrestamoNormal = (id) => {
        Alert.alert(
            'CERRAR PRESTAMO',
            '¿Desea cerrar el prestamo?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Si', onPress: async () => {
                        const monto = await selectPrestamo(id);
                        //    console.log(monto[0].monto)
                        if (!monto[0].monto==0) {
                            Alert.alert(
                                'ERROR',
                                'NO SE PUEDE CERRAR EL PRESTAMO PORQUE EL MONTO DEL PRESTAMO ES DIFERENTE A 0'
                            )
                        }
                        else {
                            await closePrestamo(id);
                            Alert.alert(
                                'EXITO',
                                'EL PRESTAMO SE CERRO CORRECTAMENTE'
                            )
                            setEstadoDato(!estadoDato)
                        }
                    }
                },
            ],
            { cancelable: false }
        );
    };

    const handleRegister = () => {
        const registrarDetalle = async () => {
            await insertDetallePrestamos(idPrestamo, '-', format(new Date(), 'yyyy-MM-dd'), monto, tipo === '0' ? false : true);
            await updatePrestamo(idPrestamo, monto, tipo === '0' ? false : true);
            await fetchDataAndUpdate();
            toggleModal();
        }
        registrarDetalle()
    };

    // funcion para traer datos de detalle de deuda 
    const fetchDataAndUpdate = async () => {
        let montoTotal = 0, pagado = 0, faltante = 0;
        const detalleData = await selectDetallePrestamos(idPrestamo);
        detalleData.forEach(dato => {
            montoTotal = dato.monto + montoTotal;
            pagado = dato.estado ? dato.monto + pagado : pagado;
            faltante = dato.estado ? faltante : dato.monto + faltante;
        });
        setDetalle(detalleData);
        setMontos({ 'total': montoTotal, 'pagado': pagado, 'faltante': faltante });
    };

    return (
        <>
            <Tittle tittle='Detalle prestamo' />

            <View style={styles.detail}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5DADE2', paddingHorizontal: 5 }}>
                    <Text style={[styles.cabecera]}>{nombresDato}</Text>
                    {
                        tipoDato ?
                          <Text style={[styles.cabecera]}>{interesDato}%</Text>
                          :
                          estadoDato ?
                          null:<Button color='#F39C12' title='Registrar' onPress={toggleModal} />
                    }
                    {
                    estadoDato ?
                        null:<Button color='#333' title='Cerrar' onPress={() => tipoDato ?cerrarPrestamo(idPrestamo):cerrarPrestamoNormal(idPrestamo)} />
                    }
                </View>
                {detalle.length > 0 ?
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.row}>
                            <Text style={styles.head}>N°</Text>
                            <Text style={styles.head}>F pago</Text>
                            {tipoDato ? <Text style={styles.head}>F pagado</Text> : null}
                            <Text style={styles.head}>Monto</Text>
                            <Text style={[styles.state, styles.head]}>Estado</Text>
                        </View>

                        {detalle.map((registro, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={[styles.cell, styles.smallCell]}>{registro.numero_cuota}</Text>
                                <Text style={[styles.cell, styles.largeCell]}>{registro.fecha_pago}</Text>
                                {tipoDato ? <Text style={[styles.cell, styles.largeCell]}>{registro.fecha_pagado}</Text> : null}
                                <Text style={[styles.cell, styles.mediumCell]}>{registro.monto}</Text>
                                {
                                    tipoDato ?
                                        <TouchableOpacity style={[styles.cell, styles.stateTouchable]} 
        onPress={estadoDato?null:() => updateStateCuota(registro.id_detalle_prestamo, registro.estado, registro.numero_cuota)}>
                                            <Text style={[styles.state, registro.estado ? styles.paid : styles.unpaid]}>
                                                {registro.estado ? 'P' : 'F'}
                                            </Text>
                                        </TouchableOpacity> :
                                        <TouchableOpacity style={[styles.cell, styles.stateTouchable]}>
                                            <Text style={[styles.state, registro.estado ? styles.paid : styles.unpaid]}>
                                                {registro.estado ? 'Entrada' : 'Salida'}
                                            </Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        ))}

                        {
                            tipoDato ? <>
                            {estadoDato ?
                             <Text style={styles.cerrado}>Prestamo cerrado</Text>:
                                <><View style={[styles.row, styles.pie]}>
                                    <Text style={styles.cell}>Pagado</Text>
                                    <Text style={styles.cell}>{montos.pagado}</Text>
                                </View>
                                <View style={[styles.row, styles.pie]}>
                                    <Text style={styles.cell}>Faltante</Text>
                                    <Text style={styles.cell}>{montos.faltante}</Text>
                                </View></>
                                }
                                <View style={[styles.row, styles.pie]}>
                                    <Text style={styles.cell}>Total</Text>
                                    <Text style={styles.cell}>{montos.total}</Text>
                                </View></> : <Text style={{ color: '#2874A6 ', fontSize: 20, padding: 20 }}>Cargando...</Text>
                        }
                    </ScrollView>
                    : <Text style={{ color: '#2874A6 ', fontSize: 20, padding: 20 }}>Cargando...</Text>
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Gestionar Préstamo</Text>

                        <RNPickerSelect
                            onValueChange={(value) => setTipo(value)}
                            items={[
                                { label: 'Salida (Préstamo)', value: '0' },
                                { label: 'Entrada (Pago)', value: '1' },
                            ]}
                            placeholder={{ label: 'Seleccione una opción...', value: null }}
                            style={pickerSelectStyles}

                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el monto"
                            value={monto}
                            onChangeText={setMonto}
                            keyboardType="numeric"
                            placeholderTextColor="gray"
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Registrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={toggleModal}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    detail: {
        paddingHorizontal: 10,
        marginBottom: 140
    },
    description: {
        fontSize: 19,
        color: 'black'
    },
    container: {
        paddingHorizontal: 5,
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 17,
    },
    head: {
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        textAlign: 'center'
    },
    cell: {
        color: 'black',
        textAlign: 'center',

    },
    smallCell: {
        flex: 1,
    },
    mediumCell: {
        flex: 2,
    },
    largeCell: {
        flex: 3,
    },
    stateTouchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    state: {
        textAlign: 'center',
        width: '100%',
    },
    paid: {
        backgroundColor: 'green',
        color: 'white',
        padding: 3,
        overflow: 'hidden',
        flexWrap: 'nowrap',
    },
    unpaid: {
        backgroundColor: 'red',
        color: 'white',
        padding: 3,
        overflow: 'hidden',
        flexWrap: 'nowrap',
    },
    cabecera: {

        padding: 15,
        color: 'white',
        fontSize: 17
    },
    cerrado:{
        color:'red',
        fontSize:18,
        marginTop:20
    },
    pie: {
        marginTop: 10,
        backgroundColor: '#ddd',
        padding: 15,
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 350,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: '#922B21',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
        color: 'black'
    },
    modalButton: {
        backgroundColor: '#2874A6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#A93226',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

const pickerSelectStyles = StyleSheet.create({

    inputAndroid: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
        color: 'black',
        backgroundColor: '#ddd'
    },
    placeholder: {
        color: 'black',
    },
});
export default DetailCard;

