require('dotenv').config({ path: '../.env' }); // Aqui se cargan las variables del Entorno del "archivo .env"

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
//const path = require('path'); // Solo habilitar Para los archivos de Produccion
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


// ****************** Conexión a la base de datos ********************
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos.');
    }
});

// Ruta para probar la conexión con la base de datos
app.get('/test-db-connection', (req, res) => {
    const sql = 'SELECT 1';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).send('Error al conectar a la base de datos');
        } else {
            res.status(200).send('Conexión a la base de datos exitosa');
        }
    });
});

// ************* Rutas para el LogIng ******************
app.post('/login', (req, res) => {
    const { dni, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE dni = ? AND password = ?';
    db.query(sql, [dni, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        } else if (results.length === 0) {
            res.status(401).send('Credenciales incorrectas');
        } else {
            const usuario = results[0];
            res.status(200).json({ rol: usuario.rol, usuarioId: usuario.id, nombreUser: usuario.nombre });
        }
    });
});

// ************* Rutas para los Usuarios ******************
// Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { dni, nombre, rol, password } = req.body;
    const sql = 'INSERT INTO usuarios (dni, nombre, rol, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [dni, nombre, rol, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al agregar el usuario');
        } else {
            res.status(201).send('Usuario agregado con éxito');
        }
    });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener los usuarios');
        } else {
            res.status(200).json(results);
        }
    });
});

// Actualizar rol de un usuario
app.put('/usuarios/:id', (req, res) => {
    const { rol } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE usuarios SET rol = ? WHERE id = ?';
    db.query(sql, [rol, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar el rol del usuario');
        } else {
            res.status(200).send('Rol del usuario actualizado con éxito');
        }
    });
});

// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.status(200).send('Usuario eliminado con éxito');
        }
    });
});

// ************* Rutas para las tareas ******************
// Crear una nueva tarea
app.post('/tareas', (req, res) => {
    const { Equipo, descripcion, status, prioridad, informado, tecnico_id, fechaAsignacion } = req.body;
    const sql = 'INSERT INTO tarea (Equipo, descripcion, status, prioridad, informado, tecnico_id, fechaAsignacion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Equipo, descripcion, status, prioridad, informado, tecnico_id, fechaAsignacion], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al agregar la tarea');
        } else {
            res.status(201).send('Tarea creada con éxito');
        }
    });
});

// Archivar una tarea
app.post('/tareasArchivadas', (req, res) => {
    const { tarea_id, Equipo, descripcion, status, prioridad, informado, tecnico_id, fechaAsignacion, fechaProceso, fechaFinalizada, fechaArchivada} = req.body;
    const sql = 'INSERT INTO tareaarchivadas (tarea_id, Equipo, descripcion, status, prioridad, informado, tecnico_id,' + 
                'fechaAsignacion, fechaProceso, fechaFinalizada, fechaArchivada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [tarea_id, Equipo, descripcion, status, prioridad, informado, tecnico_id, fechaAsignacion, fechaProceso, fechaFinalizada, fechaArchivada], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al archivar la tarea');
        } else {
            res.status(201).send('Tarea archivada con éxito');
        }
    });
});

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
    const { rol, usuarioId } = req.query;

    let sql = '';
    if (rol === 'administrador' || rol === 'recepcionista') {
        sql = 'SELECT * FROM vista_tareas_tecnicos';  
    } else if (rol === 'tecnico') {
        sql = 'SELECT * FROM tarea WHERE tecnico_id = ?';  
    }

    db.query(sql, [usuarioId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener las tareas');
        } else {
            res.status(200).json(results);
        }
    });
});

// Obtener todas las tareas Archivadas
app.get('/tareasArchivadas', (req, res) => {
    let sql = 'SELECT * FROM vista_tareasarchivadas_tecnicos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener las tareas');
        } else {
            res.status(200).json(results);
        }
    });
});

// Actualizar el estado de una tarea
app.put('/tareas/:id', (req, res) => {
    let sql = '';
    const { status, informado, fechaProceso, fechaFinalizada } = req.body;
    const { id } = req.params;
    
    if (!fechaProceso && !fechaFinalizada) {
        sql = 'UPDATE tarea SET status = ?, informado = ? WHERE tarea_id = ?';
        db.query(sql, [status, informado, id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al actualizar la tarea');
            } else {
                res.status(200).send('Tarea actualizada con éxito');
            }
        });
    }
    else if (!fechaProceso) {
        sql = 'UPDATE tarea SET status = ?, informado = ?, fechaFinalizada =? WHERE tarea_id = ?';
        db.query(sql, [status, informado, fechaFinalizada, id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al actualizar la tarea');
            } else {
                res.status(200).send('Tarea actualizada con éxito');
            }
        });
    }
    else {
        sql = 'UPDATE tarea SET status = ?, informado = ?, fechaProceso = ? WHERE tarea_id = ?';
        db.query(sql, [status, informado, fechaProceso, id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al actualizar la tarea');
            } else {
                res.status(200).send('Tarea actualizada con éxito');
            }
        });
    }   
});


// Actualizar una tarea en general
app.put('/tareaUpdate/:id', (req, res) => {
    const { Equipo, descripcion, status, prioridad, tecnico_id } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE tarea SET Equipo = ?, descripcion = ?, status = ?, prioridad = ?, tecnico_id = ?  WHERE tarea_id = ?';
    db.query(sql, [Equipo, descripcion, status, prioridad, tecnico_id, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar la tarea');
        } else {
            res.status(200).send('Tarea actualizada con éxito');
        }
    });
});


// Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tarea WHERE tarea_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar la tarea');
        } else {
            res.status(200).send('Tarea eliminada con éxito');
        }
    });
});

/*
// *************** Iniciar los Archivos Estáticos del Frontend ***************
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta que maneja todas las solicitudes no definidas en las rutas anteriores
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
*/

// ************* Inicio del Servidor ******************
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
