import { openDatabase } from 'react-native-sqlite-storage';

export const db = openDatabase({
    name: 'prestamos'
})


export const createTables = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS prestamo (
              id_prestamo INTEGER PRIMARY KEY AUTOINCREMENT,
              nombre TEXT,
              fecha DATE,
              monto INT,
              porcentaje INT,
              cuotas INT
            );
      
            CREATE TABLE IF NOT EXISTS detalle_prestamo (
                id_detalle_prestamo INTEGER PRIMARY KEY AUTOINCREMENT,
                id_prestamo INTEGER,
                numero_cuota INT, 
                fecha_pago DATE,
                fecha_pagado DATE, 
                monto INT, 
                estado BOOLEAN, 
                FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo)
            );`,
                [],
                () => {
                    resolve('correcto tablas')
                },
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

export const selectPrestamos = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM prestamo order by id_prestamo desc`,
                [],
                (sqlTxn, res) => {
                    const prestamos = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        prestamos.push(res.rows.item(i));
                    }
                    resolve(prestamos);
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
};

export const insertPrestamos = (nombre,fecha,monto,porcentaje,cuotas) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `insert into prestamo (nombre,fecha,monto,porcentaje,cuotas) values(?,?,?,?,?)`,
                [nombre,fecha,monto,porcentaje,cuotas],
                (sqlTxn, res) => {
                    console.log('valor insertado correctamente')
                    return resolve('valor insertado correctamente')
                },
                error => {
                    reject(error.message)
                }
            )
        })
    })
}



export const deletePrestamos = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `delete from prestamo`,
                [],
                (sqlTxn, res) => resolve('registro elimiando correctamente'),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}