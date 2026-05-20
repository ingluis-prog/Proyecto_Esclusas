// =============================================================================
// comandos.js  —  Comandos de operación masiva
// Esclusa de Miraflores – Canal de Panamá
//
// Funciones globales para operar múltiples equipos a la vez:
//   window.normalizarPlanta()  — Lleva la planta al estado operativo definido
//   window.resetearPlanta()    — Abre todos los equipos (estado cero / reset total)
// =============================================================================

// =============================================================================
// CATÁLOGO MAESTRO DE EQUIPOS
// Fuente única de verdad. Agregar aquí nuevos equipos al escalar el proyecto.
// =============================================================================
window.EQUIPOS_MAESTROS = [
    // Alimentadores radiales
    'IRT571','IRT585','IRT586','IRT574','IRT573',
    // Interruptores de enlace
    'ITIETT','ITIETT-2',
    'ITT572N','ITT573N','ITT584S','ITT585S',
    'ITT575S','ITT579N','ITT579S','ITT583S','ITT584N','ITT580S',
    'ITT580N','ITT576S','ITT576N','ITT572S','ITT573S','ITT577N',
    'ITT577S','ITT581N','ITT581S','ITT585N','ITT586N','ITT582S',
    'ITT582N','ITT578S','ITT578N','ITT574S','ITT571S','ITT575N',
    // TR 500
    'STR571N','STR571S','ITR571N','ITR571S','ITIETR571',
    'STR572N','STR572S','ITR572N','ITR572S','ITIETR572',
    'STR573N','STR573S','ITR573N','ITR573S','ITIETR573',
    'STR574N','STR574S','ITR574N','ITR574S','ITIETR574',
    'STR575N','STR575S','ITR575N','ITR575S','ITIETR575',
    'STR576N','STR576S','ITR576N','ITR576S','ITIETR576',
    'STR577N','STR577S','ITR577N','ITR577S','ITIETR577',
    'STR578N','STR578S','ITR578N','ITR578S','ITIETR578',
    'STR579N','STR579S','ITR579N','ITR579S','ITIETR579',
    'STR580N','STR580S','ITR580N','ITR580S','ITIETR580',
    'STR581N','STR581S','ITR581N','ITR581S','ITIETR581',
    'STR582N','STR582S','ITR582N','ITR582S','ITIETR582',
    'STR583N','STR583S','ITR583N','ITR583S','ITIETR583',
    'STR584N','STR584S','ITR584N','ITR584S','ITIETR584',
    'STR585N','STR585S','ITR585N','ITR585S','ITIETR585',
    'STR586N','STR586S','ITR586N','ITR586S','ITIETR586',
    // Secundarios 700
    'ITR771N','ITR771S','ITIETR771','ITR772N','ITR772S','ITIETR772',
    'ITR773N','ITR773S','ITIETR773','ITR774N','ITR774S','ITIETR774',
    'ITR775N','ITR775S','ITIETR775','ITR776N','ITR776S','ITIETR776',
    'ITR777N','ITR777S','ITIETR777','ITR778N','ITR778S','ITIETR778',
    'ITR779N','ITR779S','ITIETR779','ITR780N','ITR780S','ITIETR780',
    'ITR781N','ITR781S','ITIETR781','ITR782N','ITR782S','ITIETR782',
    // Primarios
    'INTM20','INTM13','INTM12','INTM11','INTM6','INTM5','INTM4',
    'INT2B785N','INT2A785N','INT1A785N','INT3B786S','INT3A786S','INT2A786S',
    'INT3A785N','INT4A785N','INT5A785N','INT6A785N','INT3B785N','INT4B785N','INT5B785N','INT6B785N','INT1B785N',
    'INT1A786S','INT4A786S','INT5A786S','INT6A786S','INT7A786S','INT1B786S','INT2B786S','INT4B786S','INT5B786S','INT6B786S','INT7B786S',
    // Auxiliares y caissons
    'SFIREPUMP-8','SFIREPUMP-3','SCAISSON-A','SCAISSON-B','SCAISSON-C','SPMPSTB','SPMP','SPMPSTAEAST','SPMPW',
    'SS12A-1','SS12A-2','SS12A-3','SS12A-4','SSN11-1','SSN11-2','SSN11-3','SSN11-4','SSN9','SFIREPUMP',
    'SS11','SM20A','SM20B','SBLDG','STESTCABIA','STESTCABIB','SAIRCOMPRESSORPHASE1','SAIRCOMPRESSORPHASE2',
    'SN10','STIEPHASE1','STIEPHASE2','SS11A','SN9FIREPUMP','SFIREPUMPEAST',
    'S-IN-N11','S-N11A','S-OUT-N11B','S-N11B','S-N11C','S-N6','S-N7','S-IN-N5','S-N9','S-OUT-N5','SN9-2','SN5',
    'SN5A-1','SN5A-2','SN5B-1','SN5B-2','SN5C-1','SN5C-2','SS5C-1','SS5C-2','SS5B-1','SS5B-2','SS5A-1','SS5A-2',
    'SS10A','SS5','SDE5','SDE6','SDE7','SDE8','SPMPA','SPMPSTA','SPMPB',
    'SN6-1','SN6-2','SN6-S7B-TIE-1','SN6-S7B-TIE-2','SS7B-1','SS7B-2','SS7A-1','SS7A-2','SS7-1','SS7-2',
    'SN6A-1','SN6A-2','SN6B-1','SN6B-2','SS7-N6B-TIE-2','SS7-N6B-TIE-1',
    'SN7-1','SN7-2','SN7-S6B-TIE-2','SN7-S6B-TIE-1','SS6B-1','SS6B-2','SS6A-1','SS6A-2','SS6-1','SS6-2',
    'SN7A-1','SN7A-2','SN7B-1','SN7B-2','SS6-N7B-TIE-1','SS6-N7B-TIE-2',
    'SN8','SN8A-1','SN8A-2','SN8B-1','SN8B-2','SN8C-1','SN8C-2','SS10','SDE2','SDE1','SDE3','SDE4',
    'SS8','SS8A-2','SS8A-1','SS8B-2','SS8B-1','SS8C-2','SS8C-1','SN9','SS8B-2-2'
];

// Equipos que en operación normal deben quedar ABIERTOS (resto = CERRADO)
window.EQUIPOS_NORMALMENTE_ABIERTOS = [
    'SPMPB','STESTCABIA','STESTCABIB','SS11','SSN11-1',
    'SDE4','SDE3','SDE1','SDE2','SS10',
    'STIEPHASE2','STIEPHASE1','SN9',
    'SN7-S6B-TIE-2','SN6-S7B-TIE-2','SN6-S7B-TIE-1','SN7-S6B-TIE-1',
    'SSN11-2','SS6-N7B-TIE-1','SS7-N6B-TIE-1','SS7-N6B-TIE-2','SS6-N7B-TIE-2',
    'SCAISSON-C','SCAISSON-B','SCAISSON-A',
    'SN9-2','SS10A','SSN11-3',
    'SDE8','SDE7','SDE6','SDE5'
];

// ---------------------------------------------------------------------------
// Utilidad interna: determinar el color apropiado según tipo de equipo y estado
// ---------------------------------------------------------------------------
function _colorEquipo(id, estado) {
    if (estado === 'ABIERTO') {
        return (id.startsWith('INT') && !id.startsWith('ITR')) ? '#dd0000ff' : '#ffa500ff';
    }
    // CERRADO
    if (id.startsWith('INT') || id.startsWith('ITR') || id.startsWith('ITI') ||
        id.startsWith('ITT') || id.startsWith('IRT')) {
        return '#13c004ff'; // Interruptores — verde intenso
    }
    return '#b2ec5dff'; // Seccionadores — verde claro
}

// ---------------------------------------------------------------------------
// Aplicar estado a un equipo (modifica el DOM)
// ---------------------------------------------------------------------------
function _aplicarEstado(id, nuevoEstado) {
    var el   = document.getElementById(id);
    var rect = document.getElementById('rect_' + id);
    var target = el || rect;
    if (!target) return;

    target.setAttribute('data-estado', nuevoEstado);
    var color = _colorEquipo(id, nuevoEstado);
    if (target.style) { target.style.fill = color; target.setAttribute('fill', color); }
}

// =============================================================================
// COMANDO: NORMALIZAR PLANTA
// Lleva todos los equipos al estado operativo definido en EQUIPOS_NORMALMENTE_ABIERTOS.
// =============================================================================
window.normalizarPlanta = function () {
    var contCerrados = 0, contAbiertos = 0;

    window.EQUIPOS_MAESTROS.forEach(function (id) {
        var debeEstarAbierto = window.EQUIPOS_NORMALMENTE_ABIERTOS.indexOf(id) !== -1;
        var nuevoEstado = debeEstarAbierto ? 'ABIERTO' : 'CERRADO';
        _aplicarEstado(id, nuevoEstado);
        if (nuevoEstado === 'ABIERTO') contAbiertos++;
        else contCerrados++;
    });

    if (window.actualizarTodaLaRed) window.actualizarTodaLaRed();
    alert('✅ PLANTA NORMALIZADA\n\nAbiertos: ' + contAbiertos + '\nCerrados: ' + contCerrados);
};

// =============================================================================
// COMANDO: RESETEAR PLANTA
// Abre absolutamente todos los equipos (estado inicial / cero energía).
// =============================================================================
window.resetearPlanta = function () {
    window.EQUIPOS_MAESTROS.forEach(function (id) {
        _aplicarEstado(id, 'ABIERTO');
    });

    if (window.actualizarTodaLaRed) window.actualizarTodaLaRed();
    alert('🔄 PLANTA RESETEADA\nTodos los equipos están ABIERTOS.');
};
