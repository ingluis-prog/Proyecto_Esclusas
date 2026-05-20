// =============================================================================
// panel.js  —  Panel lateral de inspección de equipos
// Esclusa de Gatún – Canal de Panamá
//
// Muestra un panel deslizante con imagen y datos técnicos del elemento
// seleccionado en el diagrama SVG.
// =============================================================================

// ---------------------------------------------------------------------------
// BASE DE DATOS TÉCNICA DE EQUIPOS
// ---------------------------------------------------------------------------
window.DATOS_TECNICOS = {

    // ── Clasificación por prefijo — Esclusa de Gatún ──
    _tipos: {
        // ── INTERRUPTORES PRIMARIOS (13.8kV) ──
        'IHE-': {
            tipo: 'Interruptor Primario Hydro-East',
            descripcion: 'Interruptor de potencia en la línea primaria 13.8kV, alimentación Hydro-East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'IGE-': {
            tipo: 'Interruptor Primario Gatún-East',
            descripcion: 'Interruptor de potencia en la línea primaria 13.8kV, alimentación Gatún-East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'IGW-': {
            tipo: 'Interruptor Primario Gatún-West',
            descripcion: 'Interruptor de potencia en la línea primaria 13.8kV, alimentación Gatún-West.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'ICAP-': {
            tipo: 'Interruptor de Capacitor / Futuro',
            descripcion: 'Interruptor reservado para banco de capacitores o expansión futura.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'ITRAMOHE': {
            tipo: 'Interruptor de Tramo Hydro-East',
            descripcion: 'Interruptor que protege el tramo de alimentación Hydro-East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'ISPAR': {
            tipo: 'Interruptor Spare',
            descripcion: 'Interruptor de reserva (spare) en el circuito primario.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },
        'IBUSTIE': {
            tipo: 'Interruptor de Enlace de Bus (Bustie)',
            descripcion: 'Interruptor de acoplamiento entre secciones del bus primario 13.8kV.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: '25kA',
            fabricante: 'ABB',
            categoria: 'Interruptor Primario'
        },

        // ── INTERRUPTORES DE TRANSFORMADOR (TR) ──
        'ITR4': {
            tipo: 'Interruptor de Protección TR Serie 400',
            descripcion: 'Interruptor de protección del transformador de potencia serie 400.',
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

        // ── INTERRUPTORES BT (480V) ──
        'IRT-': {
            tipo: 'Interruptor Radial BT',
            descripcion: 'Interruptor de baja tensión que alimenta el bus principal desde la acometida.',
            voltaje: '480V AC',
            corriente: '3,200A',
            capacidad: '65kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'ITT-': {
            tipo: 'Interruptor de Enlace BT',
            descripcion: 'Interruptor de transferencia entre secciones del bus de baja tensión.',
            voltaje: '480V AC',
            corriente: '2,500A',
            capacidad: '50kA',
            fabricante: 'ABB / Eaton',
            categoria: 'Interruptor BT'
        },
        'IT-': {
            tipo: 'Interruptor de Transferencia',
            descripcion: 'Interruptor de transferencia para circuitos de turntable o auxiliares.',
            voltaje: '480V AC',
            corriente: '1,200A',
            capacidad: '35kA',
            fabricante: 'ABB',
            categoria: 'Interruptor BT'
        },
        'IFUS-': {
            tipo: 'Fusible de Protección',
            descripcion: 'Fusible de protección para unidades de transformador.',
            voltaje: '480V AC',
            corriente: '400A',
            capacidad: 'N/A',
            fabricante: 'ABB / Bussmann',
            categoria: 'Auxiliar'
        },

        // ── SECCIONADORES DE TRANSFORMADOR ──
        'STR': {
            tipo: 'Seccionador de Transformador',
            descripcion: 'Seccionador de aislamiento del transformador para mantenimiento seguro.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Transformador'
        },

        // ── SECCIONADORES PRIMARIOS ──
        'SGW-': {
            tipo: 'Seccionador Primario Gatún-West',
            descripcion: 'Seccionador de aislamiento en el circuito primario lado Gatún-West.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },
        'SGE-': {
            tipo: 'Seccionador Primario Gatún-East',
            descripcion: 'Seccionador de aislamiento en el circuito primario lado Gatún-East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },
        'SHE-': {
            tipo: 'Seccionador Hydro-East',
            descripcion: 'Seccionador de aislamiento en la alimentación Hydro-East.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },
        'S23-': {
            tipo: 'Seccionador Station 23',
            descripcion: 'Seccionador de aislamiento en la subestación Station 23.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB / Siemens',
            categoria: 'Seccionador'
        },
        'S-SCHEDULE': {
            tipo: 'Seccionador de Programa',
            descripcion: 'Seccionador de scheduling para programa de mantenimiento.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Seccionador'
        },

        // ── SELECTORES ──
        'SEL-': {
            tipo: 'Selector Non-Loadbreak',
            descripcion: 'Selector de fuente sin capacidad de interrupción bajo carga.',
            voltaje: '13.8kV',
            corriente: '600A',
            capacidad: 'N/A (sin carga)',
            fabricante: 'ABB',
            categoria: 'Seccionador'
        },

        // ── SECCIONADORES AUXILIARES ──
        'SCAISSON': {
            tipo: 'Seccionador de Caisson',
            descripcion: 'Seccionador de alimentación de los sistemas de achique del caisson.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'STOWER': {
            tipo: 'Seccionador de Torre/Bomba',
            descripcion: 'Seccionador de alimentación para torre de bombas.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SWEST': {
            tipo: 'Seccionador West Caisson',
            descripcion: 'Seccionador de alimentación del caisson lado oeste.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SEAST': {
            tipo: 'Seccionador East Caisson',
            descripcion: 'Seccionador de alimentación del caisson lado este.',
            voltaje: '13.8kV',
            corriente: '200A',
            capacidad: 'N/A',
            fabricante: 'ABB',
            categoria: 'Auxiliar'
        },
        'SCOMP': {
            tipo: 'Seccionador de Compresor',
            descripcion: 'Seccionador de alimentación del compresor de aire.',
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
    'CERRADO':     { color: '#00FF00', label: 'Cerrado', icono: '🟢' },
    'ABIERTO':     { color: '#FF0000', label: 'Abierto', icono: '🔴' },
    'DESACOPLADO': { color: '#808080', label: 'Desacoplado', icono: '⚪' },
    'BLOQUEADO':   { color: '#ff4455', label: 'Bloqueado', icono: '⚠️' },
    'ATERRIZADO':  { color: '#8b4513', label: 'Aterrizado', icono: '⚡' }
};

// ---------------------------------------------------------------------------
// MAPEO DE CATEGORÍA → CARPETA DE IMÁGENES (Gatún)
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

    // Gatún: detectar tipo por prefijo del ID
    if (id.indexOf('SEL-') === 0) return 'Selector Non-Loadbreak';
    if (id.indexOf('STR') === 0) return 'Seccionador TR';
    if (id.indexOf('SGW') === 0 || id.indexOf('SGE') === 0 || id.indexOf('SHE') === 0) return 'Seccionador Primario';
    if (id.indexOf('S23-') === 0 || id.indexOf('SCAISSON') === 0 || id.indexOf('STOWER') === 0 || id.indexOf('SWEST') === 0 || id.indexOf('SEAST') === 0 || id.indexOf('SCOMP') === 0) return 'Seccionador';
    if (id.indexOf('ITR') === 0) return 'Interruptor TR';
    if (id.indexOf('IRT-') === 0) return 'Interruptor Radial BT';
    if (id.indexOf('ITT-') === 0) return 'Interruptor Enlace BT';
    if (id.indexOf('IHE-') === 0 || id.indexOf('IGE-') === 0 || id.indexOf('IGW-') === 0) return 'Interruptor Primario';
    if (id.indexOf('IBUSTIE') === 0) return 'Interruptor Bustie';
    if (id.indexOf('IFUS-') === 0) return 'Fusible';
    if (id.indexOf('IT-') === 0) return 'Interruptor Transfer';
    if (id.indexOf('I') === 0) return 'Interruptor';

    return 'Componente';
}

// ---------------------------------------------------------------------------
// OBTENER VECINOS DESDE cerebro.js
// ---------------------------------------------------------------------------
function _getVecinos(id) {
    // Gatún usa mapaVecinosGatun
    if (window.mapaVecinosGatun && window.mapaVecinosGatun[id]) {
        return window.mapaVecinosGatun[id];
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
// Gatún usa maniobraSeccionador y maniobraSelector + addEventListener
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

    // Guardar las funciones originales de Gatún
    var _origManiobraSeccionador = window.maniobraSeccionador;
    var _origManiobraSelector    = window.maniobraSelector;

    // Sobrescribir handler de seccionadores
    window.maniobraSeccionador = function(el) {
        if (window._modoInspeccion) {
            window.abrirPanelInspeccion(el);
            return;
        }
        if (_origManiobraSeccionador) _origManiobraSeccionador(el);
    };

    // Sobrescribir handler de selectores
    window.maniobraSelector = function(el) {
        if (window._modoInspeccion) {
            window.abrirPanelInspeccion(el);
            return;
        }
        if (_origManiobraSelector) _origManiobraSelector(el);
    };

    // Interceptar clics en el SVG container (para elementos con addEventListener)
    var svgContainer = document.getElementById('svg-container');
    if (svgContainer) {
        svgContainer.addEventListener('click', function(e) {
            if (!window._modoInspeccion) return;

            var target = e.target;
            // Buscar el elemento interactivo más cercano (con data-estado o id conocido)
            while (target && target !== svgContainer) {
                if (target.hasAttribute('data-estado') ||
                    target.style.cursor === 'pointer' ||
                    (target.getAttribute('onclick') && target.getAttribute('onclick').indexOf('maniobra') !== -1)) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.abrirPanelInspeccion(target);
                    return;
                }
                target = target.parentElement;
            }
        }, true); // Usar capture para interceptar antes que otros handlers
    }

    // Tecla Escape para cerrar panel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.cerrarPanelInspeccion();
    });

    // Tecla I para toggle rápido del modo inspección
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            window.toggleModoInspeccion();
        }
    });
});
