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
                    monto REAL,
                    porcentaje INT,
                    cuotas INT,
                    tipo BOOLEAN,
                    estado BOOLEAN
                );`,
                [],
                () => {
                    // Después de crear la tabla prestamo, crear la tabla detalle_prestamo
                    txn.executeSql(
                        `CREATE TABLE IF NOT EXISTS detalle_prestamo (
                            id_detalle_prestamo INTEGER PRIMARY KEY AUTOINCREMENT,
                            id_prestamo INTEGER,
                            numero_cuota INT, 
                            fecha_pago DATE,
                            fecha_pagado DATE, 
                            monto REAL, 
                            estado BOOLEAN, 
                            FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo)
                        );`,
                        [],
                        () => resolve(),
                        error => reject(error.message)
                    );
                },
                error => {
                    reject(error.message);
                }
            );
        });
    });
};

export const selectPrestamos = (estado) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM prestamo where estado=? order by id_prestamo desc`,
                [estado],
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

export const selectDetallePrestamos = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM detalle_prestamo where id_prestamo=?  order by id_detalle_prestamo`,
                [id],
                (sqlTxn, res) => {
                    const prestamoDetalle = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        prestamoDetalle.push(res.rows.item(i));
                    }
                    resolve(prestamoDetalle);
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
};

export const selectDeudaGeneral = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT detalle_prestamo.estado,sum(detalle_prestamo.monto) as total FROM detalle_prestamo 
                inner join prestamo on prestamo.id_prestamo=detalle_prestamo.id_prestamo 
                where prestamo.tipo=true
                group by detalle_prestamo.estado`,
                [],
                (sqlTxn, res) => {
                    const prestamoDetalle = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        prestamoDetalle.push(res.rows.item(i));
                    }
                    // Llamar a la función selectDeudaGeneralNormal
                    selectDeudaGeneralNormal().then(prestamoNormal => {
                        resolve([prestamoDetalle, prestamoNormal]);
                    }).catch(error => {
                        reject(error); // Rechaza la promesa en caso de error en selectDeudaGeneralNormal
                    });
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
};

export const selectDeudaGeneralNormal = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT sum(monto) as total from prestamo where tipo=false`,
                [],
                (sqlTxn, res) => {
                    const prestamoNormalDetalle = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        prestamoNormalDetalle.push(res.rows.item(i));
                    }
                    resolve(prestamoNormalDetalle);
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
}

export const insertPrestamos = (nombre, fecha, monto, porcentaje, cuotas, tipo) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `insert into prestamo (nombre,fecha,monto,porcentaje,cuotas,tipo,estado) values(?,?,?,?,?,?,?)`,
                [nombre.toUpperCase(), fecha, monto, porcentaje, cuotas, tipo, false],
                (sqlTxn, res) => resolve(res.insertId),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

export const insertDetallePrestamos = (idPrestamo, cuota, fechaPago, monto, estado) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `insert into detalle_prestamo (id_prestamo,numero_cuota,fecha_pago,fecha_pagado,monto,estado) values(?,?,?,?,?,?)`,
                [idPrestamo, cuota, fechaPago, '', monto, estado],
                (sqlTxn, res) => resolve('detalle insertado'),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

export const deletePrestamos = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `delete from prestamo where id_prestamo=?`,
                [id],
                (sqlTxn, res) => {
                    // Después de crear la tabla prestamo, crear la tabla detalle_prestamo
                    txn.executeSql(
                        `delete from detalle_prestamo where id_prestamo=?`,
                        [id],
                        () => resolve(),
                        error => reject(error.message)
                    );
                },
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

export const updatePrestamo = (id, monto, estado) => {
    return new Promise((resolve, reject) => {
        let query;
        if (estado) {
            query = `UPDATE prestamo SET monto = monto - ? WHERE id_prestamo = ?`;
        } else {
            query = `UPDATE prestamo SET monto = monto + ? WHERE id_prestamo = ?`;
        }
        db.transaction(txn => {
            txn.executeSql(
                query,
                [monto, id],
                (sqlTxn, res) => resolve(),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

export const cuotasNoPagadas = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM detalle_prestamo inner join prestamo on detalle_prestamo.id_prestamo=prestamo.id_prestamo where 
                detalle_prestamo.estado=false and detalle_prestamo.id_prestamo=?
                `,
                [id],
                (sqlTxn, res) => {
                    const cuotas = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        cuotas.push(res.rows.item(i));
                    }
                    resolve(cuotas);
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
};
export const closePrestamo = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `UPDATE prestamo SET estado=true WHERE id_prestamo = ?`,
                [id],
                (sqlTxn, res) => resolve(),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}
export const selectPrestamo = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT monto FROM prestamo where id_prestamo=?`,
                [id],
                (sqlTxn, res) => {
                    const monto = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        monto.push(res.rows.item(i));
                    }
                    resolve(monto);
                },
                error => {
                    reject(error.message); // Rechaza la promesa en caso de error
                }
            );
        });
    });
};


export const updateStateCuotaPrestamo = (id, fechaPagado, estado) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `update detalle_prestamo set estado=?,fecha_pagado=? where id_detalle_prestamo=?`,
                [estado, fechaPagado, id],
                (sqlTxn, res) => resolve(),
                error => {
                    reject(error.message)
                }
            )
        })
    })
}

// export const verTablas = () => {
//     return new Promise((resolve, reject) => {
//         db.transaction(txn => {
//             txn.executeSql(
//                 "SELECT name FROM sqlite_master WHERE type='table'",
//                 [],
//                 (sqlTxn, res) => {
//                     const tablas = [];
//                     for (let i = 0; i < res.rows.length; i++) {
//                         tablas.push(res.rows.item(i).name);
//                     }
//                     resolve(tablas);
//                 },
//                 error => {
//                     reject(error.message);
//                 }
//             );
//         });
//     });
// };