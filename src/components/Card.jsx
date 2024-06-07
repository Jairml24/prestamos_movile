import { React} from "react";
import { StyleSheet, Text, Button, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Card({ id, nombres, fecha,interes, monto,deletePrestamo }) {
    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.navigate('DetailCard', { id: id ,nombres:nombres,interes:interes})} activeOpacity={0.8} style={styles.card}>
            <View >
                <Text style={styles.titulo}>{nombres}</Text>
                <Text style={styles.description}>Prestamo : {fecha}</Text>
                <Text style={styles.description}>Interes: {interes} %</Text>
            </View>
            <View onPress={() => navigation.navigate('DetailCard', { id: id })}>
                <Text style={[styles.titulo, styles.monto]}>S/.  {monto}</Text>
                <Button onPress={()=>deletePrestamo(id)} color={'red'} title="Eliminar" />
            </View>
        </TouchableOpacity >
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
        backgroundColor: '#2ECC71',
        padding: 5,
        borderRadius: 10,
        marginBottom: 5
    }
})

export default Card