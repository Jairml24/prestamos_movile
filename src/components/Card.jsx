import { React} from "react";
import { StyleSheet, Text, Button, View, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DetailCard from "../views/LendingDetail";

function Card({ id, nombres, fecha, monto }) {
    const navigation = useNavigation()
    return (
        <View style={styles.card}>
            <View >
                <Text style={styles.titulo}>{nombres}</Text>
                <Text style={styles.description}>Prestamo : {fecha}</Text>
                <Text style={styles.description}>Prox pago: {fecha}</Text>
            </View>
            <View >
                <Text style={[styles.titulo, styles.monto]}>S/.  {monto}</Text>
                <Button onPress={() => navigation.navigate('DetailCard', { id: id })} color={'#2ECC71'} title="Detalle" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2980B9',
        marginBottom: 20,
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titulo: {
        fontSize: 19,
        fontWeight: 'bold',
        color: 'white'
    },
    description: {
        fontSize: 16,
        color: '#ccc'

    },
    monto: {
        backgroundColor: '#E74C3C',
        padding: 5,
        borderRadius: 10,
        marginBottom: 5
    }
})

export default Card