/**
 * ====================================================================
 * SERVIDOR BACKEND Y API REST - PROYECTO ACEROTCG
 * Asignatura: Desarrollo Videojuegos y Simulación Virtual
 * Institución: Pontificia Universidad Católica de Valparaíso (PUCV)
 * 
 * Evaluación 2: Proyecto Web con acceso DB
 * Criterio 4: Conexión a Base de Datos (Muestra datos de al menos 1 tabla)
 * Criterio 5: Uso de Thunder Client (Rutas probadas y documentadas)
 * ====================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (HTML, CSS, JS, Imágenes)
const rootDir = path.resolve(__dirname, '..');
app.use(express.static(rootDir));

// Conexión y preparación de la Base de Datos SQLite
const dbPath = path.join(rootDir, 'database', 'acerotcg.sqlite');
const db = new DatabaseSync(dbPath);

console.log('✅ [Base de Datos] Conexión establecida exitosamente con:', dbPath);

// Inicialización de tablas y datos semilla (si no existen)
function inicializarBaseDeDatos() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS cartas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            edicion TEXT NOT NULL DEFAULT 'Vigilantes de Acero',
            tipo TEXT NOT NULL,
            coste INTEGER NOT NULL DEFAULT 1,
            fuerza INTEGER NOT NULL DEFAULT 0,
            rareza TEXT NOT NULL DEFAULT 'Común',
            habilidad TEXT NOT NULL,
            imagen_url TEXT DEFAULT 'assets/img/booster_vigilantes_angel.jpg',
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS mazos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            formato TEXT NOT NULL DEFAULT 'Imperio / Acero',
            descripcion TEXT,
            total_cartas INTEGER NOT NULL DEFAULT 50,
            autor TEXT NOT NULL DEFAULT 'Jugador AceroTCG',
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Verificar si existen registros
    const countQuery = db.prepare('SELECT COUNT(*) AS total FROM cartas');
    const result = countQuery.get();

    if (result.total === 0) {
        console.log('🌱 [Base de Datos] Sembrando datos iniciales en tabla `cartas`...');
        const insertCard = db.prepare(`
            INSERT INTO cartas (nombre, edicion, tipo, coste, fuerza, rareza, habilidad, imagen_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const seedCartas = [
            ['Lucifer, El Caído', 'Vigilantes de Acero', 'Aliado', 4, 5, 'Ultra Real', 'Furia. Cuando entra en juego, destruye un Aliado oponente de coste 3 o menor. Puedes pagar 1 Oro para barajar una carta del cementerio.', 'assets/img/booster_vigilantes_lucifer.jpg'],
            ['Miguel Arcángel', 'Vigilantes de Acero', 'Aliado', 5, 6, 'Ultra Real', 'Inmune a talismanes de coste 2 o menor. En fase final, endereza hasta dos Aliados que hayan defendido este turno.', 'assets/img/booster_vigilantes_angel.jpg'],
            ['Paladín de la Alianza', 'Vigilantes de Acero', 'Aliado', 3, 4, 'Real', 'Ataque Rápido. Puede atacar en el turno en que entra en juego. Mientras esté en juego, tus otros Aliados reciben +1 de Fuerza.', 'assets/img/booster_vigilantes_paladin.jpg'],
            ['Guardián de Acero', 'Vigilantes de Acero', 'Aliado', 1, 2, 'Vasallo', 'Guardián. Cuando esta carta es enviada al cementerio desde el campo, genera 1 Oro adicional en tu siguiente fase de vigilia.', 'assets/img/booster_vigilantes_angel.jpg'],
            ['Espada Flamígera', 'Vigilantes de Acero', 'Arma', 2, 2, 'Cortesano', 'Portador gana +2 a la Fuerza e Imbloqueable por Aliados de coste 2 o menor.', 'assets/img/booster_vigilantes_paladin.jpg'],
            ['Códice Prohibido', 'Vigilantes de Acero', 'Arma', 2, 1, 'Real', 'Cuando el portador inflija daño al mazo oponente, puedes robar 2 cartas y descartar 1 de tu mano.', 'assets/img/booster_vigilantes_lucifer.jpg'],
            ['Trono Celestial', 'Vigilantes de Acero', 'Tótem', 3, 0, 'Real', 'Una vez por turno, puedes descartar una carta de tu mano para robar 2 cartas de tu mazo.', 'assets/img/booster_vigilantes_angel.jpg'],
            ['Fortaleza Vigilante', 'Vigilantes de Acero', 'Tótem', 2, 0, 'Cortesano', 'Todos tus Aliados defensores obtienen +2 a la Fuerza. No puede ser destruido por Talismanes de coste 1.', 'assets/img/booster_vigilantes_paladin.jpg'],
            ['Ira Divina', 'Vigilantes de Acero', 'Talismán', 3, 0, 'Mega Real', 'Destruye todos los Aliados en juego que tengan Fuerza 3 o menos.', 'assets/img/booster_vigilantes_lucifer.jpg'],
            ['Sello de Luz', 'Vigilantes de Acero', 'Talismán', 1, 0, 'Vasallo', 'Anula un Talismán oponente de coste 2 o menor. Roba una carta.', 'assets/img/booster_vigilantes_angel.jpg'],
            ['Juicio Final', 'Vigilantes de Acero', 'Talismán', 4, 0, 'Ultra Real', 'Baraja hasta 4 cartas del cementerio oponente en su mazo y remueve del juego 1 Aliado objetivo.', 'assets/img/booster_vigilantes_lucifer.jpg'],
            ['Valkiria de la Tormenta', 'Vigilantes de Acero', 'Aliado', 2, 3, 'Cortesano', 'Volador. Cuando bloquea un ataque directo, su fuerza aumenta temporalmente a 5.', 'assets/img/booster_vigilantes_paladin.jpg']
        ];

        for (const c of seedCartas) {
            insertCard.run(...c);
        }

        const insertDeck = db.prepare(`
            INSERT INTO mazos (nombre, formato, descripcion, total_cartas, autor)
            VALUES (?, ?, ?, ?, ?)
        `);
        insertDeck.run('Mazo Sagrado Arcángeles', 'Imperio / Acero', 'Estrategia de control agresivo basada en Miguel Arcángel y tótems de robo.', 50, 'Master_TCG');
        insertDeck.run('Legión Caída', 'Imperio / Acero', 'Mazo centrado en daño directo y destrucción con Lucifer y talismanes oscuros.', 50, 'ShadowKnight');
        insertDeck.run('Defensa Inquebrantable', 'Vigilantes Formato Cerrado', 'Mazo defensivo con armas y guardianes de bajo coste.', 50, 'SteelGamer');

        console.log('✅ [Base de Datos] 12 cartas y 3 mazos iniciales insertados con éxito.');
    }
}

inicializarBaseDeDatos();

// ====================================================================
// RUTAS DE LA API REST (Para consumo frontend y pruebas Thunder Client)
// ====================================================================

// 1. Endpoint de estado y salud de la base de datos
app.get('/api/health', (req, res) => {
    try {
        const row = db.prepare('SELECT COUNT(*) as count FROM cartas').get();
        res.json({
            status: 'ok',
            database: 'conectada',
            engine: 'SQLite3 / SQL Compatible',
            totalCartas: row.count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// 2. Endpoint para obtener todas las cartas de la base de datos
app.get('/api/cartas', (req, res) => {
    try {
        const { tipo, search } = req.query;
        let query = 'SELECT * FROM cartas';
        const params = [];

        const conditions = [];
        if (tipo && tipo !== 'Todos') {
            conditions.push('tipo = ?');
            params.push(tipo);
        }
        if (search) {
            conditions.push('(nombre LIKE ? OR habilidad LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY id ASC';

        const stmt = db.prepare(query);
        const rows = stmt.all(...params);

        res.json({
            exito: true,
            total: rows.length,
            datos: rows
        });
    } catch (error) {
        res.status(500).json({ exito: false, error: error.message });
    }
});

// 3. Endpoint para obtener una carta específica por su ID
app.get('/api/cartas/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM cartas WHERE id = ?');
        const carta = stmt.get(req.params.id);

        if (!carta) {
            return res.status(404).json({ exito: false, mensaje: 'Carta no encontrada' });
        }

        res.json({ exito: true, datos: carta });
    } catch (error) {
        res.status(500).json({ exito: false, error: error.message });
    }
});

// 4. Endpoint para registrar una nueva carta en la base de datos
app.post('/api/cartas', (req, res) => {
    try {
        const { nombre, edicion, tipo, coste, fuerza, rareza, habilidad, imagen_url } = req.body;

        if (!nombre || !tipo || !habilidad) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Campos obligatorios faltantes: nombre, tipo y habilidad son requeridos.'
            });
        }

        const stmt = db.prepare(`
            INSERT INTO cartas (nombre, edicion, tipo, coste, fuerza, rareza, habilidad, imagen_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            nombre,
            edicion || 'Vigilantes de Acero',
            tipo,
            parseInt(coste, 10) || 1,
            parseInt(fuerza, 10) || 0,
            rareza || 'Común',
            habilidad,
            imagen_url || 'assets/img/booster_vigilantes_angel.jpg'
        );

        res.status(201).json({
            exito: true,
            mensaje: 'Carta creada exitosamente en la base de datos.',
            idInsertado: info.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ exito: false, error: error.message });
    }
});

// 5. Endpoint para obtener los mazos registrados
app.get('/api/mazos', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM mazos ORDER BY id ASC');
        const mazos = stmt.all();
        res.json({ exito: true, total: mazos.length, datos: mazos });
    } catch (error) {
        res.status(500).json({ exito: false, error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor AceroTCG ejecutándose exitosamente!`);
    console.log(`🌐 Aplicación Web: http://localhost:${PORT}`);
    console.log(`📡 API REST Base de Datos: http://localhost:${PORT}/api/cartas`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
});
