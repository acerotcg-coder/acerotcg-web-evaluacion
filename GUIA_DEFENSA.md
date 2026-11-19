# 🛡️ Guía de Defensa Oral y Preguntas Frecuentes - AceroTCG Web

**Pontificia Universidad Católica de Valparaíso (PUCV)**  
*Escuela de Industrias Creativas - Desarrollo Videojuegos y Simulación Virtual*  
*Criterio Extra Evaluación 2: Presentación (3 pts)*

Esta guía contiene las preguntas técnicas más probables que el profesor o la comisión realizarán durante la defensa del proyecto, junto con las respuestas exactas y el archivo/línea donde se encuentra cada solución.

---

### 1. ¿Cómo consume la aplicación la API externa y qué pasa si no hay internet?
* **Respuesta:**  
  "En el archivo `assets/js/app.js`, la función `cargarDatosApiExterna()` utiliza `fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?...')` con `async/await`. Si la solicitud es exitosa, transforma el JSON recibido y llama a `renderizarCartasApi()` para inyectar dinámicamente las tarjetas en el DOM con Bootstrap. En caso de falla de red o bloqueo de CORS, implementamos un bloque `try/catch` que recurre a la función `obtenerCartasRespaldoApi()`, garantizando que la aplicación nunca se caiga ni quede en blanco."

---

### 2. ¿Cómo funciona el filtro DOM en tiempo real sin recargar la página?
* **Respuesta:**  
  "Se utilizan Event Listeners de tipo `'input'` en el campo de texto y `'change'` en el selector de categorías. Cada vez que el usuario escribe, se ejecuta `filtrarCartasApi()` o `filtrarCartasDb()`. Esta función toma el arreglo en memoria, aplica el método funcional de JavaScript `.filter()` comparando en minúsculas (`toLowerCase()`) y vuelve a renderizar únicamente las tarjetas coincidentes mediante `innerHTML`, actualizando también el contador dinámico en pantalla."

---

### 3. ¿Cómo se conecta la aplicación a la Base de Datos?
* **Respuesta:**  
  "La arquitectura cuenta con un servidor en Node.js con Express (`server/server.js`). Este servidor abre una conexión con la base de datos SQL (`database/acerotcg.sqlite`) y expone una API REST con endpoints JSON como `GET /api/cartas` y `POST /api/cartas`. Cuando el cliente frontend carga, hace una petición `fetch('/api/cartas')` a nuestro propio servidor, el cual ejecuta una consulta SQL `SELECT * FROM cartas ORDER BY id ASC` y devuelve los datos en formato JSON para mostrarlos en las tarjetas."

---

### 4. ¿Qué contiene el archivo SQL dump y cómo se estructuró?
* **Respuesta:**  
  "El archivo `database/acerotcg_db.sql` contiene las instrucciones DDL y DML estándar:
  1. `DROP TABLE IF EXISTS cartas;` y `DROP TABLE IF EXISTS mazos;` para reiniciar limpiamente.
  2. `CREATE TABLE cartas (...)` con tipos de datos adecuados: `id` como clave primaria autoincremental, `nombre`, `tipo`, `coste`, `fuerza`, `rareza`, `habilidad` e `imagen_url`.
  3. `INSERT INTO cartas (...)` con 12 registros balanceados del universo AceroTCG listos para ser importados en cualquier motor como MySQL, MariaDB o SQLite."

---

### 5. ¿Cómo se probaron las rutas con Thunder Client?
* **Respuesta:**  
  "En la carpeta `thunder-client/` incluimos la colección oficial `thunder-collection_acerotcg.json`. Configuramos 6 pruebas automatizadas:
  1. `GET /api/health`: Comprueba que el estado sea 'ok' y la base de datos esté conectada.
  2. `GET /api/cartas`: Comprueba código 200 y recepción del listado completo.
  3. `GET /api/cartas?tipo=Aliado`: Comprueba el filtro en el backend.
  4. `GET /api/cartas/1`: Verifica la obtención por ID.
  5. `POST /api/cartas`: Valida la inserción de una nueva carta con código 201 Created.
  6. `GET /api/mazos`: Verifica la consulta a una segunda tabla de la base de datos."

---

### 6. ¿Por qué se utilizó Bootstrap y cómo garantiza la adaptabilidad (responsividad)?
* **Respuesta:**  
  "Se utilizó Bootstrap 5.3 mediante su CDN oficial. Se empleó el sistema de rejilla (*Grid System*) con clases como `col-12 col-md-6 col-lg-4 col-xl-3`, lo que permite que en teléfonos móviles las cartas se vean en una sola columna y en pantallas grandes se distribuyan en 3 o 4 columnas automáticamente sin desbordamientos horizontales. Además, se usaron componentes nativos como la barra de navegación responsiva (`navbar-expand-lg`), modales accesibles y badges informativos."

---

### 7. ¿Por qué se separó en carpetas `assets/css`, `assets/js`, `server` y `database`?
* **Respuesta:**  
  "Cumple con el principio de separación de responsabilidades y la estructura exigida en la rúbrica. Los archivos del cliente estático están en `assets/`, el servidor backend en `server/`, los scripts y persistencia en `database/`, y el archivo `README.md` se encuentra en la raíz del proyecto para cumplir estrictamente con el criterio 10 de la evaluación."
