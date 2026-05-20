// =============================================================================
// panel.js  —  Panel lateral de inspección de equipos
// Esclusa de Pedro Miguel – Canal de Panamá
//
// Muestra un panel deslizante con imagen y datos técnicos del elemento
// seleccionado en el diagrama SVG.
// =============================================================================

// ---------------------------------------------------------------------------
// BASE DE DATOS TÉCNICA DE EQUIPOS
// ---------------------------------------------------------------------------
window.DATOS_TECNICOS = {

    // ── Clasificación por prefijo — Esclusa de Pedro Miguel ──
    _tipos: {
        // ── INTERRUPTORES DE ALIMENTACIÓN PRINCIPAL ──
        'IM': {
            tipo: 'Interruptor de Alimentación Principal',
            descripcion: 'Interruptor principal de alimentación desde la línea de 13.8kV.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'IE': {
            tipo: 'Interruptor de Enlace',
            descripcion: 'Interruptor de enlace entre secciones del bus primario.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },

        // ── INTERRUPTORES BT (480V) POR SWITCHROOM ──
        'I1AP1': {
            tipo: 'Interruptor Radial 1A P1',
            descripcion: 'Interruptor radial de baja tensión, posición 1A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '3,200A',
            capacidad: '65kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I1BP1': {
            tipo: 'Interruptor Radial 1B P1',
            descripcion: 'Interruptor radial de baja tensión, posición 1B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '3,200A',
            capacidad: '65kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I2AP1': {
            tipo: 'Interruptor Radial 2A P1',
            descripcion: 'Interruptor radial de baja tensión, posición 2A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,500A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I2BP1': {
            tipo: 'Interruptor Radial 2B P1',
            descripcion: 'Interruptor radial de baja tensión, posición 2B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,500A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I3AP1': {
            tipo: 'Interruptor 3A P1',
            descripcion: 'Interruptor de distribución posición 3A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I3BP1': {
            tipo: 'Interruptor 3B P1',
            descripcion: 'Interruptor de distribución posición 3B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I4BP1': {
            tipo: 'Interruptor 4B P1',
            descripcion: 'Interruptor de distribución posición 4B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I5AP1': {
            tipo: 'Interruptor 5A P1',
            descripcion: 'Interruptor de distribución posición 5A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I5BP1': {
            tipo: 'Interruptor 5B P1',
            descripcion: 'Interruptor de distribución posición 5B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I6AP1': {
            tipo: 'Interruptor 6A P1',
            descripcion: 'Interruptor de distribución posición 6A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I6BP1': {
            tipo: 'Interruptor 6B P1',
            descripcion: 'Interruptor de distribución posición 6B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I7AP1': {
            tipo: 'Interruptor 7A P1',
            descripcion: 'Interruptor de distribución posición 7A del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'I7BP1': {
            tipo: 'Interruptor 7B P1',
            descripcion: 'Interruptor de distribución posición 7B del switchroom P1.',
            voltaje: '480V AC',
            corriente: '2,000A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },

        // ── INTERRUPTORES DE TRANSFORMADOR ──
        'ITR5': {
            tipo: 'Interruptor de Protección TR Serie 500',
            descripcion: 'Interruptor de protección del transformador de potencia serie 500.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Transformador'
        },
        'ITR7': {
            tipo: 'Interruptor Secundario TR Serie 700',
            descripcion: 'Interruptor de protección del devanado secundario del transformador serie 700.',
            voltaje: '480V AC',
            corriente: '1,200A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Transformador'
        },

        // ── INTERRUPTORES BUSTIE ──
        'IBUSTIE': {
            tipo: 'Interruptor de Enlace de Bus (Bustie)',
            descripcion: 'Interruptor de acoplamiento entre secciones del bus secundario del transformador.',
            voltaje: '480V AC',
            corriente: '1,200A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },

        // ── INTERRUPTORES DE RIELES ──
        'INTRIELES-RT': {
            tipo: 'Interruptor de Rieles (Radial)',
            descripcion: 'Interruptor radial de rieles para transferencia de locomotoras.',
            voltaje: '480V AC',
            corriente: '800A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },
        'INTRIELES-TT': {
            tipo: 'Interruptor de Rieles (Transfer)',
            descripcion: 'Interruptor de transferencia de rieles entre switchrooms.',
            voltaje: '480V AC',
            corriente: '800A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },
        'ITIE-TT': {
            tipo: 'Interruptor TIE Rieles',
            descripcion: 'Interruptor de enlace TIE entre segmentos de rieles.',
            voltaje: '480V AC',
            corriente: '800A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },

        // ── SECCIONADORES EAST (SE) ──
        'SEW': {
            tipo: 'Seccionador East-West',
            descripcion: 'Seccionador de aislamiento entre circuitos East y West.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },
        'SE12-PUMP': {
            tipo: 'Seccionador de Bomba',
            descripcion: 'Seccionador de alimentación para bomba de agua.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SE': {
            tipo: 'Seccionador East',
            descripcion: 'Seccionador de aislamiento en circuito primario lado East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },

        // ── SECCIONADORES WEST (SW) ──
        'SW': {
            tipo: 'Seccionador West',
            descripcion: 'Seccionador de aislamiento en circuito primario lado West.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },

        // ── SECCIONADORES AUXILIARES ──
        'SFIRE': {
            tipo: 'Seccionador Bomba Contra Incendios',
            descripcion: 'Seccionador de alimentación de la bomba del sistema contra incendios.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SNACOMP': {
            tipo: 'Seccionador de Compresor Norte',
            descripcion: 'Seccionador de alimentación del compresor de aire lado norte.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SSACOMP': {
            tipo: 'Seccionador de Compresor Sur',
            descripcion: 'Seccionador de alimentación del compresor de aire lado sur.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
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
    'CERRADO':     { color: '#b2ec5d', label: 'Cerrado', icono: '🟢' },
    'ABIERTO':     { color: '#ffa500', label: 'Abierto', icono: '🟠' },
    'DESACOPLADO': { color: '#cccccc', label: 'Desacoplado', icono: '⚪' },
    'BLOQUEADO':   { color: '#ff4455', label: 'Bloqueado', icono: '⚠️' },
    'ATERRIZADO':  { color: '#8b4513', label: 'Aterrizado', icono: '⚡' }
};

// ---------------------------------------------------------------------------
// MAPEO DE CATEGORÍA → CARPETA DE IMÁGENES (Pedro Miguel)
// ---------------------------------------------------------------------------
var CARPETAS_CATEGORIA = {
    'Interruptor Primario':   'interruptores',
    'Interruptor BT':         'interruptores',
    'Interruptor TR':         'interruptores',
    'Transformador':          'transformadores',
    'Seccionador':            'seccionadores',
    'Seccionador TR':         'seccionadores',
    'Auxiliar':               'auxiliares'
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
    var id = (el.id || '').toUpperCase();
    var onclick = el.getAttribute('onclick') || '';

    // Pedro Miguel usa onclick inline — detectar tipo por prefijo del ID
    if (id.indexOf('SE') === 0 || id.indexOf('SW') === 0) return 'Seccionador TR';
    if (id.indexOf('STR') === 0) return 'Seccionador TR';
    if (id.indexOf('ITR') === 0) return 'Interruptor TR';
    if (id.indexOf('IRT') === 0 || id.indexOf('ITT') === 0 || id.indexOf('ITIETT') === 0) return 'Interruptor BT';
    if (id.indexOf('IM') === 0) return 'Interruptor Motor';
    if (id.indexOf('IBUSTIE') === 0) return 'Interruptor Bustie';
    if (id.indexOf('INTRIELES') === 0) return 'Interruptor de Rieles';
    if (id.indexOf('I') === 0) return 'Interruptor BT';

    // Fallback: detectar por contenido del onclick
    if (onclick.indexOf('CERRADO') !== -1 || onclick.indexOf('ABIERTO') !== -1) return 'Equipo de Maniobra';
    if (onclick.indexOf('ENERGIZADA') !== -1) return 'Barra / Bus';
    return 'Componente';
}

// ---------------------------------------------------------------------------
// OBTENER VECINOS DESDE cerebro.js
// ---------------------------------------------------------------------------
function _getVecinos(id) {
    // Pedro Miguel usa mapaInterlocks
    if (window.mapaInterlocks && window.mapaInterlocks[id]) {
        return window.mapaInterlocks[id];
    }
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
// Pedro Miguel usa onclick inline (no funciones nombradas), así que
// usamos un listener en fase de captura para interceptar antes del inline JS.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

    var svgContainer = document.getElementById('svg-container');

    if (svgContainer) {
        // Capture-phase listener: se ejecuta ANTES que los onclick inline
        svgContainer.addEventListener('click', function(e) {
            if (!window._modoInspeccion) return;

            var target = e.target;
            // Subir por el DOM buscando un elemento interactivo
            while (target && target !== svgContainer) {
                if (target.hasAttribute('data-estado') ||
                    target.style.cursor === 'pointer' ||
                    target.hasAttribute('onclick')) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Bloquea también el onclick inline
                    window.abrirPanelInspeccion(target);
                    return;
                }
                target = target.parentElement;
            }
        }, true); // true = capture phase
    }

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
