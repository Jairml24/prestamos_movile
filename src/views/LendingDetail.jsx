import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import Tittle from "../components/Tittle";
import { selectDetallePrestamos, updateStateCuotaPrestamo } from '../dataBase/db.js';
import { format } from 'date-fns';

function DetailCard() {
    const route = useRoute();
    const idPrestamo = route.params.id;
    const nombresDato = route.params.nombres;
    const interesDato = route.params.interes;
    const [detalle, setDetalle] = useState([]);
    const [montos, setMontos] = useState({});

    useEffect(() => {
        async function fetchData() {
            await fetchDataAndUpdate();
        }
        fetchData();
    }, []);


    const updateStateCuota = (id, state,cuota) => {
        const mensaje=state?' FALTANTE':' PAGADA'
        Alert.alert(
            'ACTUALIZACIÓN DE LA CUOTA N°'+cuota,
            '¿Desea poner la cuota como:'+mensaje+' ?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Si', onPress: async () => {
                        const fechaPagado=state?null:format(new Date(),'yyyy-MM-dd')
                        const e=await updateStateCuotaPrestamo(id ,fechaPagado,!state);
                        await fetchDataAndUpdate();
                    }
                },
            ],
            { cancelable: false }
        );
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
                <View style={{flexDirection:'row',justifyContent:'space-between',  backgroundColor:'#5DADE2',}}>
                    <Text style={[styles.cabecera]}>{nombresDato}</Text>
                    <Text style={[styles.cabecera]}>{interesDato}%</Text>
                </View>
                {detalle.length > 0 ?
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.row}>
                            <Text style={styles.head}>N°</Text>
                            <Text style={styles.head}>F pago</Text>
                            <Text style={styles.head}>F pagado</Text>
                            <Text style={styles.head}>Monto</Text>
                            <Text style={[styles.state, styles.head]}>Estado</Text>
                        </View>

                        {detalle.map((registro, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={[styles.cell, styles.smallCell]}>{registro.numero_cuota}</Text>
                                <Text style={[styles.cell, styles.largeCell]}>{registro.fecha_pago}</Text>
                                <Text style={[styles.cell, styles.largeCell]}>{registro.fecha_pagado}</Text>
                                <Text style={[styles.cell, styles.mediumCell]}>{registro.monto}</Text>
                                <TouchableOpacity style={[styles.cell, styles.stateTouchable]} onPress={() => updateStateCuota(registro.id_detalle_prestamo, registro.estado,registro.numero_cuota)}>
                                    <Text style={[styles.state, registro.estado ? styles.paid : styles.unpaid]}>
                                        {registro.estado ? 'P' : 'F'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={[styles.row,styles.pie]}>
                            <Text style={styles.cell}>Pagado</Text>
                            <Text style={styles.cell}>{montos.pagado}</Text>
                        </View>
                        <View style={[styles.row,styles.pie]}>
                            <Text style={styles.cell}>Faltante</Text>
                            <Text style={styles.cell}>{montos.faltante}</Text>
                        </View>
                        <View style={[styles.row,styles.pie]}>
                            <Text style={styles.cell}>Total</Text>
                            <Text style={styles.cell}>{montos.total}</Text>
                        </View>
                    </ScrollView>
                    :<Text style={{ color: '#2874A6 ',fontSize:20, padding:20}}>Cargando...</Text>
                }
            </View>
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
        backgroundColor:'white'
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
    cabecera:{
      
        padding:15,
        color:'white',
        fontSize:17
    },
    pie:{
        marginTop:10,
        backgroundColor:'#ddd',
        padding:15,
        color:'black',
        fontSize:17,
        fontWeight:'bold'
    }
});

export default DetailCard;

