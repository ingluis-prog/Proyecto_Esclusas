// =============================================================================
// visor.js  —  Panel lateral de imágenes de equipos
// Esclusa de Miraflores – Canal de Panamá
//
// Uso:
//   - Clic derecho sobre cualquier elemento del SVG → abre su imagen en el panel
//   - Las imágenes deben estar en la carpeta /img/ con el nombre del ID del equipo
//   - Formatos soportados: .jpg, .jpeg, .png, .webp (se prueban en ese orden)
//   - Si no existe imagen aún, muestra un mensaje amigable
// =============================================================================

(function () {

    // ── Extensiones a probar en orden ──
    var EXTENSIONES = ['jpg', 'jpeg', 'png', 'webp'];

    // ── Crear el panel lateral en el DOM ──
    function crearPanel() {
        var panel = document.createElement('div');
        panel.id = 'visor-panel';
        panel.innerHTML = `
            <div id="visor-header">
                <span id="visor-titulo">Visor de Equipos</span>
                <button id="visor-cerrar" title="Cerrar">✕</button>
            </div>
            <div id="visor-body">
                <div id="visor-placeholder">
                    <span>🖱️ Clic derecho sobre<br>un equipo para ver<br>su imagen</span>
                </div>
                <div id="visor-contenido" style="display:none">
                    <div id="visor-id-label"></div>
                    <img id="visor-img" src="" alt="" />
                    <div id="visor-sin-imagen" style="display:none">
                        <span>📷 Sin imagen disponible</span>
                        <small id="visor-ruta-esperada"></small>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Estilos del panel
        var style = document.createElement('style');
        style.textContent = `
            #visor-panel {
                position: fixed;
                top: 52px;
                right: 0;
                width: 300px;
                height: calc(100vh - 52px);
                background: #1e2a3a;
                border-left: 2px solid #0f3460;
                display: flex;
                flex-direction: column;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.25s ease;
                box-shadow: -4px 0 16px rgba(0,0,0,0.4);
            }
            #visor-panel.abierto {
                transform: translateX(0);
            }
            #visor-header {
                background: #16213e;
                padding: 10px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #0f3460;
                flex-shrink: 0;
            }
            #visor-titulo {
                color: #e2e8f0;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            #visor-cerrar {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 16px;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px;
                transition: background 0.15s;
            }
            #visor-cerrar:hover {
                background: #0f3460;
                color: #e2e8f0;
            }
            #visor-body {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px;
            }
            #visor-placeholder {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #475569;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 14px;
                line-height: 1.8;
            }
            #visor-contenido {
                width: 100%;
            }
            #visor-id-label {
                background: #0f3460;
                color: #FFC200;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                font-weight: bold;
                padding: 6px 10px;
                border-radius: 5px;
                margin-bottom: 12px;
                text-align: center;
                word-break: break-all;
            }
            #visor-img {
                width: 100%;
                border-radius: 6px;
                border: 1px solid #0f3460;
                display: block;
            }
            #visor-sin-imagen {
                text-align: center;
                color: #64748b;
                font-family: 'Segoe UI', Arial, sans-serif;
                padding: 24px 0;
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
            }
            #visor-sin-imagen span {
                font-size: 15px;
            }
            #visor-ruta-esperada {
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #475569;
                background: #0f1923;
                padding: 4px 8px;
                border-radius: 4px;
                word-break: break-all;
            }

            /* Ajustar el SVG cuando el panel esté abierto */
            body.visor-abierto #svg-container {
                margin-right: 300px;
                transition: margin-right 0.25s ease;
            }
        `;
        document.head.appendChild(style);

        // Evento cerrar
        document.getElementById('visor-cerrar').addEventListener('click', cerrarPanel);

        return panel;
    }

    // ── Abrir panel con la imagen del equipo ──
    function abrirEquipo(id) {
        var panel = document.getElementById('visor-panel');
        var placeholder = document.getElementById('visor-placeholder');
        var contenido = document.getElementById('visor-contenido');
        var idLabel = document.getElementById('visor-id-label');
        var img = document.getElementById('visor-img');
        var sinImagen = document.getElementById('visor-sin-imagen');
        var rutaEsperada = document.getElementById('visor-ruta-esperada');

        // Mostrar panel
        panel.classList.add('abierto');
        document.body.classList.add('visor-abierto');

        // Actualizar etiqueta ID
        idLabel.textContent = id;
        placeholder.style.display = 'none';
        contenido.style.display = 'block';
        img.style.display = 'none';
        sinImagen.style.display = 'none';

        // Intentar cargar la imagen probando extensiones
        buscarImagen(id, 0, img, sinImagen, rutaEsperada);
    }

    // ── Buscar imagen probando extensiones en orden ──
    function buscarImagen(id, idx, img, sinImagen, rutaEsperada) {
        if (idx >= EXTENSIONES.length) {
            // No se encontró en ninguna extensión
            img.style.display = 'none';
            sinImagen.style.display = 'flex';
            rutaEsperada.textContent = 'img/' + id + '.jpg  (o .jpeg, .png, .webp)';
            return;
        }

        var ext = EXTENSIONES[idx];
        var ruta = 'img/' + id + '.' + ext;

        var testImg = new Image();
        testImg.onload = function () {
            img.src = ruta;
            img.alt = id;
            img.style.display = 'block';
            sinImagen.style.display = 'none';
        };
        testImg.onerror = function () {
            buscarImagen(id, idx + 1, img, sinImagen, rutaEsperada);
        };
        testImg.src = ruta;
    }

    // ── Cerrar panel ──
    function cerrarPanel() {
        var panel = document.getElementById('visor-panel');
        panel.classList.remove('abierto');
        document.body.classList.remove('visor-abierto');
    }

    // ── Interceptar clic derecho en el SVG ──
    function iniciarVisor() {
        var svgContainer = document.getElementById('svg-container');
        if (!svgContainer) return;

        svgContainer.addEventListener('contextmenu', function (e) {
            // Buscar el elemento SVG clicado con un ID de equipo
            var el = e.target;
            var id = null;

            // Subir hasta 5 niveles buscando un ID que corresponda a un equipo
            for (var i = 0; i < 5; i++) {
                if (!el || el === svgContainer) break;
                var elId = el.id || '';
                // Excluir IDs genéricos del SVG
                if (elId && !elId.startsWith('svg') && !elId.startsWith('g') &&
                    !elId.startsWith('path') && !elId.startsWith('use') &&
                    !elId.startsWith('tspan') && !elId.startsWith('text') &&
                    !elId.startsWith('defs') && !elId.startsWith('stop') &&
                    !elId.startsWith('glyph') && !elId.startsWith('namedview') &&
                    !elId.startsWith('rect3') && elId !== 'title4') {
                    id = elId;
                    break;
                }
                el = el.parentElement;
            }

            if (id) {
                e.preventDefault(); // Evitar menú contextual del navegador
                abrirEquipo(id);
            }
        });
    }

    // ── Inicializar cuando el DOM esté listo ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            crearPanel();
            iniciarVisor();
        });
    } else {
        crearPanel();
        iniciarVisor();
    }

})();
