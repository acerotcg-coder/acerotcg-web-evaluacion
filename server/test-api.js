/**
 * Test runner para simular la ejecución de Thunder Client y verificar las rutas REST.
 */
async function runTests() {
    console.log('🧪 Iniciando verificación de rutas Thunder Client...\n');
    let pasados = 0;

    try {
        // Test 1: Health
        const r1 = await fetch('http://localhost:3000/api/health');
        const j1 = await r1.json();
        if (r1.status === 200 && j1.status === 'ok') {
            console.log('✅ [TEST 1/6] GET /api/health -> HTTP 200 (BD Conectada, ' + j1.totalCartas + ' cartas)');
            pasados++;
        }

        // Test 2: Cartas All
        const r2 = await fetch('http://localhost:3000/api/cartas');
        const j2 = await r2.json();
        if (r2.status === 200 && j2.exito && j2.total >= 12) {
            console.log('✅ [TEST 2/6] GET /api/cartas -> HTTP 200 (' + j2.total + ' cartas obtenidas)');
            pasados++;
        }

        // Test 3: Filter Tipo
        const r3 = await fetch('http://localhost:3000/api/cartas?tipo=Aliado');
        const j3 = await r3.json();
        if (r3.status === 200 && j3.exito && j3.total > 0) {
            console.log('✅ [TEST 3/6] GET /api/cartas?tipo=Aliado -> HTTP 200 (' + j3.total + ' aliados filtrados)');
            pasados++;
        }

        // Test 4: Por ID
        const r4 = await fetch('http://localhost:3000/api/cartas/1');
        const j4 = await r4.json();
        if (r4.status === 200 && j4.datos && j4.datos.nombre.includes('Lucifer')) {
            console.log('✅ [TEST 4/6] GET /api/cartas/1 -> HTTP 200 (Carta encontrada: ' + j4.datos.nombre + ')');
            pasados++;
        }

        // Test 5: POST Nueva Carta
        const r5 = await fetch('http://localhost:3000/api/cartas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Dragón Titán de Acero',
                edicion: 'Vigilantes de Acero',
                tipo: 'Aliado',
                coste: 5,
                fuerza: 7,
                rareza: 'Ultra Real',
                habilidad: 'Furia. Inmune a efectos de cartas de coste 3 o menor.',
                imagen_url: 'assets/img/booster_vigilantes_lucifer.jpg'
            })
        });
        const j5 = await r5.json();
        if (r5.status === 201 && j5.exito) {
            console.log('✅ [TEST 5/6] POST /api/cartas -> HTTP 201 (Carta insertada con ID: ' + j5.idInsertado + ')');
            pasados++;
        }

        // Test 6: Mazos
        const r6 = await fetch('http://localhost:3000/api/mazos');
        const j6 = await r6.json();
        if (r6.status === 200 && j6.exito && j6.total >= 3) {
            console.log('✅ [TEST 6/6] GET /api/mazos -> HTTP 200 (' + j6.total + ' mazos registrados)');
            pasados++;
        }

        console.log(`\n🎉 Resultado Final: ${pasados}/6 pruebas superadas exitosamente con Thunder Client!`);
    } catch (e) {
        console.error('❌ Error ejecutando pruebas:', e.message);
    }
}

runTests();
