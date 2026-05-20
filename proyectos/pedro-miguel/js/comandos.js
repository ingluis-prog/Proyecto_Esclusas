// =============================================================================
// comandos.js — Comandos de operación: Esclusa de Pedro Miguel
// =============================================================================

window.normalizarPlanta = function() {
// =============================================================================
// 1. LISTA DE EXCEPCIONES: EQUIPOS QUE DEBEN ESTAR ***ABIERTOS***
// =============================================================================
// Todo lo que esté aquí se quedará ABIERTO (Naranja).
// Todo lo demás se CERRARÁ (Verde) automáticamente.
var equiposAbiertos = [
    'SW6-E10-TIE2', // Solicitado anteriormente
    'SW11A', 
    'SEW4', 
    'IE11', 
    'SDE1', 'SDE2', 'SDE3', 'SDE4', 
    'SE2C1', 
    'SE12B', 
    'SW10-E9-TIE2', 
    'SW5C2', 
    'SEW3A', 
    'SE12D', 
    'SE9-W10-TIE2', 
    'SE10-W6-TIE2', 
    'SW11C'
];

// =============================================================================
// 2. LISTA MAESTRA DE TODOS LOS EQUIPOS (INCLUYENDO NUEVOS)
// =============================================================================
var todosLosEquipos = [
    // --- Fuentes y Cabeceras ---
    'IM7', 'IM17', 'IM18', 'IM8', 'IM15', 'IM19',
    'I6AP1E', 'I6BP1E', 'I2BP1E', 'I6AP1W', 'I6BP1W', 'I2BP1W',
    'I1AP1E', 'I1AP1W', 'I2AP1E', 'I2AP1W',
    'I4BP1E', 'I4BP1W', 'I1BP1E', 'I1BP1W', 'I7BP1E', 'I7AP1E', 'IE11',

    // --- Trafos (Seccionadores e Interruptores) ---
    'SE2557', 'ITR557N', 'SE5557', 'ITR557S',
    'SE2561', 'ITR561N', 'SE5561', 'ITR561S',
    'SE2565', 'ITR565N', 'SE5565', 'ITR565S',
    'SW2568', 'ITR568N', 'SW5568', 'ITR568S',
    'SW2564', 'ITR564N', 'SW5564', 'ITR564S',
    'SW2560', 'ITR560N', 'SW5560', 'ITR560S',
    'SW10559', 'ITR559N', 'SW6559', 'ITR559S',
    'SE9558', 'ITR558N', 'SE10558', 'ITR558S',
    'SW10563', 'ITR563N', 'SW6563', 'ITR563S',
    'SE9562', 'ITR562N', 'SE10562', 'ITR562S',
    'SW10567', 'ITR567N', 'SW6567', 'ITR567S',
    'SE9566', 'ITR566N', 'SE10566', 'ITR566S',
    'ITR761N', 'ITR761S', 'ITR765N', 'ITR765S',
    'ITR762N', 'ITR762S', 'ITR763N', 'ITR763S',
    'ITR766N', 'ITR766S', 'ITR767N', 'ITR767S',
    'ITR768N', 'ITR768S', 'ITR764N', 'ITR764S',

    // --- NUEVO: Extensiones de Barra (IBUSTIE) ---
    'IBUSTIE557', 'IBUSTIE561', 'IBUSTIE765', 'IBUSTIE565', 'IBUSTIE558', 
    'IBUSTIE766', 'IBUSTIE566', 'IBUSTIE559', 'IBUSTIE767', 'IBUSTIE567', 
    'IBUSTIE560', 'IBUSTIE564', 'IBUSTIE768', 'IBUSTIE568',

    // --- NUEVO: Interruptores de Rieles (RT) ---
    'INTRIELES-RT-TR557', 'INTRIELES-RT-TR559', 'INTRIELES-RT-TR560', 
    'INTRIELES-RT-TR568', 'INTRIELES-RT-TR567', 'INTRIELES-RT-TR565',

    // --- NUEVO: Interruptores de Transferencia (TT) ---
    'INTRIELES-TT-TR557', 'INTRIELES-TT-TR561',
    'INTRIELES-TTS-TR561', 'INTRIELES-TTN-TR565',
    'INTRIELES-TTS-TR558', 'INTRIELES-TTN-TR562',
    'INTRIELES-TTS-TR562', 'INTRIELES-TTN-TR566',
    'INTRIELES-TTS-TR559', 'INTRIELES-TTN-TR553','INTRIELES-TTN-TR563',
    'INTRIELES-TTS-TR563', 'INTRIELES-TTN-TR567',
    'INTRIELES-TTS-TR560', 'INTRIELES-TTN-TR564',
    'INTRIELES-TTS-TR564', 'INTRIELES-TTS-TR568',

    // --- NUEVO: Segmentados e Intermedios ---
    'INTRIELES-TTN-TR558', 'INTRIELES-TTN-TR559', 
    'ITIE-TT-558-559', // Tie intermedio
    'INTRIELES-TTS-TR566', 'INTRIELES-TTS-TR567', 
    'ITIE-TT-566-567', // Tie intermedio

    // --- Anillos y Derivaciones ---
    'I3BP1E', 'I5BP1W', 'SE5', 'SE5A1', 'SE5A2', 'SE5B1', 'SE5B2', 'SE5C1', 'SE5C2', 'SE5-W5-TIE1', 'SE5-W5-TIE2',
    'SW51', 'SW5A2', 'SW5A1', 'SW5B2', 'SW5B1', 'SW5C2', 'SW5C1',
    'I5BP1E', 'I3BP1W', 'SE2', 'SE2A', 'SE2A2', 'SE2B1', 'SE2B2', 'SE2C1', 'SE2C2', 'SW2-E2-TIE1', 'SW2-E2-TIE2',
    'SW2C1', 'SW2C2', 'SW2B1', 'SW2B2', 'SW2A1', 'SW2A2', 'SW21',
    'I3AP1E', 'I5AP1W', 'SE9-1', 'SE9-W10-TIE1', 'SE9-W10-TIE2', 'SW10', 'SW10-2', 'SW10A', 'SW10A2', 'SW10-E9-TIE1', 'SW10-E9-TIE2', 'SE9A1', 'SE9A2', 'SE9-2', 'SE92',
    'I5AP1E', 'I3AP1W', 'SE10', 'SE10-W6-TIE1', 'SE10-W6-TIE2', 'SW6-1', 'SW6-2', 'SW6A-1', 'SW6A-2', 'SW6-E10-TIE1', 'SW6-E10-TIE2', 'SE10A-1', 'SE10A-2', 'SE10-1',
    'SEW4', 'SEW3', 'SFIREA', 'SEW3A', 'SEW4A', 'SFIREB',
    'SE12A', 'SW11A', 'SE12-PUMP-A', 'SE12B', 'SW11B', 'SE12-PUMP-B', 'SE12C', 'SW11C', 'SE12-PUMP-C', 'SE12D', 'SW11D', 'SE12-PUMP-D',
    'SE7', 'SNACOMPRESSOR', 'SW7', 'SSACOMPRESSOR',
    
    // --- Otros (Ties y Tierras) ---
    'SDE1', 'SDE2', 'SDE3', 'SDE4',
    'SW6-E10-TIE1', 'SW6-E10-TIE2', 'SE10-W6-TIE1'
];

// =============================================================================
// 3. APLICAR LOGICA
// =============================================================================
todosLosEquipos.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        // ¿Está este equipo en la lista de ABIERTOS?
        var debeEstarAbierto = equiposAbiertos.includes(id);
        
        // Si está en la lista -> ABIERTO (Naranja)
        // Si NO está en la lista -> CERRADO (Verde)
        var nuevoEstado = debeEstarAbierto ? 'ABIERTO' : 'CERRADO';
        var nuevoColor = debeEstarAbierto ? '#ffa500ff' : '#b2ec5dff';

        el.setAttribute('data-estado', nuevoEstado);
        
        var rect = document.getElementById("rect_" + id) || (el.children && el.children[0]) || el;
        if(rect && rect.style) { 
            rect.style.fill = nuevoColor; 
            rect.setAttribute('fill', nuevoColor); 
        }
    }
});

// 4. Recalcular Flujos
if (window.actualizarTodaLaRed) {
    window.actualizarTodaLaRed();
} else {
    alert("Elementos colocados en su posición normal");
}};

window.resetearPlanta = function() {
// =============================================================================
// MANIOBRA DE APERTURA TOTAL (BLACKOUT)
// =============================================================================

// 1. Confirmación de seguridad
if (confirm("¡ADVERTENCIA! \n\n¿Está seguro de que desea ABRIR TODOS los interruptores y seccionadores?\n\nEsto desenergizará la planta.")) {
    
    // 2. LISTA MAESTRA DE TODOS LOS EQUIPOS (Interruptores + Seccionadores)
    var todosLosEquipos = [
        // --- Principales y Enlace ---
        'IM7', 'IM17', 'IM18', 'IM8', 'IM15', 'IM19',
        'IBUSTIE', // Enlace de barras principal

        // --- Cabeceras de Barra ---
        'I6AP1E', 'I6BP1E', 'I2BP1E', 'I6AP1W', 'I6BP1W', 'I2BP1W',
        'I1AP1E', 'I1AP1W', 'I2AP1E', 'I2AP1W',
        'I4BP1E', 'I4BP1W', 'I1BP1E', 'I1BP1W', 'I7BP1E', 'I7AP1E', 'IE11',

        // --- Trafos: Seccionadores e Interruptores (Grupos 5xx) ---
        'SE2557', 'ITR557N', 'SE5557', 'ITR557S',
        'SE2561', 'ITR561N', 'SE5561', 'ITR561S',
        'SE2565', 'ITR565N', 'SE5565', 'ITR565S',
        'SW2568', 'ITR568N', 'SW5568', 'ITR568S',
        'SW2564', 'ITR564N', 'SW5564', 'ITR564S',
        'SW2560', 'ITR560N', 'SW5560', 'ITR560S',
        'SW10559', 'ITR559N', 'SW6559', 'ITR559S',
        'SE9558', 'ITR558N', 'SE10558', 'ITR558S',
        'SW10563', 'ITR563N', 'SW6563', 'ITR563S',
        'SE9562', 'ITR562N', 'SE10562', 'ITR562S',
        'SW10567', 'ITR567N', 'SW6567', 'ITR567S',
        'SE9566', 'ITR566N', 'SE10566', 'ITR566S',

        // --- Trafos: Solo Interruptores (Grupos 7xx - Conexión Directa) ---
        'ITR761N', 'ITR761S',
        'ITR765N', 'ITR765S',
        'ITR762N', 'ITR762S',
        'ITR763N', 'ITR763S',
        'ITR766N', 'ITR766S',
        'ITR767N', 'ITR767S',
        'ITR768N', 'ITR768S',
        'ITR764N', 'ITR764S',

        // --- NUEVO: Extensiones de Barra (IBUSTIE) ---
        'IBUSTIE557', 'IBUSTIE561', 'IBUSTIE765', 'IBUSTIE565', 'IBUSTIE558', 
        'IBUSTIE766', 'IBUSTIE566', 'IBUSTIE559', 'IBUSTIE767', 'IBUSTIE567', 
        'IBUSTIE560', 'IBUSTIE564', 'IBUSTIE768', 'IBUSTIE568',

        // --- NUEVO: Interruptores de Rieles (RT) ---
        'INTRIELES-RT-TR557', 'INTRIELES-RT-TR559', 'INTRIELES-RT-TR560', 
        'INTRIELES-RT-TR568', 'INTRIELES-RT-TR567', 'INTRIELES-RT-TR565',

        // --- NUEVO: Interruptores de Transferencia (TT) ---
        'INTRIELES-TT-TR557', 'INTRIELES-TT-TR561',
        'INTRIELES-TTS-TR561', 'INTRIELES-TTN-TR565',
        'INTRIELES-TTS-TR558', 'INTRIELES-TTN-TR562',
        'INTRIELES-TTS-TR562', 'INTRIELES-TTN-TR566',
        'INTRIELES-TTS-TR559', 'INTRIELES-TTN-TR553',
        'INTRIELES-TTS-TR563', 'INTRIELES-TTN-TR567',
        'INTRIELES-TTS-TR560', 'INTRIELES-TTN-TR564','INTRIELES-TTN-TR563',
        'INTRIELES-TTS-TR564', 'INTRIELES-TTS-TR568',

        // --- NUEVO: Segmentados e Intermedios (Tie-Breakers) ---
        'INTRIELES-TTN-TR558', 'INTRIELES-TTN-TR559', 
        'ITIE-TT-558-559', 
        'INTRIELES-TTS-TR566', 'INTRIELES-TTS-TR567', 
        'ITIE-TT-566-567',

        // --- Anillos, Derivaciones y Cargas (Seccionadores de Maniobra) ---
        'I3BP1E', 'I5BP1W', 'SE5', 'SE5A1', 'SE5A2', 'SE5B1', 'SE5B2', 'SE5C1', 'SE5C2', 'SE5-W5-TIE1', 'SE5-W5-TIE2',
        'SW51', 'SW5A2', 'SW5A1', 'SW5B2', 'SW5B1', 'SW5C2', 'SW5C1',
        'I5BP1E', 'I3BP1W', 'SE2', 'SE2A', 'SE2A2', 'SE2B1', 'SE2B2', 'SE2C1', 'SE2C2', 'SW2-E2-TIE1', 'SW2-E2-TIE2',
        'SW2C1', 'SW2C2', 'SW2B1', 'SW2B2', 'SW2A1', 'SW2A2', 'SW21',
        'I3AP1E', 'I5AP1W', 'SE9-1', 'SE9-W10-TIE1', 'SE9-W10-TIE2', 'SW10', 'SW10-2', 'SW10A', 'SW10A2', 'SW10-E9-TIE1', 'SW10-E9-TIE2', 'SE9A1', 'SE9A2', 'SE9-2', 'SE92',
        'I5AP1E', 'I3AP1W', 'SE10', 'SE10-W6-TIE1', 'SE10-W6-TIE2', 'SW6-1', 'SW6-2', 'SW6A-1', 'SW6A-2', 'SW6-E10-TIE1', 'SW6-E10-TIE2', 'SE10A-1', 'SE10A-2', 'SE10-1',
        'SEW4', 'SEW3', 'SFIREA', 'SEW3A', 'SEW4A', 'SFIREB',
        'SE12A', 'SW11A', 'SE12-PUMP-A', 'SE12B', 'SW11B', 'SE12-PUMP-B', 'SE12C', 'SW11C', 'SE12-PUMP-C', 'SE12D', 'SW11D', 'SE12-PUMP-D',
        'SE7', 'SNACOMPRESSOR', 'SW7', 'SSACOMPRESSOR',
        
        // --- Ties específicos ---
        'SW6-E10-TIE1', 'SW6-E10-TIE2', 'SE10-W6-TIE1', 'SW10-E9-TIE1', 'SW10-E9-TIE2',
        
        // --- Seccionadores de Tierra (Para asegurar que también se abran y no causen corto al re-energizar) ---
        'SDE1', 'SDE2', 'SDE3', 'SDE4'
    ];

    // 3. Proceso de Apertura Masiva
    todosLosEquipos.forEach(function(id) {
        var el = document.getElementById(id);
        
        if (el) {
            // A. Lógica: Establecer estado ABIERTO
            el.setAttribute('data-estado', 'ABIERTO');
            
            // B. Visual: Buscar el rectángulo y pintarlo de Naranja
            var rect = document.getElementById("rect_" + id) || (el.children && el.children[0]) || el;
            if (rect && rect.style) {
                rect.style.fill = '#ffa500ff';
                rect.setAttribute('fill', '#ffa500ff');
                rect.style.strokeWidth = '0'; // Quitar borde si lo tuviera
            }
        }
    });

    // 4. Limpieza Visual de Líneas (Opcional, el update final lo hará, pero esto da feedback inmediato)
    // Apagamos visualmente las barras principales inmediatamente
    ['TRAMOBUSP1E', 'TRAMOBUSP1W', 'TRAMOBUSTIE'].forEach(function(id) {
        var b = document.getElementById(id);
        if (b) {
            b.style.stroke = '#000000';
            b.style.strokeWidth = '2';
        }
    });

    // 5. Actualizar el Cerebro Lógico
    // Esto es crucial: le dice al sistema "Todo cambió, recalcula los colores de las líneas"
    if (window.actualizarTodaLaRed) {
        window.actualizarTodaLaRed();
    }

    alert("Apertura total completada.\nTodos los equipos están en posición ABIERTO.");
}};
