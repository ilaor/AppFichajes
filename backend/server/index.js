// ====================== IMPORTS ======================
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');

// ====================== APP BASE ======================
const app = express();
app.use(cors());
app.use(express.json());

// ====================== DB POOL ======================
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dism',
});
app.set('db', pool);

// ====================== SWAGGER ======================
const swaggerDocument = YAML.load(path.join(__dirname, 'api', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===================== API KEY (middleware) =====================
// Comenta este middleware mientras desarrollas si quieres evitar el header.
// Para activarlo, descomenta el app.use(...) de abajo.
async function validarApiKey(req, res, next) {
  if (
    req.path.startsWith('/api-docs') ||
    req.path === '/ping' ||
    req.path === '/' ||
    req.path === '/testdb'
  ) {
    return next();
  }
  const key = req.header('x-api-key');
  if (!key) return res.status(401).json({ message: 'Falta x-api-key' });
  try {
    const [rows] = await req.app.get('db').query(
      'SELECT 1 FROM ApiKey WHERE `Key`=?',
      [key]
    );
    if (!rows.length) return res.status(403).json({ message: 'API key inválida' });
    next();
  } catch (e) {
    console.error('Error validando API key', e);
    res.status(500).json({ message: 'Error validando API key' });
  }
}

// ====================== ENDPOINTS UTIL ======================
app.get('/ping', (req, res) => res.status(200).send('pong'));

app.get('/', (req, res) => {
  res.send(`
    <h2>Servidor DISM funcionando</h2>
    <ul>
      <li><a href="/ping">/ping</a></li>
      <li><a href="/testdb">/testdb</a></li>
      <li><a href="/usuarios">/usuarios</a></li>
      <li><a href="/trabajos">/trabajos</a></li>
      <li><a href="/api-docs">/api-docs</a></li>
    </ul>
  `);
});

app.get('/testdb', async (req, res) => {
  try {
    const [rows] = await req.app.get('db').query('SELECT NOW() AS ahora');
    res.json(rows);
  } catch (error) {
    console.error('Error testdb:', error);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

// ====================== USUARIOS (CRUD) ======================
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await req.app.get('db').query('SELECT * FROM Usuarios');
    res.json(rows);
  } catch (e) {
    console.error('GET /usuarios', e);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await req.app.get('db').query(
      'SELECT * FROM Usuarios WHERE IdUsuario=?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    console.error('GET /usuarios/:id', e);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { Nombre, Usuario, Clave } = req.body;
    if (!Nombre || !Usuario || !Clave) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [r] = await req.app.get('db').query(
      'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
      [Nombre, Usuario, Clave]
    );

    res.status(201).json({ message: 'Usuario creado', id: r.insertId });
  } catch (e) {
    console.error('POST /usuarios', e);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});


app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Usuario, Clave } = req.body;
    await req.app.get('db').query(
      'UPDATE Usuarios SET Nombre=?, Usuario=?, Clave=? WHERE IdUsuario=?',
      [Nombre, Usuario, Clave, id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (e) {
    console.error('PUT /usuarios/:id', e);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await req.app.get('db').query(
      'DELETE FROM Usuarios WHERE IdUsuario=?',
      [id]
    );
    res.json({ message: 'Usuario eliminado' });
  } catch (e) {
    console.error('DELETE /usuarios/:id', e);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// ====================== TRABAJOS (CRUD) ======================
app.get('/trabajos', async (req, res) => {
  try {
    const [rows] = await req.app.get('db').query('SELECT * FROM Trabajos');
    res.json(rows);
  } catch (e) {
    console.error('GET /trabajos', e);
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
});

app.get('/trabajos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await req.app.get('db').query(
      'SELECT * FROM Trabajos WHERE IdTrabajo=?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Trabajo no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    console.error('GET /trabajos/:id', e);
    res.status(500).json({ error: 'Error al obtener trabajo' });
  }
});

app.post('/trabajos', async (req, res) => {
  try {
    const { Nombre } = req.body;
    if (!Nombre) {
      return res.status(400).json({ message: "Falta Nombre del trabajo" });
    }

    const [r] = await req.app.get('db').query(
      'INSERT INTO Trabajos (Nombre) VALUES (?)',
      [Nombre]
    );

    res.status(201).json({ message: 'Trabajo creado', id: r.insertId });
  } catch (e) {
    console.error('POST /trabajos', e);
    res.status(500).json({ error: 'Error al crear trabajo' });
  }
});


app.put('/trabajos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre } = req.body;
    await req.app.get('db').query(
      'UPDATE Trabajos SET Nombre=? WHERE IdTrabajo=?',
      [Nombre, id]
    );
    res.json({ message: 'Trabajo actualizado' });
  } catch (e) {
    console.error('PUT /trabajos/:id', e);
    res.status(500).json({ error: 'Error al actualizar trabajo' });
  }
});

app.delete('/trabajos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await req.app.get('db').query(
      'DELETE FROM Trabajos WHERE IdTrabajo=?',
      [id]
    );
    res.json({ message: 'Trabajo eliminado' });
  } catch (e) {
    console.error('DELETE /trabajos/:id', e);
    res.status(500).json({ error: 'Error al eliminar trabajo' });
  }
});

// ====================== FICHAJES ======================
app.get('/fichajes', async (req, res) => {
  try {
    const { idUsuario, desde, hasta } = req.query;
    let sql = `
      SELECT f.*, u.Nombre AS NombreUsuario, t.Nombre AS NombreTrabajo
      FROM Fichajes f
      LEFT JOIN Usuarios u ON u.IdUsuario = f.IdUsuario
      LEFT JOIN Trabajos t ON t.IdTrabajo = f.IdTrabajo
      WHERE 1=1
    `;
    const params = [];
    if (idUsuario) { sql += ' AND f.IdUsuario=?'; params.push(idUsuario); }
    if (desde)     { sql += ' AND f.FechaHoraEntrada >= ?'; params.push(desde); }
    if (hasta)     { sql += ' AND f.FechaHoraEntrada <= ?'; params.push(hasta); }
    sql += ' ORDER BY f.FechaHoraEntrada DESC';

    const [rows] = await req.app.get('db').query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('GET /fichajes', e);
    res.status(500).json({ error: 'Error al obtener fichajes' });
  }
});

// POST /fichajes  (iniciar fichaje)  ➜ con control de 12h y fichaje activo
app.post('/fichajes', async (req, res) => {
  try {
    const { IdUsuario, IdTrabajo, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
    if (!IdUsuario || !IdTrabajo) {
      return res.status(400).json({ message: 'Faltan campos' });
    }

    // Buscar último fichaje del usuario
    const [rows] = await req.app.get('db').query(
      `SELECT f.*, TIMESTAMPDIFF(HOUR, f.FechaHoraEntrada, NOW()) AS horas
       FROM Fichajes f
       WHERE f.IdUsuario=?
       ORDER BY f.FechaHoraEntrada DESC
       LIMIT 1`,
      [IdUsuario]
    );

    if (rows.length) {
      const f = rows[0];

      // Si sigue abierto pero ya pasó de 12 horas → cerramos automáticamente
      if (f.FechaHoraSalida == null && f.horas >= 12) {
        await req.app.get('db').query(
          `UPDATE Fichajes SET 
              FechaHoraSalida = DATE_ADD(FechaHoraEntrada, INTERVAL 12 HOUR),
              HorasTrabajadas = 12
           WHERE IdFichaje=?`,
          [f.IdFichaje]
        );
      }

      //  Si sigue abierto (<12 horas) → no dejamos abrir otro
      if (f.FechaHoraSalida == null && f.horas < 12) {
        return res.status(409).json({
          message: 'Ya existe un fichaje activo',
          idFichaje: f.IdFichaje
        });
      }
    }

    //  Crear el nuevo fichaje
    const [r] = await req.app.get('db').query(
      `INSERT INTO Fichajes 
       (FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud)
       VALUES (NOW(), NULL, NULL, ?, ?, ?, ?)`,
      [IdTrabajo, IdUsuario, GeolocalizacionLatitud || null, GeolocalizacionLongitud || null]
    );

    res.status(201).json({ message: 'Fichaje iniciado', idFichaje: r.insertId });
  } catch (e) {
    console.error('POST /fichajes', e);
    res.status(500).json({ error: 'Error al iniciar fichaje' });
  }
});

// PUT /fichajes/:id/cerrar  (finalizar fichaje, máx 12h)
app.put('/fichajes/:id/cerrar', async (req, res) => {
  try {
    const { id } = req.params;

    // Conseguimos la hora de entrada
    const [rows] = await req.app.get('db').query(
      `SELECT FechaHoraEntrada FROM Fichajes WHERE IdFichaje=?`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Fichaje no encontrado' });
    }

    const entrada = rows[0].FechaHoraEntrada;

    // Calculamos horas reales
    const [rows2] = await req.app.get('db').query(
      `SELECT TIMESTAMPDIFF(HOUR, ?, NOW()) AS horas`,
      [entrada]
    );
    const horas = rows2[0].horas ?? 0;
    const horasFinal = Math.min(Math.max(horas, 0), 12);

    // Si excede 12h, fijamos la salida a Entrada + 12h
    const salidaExpr = horas >= 12
      ? 'DATE_ADD(FechaHoraEntrada, INTERVAL 12 HOUR)'
      : 'NOW()';

    await req.app.get('db').query(
      `UPDATE Fichajes 
         SET FechaHoraSalida = ${salidaExpr},
             HorasTrabajadas = ?
       WHERE IdFichaje=?`,
      [horasFinal, id]
    );

    res.json({ message: 'Fichaje cerrado', horasFinal });
  } catch (e) {
    console.error('PUT /fichajes/:id/cerrar', e);
    res.status(500).json({ error: 'Error al cerrar fichaje' });
  }
});

// GET /fichajes/ultimo?idUsuario=#
app.get('/fichajes/ultimo', async (req, res) => {
  try {
    const { idUsuario } = req.query;
    if (!idUsuario) {
      return res.status(400).json({ message: 'Falta idUsuario' });
    }

    const [rows] = await req.app.get('db').query(
      `SELECT f.*, 
              TIMESTAMPDIFF(HOUR, f.FechaHoraEntrada, NOW()) AS horasDesdeEntrada
       FROM Fichajes f
       WHERE f.IdUsuario=?
       ORDER BY f.FechaHoraEntrada DESC
       LIMIT 1`,
      [idUsuario]
    );

    if (!rows.length) {
      return res.json(null);
    }

    const f = rows[0];

    // Si excedió 12h y sigue sin salida, cerramos automáticamente
    if (f.FechaHoraSalida == null && f.horasDesdeEntrada >= 12) {
      await req.app.get('db').query(
        `UPDATE Fichajes SET 
            FechaHoraSalida = DATE_ADD(FechaHoraEntrada, INTERVAL 12 HOUR),
            HorasTrabajadas = 12
         WHERE IdFichaje=?`,
        [f.IdFichaje]
      );

      const entradaDate = new Date(f.FechaHoraEntrada);
      const salidaDate = new Date(entradaDate.getTime() + 12 * 3600 * 1000);

      f.FechaHoraSalida = salidaDate;
      f.HorasTrabajadas = 12;
      f.horasDesdeEntrada = 12;
    }

    f.activo = f.FechaHoraSalida == null;

    res.json(f);
  } catch (e) {
    console.error('GET /fichajes/ultimo', e);
    res.status(500).json({ error: 'Error al obtener último fichaje' });
  }
});

// ====================== API KEY ======================
app.get('/apikey/validar', async (req, res) => {
  try {
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ ok: false, message: 'Falta x-api-key' });
    const [rows] = await req.app.get('db').query(
      'SELECT 1 FROM ApiKey WHERE `Key`=?',
      [key]
    );
    res.json({ ok: !!rows.length });
  } catch (e) {
    console.error('GET /apikey/validar', e);
    res.status(500).json({ ok: false, error: 'Error validando key' });
  }
});
// ====================== LOGIN ENDPOINT ======================
app.post('/login', async (req, res) => {
  try {
    const { Usuario, Clave } = req.body;

    if (!Usuario || !Clave) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const sql = `
      SELECT IdUsuario, Nombre, Usuario
      FROM Usuarios
      WHERE LOWER(TRIM(Usuario)) = LOWER(TRIM(?))
      AND TRIM(Clave) = TRIM(?)
      LIMIT 1
    `;

    const [rows] = await req.app.get('db').query(sql, [Usuario, Clave]);

    if (!rows.length) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    res.json({
      ok: true,
      usuario: rows[0]
    });

  } catch (e) {
    console.error("POST /login error", e);
    res.status(500).json({ message: "Error en login" });
  }
});

// ====================== LISTEN ======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
});
