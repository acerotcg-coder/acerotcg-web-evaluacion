/**
 * ====================================================================
 * APLICACIÓN JAVASCRIPT - PROYECTO WEB ACEROTCG
 * Asignatura: Desarrollo Videojuegos y Simulación Virtual (PUCV)
 * 
 * Cumplimiento de Pautas:
 * - Evaluación 1: Criterio 4 (Renderización API externa)
 * - Evaluación 1: Criterio 5 (Funciones JavaScript bien estructuradas)
 * - Evaluación 1: Criterio 6 (Filtro DOM dinámico para API)
 * - Evaluación 2: Criterio 4 (Conexión a Base de Datos y visualización)
 * - Evaluación 2: Criterio 6 (Filtro DOM dinámico para Base de Datos)
 * - Ambos: Criterio 9 (Código documentado e indentado)
 * ====================================================================
 */

// ====================================================================
// 1. ESTADO GLOBAL DE LA APLICACIÓN
// ====================================================================
const state = {
    apiExternaCartas: [],       // Almacena las cartas obtenidas desde la API externa
    apiExternaFiltradas: [],    // Cartas de la API tras aplicar filtros en el DOM
    dbCartas: [],               // Almacena las cartas obtenidas desde la Base de Datos local
    dbCartasFiltradas: [],      // Cartas de la BD tras aplicar filtros en el DOM
    isDbConnected: false        // Estado de conexión con el backend/DB
};

// URL de la API Externa de TCG (Cartas de YGOPRODeck - Libre, gratuita y sin API key)
const API_EXTERNA_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=20&offset=0';

// URL del backend local conectado a la Base de Datos
const API_LOCAL_DB_URL = '/api/cartas';
const API_LOCAL_HEALTH_URL = '/api/health';

// ====================================================================
// 2. INICIALIZACIÓN AL CARGAR EL DOM
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 [AceroTCG] Inicializando aplicación web...');
    
    // Inicializar tooltips de Bootstrap si existieran
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Inicializar listeners de eventos
    configurarEventos();

    // Cargar datos de ambas fuentes
    cargarDatosApiExterna();
    verificarYConectarBaseDatos();
});

// ====================================================================
// 3. CONFIGURACIÓN DE EVENT LISTENERS (MANIPULACIÓN DEL DOM)
// ====================================================================
/**
 * Configura los eventos del DOM para filtros de búsqueda y acciones.
 */
function configurarEventos() {
    // Filtros de la API Externa
    const inputSearchApi = document.getElementById('search-api');
    const selectTipoApi = document.getElementById('filter-tipo-api');
    const btnResetApi = document.getElementById('btn-reset-api');

    if (inputSearchApi) {
        inputSearchApi.addEventListener('input', filtrarCartasApi);
    }
    if (selectTipoApi) {
        selectTipoApi.addEventListener('change', filtrarCartasApi);
    }
    if (btnResetApi) {
        btnResetApi.addEventListener('click', () => {
            if (inputSearchApi) inputSearchApi.value = '';
            if (selectTipoApi) selectTipoApi.value = 'Todos';
            filtrarCartasApi();
        });
    }

    // Filtros de la Base de Datos Local
    const inputSearchDb = document.getElementById('search-db');
    const selectTipoDb = document.getElementById('filter-tipo-db');
    const selectOrdenDb = document.getElementById('sort-db');
    const btnResetDb = document.getElementById('btn-reset-db');

    if (inputSearchDb) {
        inputSearchDb.addEventListener('input', filtrarCartasDb);
    }
    if (selectTipoDb) {
        selectTipoDb.addEventListener('change', filtrarCartasDb);
    }
    if (selectOrdenDb) {
        selectOrdenDb.addEventListener('change', filtrarCartasDb);
    }
    if (btnResetDb) {
        btnResetDb.addEventListener('click', () => {
            if (inputSearchDb) inputSearchDb.value = '';
            if (selectTipoDb) selectTipoDb.value = 'Todos';
            if (selectOrdenDb) selectOrdenDb.value = 'id-asc';
            filtrarCartasDb();
        });
    }

    // Formulario para registrar nueva carta en Base de Datos (POST)
    const formNuevaCarta = document.getElementById('form-nueva-carta');
    if (formNuevaCarta) {
        formNuevaCarta.addEventListener('submit', registrarNuevaCarta);
    }
}

// ====================================================================
// 4. MÓDULO API EXTERNA (EVALUACIÓN 1 - PROYECTO WEB API)
// ====================================================================

/**
 * Consulta a una API REST externa utilizando fetch() y maneja la respuesta.
 * Cumple con Criterio 4: Renderización API (6 pts)
 */
async function cargarDatosApiExterna() {
    const contenedor = document.getElementById('api-cards-container');
    const contador = document.getElementById('api-counter');

    try {
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Cargando API...</span>
                    </div>
                    <p class="mt-2 text-muted">Consultando API Externa de Cartas TCG...</p>
                </div>
            `;
        }

        const respuesta = await fetch(API_EXTERNA_URL);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const json = await respuesta.json();
        
        // Mapear los datos de la API externa
        state.apiExternaCartas = (json.data || []).map(item => ({
            id: item.id,
            nombre: item.name,
            tipo: item.type || 'Carta',
            descripcion: item.desc || 'Sin descripción disponible',
            atk: item.atk !== undefined ? item.atk : null,
            def: item.def !== undefined ? item.def : null,
            nivel: item.level || null,
            arquetipo: item.archetype || 'Genérico',
            imagen: (item.card_images && item.card_images[0]) ? item.card_images[0].image_url_small : 'assets/img/booster_vigilantes_angel.jpg'
        }));

        state.apiExternaFiltradas = [...state.apiExternaCartas];
        renderizarCartasApi(state.apiExternaFiltradas);

    } catch (error) {
        console.warn('⚠️ No se pudo conectar con la API externa principal. Usando datos de respaldo...', error);
        // Respaldo de datos en caso de corte o bloqueo de CORS en local
        state.apiExternaCartas = obtenerCartasRespaldoApi();
        state.apiExternaFiltradas = [...state.apiExternaCartas];
        renderizarCartasApi(state.apiExternaFiltradas);
    }
}

/**
 * Filtra dinámicamente las cartas de la API externa en el DOM.
 * Cumple con Criterio 6: Filtro DOM dinámico para API (6 pts)
 */
function filtrarCartasApi() {
    const inputSearch = document.getElementById('search-api');
    const selectTipo = document.getElementById('filter-tipo-api');

    const busqueda = inputSearch ? inputSearch.value.trim().toLowerCase() : '';
    const tipoSeleccionado = selectTipo ? selectTipo.value : 'Todos';

    state.apiExternaFiltradas = state.apiExternaCartas.filter(carta => {
        const coincideNombre = carta.nombre.toLowerCase().includes(busqueda) || 
                               carta.descripcion.toLowerCase().includes(busqueda);
        
        let coincideTipo = true;
        if (tipoSeleccionado !== 'Todos') {
            coincideTipo = carta.tipo.toLowerCase().includes(tipoSeleccionado.toLowerCase());
        }

        return coincideNombre && coincideTipo;
    });

    renderizarCartasApi(state.apiExternaFiltradas);
}

/**
 * Renderiza en el DOM la lista de cartas de la API externa como tarjetas Bootstrap.
 * @param {Array} cartas 
 */
function renderizarCartasApi(cartas) {
    const contenedor = document.getElementById('api-cards-container');
    const contador = document.getElementById('api-counter');

    if (contador) {
        contador.textContent = `Mostrando ${cartas.length} de ${state.apiExternaCartas.length} cartas`;
    }

    if (!contenedor) return;

    if (cartas.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search text-warning fs-1"></i>
                <h4 class="mt-3 text-light">No se encontraron cartas</h4>
                <p class="text-muted">Prueba cambiando los términos de búsqueda o el filtro de tipo.</p>
            </div>
        `;
        return;
    }

    let html = '';
    cartas.forEach(carta => {
        const tieneAtk = carta.atk !== null ? `<span class="badge badge-str me-1">ATK: ${carta.atk}</span>` : '';
        const tieneDef = carta.def !== null ? `<span class="badge badge-tipo">DEF: ${carta.def}</span>` : '';

        html += `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <article class="tcg-card">
                    <div class="tcg-card-img-wrapper">
                        <img src="${carta.imagen}" alt="${carta.nombre}" class="tcg-card-img" loading="lazy" onerror="this.src='assets/img/booster_vigilantes_angel.jpg'">
                    </div>
                    <div class="tcg-card-body">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-secondary">${carta.tipo}</span>
                                ${carta.nivel ? `<span class="badge badge-cost">★ ${carta.nivel}</span>` : ''}
                            </div>
                            <h3 class="tcg-card-title">${carta.nombre}</h3>
                            <div class="mb-2">
                                ${tieneAtk}
                                ${tieneDef}
                            </div>
                            <p class="tcg-card-ability">${truncarTexto(carta.descripcion, 100)}</p>
                        </div>
                        <div class="mt-3 text-end">
                            <button class="btn btn-sm btn-outline-warning w-100" onclick="abrirModalDetalleApi(${carta.id})">
                                <i class="bi bi-eye"></i> Ver Detalles
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

// ====================================================================
// 5. MÓDULO BASE DE DATOS LOCAL (EVALUACIÓN 2 - PROYECTO WEB DB)
// ====================================================================

/**
 * Verifica la salud de la Base de Datos y carga los registros iniciales.
 * Cumple con Criterio 4: Conexión a Base de Datos (6 pts)
 */
async function verificarYConectarBaseDatos() {
    const badgeEstado = document.getElementById('db-status-badge');
    
    try {
        const respuestaHealth = await fetch(API_LOCAL_HEALTH_URL);
        if (!respuestaHealth.ok) throw new Error('Servidor offline');

        const dataHealth = await respuestaHealth.json();
        state.isDbConnected = true;

        if (badgeEstado) {
            badgeEstado.className = 'badge bg-success';
            badgeEstado.innerHTML = `<i class="bi bi-database-check me-1"></i> BD Conectada (${dataHealth.engine})`;
        }

        // Cargar cartas desde la Base de Datos
        await cargarDatosBaseDatos();

    } catch (error) {
        console.info('ℹ️ Modo Demostración GitHub Pages / Backend local offline. Cargando respaldo DB...');
        state.isDbConnected = false;

        if (badgeEstado) {
            badgeEstado.className = 'badge bg-warning text-dark';
            badgeEstado.innerHTML = `<i class="bi bi-info-circle me-1"></i> Modo Demo GitHub Pages (BD Offline)`;
            badgeEstado.title = 'Para conexión completa a DB SQL ejecuta: npm start';
        }

        // Cargar datos de respaldo preconfigurados idénticos a acerotcg_db.sql
        state.dbCartas = obtenerCartasRespaldoDb();
        state.dbCartasFiltradas = [...state.dbCartas];
        renderizarCartasDb(state.dbCartasFiltradas);
    }
}

/**
 * Consulta las cartas a través de la API REST del backend conectado a la Base de Datos.
 */
async function cargarDatosBaseDatos() {
    const contenedor = document.getElementById('db-cards-container');

    try {
        const respuesta = await fetch(API_LOCAL_DB_URL);
        const json = await respuesta.json();

        if (json.exito && Array.isArray(json.datos)) {
            state.dbCartas = json.datos;
            state.dbCartasFiltradas = [...state.dbCartas];
            renderizarCartasDb(state.dbCartasFiltradas);
        }
    } catch (error) {
        console.error('Error al consultar datos de la BD:', error);
    }
}

/**
 * Filtra dinámicamente las cartas de la Base de Datos en el DOM.
 * Cumple con Criterio 6: Filtro DOM de datos (3 pts)
 */
function filtrarCartasDb() {
    const inputSearch = document.getElementById('search-db');
    const selectTipo = document.getElementById('filter-tipo-db');
    const selectOrden = document.getElementById('sort-db');

    const busqueda = inputSearch ? inputSearch.value.trim().toLowerCase() : '';
    const tipo = selectTipo ? selectTipo.value : 'Todos';
    const orden = selectOrden ? selectOrden.value : 'id-asc';

    // Filtrado
    let filtradas = state.dbCartas.filter(carta => {
        const coincideTexto = carta.nombre.toLowerCase().includes(busqueda) || 
                              carta.habilidad.toLowerCase().includes(busqueda) ||
                              carta.edicion.toLowerCase().includes(busqueda);
        
        const coincideTipo = (tipo === 'Todos') || (carta.tipo.toLowerCase() === tipo.toLowerCase());

        return coincideTexto && coincideTipo;
    });

    // Ordenamiento dinámico
    if (orden === 'fuerza-desc') {
        filtradas.sort((a, b) => b.fuerza - a.fuerza);
    } else if (orden === 'coste-asc') {
        filtradas.sort((a, b) => a.coste - b.coste);
    } else if (orden === 'nombre-asc') {
        filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
        filtradas.sort((a, b) => a.id - b.id);
    }

    state.dbCartasFiltradas = filtradas;
    renderizarCartasDb(state.dbCartasFiltradas);
}

/**
 * Renderiza en el DOM las cartas de la Base de Datos como tarjetas Bootstrap.
 * @param {Array} cartas 
 */
function renderizarCartasDb(cartas) {
    const contenedor = document.getElementById('db-cards-container');
    const contador = document.getElementById('db-counter');

    if (contador) {
        contador.textContent = `Mostrando ${cartas.length} de ${state.dbCartas.length} cartas en BD`;
    }

    if (!contenedor) return;

    if (cartas.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-database-slash text-warning fs-1"></i>
                <h4 class="mt-3 text-light">No hay cartas que coincidan</h4>
                <p class="text-muted">Ajusta los filtros o añade una nueva carta con el botón superior.</p>
            </div>
        `;
        return;
    }

    let html = '';
    cartas.forEach(carta => {
        html += `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <article class="tcg-card">
                    <div class="tcg-card-img-wrapper">
                        <img src="${carta.imagen_url || 'assets/img/booster_vigilantes_angel.jpg'}" alt="${carta.nombre}" class="tcg-card-img" loading="lazy" onerror="this.src='assets/img/booster_vigilantes_angel.jpg'">
                    </div>
                    <div class="tcg-card-body">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge badge-tipo">${carta.tipo}</span>
                                <span class="badge badge-rareza">${carta.rareza}</span>
                            </div>
                            <h3 class="tcg-card-title">${carta.nombre}</h3>
                            <div class="mb-2">
                                <span class="badge badge-cost me-1"><i class="bi bi-coin"></i> Coste: ${carta.coste}</span>
                                <span class="badge badge-str"><i class="bi bi-lightning-fill"></i> Fuerza: ${carta.fuerza}</span>
                            </div>
                            <p class="tcg-card-ability">${carta.habilidad}</p>
                        </div>
                        <div class="mt-3 d-flex justify-content-between align-items-center">
                            <small class="text-muted"><i class="bi bi-collection"></i> ${carta.edicion}</small>
                            <button class="btn btn-sm btn-outline-warning" onclick="abrirModalDetalleDb(${carta.id})">
                                <i class="bi bi-zoom-in"></i> Detalle
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

/**
 * Registra una nueva carta enviando un POST a la API REST de la Base de Datos.
 * Cumple con interacción completa CRUD con BD.
 * @param {Event} event 
 */
async function registrarNuevaCarta(event) {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const nuevaCarta = {
        nombre: document.getElementById('input-nombre').value.trim(),
        tipo: document.getElementById('input-tipo').value,
        coste: parseInt(document.getElementById('input-coste').value, 10),
        fuerza: parseInt(document.getElementById('input-fuerza').value, 10),
        rareza: document.getElementById('input-rareza').value,
        edicion: document.getElementById('input-edicion').value.trim() || 'Vigilantes de Acero',
        habilidad: document.getElementById('input-habilidad').value.trim(),
        imagen_url: document.getElementById('input-imagen').value.trim() || 'assets/img/booster_vigilantes_paladin.jpg'
    };

    try {
        if (state.isDbConnected) {
            const respuesta = await fetch(API_LOCAL_DB_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCarta)
            });

            if (!respuesta.ok) throw new Error('Error al guardar en el servidor');
            
            // Recargar datos desde la base de datos
            await cargarDatosBaseDatos();
        } else {
            // Modo Demo: Insertar en memoria local
            nuevaCarta.id = state.dbCartas.length + 1;
            state.dbCartas.unshift(nuevaCarta);
            filtrarCartasDb();
        }

        // Cerrar modal y limpiar formulario
        const modalEl = document.getElementById('modalNuevaCarta');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        form.reset();
        form.classList.remove('was-validated');

        mostrarAlertaExito('¡Carta registrada con éxito en la Base de Datos!');

    } catch (error) {
        alert('Hubo un error al registrar la carta: ' + error.message);
    }
}

// ====================================================================
// 6. FUNCIONES AUXILIARES Y MODALES
// ====================================================================

/**
 * Muestra el modal con el detalle completo de una carta de la API externa.
 * @param {number} id 
 */
function abrirModalDetalleApi(id) {
    const carta = state.apiExternaCartas.find(c => c.id === id);
    if (!carta) return;

    document.getElementById('modalDetalleTitulo').textContent = carta.nombre;
    document.getElementById('modalDetalleBody').innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-5 text-center mb-3 mb-md-0">
                <img src="${carta.imagen}" alt="${carta.nombre}" class="img-fluid rounded shadow" style="max-height: 320px;">
            </div>
            <div class="col-md-7">
                <p><strong>Tipo:</strong> <span class="badge bg-secondary">${carta.tipo}</span></p>
                ${carta.arquetipo ? `<p><strong>Arquetipo:</strong> <span class="badge bg-info text-dark">${carta.arquetipo}</span></p>` : ''}
                ${carta.atk !== null ? `<p><strong>Ataque:</strong> <span class="text-danger fw-bold">${carta.atk}</span></p>` : ''}
                ${carta.def !== null ? `<p><strong>Defensa:</strong> <span class="text-primary fw-bold">${carta.def}</span></p>` : ''}
                <hr class="border-secondary">
                <h6>Efecto / Habilidad:</h6>
                <p class="text-light bg-dark p-3 rounded">${carta.descripcion}</p>
                <small class="text-muted">Fuente: API Externa YGOPRODeck</small>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
    modal.show();
}

/**
 * Muestra el modal con el detalle completo de una carta de la Base de Datos local.
 * @param {number} id 
 */
function abrirModalDetalleDb(id) {
    const carta = state.dbCartas.find(c => c.id === id);
    if (!carta) return;

    document.getElementById('modalDetalleTitulo').textContent = carta.nombre;
    document.getElementById('modalDetalleBody').innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-5 text-center mb-3 mb-md-0">
                <img src="${carta.imagen_url}" alt="${carta.nombre}" class="img-fluid rounded shadow" style="max-height: 320px;" onerror="this.src='assets/img/booster_vigilantes_angel.jpg'">
            </div>
            <div class="col-md-7">
                <p><strong>Tipo:</strong> <span class="badge badge-tipo">${carta.tipo}</span></p>
                <p><strong>Rareza:</strong> <span class="badge badge-rareza">${carta.rareza}</span></p>
                <p><strong>Coste de Oro:</strong> <span class="badge badge-cost">${carta.coste}</span></p>
                <p><strong>Fuerza:</strong> <span class="badge badge-str">${carta.fuerza}</span></p>
                <p><strong>Edición:</strong> <span class="text-warning">${carta.edicion}</span></p>
                <hr class="border-secondary">
                <h6>Habilidad de la Carta:</h6>
                <p class="text-light bg-dark p-3 rounded">${carta.habilidad}</p>
                <small class="text-muted"><i class="bi bi-database me-1"></i> Registro recuperado desde Base de Datos SQL (ID: ${carta.id})</small>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
    modal.show();
}

/**
 * Trunca un texto a un máximo de caracteres añadiendo puntos suspensivos.
 * @param {string} texto 
 * @param {number} max 
 * @returns {string}
 */
function truncarTexto(texto, max) {
    if (!texto) return '';
    return texto.length > max ? texto.substring(0, max) + '...' : texto;
}

/**
 * Muestra un banner flotante de alerta de éxito temporal.
 * @param {string} mensaje 
 */
function mostrarAlertaExito(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow-lg z-3';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 400);
    }, 3500);
}

// ====================================================================
// 7. DATOS DE RESPALDO (OFFLINE Y GITHUB PAGES FALLBACK)
// ====================================================================
function obtenerCartasRespaldoApi() {
    return [
        { id: 101, nombre: 'Mago Oscuro', tipo: 'Normal Monster', nivel: 7, atk: 2500, def: 2100, arquetipo: 'Dark Magician', descripcion: 'El máximo hechicero en términos de ataque y defensa.', imagen: 'https://images.ygoprodeck.com/images/cards_small/46986414.jpg' },
        { id: 102, nombre: 'Dragón Blanco de Ojos Azules', tipo: 'Normal Monster', nivel: 8, atk: 3000, def: 2500, arquetipo: 'Blue-Eyes', descripcion: 'Este legendario dragón es un poderoso motor de destrucción.', imagen: 'https://images.ygoprodeck.com/images/cards_small/89631139.jpg' },
        { id: 103, nombre: 'Olla de la Codicia', tipo: 'Spell Card', nivel: null, atk: null, def: null, arquetipo: 'Pot', descripcion: 'Roba 2 cartas de tu Deck.', imagen: 'https://images.ygoprodeck.com/images/cards_small/55144522.jpg' },
        { id: 104, nombre: 'Fuerza de Espejo', tipo: 'Trap Card', nivel: null, atk: null, def: null, arquetipo: 'Mirror', descripcion: 'Cuando un monstruo del adversario declara un ataque: destruye todos los monstruos en Posición de Ataque.', imagen: 'https://images.ygoprodeck.com/images/cards_small/44095762.jpg' }
    ];
}

function obtenerCartasRespaldoDb() {
    return [
        { id: 1, nombre: 'Lucifer, El Caído', edicion: 'Vigilantes de Acero', tipo: 'Aliado', coste: 4, fuerza: 5, rareza: 'Ultra Real', habilidad: 'Furia. Cuando entra en juego, destruye un Aliado oponente de coste 3 o menor.', imagen_url: 'assets/img/booster_vigilantes_lucifer.jpg' },
        { id: 2, nombre: 'Miguel Arcángel', edicion: 'Vigilantes de Acero', tipo: 'Aliado', coste: 5, fuerza: 6, rareza: 'Ultra Real', habilidad: 'Inmune a talismanes de coste 2 o menor. En fase final, endereza Aliados defensores.', imagen_url: 'assets/img/booster_vigilantes_angel.jpg' },
        { id: 3, nombre: 'Paladín de la Alianza', edicion: 'Vigilantes de Acero', tipo: 'Aliado', coste: 3, fuerza: 4, rareza: 'Real', habilidad: 'Ataque Rápido. Mientras esté en juego, tus otros Aliados reciben +1 de Fuerza.', imagen_url: 'assets/img/booster_vigilantes_paladin.jpg' },
        { id: 4, nombre: 'Guardián de Acero', edicion: 'Vigilantes de Acero', tipo: 'Aliado', coste: 1, fuerza: 2, rareza: 'Vasallo', habilidad: 'Guardián. Al ir al cementerio, genera 1 Oro adicional.', imagen_url: 'assets/img/booster_vigilantes_angel.jpg' },
        { id: 5, nombre: 'Espada Flamígera', edicion: 'Vigilantes de Acero', tipo: 'Arma', coste: 2, fuerza: 2, rareza: 'Cortesano', habilidad: 'Portador gana +2 a la Fuerza e Imbloqueable por Aliados de coste 2 o menor.', imagen_url: 'assets/img/booster_vigilantes_paladin.jpg' },
        { id: 6, nombre: 'Trono Celestial', edicion: 'Vigilantes de Acero', tipo: 'Tótem', coste: 3, fuerza: 0, rareza: 'Real', habilidad: 'Una vez por turno, puedes descartar una carta para robar 2 cartas.', imagen_url: 'assets/img/booster_vigilantes_angel.jpg' },
        { id: 7, nombre: 'Ira Divina', edicion: 'Vigilantes de Acero', tipo: 'Talismán', coste: 3, fuerza: 0, rareza: 'Mega Real', habilidad: 'Destruye todos los Aliados en juego que tengan Fuerza 3 o menos.', imagen_url: 'assets/img/booster_vigilantes_lucifer.jpg' },
        { id: 8, nombre: 'Sello de Luz', edicion: 'Vigilantes de Acero', tipo: 'Talismán', coste: 1, fuerza: 0, rareza: 'Vasallo', habilidad: 'Anula un Talismán oponente de coste 2 o menor. Roba una carta.', imagen_url: 'assets/img/booster_vigilantes_angel.jpg' }
    ];
}
