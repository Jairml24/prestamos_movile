import React from "react";
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, Button, View, ScrollView } from "react-native";
import Tittle from "../components/Tittle";


const registros = [
    {
        numero: 1,
        fechaPago: '2024-06-01',
        fechaPagado: '2024-06-02',
        monto: 200,
        estado: true,
    },
    {
        numero: 2,
        fechaPago: '2024-06-05',
        fechaPagado: '2024-06-05',
        monto: 150,
        estado: true,
    },
    {
        numero: 3,
        fechaPago: '2024-06-10',
        fechaPagado: '2024-06-11',
        monto: 100,
        estado: true,
    },
    {
        numero: 4,
        fechaPago: '2024-06-15',
        fechaPagado: '2024-06-15',
        monto: 250,
        estado: true,
    },
    {
        numero: 5,
        fechaPago: '2024-06-20',
        fechaPagado: '',
        monto: 300,
        estado: false,
    },
    {
        numero: 6,
        fechaPago: '2024-06-25',
        fechaPagado: '',
        monto: 180,
        estado: false,
    },
    {
        numero: 7,
        fechaPago: '2024-07-01',
        fechaPagado: '',
        monto: 220,
        estado: false,
    },
    {
        numero: 8,
        fechaPago: '2024-07-05',
        fechaPagado: '',
        monto: 170,
        estado: false,
    },
    {
        numero: 9,
        fechaPago: '2024-07-10',
        fechaPagado: '',
        monto: 200,
        estado: false,
    },
    {
        numero: 10,
        fechaPago: '2024-07-15',
        fechaPagado: '',
        monto: 250,
        estado: false,
    },
];
let montoTotal=0
registros.forEach(dato=>{
    montoTotal=dato.monto+montoTotal 
})

function DetailCard({ id }) {
    const route = useRoute();
    const miValor = route.params.id;
    return (
        <>
        <Tittle tittle='Detalle prestamo'/>
        <View style={styles.detail}>
            <Text style={styles.description}>id: {miValor}</Text>
            <Text style={styles.description}>Jose Noriega Rojas</Text>
            <Text style={styles.description}>Prestamo: S/. 2500.00</Text>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.head}>N°</Text>
                    <Text style={styles.head}>F pago</Text>
                    <Text style={styles.head}>F pagado</Text>
                    <Text style={styles.head}>Monto</Text>
                    <Text style={[styles.state, styles.head]}>Estado</Text>

                </View>

                {registros.map((registro, index) => (
                    
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{registro.numero}</Text>
                        <Text style={styles.cell}>{registro.fechaPago}</Text>
                        <Text style={styles.cell}>{registro.fechaPagado}</Text>
                        <Text style={styles.cell}>{registro.monto}</Text>
                        <Text style={[styles.state,styles.cell, registro.estado ? styles.paid : styles.unpaid]}>
                            {registro.estado ? 'PAGADO' : 'FALTA'}
                        </Text>
                    </View>
                ))}

                <View style={styles.row}>
                    <Text style={styles.cell}>Total</Text>
                    <Text></Text>
                    <Text></Text>
                    <Text style={styles.cell}>{montoTotal}</Text>
                    <Text></Text>
                </View>
            </ScrollView>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    detail:{
        paddingHorizontal:10
    },
    description: {
        fontSize: 19,
        color:'black'
        
    },
    container: {
        paddingHorizontal: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 15,
    },
    head: {
        fontWeight: 'bold',
        color:'black'
    },
    cell:{
        color:'black'
    },
    state: {
        width: '16%',
        textAlign: 'center'
    },

    paid: {
        backgroundColor: 'green',
        color: 'white',
        padding: 3
    },
    unpaid: {
        backgroundColor: 'red',
        color: 'white',
        padding: 3
    }
});
export default DetailCard