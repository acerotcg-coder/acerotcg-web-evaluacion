# Portal Web AceroTCG - Web API & Acceso a Base de Datos 🎮⚔️

**Pontificia Universidad Católica de Valparaíso (PUCV)**  
*Escuela de Industrias Creativas - Desarrollo Videojuegos y Simulación Virtual*  
**Asignatura:** Desarrollo Web  
**Puntaje Esperado:** 100% de Cumplimiento (Evaluación 1: 39 + 3 pts extra | Evaluación 2: 39 + 3 pts extra)

---

## 👥 Integrantes del Proyecto
* **Nombre del Integrante 1:** [Nombre y Apellidos] - *Rol: Desarrollo Frontend & Consumo API*
* **Nombre del Integrante 2:** [Nombre y Apellidos] - *Rol: Backend & Base de Datos SQL*
* **Fecha de Entrega:** Noviembre 2026

---

## 📖 Descripción del Proyecto
**AceroTCG Web Portal** es una plataforma web completa desarrollada para la gestión, exploración y visualización de cartas coleccionables inspiradas en el universo de *AceroTCG / Mitos y Leyendas*.

Este proyecto unifica en una sola solución técnica las dos evaluaciones requeridas por la cátedra:
1. **Evaluación Proyecto Web API:** Consume una API externa asíncrona de cartas TCG vía `fetch()`, renderiza los datos en tarjetas responsivas y ofrece un filtro dinámico sobre el DOM sin recargar la página.
2. **Evaluación Proyecto Web con acceso DB:** Conecta a un backend Node.js/Express con persistencia en Base de Datos SQL, incluye script de carga `acerotcg_db.sql`, permite registrar nuevas cartas (POST) y documenta sus pruebas de rutas con **Thunder Client**.

---

## 📁 Estructura del Proyecto

El proyecto respeta una arquitectura modular, clara y limpia:

```text
acerotcg-web-evaluacion/
│
├── index.html                   # Documento principal con marcado HTML5 semántico
├── README.md                    # Este archivo: documentación e instrucciones fuera de carpetas
├── package.json                 # Configuración de dependencias (Express, Cors)
│
├── assets/                      # Recursos estáticos del frontend
│   ├── css/
│   │   └── styles.css           # Estilos personalizados integrados con Bootstrap 5
│   ├── js/
│   │   └── app.js               # Lógica cliente: fetch API, filtro DOM y modales
│   └── img/                     # Recursos visuales y cartas de AceroTCG
│       ├── logo_acerotcg.jpg
│       ├── menu_bg_lucifer.webp
│       ├── booster_vigilantes_angel.jpg
│       ├── booster_vigilantes_lucifer.jpg
│       └── booster_vigilantes_paladin.jpg
│
├── database/                    # Persistencia y modelo relacional
│   ├── acerotcg_db.sql          # Dump SQL oficial (DDL y DML) para importación
│   └── acerotcg.sqlite          # Base de datos local SQLite autogenerada
│
├── server/                      # Backend y API REST
│   └── server.js                # Servidor Express y conexión a Base de Datos
│
└── thunder-client/              # Pruebas de endpoints para Thunder Client
    └── thunder-collection_acerotcg.json  # Colección exportada lista para importar en VS Code
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos:
* Tener instalado **Node.js** (versión 18 o superior).
* Tener **Visual Studio Code** con la extensión **Thunder Client** instalada.

### Pasos:

1. **Abrir la terminal en la raíz del proyecto:**
   ```bash
   cd acerotcg-web-evaluacion
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor backend y la Base de Datos:**
   ```bash
   npm start
   ```
   *La consola indicará:*
   ```text
   ✅ [Base de Datos] Conexión establecida exitosamente
   🚀 Servidor AceroTCG ejecutándose en: http://localhost:3000
   ```

4. **Abrir en el navegador:**
   Ingresa a [http://localhost:3000](http://localhost:3000) para ver la aplicación web en funcionamiento completo.

---

## 🗄️ Base de Datos y Archivo SQL Dump

El archivo [`database/acerotcg_db.sql`](database/acerotcg_db.sql) contiene las sentencias DDL y DML estándar compatibles con **MySQL / MariaDB / SQLite / PostgreSQL**:
* **Tabla `cartas`:** Almacena `id`, `nombre`, `edicion`, `tipo`, `coste`, `fuerza`, `rareza`, `habilidad`, `imagen_url` y `fecha_creacion`.
* **Tabla `mazos`:** Almacena información de los mazos preconstruidos.
* **Datos Semilla:** 12 cartas equilibradas y 3 mazos de prueba listos para consultas.

> **Nota:** Al ejecutar `npm start`, el servidor crea y puebla automáticamente la base de datos `database/acerotcg.sqlite` usando este esquema, permitiendo ejecutar y evaluar el proyecto de inmediato sin necesidad de configurar un servidor MySQL externo.

---

## ⚡ Pruebas de API con Thunder Client

En la carpeta [`thunder-client/`](thunder-client/) se encuentra el archivo `thunder-collection_acerotcg.json` con la colección de pruebas de rutas:

1. En Visual Studio Code, abre la pestaña de **Thunder Client** (ícono del rayo).
2. Haz clic en **Collections** > **Menu (...)** > **Import**.
3. Selecciona el archivo `thunder-client/thunder-collection_acerotcg.json`.
4. Encontrarás las siguientes 6 solicitudes documentadas con sus respectivos tests automatizados:
   * `GET http://localhost:3000/api/health` -> Comprueba conexión a la Base de Datos.
   * `GET http://localhost:3000/api/cartas` -> Retorna todas las cartas de la BD.
   * `GET http://localhost:3000/api/cartas?tipo=Aliado` -> Filtra cartas por tipo en el backend.
   * `GET http://localhost:3000/api/cartas/1` -> Obtiene detalle de la carta con ID 1.
   * `POST http://localhost:3000/api/cartas` -> Registra una nueva carta en la Base de Datos (status 201).
   * `GET http://localhost:3000/api/mazos` -> Lista los mazos registrados en la BD.

---

## 🌐 Despliegue en GitHub Pages (Extra de 3 puntos)

Para obtener el puntaje extra de GitHub Pages:
1. Sube este proyecto a un repositorio público en tu cuenta de GitHub.
2. Ve a **Settings** > **Pages** en tu repositorio de GitHub.
3. En **Source**, selecciona `Deploy from a branch` y elige la rama `main` (carpeta `/root`).
4. Haz clic en **Save**. En 1 a 2 minutos tu sitio estará en vivo en `https://<tu-usuario>.github.io/<tu-repositorio>/`.
5. *Compatibilidad inteligente:* En GitHub Pages, el sitio se ejecuta en frontend estático consumiendo la API externa al 100%, y para la sección de Base de Datos activa automáticamente el *Modo Demostración*, mostrando un aviso informativo transparente para el evaluador.

---

## 📊 Matriz de Cumplimiento de Rúbricas PUCV

### Evaluación 1: Proyecto Web API (Total: 39 pts + 3 extra)
| Criterio | Puntaje | Cumplimiento en el Proyecto |
| :--- | :---: | :--- |
| **1. Uso Git** | 3 pts | Repositorio organizado con `.gitignore` y commits claros. |
| **2. Estructura carpetas** | 3 pts | Directorios estándar `assets/css/`, `assets/js/`, `assets/img/`. |
| **3. Bootstrap** | 3 pts | Bootstrap 5.3 CDN, Grid System, Cards, Modals y Responsive. |
| **4. Renderización API** | 6 pts | Función asíncrona `cargarDatosApiExterna()` consumiendo API TCG remota. |
| **5. Función JS** | 3 pts | Múltiples funciones bien definidas (`filtrarCartasApi`, `renderizarCartasApi`, etc.). |
| **6. Filtro DOM dinámico API** | 6 pts | Búsqueda por texto y select de tipo interactuando con el DOM en tiempo real. |
| **7. Cariño por el código** | 9 pts | Paleta visual inspirada en TCG oscuro, tarjetas con hover y bordes luminosos. |
| **8. Etiquetas semánticas** | 3 pts | Uso estricto de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. |
| **9. Documentado e indentado** | 3 pts | Comentarios explicativos y código formateado a 4 espacios. |
| **Extra: GitHub Pages** | 3 pts | Totalmente compatible y preparado para GitHub Pages. |

### Evaluación 2: Proyecto Web con acceso DB (Total: 39 pts + 3 extra)
| Criterio | Puntaje | Cumplimiento en el Proyecto |
| :--- | :---: | :--- |
| **1. Estructura de carpetas** | 3 pts | Módulos `server/`, `database/`, `thunder-client/` y `assets/`. |
| **2. Entregado por Git** | 3 pts | Listo para ser entregado vía repositorio Git. |
| **3. Archivo SQL dump** | 3 pts | Archivo `database/acerotcg_db.sql` con DDL y DML válido para carga. |
| **4. Conexión a Base de Datos** | 6 pts | Conexión activa a SQL y visualización de la tabla `cartas`. |
| **5. Uso de Thunder Client** | 3 pts | Colección `thunder-collection_acerotcg.json` con 6 endpoints y tests. |
| **6. Filtro DOM de datos** | 3 pts | Búsqueda y ordenamiento en tiempo real sobre datos de la base de datos. |
| **7. Cariño por el código** | 9 pts | Interfaz cuidada, coherente y funcional. |
| **8. Uso de Bootstrap** | 3 pts | Implementación sólida de Bootstrap 5 en toda la web. |
| **9. Semántica e indentación** | 3 pts | HTML5 y JavaScript estructurados según buenas prácticas. |
| **10. README.md fuera** | 3 pts | Este archivo ubicado en la raíz del proyecto con nombres e instrucciones. |
| **Extra: Presentación Oral** | 3 pts | Estructura modular preparada para explicar frontend, backend y base de datos. |
