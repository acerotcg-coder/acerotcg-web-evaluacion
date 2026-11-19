-- ====================================================================
-- PROYECTO WEB ACEROTCG - BASE DE DATOS OFICIAL
-- Asignatura: Desarrollo Videojuegos y Simulación Virtual
-- Institución: Pontificia Universidad Católica de Valparaíso (PUCV)
-- Evaluación: Proyecto Web con acceso DB
-- Archivo: database/acerotcg_db.sql
-- Descripción: Script DDL y DML para importar en MySQL, MariaDB o SQLite.
-- ====================================================================

-- 1. CREACIÓN DE LA TABLA DE CARTAS
DROP TABLE IF EXISTS cartas;
CREATE TABLE cartas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(120) NOT NULL,
    edicion VARCHAR(80) NOT NULL DEFAULT 'Vigilantes de Acero',
    tipo VARCHAR(50) NOT NULL, -- Aliado, Talismán, Arma, Tótem
    coste INT NOT NULL DEFAULT 1,
    fuerza INT NOT NULL DEFAULT 0,
    rareza VARCHAR(50) NOT NULL DEFAULT 'Común', -- Vasallo, Cortesano, Real, Mega Real, Ultra Real
    habilidad TEXT NOT NULL,
    imagen_url VARCHAR(255) DEFAULT 'assets/img/booster_vigilantes_angel.jpg',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREACIÓN DE LA TABLA DE MAZOS (DECKS)
DROP TABLE IF EXISTS mazos;
CREATE TABLE mazos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    formato VARCHAR(50) NOT NULL DEFAULT 'Imperio / Acero',
    descripcion VARCHAR(255),
    total_cartas INT NOT NULL DEFAULT 50,
    autor VARCHAR(100) NOT NULL DEFAULT 'Jugador AceroTCG',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INSERCIÓN DE DATOS INICIALES (DML) - TABLA CARTAS
INSERT INTO cartas (nombre, edicion, tipo, coste, fuerza, rareza, habilidad, imagen_url) VALUES
('Lucifer, El Caído', 'Vigilantes de Acero', 'Aliado', 4, 5, 'Ultra Real', 'Furia. Cuando entra en juego, destruye un Aliado oponente de coste 3 o menor. Puedes pagar 1 Oro para barajar una carta del cementerio.', 'assets/img/booster_vigilantes_lucifer.jpg'),
('Miguel Arcángel', 'Vigilantes de Acero', 'Aliado', 5, 6, 'Ultra Real', 'Inmune a talismanes de coste 2 o menor. En fase final, endereza hasta dos Aliados que hayan defendido este turno.', 'assets/img/booster_vigilantes_angel.jpg'),
('Paladín de la Alianza', 'Vigilantes de Acero', 'Aliado', 3, 4, 'Real', 'Ataque Rápido. Puede atacar en el turno en que entra en juego. Mientras esté en juego, tus otros Aliados reciben +1 de Fuerza.', 'assets/img/booster_vigilantes_paladin.jpg'),
('Guardián de Acero', 'Vigilantes de Acero', 'Aliado', 1, 2, 'Vasallo', 'Guardián. Cuando esta carta es enviada al cementerio desde el campo, genera 1 Oro adicional en tu siguiente fase de vigilia.', 'assets/img/booster_vigilantes_angel.jpg'),
('Espada Flamígera', 'Vigilantes de Acero', 'Arma', 2, 2, 'Cortesano', 'Portador gana +2 a la Fuerza e Imbloqueable por Aliados de coste 2 o menor.', 'assets/img/booster_vigilantes_paladin.jpg'),
('Códice Prohibido', 'Vigilantes de Acero', 'Arma', 2, 1, 'Real', 'Cuando el portador inflija daño al mazo oponente, puedes robar 2 cartas y descartar 1 de tu mano.', 'assets/img/booster_vigilantes_lucifer.jpg'),
('Trono Celestial', 'Vigilantes de Acero', 'Tótem', 3, 0, 'Real', 'Una vez por turno, puedes descartar una carta de tu mano para robar 2 cartas de tu mazo.', 'assets/img/booster_vigilantes_angel.jpg'),
('Fortaleza Vigilante', 'Vigilantes de Acero', 'Tótem', 2, 0, 'Cortesano', 'Todos tus Aliados defensores obtienen +2 a la Fuerza. No puede ser destruido por Talismanes de coste 1.', 'assets/img/booster_vigilantes_paladin.jpg'),
('Ira Divina', 'Vigilantes de Acero', 'Talismán', 3, 0, 'Mega Real', 'Destruye todos los Aliados en juego que tengan Fuerza 3 o menos.', 'assets/img/booster_vigilantes_lucifer.jpg'),
('Sello de Luz', 'Vigilantes de Acero', 'Talismán', 1, 0, 'Vasallo', 'Anula un Talismán oponente de coste 2 o menor. Roba una carta.', 'assets/img/booster_vigilantes_angel.jpg'),
('Juicio Final', 'Vigilantes de Acero', 'Talismán', 4, 0, 'Ultra Real', 'Baraja hasta 4 cartas del cementerio oponente en su mazo y remueve del juego 1 Aliado objetivo.', 'assets/img/booster_vigilantes_lucifer.jpg'),
('Valkiria de la Tormenta', 'Vigilantes de Acero', 'Aliado', 2, 3, 'Cortesano', 'Volador. Cuando bloquea un ataque directo, su fuerza aumenta temporalmente a 5.', 'assets/img/booster_vigilantes_paladin.jpg');

-- 4. INSERCIÓN DE DATOS INICIALES - TABLA MAZOS
INSERT INTO mazos (nombre, formato, descripcion, total_cartas, autor) VALUES
('Mazo Sagrado Arcángeles', 'Imperio / Acero', 'Estrategia de control agresivo basada en Miguel Arcángel y tótems de robo.', 50, 'Master_TCG'),
('Legión Caída', 'Imperio / Acero', 'Mazo centrado en daño directo y destrucción con Lucifer y talismanes oscuros.', 50, 'ShadowKnight'),
('Defensa Inquebrantable', 'Vigilantes Formato Cerrado', 'Mazo defensivo con armas y guardianes de bajo coste.', 50, 'SteelGamer');

-- 5. CONSULTA DE COMPROBACIÓN
SELECT id, nombre, tipo, coste, fuerza, rareza FROM cartas;
SELECT id, nombre, formato, total_cartas FROM mazos;
