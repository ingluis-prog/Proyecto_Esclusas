// =============================================================================
// panel.js  —  Panel lateral de inspección de equipos
// Esclusa de Miraflores – Canal de Panamá
//
// Muestra un panel deslizante con imagen y datos técnicos del elemento
// seleccionado en el diagrama SVG.
// =============================================================================

// ---------------------------------------------------------------------------
// BASE DE DATOS TÉCNICA DE EQUIPOS
// ---------------------------------------------------------------------------
window.DATOS_TECNICOS = {

    // ── Clasificación por prefijo (datos por defecto según tipo) ──
    _tipos: {
        'IRT': {
            tipo: 'Interruptor Radial BT',
            descripcion: 'Interruptor de baja tensión que alimenta el bus principal desde la acometida.',
            voltaje: '480V AC',
            corriente: '3,200A',
            capacidad: '65kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'ITT': {
            tipo: 'Interruptor de Enlace BT',
            descripcion: 'Interruptor de transferencia entre secciones del bus de baja tensión.',
            voltaje: '480V AC',
            corriente: '2,500A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'ITIETT': {
            tipo: 'Interruptor Principal de Enlace',
            descripcion: 'Interruptor principal de transferencia entre switchrooms.',
            voltaje: '480V AC',
            corriente: '4,000A',
            capacidad: '65kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },
        'STR': {
            tipo: 'Seccionador de Transformador',
            descripcion: 'Seccionador de aislamiento del transformador para mantenimiento seguro.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador TR'
        },
        'ITR5': {
            tipo: 'Interruptor de Protección TR 500',
            descripcion: 'Interruptor de protección del transformador de potencia 500kVA.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Seccionador TR'
        },
        'ITR7': {
            tipo: 'Interruptor Secundario 700V',
            descripcion: 'Interruptor de protección del devanado secundario del transformador.',
            voltaje: '700V AC',
            corriente: '1,200A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Seccionador TR'
        },
        'ITIETR5': {
            tipo: 'Interruptor de Tierra TR 500',
            descripcion: 'Interruptor de puesta a tierra del transformador para seguridad en mantenimiento.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'Tierra',
            fabricante: 'ABB',
            categoria: 'Seccionador TR'
        },
        'ITIETR7': {
            tipo: 'Interruptor de Tierra Secundario',
            descripcion: 'Interruptor de puesta a tierra del circuito secundario.',
            voltaje: '700V AC',
            corriente: '1,200A',
            capacidad: 'Tierra',
            fabricante: 'ABB',
            categoria: 'Seccionador TR'
        },
        'INTM': {
            tipo: 'Interruptor de Motor Principal',
            descripcion: 'Interruptor de protección de motor de alta capacidad para compuertas.',
            voltaje: '480V AC',
            corriente: '800A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor Motor'
        },
        'INT': {
            tipo: 'Interruptor de Motor/Carga',
            descripcion: 'Interruptor de protección para motores y cargas del switchroom.',
            voltaje: '480V AC',
            corriente: '400A',
            capacidad: '35kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor Motor'
        },
        'SN': {
            tipo: 'Seccionador Primario Norte',
            descripcion: 'Seccionador de aislamiento en el circuito primario lado norte.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador Primario'
        },
        'SS': {
            tipo: 'Seccionador Primario Sur',
            descripcion: 'Seccionador de aislamiento en el circuito primario lado sur.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador Primario'
        },
        'S-': {
            tipo: 'Seccionador de Línea',
            descripcion: 'Seccionador de aislamiento en línea de distribución primaria.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador Primario'
        },
        'SFIREPUMP': {
            tipo: 'Seccionador Bomba Contra Incendios',
            descripcion: 'Seccionador de alimentación de la bomba del sistema contra incendios.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'SCAISSON': {
            tipo: 'Seccionador de Caisson',
            descripcion: 'Seccionador de alimentación de los sistemas de achique del caisson.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'SPMP': {
            tipo: 'Seccionador de Bomba',
            descripcion: 'Seccionador de alimentación para bomba de agua o llenado.',
            voltaje: '13.8kV',
            corriente: '400A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'SM': {
            tipo: 'Seccionador de Motor Auxiliar',
            descripcion: 'Seccionador de alimentación para motor auxiliar.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'SBLDG': {
            tipo: 'Seccionador de Edificio',
            descripcion: 'Seccionador de alimentación del edificio de control.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'STEST': {
            tipo: 'Seccionador de Prueba',
            descripcion: 'Seccionador para gabinete de pruebas de cables.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'SAIR': {
            tipo: 'Seccionador de Compresor',
            descripcion: 'Seccionador de alimentación del compresor de aire.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Auxiliar'
        },
        'STIE': {
            tipo: 'Seccionador TIE',
            descripcion: 'Seccionador de enlace entre fases del circuito primario.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador Primario'
        },
        'SDE': {
            tipo: 'Seccionador de Derivación',
            descripcion: 'Seccionador de derivación en circuito primario.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador Primario'
        }
    },

    // Obtener datos técnicos de un equipo por su ID
    obtener: function(id) {
        var cleanId = id.replace('rect_', '');

        // Buscar la coincidencia más larga primero (más específica)
        var tipos = this._tipos;
        var keys = Object.keys(tipos).sort(function(a, b) { return b.length - a.length; });

        for (var i = 0; i < keys.length; i++) {
            if (cleanId.indexOf(keys[i]) === 0 || cleanId.startsWith(keys[i])) {
                var base = tipos[keys[i]];
                return {
                    id: cleanId,
                    tipo: base.tipo,
                    descripcion: base.descripcion,
                    voltaje: base.voltaje,
                    corriente: base.corriente,
                    capacidad: base.capacidad,
                    fabricante: base.fabricante,
                    categoria: base.categoria
                };
            }
        }

        return {
            id: cleanId,
            tipo: 'Equipo Eléctrico',
            descripcion: 'Elemento del diagrama unifilar.',
            voltaje: '—',
            corriente: '—',
            capacidad: '—',
            fabricante: '—',
            categoria: 'General'
        };
    }
};

// ---------------------------------------------------------------------------
// COLORES DE ESTADO (para referencia visual en el panel)
// ---------------------------------------------------------------------------
var COLORES_ESTADO = {
    'CERRADO':    { color: '#0d8659', label: 'Cerrado', icono: '🟢' },
    'ABIERTO':    { color: '#ff0000', label: 'Abierto', icono: '🔴' },
    'BLOQUEADO':  { color: '#ff4455', label: 'Bloqueado', icono: '⚠️' },
    'ATERRIZADO': { color: '#8b4513', label: 'Aterrizado', icono: '⚡' }
};

// ---------------------------------------------------------------------------
// MAPEO DE ID → CARPETA DE CATEGORÍA
// ---------------------------------------------------------------------------
var CARPETAS_CATEGORIA = {
    'Interruptor BT':         'interruptores-bt',
    'Interruptor Motor':      'interruptores-motor',
    'Seccionador TR':         'seccionadores-tr',
    'Seccionador Primario':   'seccionadores-primarios',
    'Seccionador Auxiliar':   'auxiliares'
};

// Extensiones soportadas para imágenes (buscar en este orden)
var EXTENSIONES_IMG = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

// ---------------------------------------------------------------------------
// OBTENER RUTA DE IMAGEN DEL EQUIPO
// Busca en img/equipos/{categoria}/{ID}.{ext}
// Retorna una promesa que resuelve con la URL de la imagen encontrada
// ---------------------------------------------------------------------------
function _buscarImagenEquipo(id, categoria) {
    var carpeta = CARPETAS_CATEGORIA[categoria] || 'auxiliares';
    var basePath = 'img_equipos/' + carpeta + '/' + id;

    return new Promise(function(resolve) {
        var intentar = function(index) {
            if (index >= EXTENSIONES_IMG.length) {
                resolve(null); // No se encontró imagen
                return;
            }
            var img = new Image();
            var url = basePath + '.' + EXTENSIONES_IMG[index];
            img.onload = function() { resolve(url); };
            img.onerror = function() { intentar(index + 1); };
            img.src = url;
        };
        intentar(0);
    });
}

// ---------------------------------------------------------------------------
// CAPTURA DE IMAGEN SVG DEL ELEMENTO (fallback)
// ---------------------------------------------------------------------------
function _capturarImagenElemento(elementId) {
    var el = document.getElementById(elementId) || document.getElementById('rect_' + elementId);
    if (!el) return null;

    var svg = document.querySelector('#svg-container svg');
    if (!svg) return null;

    try {
        var bbox = el.getBBox();
        var padding = Math.max(bbox.width, bbox.height) * 2.5;
        var x = bbox.x - padding;
        var y = bbox.y - padding;
        var w = bbox.width + padding * 2;
        var h = bbox.height + padding * 2;

        var svgClone = svg.cloneNode(true);
        svgClone.setAttribute('viewBox', x + ' ' + y + ' ' + w + ' ' + h);
        svgClone.setAttribute('width', '360');
        svgClone.setAttribute('height', '280');
        svgClone.style.transform = 'none';
        svgClone.style.background = '#ffffff';

        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgClone);
        var dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

        return dataUrl;
    } catch (e) {
        console.warn('No se pudo capturar imagen del elemento:', e);
        return null;
    }
}

// ---------------------------------------------------------------------------
// DETERMINAR HANDLER DEL ELEMENTO
// ---------------------------------------------------------------------------
function _getHandlerType(el) {
    var onclick = el.getAttribute('onclick') || '';
    if (onclick.indexOf('maniobrarInterruptor') !== -1) return 'Interruptor BT';
    if (onclick.indexOf('maniobrarSeccionadorTR') !== -1) return 'Seccionador TR';
    if (onclick.indexOf('maniobrarSeccionador') !== -1) return 'Seccionador Primario';
    return 'Desconocido';
}

// ---------------------------------------------------------------------------
// OBTENER VECINOS DESDE cerebro.js
// ---------------------------------------------------------------------------
function _getVecinos(id) {
    if (window.mapaVecinos && window.mapaVecinos[id]) {
        return window.mapaVecinos[id];
    }
    return [];
}

// ---------------------------------------------------------------------------
// DETERMINAR SI ES NORMALMENTE ABIERTO
// ---------------------------------------------------------------------------
function _esNormalmenteAbierto(id) {
    if (window.EQUIPOS_NORMALMENTE_ABIERTOS) {
        return window.EQUIPOS_NORMALMENTE_ABIERTOS.indexOf(id) !== -1;
    }
    return false;
}

// ---------------------------------------------------------------------------
// ABRIR PANEL LATERAL
// ---------------------------------------------------------------------------
window.abrirPanelInspeccion = function(elementoSVG) {
    var id = (elementoSVG.id || '').replace('rect_', '');
    if (!id) return;

    var datos = window.DATOS_TECNICOS.obtener(id);
    var estado = elementoSVG.getAttribute('data-estado') || 'ABIERTO';
    var estadoInfo = COLORES_ESTADO[estado] || COLORES_ESTADO['ABIERTO'];
    var handlerType = _getHandlerType(elementoSVG);
    var vecinos = _getVecinos(id);
    var normalmenteAbierto = _esNormalmenteAbierto(id);

    var panel = document.getElementById('panel-inspeccion');
    if (!panel) return;

    // ── Header ──
    document.getElementById('panel-equipo-id').textContent = id;
    document.getElementById('panel-equipo-tipo').textContent = datos.tipo;
    document.getElementById('panel-equipo-cat').textContent = datos.categoria;

    // ── Estado ──
    var estadoEl = document.getElementById('panel-estado');
    estadoEl.innerHTML = '<span class="panel-estado-dot" style="background:' + estadoInfo.color + '"></span> ' + estadoInfo.label;

    // ── Posición normal ──
    var posNormal = document.getElementById('panel-pos-normal');
    posNormal.textContent = normalmenteAbierto ? 'Normalmente Abierto' : 'Normalmente Cerrado';
    posNormal.className = 'panel-badge ' + (normalmenteAbierto ? 'badge-abierto' : 'badge-cerrado');

    // ── Datos técnicos ──
    document.getElementById('panel-voltaje').textContent = datos.voltaje;
    document.getElementById('panel-corriente').textContent = datos.corriente;
    document.getElementById('panel-capacidad').textContent = datos.capacidad;
    document.getElementById('panel-fabricante').textContent = datos.fabricante;
    document.getElementById('panel-handler').textContent = handlerType;

    // ── Descripción ──
    document.getElementById('panel-descripcion').textContent = datos.descripcion;

    // ── Conexiones (vecinos) ──
    var vecinosEl = document.getElementById('panel-vecinos');
    if (vecinos.length > 0) {
        vecinosEl.innerHTML = vecinos.map(function(v) {
            return '<span class="panel-vecino-tag">' + v + '</span>';
        }).join('');
    } else {
        vecinosEl.innerHTML = '<span class="panel-sin-datos">Sin datos de conexión</span>';
    }

    // ── Mostrar panel ──
    panel.classList.add('panel-visible');

    // Resaltar elemento en el SVG
    _resaltarElemento(elementoSVG);

    // ── Cargar imagen (asincrónico) ──
    var imgContainer = document.getElementById('panel-imagen');
    imgContainer.innerHTML = '<div class="panel-no-img">Cargando imagen...</div>';

    _buscarImagenEquipo(id, datos.categoria).then(function(imagenUrl) {
        if (imagenUrl) {
            imgContainer.innerHTML = '<img src="' + imagenUrl + '" alt="Vista de ' + id + '" title="' + id + '" />';
        } else {
            // Fallback: capturar del SVG del diagrama
            var fallbackUrl = _capturarImagenElemento(id);
            if (fallbackUrl) {
                imgContainer.innerHTML = '<img src="' + fallbackUrl + '" alt="Vista diagrama de ' + id + '" />';
            } else {
                imgContainer.innerHTML = '<div class="panel-no-img">Sin imagen disponible</div>';
            }
        }
    });
};

// ---------------------------------------------------------------------------
// CERRAR PANEL
// ---------------------------------------------------------------------------
window.cerrarPanelInspeccion = function() {
    var panel = document.getElementById('panel-inspeccion');
    if (panel) panel.classList.remove('panel-visible');
    _limpiarResaltado();
};

// ---------------------------------------------------------------------------
// RESALTADO DE ELEMENTO
// ---------------------------------------------------------------------------
var _elementoResaltado = null;
var _strokeOriginal = null;
var _strokeWidthOriginal = null;

function _resaltarElemento(el) {
    _limpiarResaltado();
    _elementoResaltado = el;
    _strokeOriginal = el.getAttribute('stroke') || el.style.stroke || '';
    _strokeWidthOriginal = el.getAttribute('stroke-width') || el.style.strokeWidth || '';
    el.style.stroke = '#ffd700';
    el.style.strokeWidth = '4';
    el.style.filter = 'drop-shadow(0 0 8px #ffd700)';
}

function _limpiarResaltado() {
    if (_elementoResaltado) {
        _elementoResaltado.style.stroke = _strokeOriginal;
        _elementoResaltado.style.strokeWidth = _strokeWidthOriginal;
        _elementoResaltado.style.filter = '';
        _elementoResaltado = null;
    }
}

// ---------------------------------------------------------------------------
// MODO INSPECCIÓN — Toggle entre maniobra e inspección
// ---------------------------------------------------------------------------
window._modoInspeccion = false;

window.toggleModoInspeccion = function() {
    window._modoInspeccion = !window._modoInspeccion;
    var btn = document.getElementById('btn-modo-inspeccion');
    if (btn) {
        if (window._modoInspeccion) {
            btn.textContent = '🔍 Modo Inspección: ON';
            btn.style.background = '#0c7f5d';
            btn.style.boxShadow = '0 0 12px rgba(255,255,255,0.4)';
        } else {
            btn.textContent = '🔍 Inspeccionar';
            btn.style.background = '#003d82';
            btn.style.boxShadow = 'none';
            window.cerrarPanelInspeccion();
        }
    }
    // Cambiar cursor en todo el SVG
    var svgContainer = document.getElementById('svg-container');
    if (svgContainer) {
        svgContainer.style.cursor = window._modoInspeccion ? 'crosshair' : '';
    }
};

// ---------------------------------------------------------------------------
// HOOK: Interceptar clics cuando modo inspección está activo
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

    // Guardar las funciones originales de maniobra
    var _origManiobrarInterruptor  = window.maniobrarInterruptor;
    var _origManiobrarSeccionadorTR = window.maniobrarSeccionadorTR;
    var _origManiobrarSeccionador   = window.maniobrarSeccionador;

    // Sobrescribir handlers para interceptar en modo inspección
    window.maniobrarInterruptor = function(el) {
        if (window._modoInspeccion) {
            window.abrirPanelInspeccion(el);
            return;
        }
        _origManiobrarInterruptor(el);
    };

    window.maniobrarSeccionadorTR = function(el) {
        if (window._modoInspeccion) {
            window.abrirPanelInspeccion(el);
            return;
        }
        _origManiobrarSeccionadorTR(el);
    };

    window.maniobrarSeccionador = function(el) {
        if (window._modoInspeccion) {
            window.abrirPanelInspeccion(el);
            return;
        }
        _origManiobrarSeccionador(el);
    };

    // Tecla Escape para cerrar panel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.cerrarPanelInspeccion();
    });

    // Tecla I para toggle rápido del modo inspección
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            // No activar si se está escribiendo en un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            window.toggleModoInspeccion();
        }
    });
});
