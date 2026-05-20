// =============================================================================
// handlers.js  —  Manejadores de maniobras eléctricas
// Esclusa de Miraflores – Canal de Panamá
//
// Exporta funciones globales que los elementos SVG invocan via onclick="...()".
// Esto elimina el código inline del SVG y centraliza la lógica de maniobras.
//
// Tipos de maniobra:
//   maniobrarInterruptor(el)   — Interruptores BT (CERRAR / ABRIR / BLOQUEAR)
//   maniobrarSeccionadorTR(el) — Seccionadores TR (CERRAR / ABRIR / ATERRIZAR)
//   maniobrarSeccionador(el)   — Seccionadores primarios (con validación de anillo)
// =============================================================================

// ---------------------------------------------------------------------------
// Utilidad: leer el estado de un equipo (admite id directo o con prefijo rect_)
// ---------------------------------------------------------------------------
function _getEstado(id) {
    var el   = document.getElementById(id);
    var rect = document.getElementById('rect_' + id);
    if (el   && el.hasAttribute('data-estado'))   return el.getAttribute('data-estado');
    if (rect && rect.hasAttribute('data-estado')) return rect.getAttribute('data-estado');
    return 'ABIERTO'; // Valor por defecto seguro
}

// ---------------------------------------------------------------------------
// HANDLER 1: Interruptores de Baja Tensión (BT)
//   Opciones: 1=CERRAR  2=ABRIR  3=BLOQUEAR (candado)
// ---------------------------------------------------------------------------
window.maniobrarInterruptor = function (el) {
    var t      = el;
    var id     = t.id.replace('rect_', '');
    var estAnt = t.getAttribute('data-estado') || 'ABIERTO';

    var op = prompt('MANIOBRA BT: ' + id + '\n1: CERRAR\n2: ABRIR\n3: BLOQUEAR (CANDADO)', '2');

    var estados = { '1': 'CERRADO', '2': 'ABIERTO', '3': 'BLOQUEADO' };
    var colores  = { '1': '#13c004ff', '2': '#ffa500ff', '3': '#ff0000ff' };

    if (!estados[op]) return;

    var nuevoEst = estados[op];
    var esSeguro = true;

    // Regla 1 — No operar si está bloqueado hacia cerrado y viceversa
    if ((estAnt === 'CERRADO'   && nuevoEst === 'BLOQUEADO') ||
        (estAnt === 'BLOQUEADO' && nuevoEst === 'CERRADO')) {
        esSeguro = false;
    }

    // Regla 2 — Al cerrar, verificar vecinos prohibidos (p.ej. tierra aguas arriba)
    if (nuevoEst === 'CERRADO' && window.reglasCierreSecc && window.reglasCierreSecc[id]) {
        var regla = window.reglasCierreSecc[id];
        if (regla.prohibidoSi) {
            for (var i = 0; i < regla.prohibidoSi.length; i++) {
                var vecino = document.getElementById(regla.prohibidoSi[i]) ||
                             document.getElementById('rect_' + regla.prohibidoSi[i]);
                if (vecino && vecino.getAttribute('data-estado') === regla.estadoProhibido) {
                    esSeguro = false; break;
                }
            }
        }
    }

    if (!esSeguro) {
        alert('⚠️ ACCIÓN DETENIDA.\nPor favor evalúe la maniobra por seguridad.');
        return;
    }

    t.setAttribute('data-estado', nuevoEst);
    t.style.fill = colores[op];
    t.setAttribute('fill', colores[op]);
    if (window.actualizarTodaLaRed) window.actualizarTodaLaRed();
};

// ---------------------------------------------------------------------------
// HANDLER 2: Seccionadores de Transformador (STR)
//   Opciones: 1=CERRAR  2=ABRIR  3=ATERRIZAR (hacia carga)
// ---------------------------------------------------------------------------
window.maniobrarSeccionadorTR = function (el) {
    var t      = el;
    var id     = t.id.replace('rect_', '');
    var estAnt = t.getAttribute('data-estado') || 'ABIERTO';

    var op = prompt('SECCIONADOR TR: ' + id + '\n1: CERRAR\n2: ABRIR\n3: ATERRIZAR (Hacia Carga)', '2');

    var estados = { '1': 'CERRADO', '2': 'ABIERTO', '3': 'ATERRIZADO' };
    var colores  = { '1': '#b2ec5dff', '2': '#ffa500ff', '3': '#000000ff' };

    if (!estados[op]) return;

    var nuevoEst = estados[op];
    var esSeguro = true;

    // Regla 1 — Al cerrar: verificar que no haya tierra en los tramos vecinos
    if (nuevoEst === 'CERRADO' && window.mapaVecinos && window.mapaVecinos[id]) {
        var misTramos = window.mapaVecinos[id];
        for (var i = 0; i < misTramos.length; i++) {
            if (window.tierrasGlobal && window.tierrasGlobal[misTramos[i]]) {
                esSeguro = false; break;
            }
        }
    }

    // Regla 2 — Al aterrizar: verificar que el trafo no esté energizado
    if (nuevoEst === 'ATERRIZADO' && window.tensionGlobal) {
        if (window.tensionGlobal[id.replace('STR', 'TR')]) esSeguro = false;
    }

    // Regla 3 — Disciplina: no saltar de CERRADO a ATERRIZADO directamente
    if ((estAnt === 'CERRADO'    && nuevoEst === 'ATERRIZADO') ||
        (estAnt === 'ATERRIZADO' && nuevoEst === 'CERRADO')) {
        esSeguro = false;
    }

    if (!esSeguro) {
        alert('⚠️ ACCIÓN DETENIDA.\nEvalúe la maniobra por seguridad.');
        return;
    }

    t.setAttribute('data-estado', nuevoEst);
    t.style.fill = colores[op];
    t.setAttribute('fill', colores[op]);
    if (window.actualizarTodaLaRed) window.actualizarTodaLaRed();
};

// ---------------------------------------------------------------------------
// HANDLER 3: Seccionadores Primarios (con validación de anillo y PAT)
//   Opciones: 1=CERRADO  2=ABIERTO  3=ATERRIZADO
// ---------------------------------------------------------------------------
window.maniobrarSeccionador = function (el) {
    var t        = el;
    var idLimpio = t.id.replace('rect_', '');
    var estAnt   = t.getAttribute('data-estado') || 'ABIERTO';

    var eleccion = prompt(idLimpio + '\nEstado actual: ' + estAnt +
                          '\n1: CERRADO\n2: ABIERTO\n3: ATERRIZADO', '2');

    var estados = { '1': 'CERRADO', '2': 'ABIERTO', '3': 'ATERRIZADO' };
    var colores  = { '1': '#b2ec5dff', '2': '#ffa500ff', '3': '#000000ff' };

    if (!estados[eleccion]) return;

    var nEst = estados[eleccion];

    // Regla 1 — Disciplina de secuencia
    if ((estAnt === 'CERRADO'    && nEst === 'ATERRIZADO') ||
        (estAnt === 'ATERRIZADO' && nEst === 'CERRADO')) {
        alert('¡MANIOBRA PROHIBIDA!\nDebe pasar por ABIERTO.');
        return;
    }

    // Regla 2 — Cierre seguro
    if (nEst === 'CERRADO') {
        // 2a. Interlocks directos
        var regla = window.reglasCierreSecc ? window.reglasCierreSecc[idLimpio] : null;
        if (regla && regla.prohibidoSi) {
            for (var k = 0; k < regla.prohibidoSi.length; k++) {
                var enemigo = document.getElementById(regla.prohibidoSi[k]);
                if (enemigo && enemigo.getAttribute('data-estado') === regla.estadoProhibido) {
                    alert('⛔ BLOQUEO LOCAL ⛔\nEl equipo ' + regla.prohibidoSi[k] +
                          ' está en ' + regla.estadoProhibido);
                    return;
                }
            }
        }
        // 2b. Verificación de ruta (si existe validarCierre)
        if (window.validarCierre) {
            var analisis = window.validarCierre(idLimpio);
            if (!analisis.ok) {
                alert('⛔ ¡PELIGRO DE CORTO! ⛔\n' + analisis.msg);
                return;
            }
        }
    }

    // Regla 3 — Puesta a tierra segura
    if (nEst === 'ATERRIZADO') {
        var tramosObj = (window.reglasTierra && window.reglasTierra[idLimpio]) ?
                         window.reglasTierra[idLimpio] : [];
        for (var i = 0; i < tramosObj.length; i++) {
            if (window.tensionGlobal && window.tensionGlobal[tramosObj[i]]) {
                alert('⛔ ¡PELIGRO MORTAL! ⛔\nEl tramo [' + tramosObj[i] + '] está ENERGIZADO.');
                return;
            }
        }
    }

    // Regla 4 — Apertura segura en anillo (previene aislamiento con carga)
    if (nEst === 'ABIERTO' && window.reglasAperturaAnillo && window.reglasAperturaAnillo[idLimpio]) {
        var reglaAp = window.reglasAperturaAnillo[idLimpio];

        var estadoPareja = _getEstado(reglaAp.pareja);
        var estadoItr    = _getEstado(reglaAp.itr);

        if (estadoPareja === 'ABIERTO' && estadoItr === 'CERRADO') {
            alert('⚠️ PROCEDIMIENTO INCORRECTO:\n\nEsta intentando aislar el ' + reglaAp.tramo +
                  ', para lograr esto se debe desconectar la carga del ' + reglaAp.tr +
                  ', mediante la apertura del ' + reglaAp.itr + ' primero.');
            return;
        }
    }

    // Aplicar cambio de estado
    t.setAttribute('data-estado', nEst);
    if (t.style) { t.style.fill = colores[eleccion]; t.setAttribute('fill', colores[eleccion]); }
    if (window.actualizarTodaLaRed) window.actualizarTodaLaRed();
};
