// =============================================================================
// cerebro.js — Motor de simulación eléctrica: Esclusa de Gatún
// Se ejecuta automáticamente al cargar para inicializar handlers
// =============================================================================

// =============================================================================
// CEREBRO GATÚN - SIMULADOR ELÉCTRICO (ESCUDO ANTI DOBLE-CLIC AÑADIDO)
// =============================================================================

const ESTADOS = {
    DESACOPLADO: { color: '#808080', label: 'ESTADO ACTUAL: ⚪ DESACOPLADO' },
    ABIERTO:     { color: '#FF0000', label: 'ESTADO ACTUAL: 🔴 ABIERTO' },
    CERRADO:     { color: '#00FF00', label: 'ESTADO ACTUAL: 🟢 CERRADO' }
};

// --- CONFIGURACIÓN DE SELECTORES NON-LOADBREAK ---
window.configSelectores = {
    'SEL-TR444UNIT-A': { NC: 'TRAMOHE-10', NO: 'TRAMOGW-12', carga: 'TRAMO-UNIT-A' },
    'SEL-TR444UNIT-B': { NC: 'TRAMOHE-10', NO: 'TRAMOGW-12', carga: 'TRAMO-UNIT-B' },
    'SEL-TR440UNIT-A': { NC: 'TRAMOGE-12', NO: 'TRAMOHE-10', carga: 'TRAMO-UNIT-A-TR440' },
    'SEL-TR440UNIT-B': { NC: 'TRAMOGE-12', NO: 'TRAMOHE-10', carga: 'TRAMO-UNIT-B-TR440' }
};

// --- ENLACES PASIVOS (SIN INTERRUPTOR) ---
window.enlacesPasivos = [
    ['TRANSFORMER-A-TR444', 'TRAMO-STATION-23'],
    ['TRANSFORMER-B-TR444', 'TRAMO-STATION-23'],
    ['TRANSFORMER-A-TR440', 'TRAMO-STATION-23-EAST'],
    ['TRANSFORMER-B-TR440', 'TRAMO-STATION-23-EAST']
];

var interruptoresGatun = [
    'IHE-4', 'IHE-7', 'IHE-3', 'IHE-8', 'IHE-2', 'ICAP-FUTURE-B', 'IGE-7', 'IGE-6', 'ISPAREC', 'ISPARED', 'ISPAREE', 'IGE-4', 'IGE-5', 'IGE-12',
    'ICAP-FUTURE-A', 'IGW-5', 'IGW-4', 'ISPAREB', 'ISPAREA', 'IGW-6', 'IGW-7', 'IGW-12', 'IBUSTIEA-B', 'IBUSTIEA-A', 'IBUSTIEB-A', 'IBUSTIEB-B',
    'IGE-8', 'IGW-8', 'ITRAMOHE-10', 
    'ITR441S', 'ITR441N', 'ITR442S', 'ITR442N', 'ITR443S', 'ITR443N', 'ITR444S', 'ITR444N', 'ITR445S', 'ITR445N',
    'ITR446S', 'ITR446N', 'ITR447S', 'ITR447N', 'ITR448S', 'ITR448N', 'ITR449S', 'ITR449N', 'ITR450S', 'ITR450N',
    'ITR451S', 'ITR451N', 'ITR452S', 'ITR452N', 'ITR453S', 'ITR453N', 'ITR454S', 'ITR454N', 'ITR455S', 'ITR455N',
    'ITR456S', 'ITR456N', 'ITR457S', 'ITR457N', 'ITR458S', 'ITR458N', 'ITR459S', 'ITR459N', 'ITR460S', 'ITR460N',
    'ITR741S', 'ITR741N', 'ITR742S', 'ITR742N', 'ITR743S', 'ITR743N', 'ITR744S', 'ITR744N', 'ITR745S', 'ITR745N',
    'ITR746S', 'ITR746N', 'ITR747S', 'ITR747N', 'ITR748S', 'ITR748N', 'ITR749S', 'ITR749N', 'ITR750S', 'ITR750N',
    'ITR751S', 'ITR751N', 'ITR752S', 'ITR752N', 'ITR753S', 'ITR753N', 'ITR754S', 'ITR754N', 'ITR755S', 'ITR755N', 'ITR756S', 'ITR756N',
    'IRT-SUR-TR460', 'ITT-SUR-TR460', 'IRT-NORTE-TR460', 'ITT-NORTE-TR460', 'IRT-SUR-TR456', 'ITT-SUR-TR456', 'IRT-NORTE-TR456', 'ITT-NORTE-TR456',
    'IRT-SUR-TR452', 'ITT-SUR-TR452', 'IRT-NORTE-TR452', 'ITT-NORTE-TR452', 'IRT-SUR-TR448', 'ITT-SUR-TR448', 'IRT-NORTE-TR448', 'ITT-NORTE-TR448',
    'IRT-SUR-TR444', 'ITT-SUR-TR444', 'IRT-NORTE-TR444', 'ITT-NORTE-TR444', 'IRT-SUR-TR457', 'ITT-SUR-TR457', 'IRT-NORTE-TR457', 'ITT-NORTE-TR457',
    'IRT-SUR-TR453', 'ITT-SUR-TR453', 'IRT-NORTE-TR453', 'ITT-NORTE-TR453', 'IRT-SUR-TR449', 'ITT-SUR-TR449', 'IRT-NORTE-TR449', 'ITT-NORTE-TR449',
    'IRT-SUR-TR445', 'ITT-SUR-TR445', 'IRT-NORTE-TR445', 'ITT-NORTE-TR445', 'IRT-SUR-TR441', 'ITT-SUR-TR441', 'IRT-NORTE-TR441', 'ITT-NORTE-TR441',
    'ITT-SUR-TR459', 'ITT-NORTE-TR459', 'ITT-SUR-TR455', 'ITT-NORTE-TR455', 'ITT-SUR-TR451', 'ITT-NORTE-TR451', 'ITT-SUR-TR447', 'ITT-NORTE-TR447', 
    'ITT-SUR-TR443', 'ITT-NORTE-TR443', 'IRT-SUR-TR458', 'ITT-SUR-TR458', 'IRT-NORTE-TR458', 'IRT-NORTE-TR458', 'IRT-SUR-TR454', 'ITT-SUR-TR454', 
    'IRT-NORTE-TR454', 'ITT-NORTE-TR454', 'IRT-SUR-TR450', 'ITT-SUR-TR450', 'IRT-NORTE-TR450', 'ITT-NORTE-TR450', 'IRT-SUR-TR446', 'ITT-SUR-TR446', 
    'IRT-NORTE-TR446', 'ITT-NORTE-TR446', 'IRT-SUR-TR442', 'ITT-SUR-TR442', 'IRT-NORTE-TR442', 'ITT-NORTE-TR442',
    'IT-TT-458', 'IT-TT-459', 'IT-RT-458', 'IT-SOUTH-TURNTABLE',
    'IT-TT-443', 'IT-TT-442', 'IT-RT-442', 'IT-NORTH-TURNTABLE',
    'IFUS-UNIT-A-TR444', 'IFUS-UNIT-B-TR444', 
    'IFUS-UNIT-A-TR440', 'IFUS-UNIT-B-TR440'
];

var seccionadoresGatun = [
    'SGW-6', 'SGE-6', 'SGE-7', 'SGE-5', 'SGE-4', 'SGW-5', 'SGW-4', 'SGW-7',
    'SGE-8-A', 'SGE-8-B', 'SGW-8-A', 'SGW-8-B', 'S-SCHEDULE-A', 'S-SCHEDULE-B', 
    'SGE-6A1', 'SGE-6A2', 'SGE-6B1', 'SGE-6B2', 'SGE-6C1', 'SGE-6C2', 'SGE-6D1', 'SGE-6D2', 'SGE-6E-GW-6E-2', 'SGE-6E-GW-6E', 
    'SGW-6D2', 'SGW-6D1', 'SGW-6C2', 'SGW-6C1', 'SGW-6B2', 'SGW-6B1', 'SGW-6A2', 'SGW-6A1',
    'SGW-7A1', 'SGW-7A2', 'SGW-7B1', 'SGW-7B2', 'SGW-7C1', 'SGW-7C2', 'SGW-7D1', 'SGW-7D2', 'SGE-7E-GW-7E', 'SGE-7E-GW-7E-1', 
    'SGE-7D2', 'SGE-7D1', 'SGE-7C2', 'SGE-7C1', 'SGE-7B2', 'SGE-7B1', 'SGE-7A2', 'SGE-7A1',
    'SGW-4A1', 'SGW-4A2', 'SGW-4B1', 'SGW-4B2', 'SGW-4C1', 'SGW-4C2', 'SGW-4D1', 'SGW-4D2', 'SGW-4E-GE-4E1', 'SGW-4E-GE-4E2',
    'SGE-4D2', 'SGE-4D1', 'SGE-4C2', 'SGE-4C1', 'SGE-4B2', 'SGE-4B1', 'SGE-4A2', 'SGE-4A1',
    'SGE-5A1', 'SGE-5A2', 'SGE-5B1', 'SGE-5B2', 'SGE-5C1', 'SGE-5C2', 'SGE-5D1', 'SGE-5D2', 'SGE-5E-GW-5E2', 'SGE-5E-GW-5E1',
    'SGW-5D2', 'SGW-5D1', 'SGW-5C2', 'SGW-5C1', 'SGW-5B2', 'SGW-5B1', 'SGW-5A2', 'SGW-5A1',
    'STR441S', 'STR441N', 'STR442S', 'STR442N', 'STR443S', 'STR443N', 'STR444S', 'STR444N', 'STR445S', 'STR445N',
    'STR446S', 'STR446N', 'STR447S', 'STR447N', 'STR448S', 'STR448N', 'STR449S', 'STR449N', 'STR450S', 'STR450N',
    'STR451S', 'STR451N', 'STR452S', 'STR452N', 'STR453S', 'STR453N', 'STR454S', 'STR454N', 'STR455S', 'STR455N',
    'STR456S', 'STR456N', 'STR457S', 'STR457N', 'STR458S', 'STR458N', 'STR459S', 'STR459N', 'STR460S', 'STR460N',
    'S23-W3', 'SCAISSON-SW-RM1', 'SCAISSON-SE-RM1', 'S23-E3',
    'S23-W7', 'S23-E7-23-W7-A', 'S23-E7-23-W7-B', 'S23-E7',
    'S23-W8', 'S23-E8-23-W8', 'S23-E8-23-W8-B', 'S23-E8',
    'S23-W6', 'S23-E6-1', 'S23-W6-1', 'S23-E6',
    'S23-W4', 'S23-W4-A', 'S23-W4-B', 'S23-W4-C',
    'S23-E4-A', 'S23-E4-B',
    'SGW-12', 'SHE-10', 'STOWER-PUMP-B', 'STOWER-PUMP-A', 'STOWER-PUMP-2', 
    'STOWER-PUMP-1', 'SWEST-CAISSON', 'SEAST-CAISSON', 'SCOMPRESSOR_1', 
    'SCOMPRESSOR_2', 'SCAISSON-A', 'SCAISSON-WEST', 'SCAISSON-EAST',
    'SWEST-NAV' 
];

window.tramosAislables = {
    // Mega-Ties y Base
    'SGE-7': 'TRAMOGE-7', 'SGE-6': 'TRAMOGE-6', 'SGE-5': 'TRAMOGE-5', 'SGE-4': 'TRAMOGE-4',
    'SGW-7': 'TRAMOGW-7', 'SGW-6': 'TRAMOGW-6', 'SGW-5': 'TRAMOGW-5', 'SGW-4': 'TRAMOGW-4',
    'SGE-8-B': 'TRAMOGE-8', 'SGE-8-A': 'TRAMOGE-8', 
    'SGW-8-B': 'TRAMOGW-8', 'SGW-8-A': 'TRAMOGW-8',   
    'S-SCHEDULE-A': 'SCHEDULE-A', 'S-SCHEDULE-B': 'SCHEDULE-B',                     
    'SGE-6A1': 'TRAMOGE-6A', 'SGE-6A2': 'TRAMOGE-6A', 'SGE-6B1': 'TRAMOGE-6B', 'SGE-6B2': 'TRAMOGE-6B',
    'SGE-6C1': 'TRAMOGE-6C', 'SGE-6C2': 'TRAMOGE-6C', 'SGE-6D1': 'TRAMOGE-6D', 'SGE-6D2': 'TRAMOGE-6D',
    'SGE-6E-GW-6E-2': 'TRAMOGE-6E-GW-6E', 'SGE-6E-GW-6E': 'TRAMOGE-6E-GW-6E',
    'SGW-6D2': 'TRAMOGW-6D', 'SGW-6D1': 'TRAMOGW-6D', 'SGW-6C2': 'TRAMOGW-6C', 'SGW-6C1': 'TRAMOGW-6C',
    'SGW-6B2': 'TRAMOGW-6B', 'SGW-6B1': 'TRAMOGW-6B', 'SGW-6A2': 'TRAMOGW-6A', 'SGW-6A1': 'TRAMOGW-6A',
    'SGW-4A1': 'TRAMOGW-4A', 'SGW-4A2': 'TRAMOGW-4A', 'SGW-4B1': 'TRAMOGW-4B', 'SGW-4B2': 'TRAMOGW-4B',
    'SGW-4C1': 'TRAMOGW-4C', 'SGW-4C2': 'TRAMOGW-4C', 'SGW-4D1': 'TRAMOGW-4D', 'SGW-4D2': 'TRAMOGW-4D',
    'SGW-4E-GE-4E1': 'TRAMOGW-4E-GE-4E', 'SGW-4E-GE-4E2': 'TRAMOGW-4E-GE-4E',
    'SGE-4D2': 'TRAMOGE-4D', 'SGE-4D1': 'TRAMOGE-4D', 'SGE-4C2': 'TRAMOGE-4C', 'SGE-4C1': 'TRAMOGE-4C',
    'SGE-4B2': 'TRAMOGE-4B', 'SGE-4B1': 'TRAMOGE-4B', 'SGE-4A2': 'TRAMOGE-4A', 'SGE-4A1': 'TRAMOGE-4A',
    'SGE-5A1': 'TRAMOGE-5A', 'SGE-5A2': 'TRAMOGE-5A', 'SGE-5B1': 'TRAMOGE-5B', 'SGE-5B2': 'TRAMOGE-5B',
    'SGE-5C1': 'TRAMOGE-5C', 'SGE-5C2': 'TRAMOGE-5C', 'SGE-5D1': 'TRAMOGE-5D', 'SGE-5D2': 'TRAMOGE-5D',
    'SGE-5E-GW-5E2': 'TRAMOGE-5E-GW-5E', 'SGE-5E-GW-5E1': 'TRAMOGE-5E-GW-5E',
    'SGW-5D2': 'TRAMOGW-5D', 'SGW-5D1': 'TRAMOGW-5D', 'SGW-5C2': 'TRAMOGW-5C', 'SGW-5C1': 'TRAMOGW-5C',
    'SGW-5B2': 'TRAMOGW-5B', 'SGW-5B1': 'TRAMOGW-5B', 'SGW-5A2': 'TRAMOGW-5A', 'SGW-5A1': 'TRAMOGW-5A',
    'SGW-7A1': 'TRAMOGW-7A', 'SGW-7A2': 'TRAMOGW-7A', 'SGW-7B1': 'TRAMOGW-7B', 'SGW-7B2': 'TRAMOGW-7B',
    'SGW-7C1': 'TRAMOGW-7C', 'SGW-7C2': 'TRAMOGW-7C', 'SGW-7D1': 'TRAMOGW-7D', 'SGW-7D2': 'TRAMOGW-7D',
    'SGE-7E-GW-7E': 'TRAMOGE-7E-GW-7E', 'SGE-7E-GW-7E-1': 'TRAMOGE-7E-GW-7E',
    'SGE-7D2': 'TRAMOGE-7D', 'SGE-7D1': 'TRAMOGE-7D', 'SGE-7C2': 'TRAMOGE-7C', 'SGE-7C1': 'TRAMOGE-7C',
    'SGE-7B2': 'TRAMOGE-7B', 'SGE-7B1': 'TRAMOGE-7B', 'SGE-7A2': 'TRAMOGE-7A', 'SGE-7A1': 'TRAMOGE-7A',
    'STR441S': 'TR441S', 'STR441N': 'TR441N', 'STR442S': 'TR442S', 'STR442N': 'TR442N',
    'STR443S': 'TR443S', 'STR443N': 'TR443N', 'STR444S': 'TR444S', 'STR444N': 'TR444N',
    'STR445S': 'TR445S', 'STR445N': 'TR445N', 'STR446S': 'TR446S', 'STR446N': 'TR446N',
    'STR447S': 'TR447S', 'STR447N': 'TR447N', 'STR448S': 'TR448S', 'STR448N': 'TR448N',
    'STR449S': 'TR449S', 'STR449N': 'TR449N', 'STR450S': 'TR450S', 'STR450N': 'TR450N',
    'STR451S': 'TR451S', 'STR451N': 'TR451N', 'STR452S': 'TR452S', 'STR452N': 'TR452N',
    'STR453S': 'TR453S', 'STR453N': 'TR453N', 'STR454S': 'TR454S', 'STR454N': 'TR454N',
    'STR455S': 'TR455S', 'STR455N': 'TR455N', 'STR456S': 'TR456S', 'STR456N': 'TR456N',
    'STR457S': 'TR457S', 'STR457N': 'TR457N', 'STR458S': 'TR458S', 'STR458N': 'TR458N',
    'STR459S': 'TR459S', 'STR459N': 'TR459N', 'STR460S': 'TR460S', 'STR460N': 'TR460N',

    // ZONAS DE PROTECCIÓN DE LA ESTACIÓN (INTERLOCKS)
    'S23-W3': 'TRAMO-STATION-23', 'S23-W4': 'TRAMO-STATION-23', 'S23-W6': 'TRAMO-STATION-23', 'S23-W6-1': 'TRAMO-STATION-23', 'S23-W7': 'TRAMO-STATION-23', 'S23-W8': 'TRAMO-STATION-23',
    'S23-E7': 'TRAMO-STATION-23-EAST', 'S23-E8': 'TRAMO-STATION-23-EAST', 'S23-E6-1': 'TRAMO-STATION-23-EAST', 'S23-E6': 'TRAMO-STATION-23-EAST', 'S23-E3': 'TRAMO-STATION-23-EAST', 'S23-E4-A': 'TRAMO-STATION-23-EAST', 'S23-E4-B': 'TRAMO-STATION-23-EAST',

    // ZONAS DE MANTENIMIENTO DEL ANILLO Y NUEVOS ENLACES
    'SCAISSON-SW-RM1': 'TRAMOTIE', 'SCAISSON-SE-RM1': 'TRAMOTIE',
    'S23-E7-23-W7-A': 'TRAMO23-E7-23-W7-A', 'S23-E7-23-W7-B': 'TRAMO23-E7-23-W7-A',
    'S23-E8-23-W8': 'TRAMO23-E8-23-W8', 'S23-E8-23-W8-B': 'TRAMO23-E8-23-W8',
    'S23-W4-A': 'TRAMO23-W4', 'S23-W4-B': 'TRAMO23-W4', 'S23-W4-C': 'TRAMO23-W4',
    
    // SEGURIDAD CASA DE CONTROL Y ACOMETIDAS
    'SGW-12': 'TRAMOGW-12',
    'SHE-10': 'TRAMOHE-10',

    // ZONAS DE MANTENIMIENTO DE CARGAS
    'STOWER-PUMP-B': 'g7', 'STOWER-PUMP-A': 'g4', 'STOWER-PUMP-2': 'g10', 'STOWER-PUMP-1': 'g13',
    'SWEST-CAISSON': 'g16', 'SEAST-CAISSON': 'g30', 'SCOMPRESSOR_1': 'COMPRESSOR_1', 'SCOMPRESSOR_2': 'COMPRESSOR_2',
    'SCAISSON-A': 'g29', 'SCAISSON-WEST': 'g27', 'SCAISSON-EAST': 'g24',
    'SWEST-NAV': 'path18132' 
};

function actualizarVisual(id, color) {
    var el = document.getElementById(id);
    if(el) {
        var rect = document.getElementById("rect_" + id) || el.querySelector('rect') || el;
        if (rect) { rect.style.fill = color; rect.setAttribute('fill', color); }
    }
}

// INICIALIZAR ESTADOS POR DEFECTO
interruptoresGatun.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.setAttribute('data-estado', 'DESACOPLADO'); actualizarVisual(id, ESTADOS['DESACOPLADO'].color); }
});

seccionadoresGatun.forEach(function(id) {
    var el = document.getElementById(id);
    if(el) { el.setAttribute('data-estado', 'ABIERTO'); actualizarVisual(id, '#FFA500'); }
});

for (var selId in window.configSelectores) {
    var el = document.getElementById(selId);
    if (el) { el.setAttribute('data-estado', 'NC'); actualizarVisual(selId, '#00FF00'); } 
}

window.mapaVecinosGatun = {
    // Red Base 
    'IHE-4': ['TRAMOHE-4', 'BARRA_MACHINERY_ROOM_G1W'], 'IHE-7': ['TRAMOHE-7', 'BARRA_MACHINERY_ROOM_G1E'],
    'IHE-3': ['TRAMOHE-3', 'BARRA_MACHINERY_ROOM_G1E'], 'IHE-8': ['TRAMOHE-8', 'BARRA_MACHINERY_ROOM_G1W'],
    'IHE-2': ['TRAMOHE-2', 'BARRA_MACHINERY_ROOM_G1E'], 
    'ICAP-FUTURE-B': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOCAP-FUTURE-B'], 'ISPAREC': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOSPAREC'],
    'ISPARED': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOSPARED'], 'ISPAREE': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOSPAREE'],
    'IGE-12': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-12'], 'ICAP-FUTURE-A': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOCAP-FUTURE-A'],
    'ISPAREB': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOSPAREB'], 'ISPAREA': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOSPAREA'],
    'IGW-12': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-12'], 'IBUSTIEA-B': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOBUSTIEA'],
    'IBUSTIEA-A': ['TRAMOBUSTIEA', 'BARRA_MACHINERY_ROOM_G1W'], 'IBUSTIEB-A': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOBUSTIEB'],
    'IBUSTIEB-B': ['TRAMOBUSTIEB', 'BARRA_MACHINERY_ROOM_G1E'],
    
    'IGE-8': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-8'],
    'IGW-8': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-8'],
    'IGE-6': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-6'], 'SGE-6': ['TRAMOGE-6', 'TRAMOTR457S'],
    'IGE-7': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-7'], 'SGE-7': ['TRAMOGE-7', 'TRAMOTR457N'],
    'IGE-5': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-5'], 'SGE-5': ['TRAMOGE-5', 'TRAMOTR458N'],
    'IGE-4': ['BARRA_MACHINERY_ROOM_G1E', 'TRAMOGE-4'], 'SGE-4': ['TRAMOGE-4', 'TRAMOTR458S'],
    'IGW-6': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-6'], 'SGW-6': ['TRAMOGW-6', 'TRAMOTR460S'],
    'IGW-5': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-5'], 'SGW-5': ['TRAMOGW-5', 'TRAMOTR459N'],
    'IGW-4': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-4'], 'SGW-4': ['TRAMOGW-4', 'TRAMOTR459S'],
    'IGW-7': ['BARRA_MACHINERY_ROOM_G1W', 'TRAMOGW-7'], 'SGW-7': ['TRAMOGW-7', 'TRAMOTR460N'],

    'SGE-8-B': ['TRAMOGE-8', 'TRAMOTR-SCHEDULEB'],
    'SGW-8-B': ['TRAMOTR-SCHEDULEB', 'TRAMOGW-8'],
    'S-SCHEDULE-B': ['TRAMOTR-SCHEDULEB', 'SCHEDULE-B'],
    'SGW-8-A': ['TRAMOGW-8', 'TRAMOTR-SCHEDULEA'],
    'SGE-8-A': ['TRAMOTR-SCHEDULEA', 'TRAMOGE-8'],
    'S-SCHEDULE-A': ['TRAMOTR-SCHEDULEA', 'SCHEDULE-A'],

    'SGE-6A1': ['TRAMOTR457S', 'TRAMOGE-6A'], 'SGE-6A2': ['TRAMOGE-6A', 'TRAMOTR453S'], 'SGE-6B1': ['TRAMOTR453S', 'TRAMOGE-6B'], 'SGE-6B2': ['TRAMOGE-6B', 'TRAMOTR449S'],
    'SGE-6C1': ['TRAMOTR449S', 'TRAMOGE-6C'], 'SGE-6C2': ['TRAMOGE-6C', 'TRAMOTR445S'], 'SGE-6D1': ['TRAMOTR445S', 'TRAMOGE-6D'], 'SGE-6D2': ['TRAMOGE-6D', 'TRAMOTR441S'],
    'SGE-6E-GW-6E-2': ['TRAMOTR441S', 'TRAMOGE-6E-GW-6E'], 'SGE-6E-GW-6E': ['TRAMOGE-6E-GW-6E', 'TRAMOTR444S'],
    'SGW-6D2': ['TRAMOTR444S', 'TRAMOGW-6D'], 'SGW-6D1': ['TRAMOGW-6D', 'TRAMOTR448S'], 'SGW-6C2': ['TRAMOTR448S', 'TRAMOGW-6C'], 'SGW-6C1': ['TRAMOGW-6C', 'TRAMOTR452S'],
    'SGW-6B2': ['TRAMOTR452S', 'TRAMOGW-6B'], 'SGW-6B1': ['TRAMOGW-6B', 'TRAMOTR456S'], 'SGW-6A2': ['TRAMOTR456S', 'TRAMOGW-6A'], 'SGW-6A1': ['TRAMOGW-6A', 'TRAMOTR460S'],
    'SGW-7A1': ['TRAMOTR460N', 'TRAMOGW-7A'], 'SGW-7A2': ['TRAMOGW-7A', 'TRAMOTR456N'], 'SGW-7B1': ['TRAMOTR456N', 'TRAMOGW-7B'], 'SGW-7B2': ['TRAMOGW-7B', 'TRAMOTR452N'],
    'SGW-7C1': ['TRAMOTR452N', 'TRAMOGW-7C'], 'SGW-7C2': ['TRAMOGW-7C', 'TRAMOTR448N'], 'SGW-7D1': ['TRAMOTR448N', 'TRAMOGW-7D'], 'SGW-7D2': ['TRAMOGW-7D', 'TRAMOTR444N'],
    'SGE-7E-GW-7E': ['TRAMOTR444N', 'TRAMOGE-7E-GW-7E'], 'SGE-7E-GW-7E-1': ['TRAMOGE-7E-GW-7E', 'TRAMOTR441N'],
    'SGE-7D2': ['TRAMOTR441N', 'TRAMOGE-7D'], 'SGE-7D1': ['TRAMOGE-7D', 'TRAMOTR445N'], 'SGE-7C2': ['TRAMOTR445N', 'TRAMOGE-7C'], 'SGE-7C1': ['TRAMOGE-7C', 'TRAMOTR449N'],
    'SGE-7B2': ['TRAMOTR449N', 'TRAMOGE-7B'], 'SGE-7B1': ['TRAMOGE-7B', 'TRAMOTR453N'], 'SGE-7A2': ['TRAMOTR453N', 'TRAMOGE-7A'], 'SGE-7A1': ['TRAMOGE-7A', 'TRAMOTR457N'],
    'SGW-4A1': ['TRAMOTR459S', 'TRAMOGW-4A'], 'SGW-4A2': ['TRAMOGW-4A', 'TRAMOTR455S'], 'SGW-4B1': ['TRAMOTR455S', 'TRAMOGW-4B'], 'SGW-4B2': ['TRAMOGW-4B', 'TRAMOTR451S'],
    'SGW-4C1': ['TRAMOTR451S', 'TRAMOGW-4C'], 'SGW-4C2': ['TRAMOGW-4C', 'TRAMOTR447S'], 'SGW-4D1': ['TRAMOTR447S', 'TRAMOGW-4D'], 'SGW-4D2': ['TRAMOGW-4D', 'TRAMOTR443S'],
    'SGW-4E-GE-4E1': ['TRAMOTR443S', 'TRAMOGW-4E-GE-4E'], 'SGW-4E-GE-4E2': ['TRAMOGW-4E-GE-4E', 'TRAMOTR442S'],
    'SGE-4D2': ['TRAMOTR442S', 'TRAMOGE-4D'], 'SGE-4D1': ['TRAMOGE-4D', 'TRAMOTR446S'], 'SGE-4C2': ['TRAMOTR446S', 'TRAMOGE-4C'], 'SGE-4C1': ['TRAMOGE-4C', 'TRAMOTR450S'],
    'SGE-4B2': ['TRAMOTR450S', 'TRAMOGE-4B'], 'SGE-4B1': ['TRAMOGE-4B', 'TRAMOTR454S'], 'SGE-4A2': ['TRAMOTR454S', 'TRAMOGE-4A'], 'SGE-4A1': ['TRAMOGE-4A', 'TRAMOTR458S'],
    'SGE-5A1': ['TRAMOTR458N', 'TRAMOGE-5A'], 'SGE-5A2': ['TRAMOGE-5A', 'TRAMOTR454N'], 'SGE-5B1': ['TRAMOTR454N', 'TRAMOGE-5B'], 'SGE-5B2': ['TRAMOGE-5B', 'TRAMOTR450N'],
    'SGE-5C1': ['TRAMOTR450N', 'TRAMOGE-5C'], 'SGE-5C2': ['TRAMOGE-5C', 'TRAMOTR446N'], 'SGE-5D1': ['TRAMOTR446N', 'TRAMOGE-5D'], 'SGE-5D2': ['TRAMOGE-5D', 'TRAMOTR442N'],
    'SGE-5E-GW-5E2': ['TRAMOTR442N', 'TRAMOGE-5E-GW-5E'], 'SGE-5E-GW-5E1': ['TRAMOGE-5E-GW-5E', 'TRAMOTR443N'],
    'SGW-5D2': ['TRAMOTR443N', 'TRAMOGW-5D'], 'SGW-5D1': ['TRAMOGW-5D', 'TRAMOTR447N'], 'SGW-5C2': ['TRAMOTR447N', 'TRAMOGW-5C'], 'SGW-5C1': ['TRAMOGW-5C', 'TRAMOTR451N'],
    'SGW-5B2': ['TRAMOTR451N', 'TRAMOGW-5B'], 'SGW-5B1': ['TRAMOGW-5B', 'TRAMOTR455N'], 'SGW-5A2': ['TRAMOTR455N', 'TRAMOGW-5A'], 'SGW-5A1': ['TRAMOGW-5A', 'TRAMOTR459N'],

    'STR441S': ['TRAMOTR441S', 'TR441S'], 'ITR441S': ['TR441S', 'BARRATR441'], 'STR441N': ['TRAMOTR441N', 'TR441N'], 'ITR441N': ['TR441N', 'BARRATR441'],
    'STR442S': ['TRAMOTR442S', 'TR442S'], 'ITR442S': ['TR442S', 'BARRATR442'], 'STR442N': ['TRAMOTR442N', 'TR442N'], 'ITR442N': ['TR442N', 'BARRATR442'],
    'STR443S': ['TRAMOTR443S', 'TR443S'], 'ITR443S': ['TR443S', 'BARRATR443'], 'STR443N': ['TRAMOTR443N', 'TR443N'], 'ITR443N': ['TR443N', 'BARRATR443'],
    'STR444S': ['TRAMOTR444S', 'TR444S'], 'ITR444S': ['TR444S', 'BARRATR444'], 'STR444N': ['TRAMOTR444N', 'TR444N'], 'ITR444N': ['TR444N', 'BARRATR444'],
    'STR445S': ['TRAMOTR445S', 'TR445S'], 'ITR445S': ['TR445S', 'BARRATR445'], 'STR445N': ['TRAMOTR445N', 'TR445N'], 'ITR445N': ['TR445N', 'BARRATR445'],
    'STR446S': ['TRAMOTR446S', 'TR446S'], 'ITR446S': ['TR446S', 'BARRATR446'], 'STR446N': ['TRAMOTR446N', 'TR446N'], 'ITR446N': ['TR446N', 'BARRATR446'],
    'STR447S': ['TRAMOTR447S', 'TR447S'], 'ITR447S': ['TR447S', 'BARRATR447'], 'STR447N': ['TRAMOTR447N', 'TR447N'], 'ITR447N': ['TR447N', 'BARRATR447'],
    'STR448S': ['TRAMOTR448S', 'TR448S'], 'ITR448S': ['TR448S', 'BARRATR448'], 'STR448N': ['TRAMOTR448N', 'TR448N'], 'ITR448N': ['TR448N', 'BARRATR448'],
    'STR449S': ['TRAMOTR449S', 'TR449S'], 'ITR449S': ['TR449S', 'BARRATR449'], 'STR449N': ['TRAMOTR449N', 'TR449N'], 'ITR449N': ['TR449N', 'BARRATR449'],
    'STR450S': ['TRAMOTR450S', 'TR450S'], 'ITR450S': ['TR450S', 'BARRATR450'], 'STR450N': ['TRAMOTR450N', 'TR450N'], 'ITR450N': ['TR450N', 'BARRATR450'],
    'STR451S': ['TRAMOTR451S', 'TR451S'], 'ITR451S': ['TR451S', 'BARRATR451'], 'STR451N': ['TRAMOTR451N', 'TR451N'], 'ITR451N': ['TR451N', 'BARRATR451'],
    'STR452S': ['TRAMOTR452S', 'TR452S'], 'ITR452S': ['TR452S', 'BARRATR452'], 'STR452N': ['TRAMOTR452N', 'TR452N'], 'ITR452N': ['TR452N', 'BARRATR452'],
    'STR453S': ['TRAMOTR453S', 'TR453S'], 'ITR453S': ['TR453S', 'BARRATR453'], 'STR453N': ['TRAMOTR453N', 'TR453N'], 'ITR453N': ['TR453N', 'BARRATR453'],
    'STR454S': ['TRAMOTR454S', 'TR454S'], 'ITR454S': ['TR454S', 'BARRATR454'], 'STR454N': ['TRAMOTR454N', 'TR454N'], 'ITR454N': ['TR454N', 'BARRATR454'],
    'STR455S': ['TRAMOTR455S', 'TR455S'], 'ITR455S': ['TR455S', 'BARRATR455'], 'STR455N': ['TRAMOTR455N', 'TR455N'], 'ITR455N': ['TR455N', 'BARRATR455'],
    'STR456S': ['TRAMOTR456S', 'TR456S'], 'ITR456S': ['TR456S', 'BARRATR456'], 'STR456N': ['TRAMOTR456N', 'TR456N'], 'ITR456N': ['TR456N', 'BARRATR456'],
    'STR457S': ['TRAMOTR457S', 'TR457S'], 'ITR457S': ['TR457S', 'BARRATR457'], 'STR457N': ['TRAMOTR457N', 'TR457N'], 'ITR457N': ['TR457N', 'BARRATR457'],
    'STR458S': ['TRAMOTR458S', 'TR458S'], 'ITR458S': ['TR458S', 'BARRATR458'], 'STR458N': ['TRAMOTR458N', 'TR458N'], 'ITR458N': ['TR458N', 'BARRATR458'],
    'STR459S': ['TRAMOTR459S', 'TR459S'], 'ITR459S': ['TR459S', 'BARRATR459'], 'STR459N': ['TRAMOTR459N', 'TR459N'], 'ITR459N': ['TR459N', 'BARRATR459'],
    'STR460S': ['TRAMOTR460S', 'TR460S'], 'ITR460S': ['TR460S', 'BARRATR460'], 'STR460N': ['TRAMOTR460N', 'TR460N'], 'ITR460N': ['TR460N', 'BARRATR460'],

    'ITR741S': ['TRAMOGE-6D', 'BARRATR741'], 'ITR741N': ['TRAMOGE-7D', 'BARRATR741'], 'ITR745S': ['TRAMOGE-6C', 'BARRATR745'], 'ITR745N': ['TRAMOGE-7C', 'BARRATR745'],
    'ITR749S': ['TRAMOGE-6B', 'BARRATR749'], 'ITR749N': ['TRAMOGE-7B', 'BARRATR749'], 'ITR753S': ['TRAMOGE-6A', 'BARRATR753'], 'ITR753N': ['TRAMOGE-7A', 'BARRATR753'],
    'ITR756S': ['TRAMOGW-6A', 'BARRATR756'], 'ITR756N': ['TRAMOGW-7A', 'BARRATR756'], 'ITR752S': ['TRAMOGW-6B', 'BARRATR752'], 'ITR752N': ['TRAMOGW-7B', 'BARRATR752'],
    'ITR748S': ['TRAMOGW-6C', 'BARRATR748'], 'ITR748N': ['TRAMOGW-7C', 'BARRATR748'], 'ITR744S': ['TRAMOGW-6D', 'BARRATR744'], 'ITR744N': ['TRAMOGW-7D', 'BARRATR744'],
    'ITR743S': ['TRAMOGW-4D', 'BARRATR743'], 'ITR743N': ['TRAMOGW-5D', 'BARRATR743'], 'ITR742S': ['TRAMOGE-4D', 'BARRATR742'], 'ITR742N': ['TRAMOGE-5D', 'BARRATR742'],
    'ITR747S': ['TRAMOGW-4C', 'BARRATR747'], 'ITR747N': ['TRAMOGW-5C', 'BARRATR747'], 'ITR746S': ['TRAMOGE-4C', 'BARRATR746'], 'ITR746N': ['TRAMOGE-5C', 'BARRATR746'],
    'ITR751S': ['TRAMOGW-4B', 'BARRATR751'], 'ITR751N': ['TRAMOGW-5B', 'BARRATR751'], 'ITR750S': ['TRAMOGE-4B', 'BARRATR750'], 'ITR750N': ['TRAMOGE-5B', 'BARRATR750'],
    'ITR755S': ['TRAMOGW-4A', 'BARRATR755'], 'ITR755N': ['TRAMOGW-5A', 'BARRATR755'], 'ITR754S': ['TRAMOGE-4A', 'BARRATR754'], 'ITR754N': ['TRAMOGE-5A', 'BARRATR754'],

    'IRT-SUR-TR460': ['BARRATR460', 'RT-SUR-TR460'], 'ITT-SUR-TR460': ['BARRATR460', 'TT-SUR-TR460'],
    'IRT-NORTE-TR460': ['BARRATR460', 'RT-TR460-TR456'], 'ITT-NORTE-TR460': ['BARRATR460', 'TT-TR460-TR456'],
    'IRT-SUR-TR456': ['RT-TR460-TR456', 'BARRATR456'], 'ITT-SUR-TR456': ['TT-TR460-TR456', 'BARRATR456'],
    'IRT-NORTE-TR456': ['BARRATR456', 'RT-TR456-TR452'], 'ITT-NORTE-TR456': ['BARRATR456', 'TT-TR456-TR452'],
    'IRT-SUR-TR452': ['RT-TR456-TR452', 'BARRATR452'], 'ITT-SUR-TR452': ['TT-TR456-TR452', 'BARRATR452'],
    'IRT-NORTE-TR452': ['BARRATR452', 'RT-TR452-TR448'], 'ITT-NORTE-TR452': ['BARRATR452', 'TT-TR452-TR448'],
    'IRT-SUR-TR448': ['RT-TR452-TR448', 'BARRATR448'], 'ITT-SUR-TR448': ['TT-TR452-TR448', 'BARRATR448'],
    'IRT-NORTE-TR448': ['BARRATR448', 'RT-TR448-TR444'], 'ITT-NORTE-TR448': ['BARRATR448', 'TT-TR448-TR444'],
    'IRT-SUR-TR444': ['RT-TR448-TR444', 'BARRATR444'], 'ITT-SUR-TR444': ['TT-TR448-TR444', 'BARRATR444'],
    'IRT-NORTE-TR444': ['BARRATR444', 'RT-NORTE-TR444'], 'ITT-NORTE-TR444': ['BARRATR444', 'TT-NORTE-TR444'],
    'IRT-SUR-TR457': ['BARRATR457', 'RT-SUR-TR457'], 'ITT-SUR-TR457': ['BARRATR457', 'TT-SUR-TR457'],
    'IRT-NORTE-TR457': ['BARRATR457', 'RT-TR457-TR453'], 'ITT-NORTE-TR457': ['BARRATR457', 'TT-TR457-TR453'],
    'IRT-SUR-TR453': ['RT-TR457-TR453', 'BARRATR453'], 'ITT-SUR-TR453': ['TT-TR457-TR453', 'BARRATR453'],
    'IRT-NORTE-TR453': ['BARRATR453', 'RT-TR453-TR449'], 'ITT-NORTE-TR453': ['BARRATR453', 'TT-TR453-TR449'],
    'IRT-SUR-TR449': ['RT-TR453-TR449', 'BARRATR449'], 'ITT-SUR-TR449': ['TT-TR453-TR449', 'BARRATR449'],
    'IRT-NORTE-TR449': ['BARRATR449', 'RT-TR449-TR445'], 'ITT-NORTE-TR449': ['BARRATR449', 'TT-TR449-TR445'],
    'IRT-SUR-TR445': ['RT-TR449-TR445', 'BARRATR445'], 'ITT-SUR-TR445': ['TT-TR449-TR445', 'BARRATR445'],
    'IRT-NORTE-TR445': ['BARRATR445', 'RT-TR445-TR441'], 'ITT-NORTE-TR445': ['BARRATR445', 'TT-TR445-TR441'],
    'IRT-SUR-TR441': ['RT-TR445-TR441', 'BARRATR441'], 'ITT-SUR-TR441': ['TT-TR445-TR441', 'BARRATR441'],
    'IRT-NORTE-TR441': ['BARRATR441', 'RT-NORTE-TR441'], 'ITT-NORTE-TR441': ['BARRATR441', 'TT-NORTE-TR441'],
    'ITT-SUR-TR459': ['BARRATR459', 'TT-SUR-TR459'],
    'ITT-NORTE-TR459': ['BARRATR459', 'TT-TR459-TR455'], 'ITT-SUR-TR455': ['TT-TR459-TR455', 'BARRATR455'],
    'ITT-NORTE-TR455': ['BARRATR455', 'TT-TR455-TR451'], 'ITT-SUR-TR451': ['TT-TR455-TR451', 'BARRATR451'],
    'ITT-NORTE-TR451': ['BARRATR451', 'TT-TR451-TR447'], 'ITT-SUR-TR447': ['TT-TR451-TR447', 'BARRATR447'],
    'ITT-NORTE-TR447': ['BARRATR447', 'TT-TR447-TR443'], 'ITT-SUR-TR443': ['TT-TR447-TR443', 'BARRATR443'],
    'ITT-NORTE-TR443': ['BARRATR443', 'TT-NORTE-TR443'],
    'IRT-SUR-TR458': ['BARRATR458', 'RT-SUR-TR458'], 'ITT-SUR-TR458': ['BARRATR458', 'TT-SUR-TR458'],
    'IRT-NORTE-TR458': ['BARRATR458', 'RT-TR458-TR454'], 'ITT-NORTE-TR458': ['BARRATR458', 'TT-TR458-TR454'],
    'IRT-SUR-TR454': ['RT-TR458-TR454', 'BARRATR454'], 'ITT-SUR-TR454': ['TT-TR458-TR454', 'BARRATR454'],
    'IRT-NORTE-TR454': ['BARRATR454', 'RT-TR454-TR450'], 'ITT-NORTE-TR454': ['BARRATR454', 'TT-TR454-TR450'],
    'IRT-SUR-TR450': ['RT-TR454-TR450', 'BARRATR450'], 'ITT-SUR-TR450': ['TT-TR454-TR450', 'BARRATR450'],
    'IRT-NORTE-TR450': ['BARRATR450', 'RT-TR450-TR446'], 'ITT-NORTE-TR450': ['BARRATR450', 'TT-TR450-TR446'],
    'IRT-SUR-TR446': ['RT-TR450-TR446', 'BARRATR446'], 'ITT-SUR-TR446': ['TT-TR450-TR446', 'BARRATR446'],
    'IRT-NORTE-TR446': ['BARRATR446', 'RT-TR446-TR442'], 'ITT-NORTE-TR446': ['BARRATR446', 'TT-TR446-TR442'],
    'IRT-SUR-TR442': ['RT-TR446-TR442', 'BARRATR442'], 'ITT-SUR-TR442': ['TT-TR446-TR442', 'BARRATR442'],
    'IRT-NORTE-TR442': ['BARRATR442', 'RT-NORTE-TR442'], 'ITT-NORTE-TR442': ['BARRATR442', 'TT-NORTE-TR442'],
    
    'IT-TT-458': ['TT-SUR-TR458', 'TRANSFERSUR'], 'IT-TT-459': ['TT-SUR-TR459', 'TRANSFERSUR'], 'IT-RT-458': ['RT-SUR-TR458', 'TRANSFERSUR'],
    'IT-SOUTH-TURNTABLE': ['TRANSFERSUR', 'TURNTABLE-SOUTH'],
    'IT-TT-443': ['TT-NORTE-TR443', 'TRANSFERNORTE'], 'IT-TT-442': ['TT-NORTE-TR442', 'TRANSFERNORTE'], 'IT-RT-442': ['RT-NORTE-TR442', 'TRANSFERNORTE'],
    'IT-NORTH-TURNTABLE': ['TRANSFERNORTE', 'TURNTABLE-NORTH'],

    'IFUS-UNIT-A-TR444': ['TRAMO-UNIT-A', 'TRANSFORMER-A-TR444'],
    'IFUS-UNIT-B-TR444': ['TRAMO-UNIT-B', 'TRANSFORMER-B-TR444'],
    'IFUS-UNIT-A-TR440': ['TRAMO-UNIT-A-TR440', 'TRANSFORMER-A-TR440'],
    'IFUS-UNIT-B-TR440': ['TRAMO-UNIT-B-TR440', 'TRANSFORMER-B-TR440'],

    // --- ENLACES DEL ANILLO Y CARGAS ---
    'S23-E4-B': ['TRAMO-STATION-23-EAST', 'g26'],
    'S23-W4-B': ['TRAMO23-W4', 'g26'],
    'S23-W4-C': ['TRAMO23-W4', 'g23'],
    'S23-E4-A': ['TRAMO-STATION-23-EAST', 'g23'],
    'SGW-12': ['TRAMOGW-12', 'g5'],
    'SHE-10': ['g5', 'TRAMOHE-10'],
    'S23-W3': ['TRAMO-STATION-23', 'TRAMOWESTCAISSON'],
    'SCAISSON-SW-RM1': ['TRAMOWESTCAISSON', 'TRAMOTIE'],
    'SCAISSON-SE-RM1': ['TRAMOTIE', 'TRAMOEASTCAISSON'],
    'S23-E3': ['TRAMOEASTCAISSON', 'TRAMO-STATION-23-EAST'],
    'S23-W7': ['TRAMO-STATION-23', 'TRAMO-TOWERWEST'],
    'S23-E7-23-W7-A': ['TRAMO-TOWERWEST', 'TRAMO23-E7-23-W7-A'],
    'S23-E7-23-W7-B': ['TRAMO23-E7-23-W7-A', 'TRAMO-TOWEREAST'],
    'S23-E7': ['TRAMO-TOWEREAST', 'TRAMO-STATION-23-EAST'],
    'S23-W8': ['TRAMO-STATION-23', 'TRAMO-TOWERWEST2'],
    'S23-E8-23-W8': ['TRAMO-TOWERWEST2', 'TRAMO23-E8-23-W8'],
    'S23-E8-23-W8-B': ['TRAMO23-E8-23-W8', 'TRAMO-TOWEREAST2'],
    'S23-E8': ['TRAMO-TOWEREAST2', 'TRAMO-STATION-23-EAST'],
    'S23-W6': ['TRAMO-STATION-23', 'TRAMON-10B'],
    'S23-E6-1': ['TRAMON-10B', 'TRAMO-STATION-23-EAST'],
    'S23-W6-1': ['TRAMO-STATION-23', 'TRAMON-10'],
    'S23-E6': ['TRAMON-10', 'TRAMO-STATION-23-EAST'],
    'S23-W4': ['TRAMO-STATION-23', 'TRAMOANCHORAGE-A'],
    'S23-W4-A': ['TRAMOANCHORAGE-A', 'TRAMO23-W4'],
    'STOWER-PUMP-B': ['TRAMO-TOWERWEST2', 'g7'],
    'STOWER-PUMP-A': ['TRAMO-TOWERWEST', 'g4'],
    'STOWER-PUMP-2': ['TRAMO-TOWEREAST2', 'g10'],
    'STOWER-PUMP-1': ['TRAMO-TOWEREAST', 'g13'],
    'SWEST-CAISSON': ['TRAMOWESTCAISSON', 'g16'],
    'SEAST-CAISSON': ['TRAMOEASTCAISSON', 'g30'],
    'SCOMPRESSOR_1': ['TRAMON-10', 'COMPRESSOR_1'],
    'SCOMPRESSOR_2': ['TRAMON-10B', 'COMPRESSOR_2'],
    'SCAISSON-A': ['TRAMOANCHORAGE-A', 'g29'],
    'SCAISSON-WEST': ['g26', 'g27'],
    'SCAISSON-EAST': ['g23', 'g24'],
    'SWEST-NAV': ['g5', 'path18132']
};

window.simularCierreParaSeguridad = function(idCandidato) {
    var tensionSimulada = {};
    
    ['TRAMOHE-4', 'TRAMOHE-7', 'TRAMOHE-3', 'TRAMOHE-8', 'TRAMOHE-2'].forEach(t => tensionSimulada[t] = true);
    
    var elIT10 = document.getElementById('ITRAMOHE-10');
    if ((elIT10 && elIT10.getAttribute('data-estado') === 'CERRADO') || idCandidato === 'ITRAMOHE-10') {
        tensionSimulada['TRAMOHE-10'] = true;
    }

    var estaCerradoSim = function(id) { 
        if (id === idCandidato) return true; 
        var el = document.getElementById(id) || document.getElementById('rect_'+id); 
        return el && el.getAttribute('data-estado') === 'CERRADO'; 
    };

    for(var k=0; k<100; k++) {
        for (var sw in window.mapaVecinosGatun) {
            var lados = window.mapaVecinosGatun[sw];
            if (estaCerradoSim(sw)) {
                if (tensionSimulada[lados[0]]) tensionSimulada[lados[1]] = true;
                if (tensionSimulada[lados[1]]) tensionSimulada[lados[0]] = true;
            }
        }
        for (var sel in window.configSelectores) {
            var conf = window.configSelectores[sel];
            var elSel = document.getElementById(sel);
            var estSel = elSel ? (elSel.getAttribute('data-estado') || 'NC') : 'NC';
            var fuenteSel = conf[estSel];
            if (tensionSimulada[fuenteSel]) tensionSimulada[conf.carga] = true;
            if (tensionSimulada[conf.carga]) tensionSimulada[fuenteSel] = true;
        }
        window.enlacesPasivos.forEach(function(par) {
            if (tensionSimulada[par[0]]) tensionSimulada[par[1]] = true;
            if (tensionSimulada[par[1]]) tensionSimulada[par[0]] = true;
        });
    }

    for (var sw in window.tramosAislables) {
        var el = document.getElementById(sw) || document.getElementById('rect_'+sw);
        if (el && el.getAttribute('data-estado') === 'ATERRIZADO') {
            var tramoAislado = window.tramosAislables[sw]; 
            if (tensionSimulada[tramoAislado]) { return sw; }
        }
    }
    return false;
};

window.maniobraSelector = function(t) {
    var idSel = t.id ? t.id.replace('rect_', '') : '';
    var conf = window.configSelectores[idSel];
    if(!conf) return;

    if (window.tensionGlobal && (window.tensionGlobal[conf.NC] || window.tensionGlobal[conf.NO] || window.tensionGlobal[conf.carga])) {
        alert('⛔ OPERACIÓN BLOQUEADA: NON-LOADBREAK SWITCH\n\nDesenergice las fuentes y la carga para operar.');
        return;
    }

    var estAnt = t.getAttribute('data-estado') || 'NC';
    var txtEst = estAnt === 'NC' ? '🟢 POSICIÓN NC' : '🟡 POSICIÓN NO';
    var op = prompt('MANIOBRA SELECTOR: ' + idSel + '\nESTADO: ' + txtEst + '\n\n1: NC\n2: NO', estAnt === 'NC' ? '2' : '1');
    
    if (op === '1' || op === '2') {
        var nuevo = op === '1' ? 'NC' : 'NO';
        if (estAnt === nuevo) return;
        t.setAttribute('data-estado', nuevo);
        actualizarVisual(idSel, nuevo === 'NC' ? '#00FF00' : '#FFFF00');
        if (window.actualizarGatun) window.actualizarGatun();
    }
};

window.maniobraSeccionador = function(t) {
    var idSecc = t.id ? t.id.replace('rect_', '') : '';
    var estAnt = t.getAttribute('data-estado') || 'ABIERTO';
    var txtEst = estAnt === 'CERRADO' ? '🟢 CERRADO' : (estAnt === 'ATERRIZADO' ? '⚫ ATERRIZADO' : '🟠 ABIERTO');
    var op = prompt('MANIOBRA SECC: ' + idSecc + '\nESTADO ACTUAL: ' + txtEst + '\n\nSELECCIONE POSICIÓN:\n1: CERRAR 🟢\n2: ABRIR 🟠\n3: ATERRIZAR ⚫', '2');
    var mapa = {'1':'CERRADO', '2':'ABIERTO', '3':'ATERRIZADO'};
    
    if (mapa[op]) {
        var nuevoEst = mapa[op];
        if (estAnt === nuevoEst) return;
        
        var esValido = true;
        var mensajeError = "";

        if (nuevoEst === 'ATERRIZADO') {
            var tramoAislado = window.tramosAislables[idSecc];
            if (tramoAislado && window.tensionGlobal && window.tensionGlobal[tramoAislado]) {
                esValido = false;
                mensajeError = '⛔ BLOQUEO\n\nNo se puede aterrizar el ' + idSecc + '. El tramo ' + tramoAislado + ' está ENERGIZADO.';
            }
        } else if (nuevoEst === 'CERRADO') {
            if (window.simularCierreParaSeguridad) {
                var culpable = window.simularCierreParaSeguridad(idSecc);
                if (culpable) {
                    esValido = false;
                    mensajeError = '⛔ BLOQUEO CORTOCIRCUITO\n\nEl tramo de protección de ' + culpable + ' está ATERRIZADO.';
                }
            }
        }

        if (!esValido) { alert(mensajeError); } else {
            t.setAttribute('data-estado', nuevoEst);
            var col = nuevoEst === 'CERRADO' ? '#00FF00' : (nuevoEst === 'ATERRIZADO' ? '#000000' : '#FFA500');
            actualizarVisual(idSecc, col);
            if (window.actualizarGatun) window.actualizarGatun();
        }
    }
};

window.actualizarGatun = function() {
    var tension = {};
    ['TRAMOHE-4', 'TRAMOHE-7', 'TRAMOHE-3', 'TRAMOHE-8', 'TRAMOHE-2'].forEach(t => tension[t] = true);
    
    var elIT10 = document.getElementById('ITRAMOHE-10');
    if (elIT10 && elIT10.getAttribute('data-estado') === 'CERRADO') {
        tension['TRAMOHE-10'] = true;
    }

    var estaCerrado = function(id) { 
        var el = document.getElementById(id); return el && el.getAttribute('data-estado') === 'CERRADO'; 
    };

    for(var k=0; k<100; k++) {
        for (var sw in window.mapaVecinosGatun) {
            var lados = window.mapaVecinosGatun[sw];
            if (estaCerrado(sw)) {
                if (tension[lados[0]]) tension[lados[1]] = true;
                if (tension[lados[1]]) tension[lados[0]] = true;
            }
        }
        for (var sel in window.configSelectores) {
            var conf = window.configSelectores[sel];
            var elSel = document.getElementById(sel);
            var estSel = elSel ? (elSel.getAttribute('data-estado') || 'NC') : 'NC';
            var fuenteSel = conf[estSel];
            if (tension[fuenteSel]) tension[conf.carga] = true;
            if (tension[conf.carga]) tension[fuenteSel] = true;
        }
        window.enlacesPasivos.forEach(function(par) {
            if (tension[par[0]]) tension[par[1]] = true;
            if (tension[par[1]]) tension[par[0]] = true;
        });
    }

    window.tensionGlobal = tension;

    var pintar = function(id) { 
        var el = document.getElementById(id); 
        if(el) { 
            var color;
            if (tension[id]) {
                var esNaranja = id.startsWith('BARRATR') || id.startsWith('RT-') || id.startsWith('TT-') || id.startsWith('TRANSFER') || id.startsWith('TURNTABLE') || id.startsWith('SCHEDULE');
                var tramosMorados = ['g26', 'g23', 'g7', 'g4', 'g10', 'g13', 'g16', 'g30', 'g29', 'g27', 'g24', 'COMPRESSOR_1', 'COMPRESSOR_2', 'path18132'];
                var esMorado = id.startsWith('TRAMO-STATION') || id.startsWith('TRAMOWEST') || id.startsWith('TRAMOTIE') || id.startsWith('TRAMOEAST') || id.startsWith('TRAMO-TOWER') || id.startsWith('TRAMO23') || id.startsWith('TRAMON-') || id.startsWith('TRAMOANCHORAGE') || tramosMorados.includes(id); 
                
                if (esNaranja) color = '#FFA500';
                else if (esMorado) color = '#D484FF'; 
                else color = '#00b4f8'; 
            } else {
                color = '#000000'; 
            }
            
            var grosor = tension[id] ? '1' : '1'; 

            if (!interruptoresGatun.includes(id) && !seccionadoresGatun.includes(id) && !window.configSelectores[id] && id !== 'ITRAMOHE-10') {
                el.style.stroke = color; el.style.strokeWidth = grosor; el.setAttribute('stroke-width', grosor);
                var hijos = el.querySelectorAll('*');
                hijos.forEach(hijo => { hijo.style.stroke = color; hijo.style.strokeWidth = grosor; });
            }
        }
    };

    var elementosAPintar = [
        'BARRA_MACHINERY_ROOM_G1W', 'BARRA_MACHINERY_ROOM_G1E', 'TRAMOHE-4', 'TRAMOHE-7', 'TRAMOHE-3', 'TRAMOHE-8', 'TRAMOHE-2', 'TRAMOHE-10',
        'TRAMOCAP-FUTURE-B', 'TRAMOSPAREC', 'TRAMOSPARED', 'TRAMOSPAREE', 'TRAMOGE-12', 'TRAMOCAP-FUTURE-A', 'TRAMOSPAREB', 'TRAMOSPAREA', 'TRAMOGW-12', 'TRAMOBUSTIEA', 'TRAMOBUSTIEB',
        'TRAMOGE-6', 'TRAMOTR457S', 'TRAMOGE-7', 'TRAMOTR457N', 'TRAMOGE-5', 'TRAMOTR458N', 'TRAMOGE-4', 'TRAMOTR458S', 'TRAMOGW-6', 'TRAMOTR460S', 'TRAMOGW-5', 'TRAMOTR459N', 'TRAMOGW-4', 'TRAMOTR459S', 'TRAMOGW-7', 'TRAMOTR460N',
        'TRAMOGE-8', 'TRAMOGW-8', 'TRAMOTR-SCHEDULEA', 'TRAMOTR-SCHEDULEB', 'SCHEDULE-A', 'SCHEDULE-B',
        
        'TRAMO-UNIT-A', 'TRAMO-UNIT-B', 'TRAMO-UNIT-A-TR440', 'TRAMO-UNIT-B-TR440',
        'TRANSFORMER-A-TR444', 'TRANSFORMER-B-TR444', 'TRAMO-STATION-23',
        'TRANSFORMER-A-TR440', 'TRANSFORMER-B-TR440', 'TRAMO-STATION-23-EAST',

        'TRAMOWESTCAISSON', 'TRAMOTIE', 'TRAMOEASTCAISSON', 'TRAMO-TOWERWEST', 'TRAMO23-E7-23-W7-A', 'TRAMO-TOWEREAST', 
        'TRAMO-TOWERWEST2', 'TRAMO23-E8-23-W8', 'TRAMO-TOWEREAST2', 'TRAMON-10B', 'TRAMON-10', 'TRAMOANCHORAGE-A', 'TRAMO23-W4',
        'g26', 'g23', 'g5', 'g7', 'g4', 'g10', 'g13', 'g16', 'g30', 'COMPRESSOR_1', 'COMPRESSOR_2', 'g29', 'g27', 'g24',
        'path18132',

        'TRAMOGE-6A', 'TRAMOTR453S', 'TRAMOGE-6B', 'TRAMOTR449S', 'TRAMOGE-6C', 'TRAMOTR445S', 'TRAMOGE-6D', 'TRAMOTR441S', 'TRAMOGE-6E-GW-6E', 'TRAMOTR444S', 'TRAMOGW-6D', 'TRAMOTR448S', 'TRAMOGW-6C', 'TRAMOTR452S', 'TRAMOGW-6B', 'TRAMOTR456S', 'TRAMOGW-6A',
        'TRAMOGW-7A', 'TRAMOTR456N', 'TRAMOGW-7B', 'TRAMOTR452N', 'TRAMOGW-7C', 'TRAMOTR448N', 'TRAMOGW-7D', 'TRAMOTR444N', 'TRAMOGE-7E-GW-7E', 'TRAMOTR441N', 'TRAMOGE-7D', 'TRAMOTR445N', 'TRAMOGE-7C', 'TRAMOTR449N', 'TRAMOGE-7B', 'TRAMOTR453N', 'TRAMOGE-7A',
        'TRAMOGW-4A', 'TRAMOTR455S', 'TRAMOGW-4B', 'TRAMOTR451S', 'TRAMOGW-4C', 'TRAMOTR447S', 'TRAMOGW-4D', 'TRAMOTR443S', 'TRAMOGW-4E-GE-4E', 'TRAMOTR442S', 'TRAMOGE-4D', 'TRAMOTR446S', 'TRAMOGE-4C', 'TRAMOTR450S', 'TRAMOGE-4B', 'TRAMOTR454S', 'TRAMOGE-4A', 'TRAMOTR458S', 'TRAMOTR459S',
        'TRAMOGE-5A', 'TRAMOTR454N', 'TRAMOGE-5B', 'TRAMOTR450N', 'TRAMOGE-5C', 'TRAMOTR446N', 'TRAMOGE-5D', 'TRAMOTR442N', 'TRAMOGE-5E-GW-5E', 'TRAMOTR443N', 'TRAMOGW-5D', 'TRAMOTR447N', 'TRAMOGW-5C', 'TRAMOTR451N', 'TRAMOGW-5B', 'TRAMOTR455N', 'TRAMOGW-5A', 'TRAMOTR459N', 'TRAMOTR458N',
        
        'TR441S', 'TR441N', 'BARRATR441', 'TR442S', 'TR442N', 'BARRATR442', 'TR443S', 'TR443N', 'BARRATR443',
        'TR444S', 'TR444N', 'BARRATR444', 'TR445S', 'TR445N', 'BARRATR445', 'TR446S', 'TR446N', 'BARRATR446',
        'TR447S', 'TR447N', 'BARRATR447', 'TR448S', 'TR448N', 'BARRATR448', 'TR449S', 'TR449N', 'BARRATR449',
        'TR450S', 'TR450N', 'BARRATR450', 'TR451S', 'TR451N', 'BARRATR451', 'TR452S', 'TR452N', 'BARRATR452',
        'TR453S', 'TR453N', 'BARRATR453', 'TR454S', 'TR454N', 'BARRATR454', 'TR455S', 'TR455N', 'BARRATR455',
        'TR456S', 'TR456N', 'BARRATR456', 'TR457S', 'TR457N', 'BARRATR457', 'TR458S', 'TR458N', 'BARRATR458',
        'TR459S', 'TR459N', 'BARRATR459', 'TR460S', 'TR460N', 'BARRATR460',

        'BARRATR741', 'BARRATR745', 'BARRATR749', 'BARRATR753', 'BARRATR756', 'BARRATR752', 'BARRATR748', 'BARRATR744',
        'BARRATR743', 'BARRATR742', 'BARRATR747', 'BARRATR746', 'BARRATR751', 'BARRATR750', 'BARRATR755', 'BARRATR754',

        'RT-SUR-TR460', 'TT-SUR-TR460', 'RT-TR460-TR456', 'TT-TR460-TR456', 'RT-TR456-TR452', 'TT-TR456-TR452',
        'RT-TR452-TR448', 'TT-TR452-TR448', 'RT-TR448-TR444', 'TT-TR448-TR444', 'RT-NORTE-TR444', 'TT-NORTE-TR444',
        'RT-SUR-TR457', 'TT-SUR-TR457', 'RT-TR457-TR453', 'TT-TR457-TR453', 'RT-TR453-TR449', 'TT-TR453-TR449',
        'RT-TR449-TR445', 'TT-TR449-TR445', 'RT-TR445-TR441', 'TT-TR445-TR441', 'RT-NORTE-TR441', 'TT-NORTE-TR441',
        'TT-SUR-TR459', 'TT-TR459-TR455', 'TT-TR455-TR451', 'TT-TR451-TR447', 'TT-TR447-TR443', 'TT-NORTE-TR443',
        'RT-SUR-TR458', 'TT-SUR-TR458', 'RT-TR458-TR454', 'TT-TR458-TR454', 'RT-TR454-TR450', 'TT-TR454-TR450', 
        'RT-TR450-TR446', 'TT-TR450-TR446', 'RT-TR446-TR442', 'TT-TR446-TR442', 'RT-NORTE-TR442', 'TT-NORTE-TR442',

        'TRANSFERSUR', 'TURNTABLE-SOUTH', 'TRANSFERNORTE', 'TURNTABLE-NORTH'
    ];
    elementosAPintar.forEach(pintar);
};

// Función para limpiar OnClicks antiguos de Inkscape
function limpiarDobleClic(el) {
    el.removeAttribute('onclick'); el.onclick = null;
    var hijos = el.querySelectorAll('*');
    hijos.forEach(h => { h.removeAttribute('onclick'); h.onclick = null; });
}

window.inicializarEventosGatun = function() {
    
    Object.keys(window.configSelectores).forEach(function(selId) {
        var el = document.getElementById(selId);
        if (el) {
            limpiarDobleClic(el);
            el.style.cursor = 'pointer';
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                if(window.maniobraSelector) window.maniobraSelector(this);
            });
        }
    });

    interruptoresGatun.forEach(function(idItem) {
        var elemento = document.getElementById(idItem);
        if (elemento) {
            limpiarDobleClic(elemento);
            elemento.style.cursor = 'pointer';
            elemento.addEventListener('click', function(e) {
                e.stopPropagation();
                var t = this; var estAnt = t.getAttribute('data-estado') || 'DESACOPLADO';
                
                if (idItem === 'ITRAMOHE-10') {
                    var estTxt = (estAnt === 'CERRADO') ? '⚡ ACTIVADA' : '🔌 DESACTIVADA';
                    var op = prompt('🏢 CONTROL CENTRAL - TRAMOHE-10\nEstado actual: ' + estTxt + '\n\nSeleccione Acción:\n1: ACTIVAR ALIMENTACIÓN ⚡\n2: DESACTIVAR 🔌', estAnt === 'CERRADO' ? '2' : '1');
                    if (op === '1') { 
                        var culpableTierra = window.simularCierreParaSeguridad('ITRAMOHE-10');
                        if (culpableTierra) {
                            alert("⛔ OPERACIÓN BLOQUEADA\n\nNo se puede ACTIVAR la acometida TRAMOHE-10.\nLa maniobra inyectaría voltaje al tramo aislado (" + culpableTierra + ") que está ⚫ ATERRIZADO.");
                            return;
                        }
                        t.setAttribute('data-estado', 'CERRADO'); actualizarVisual(idItem, '#00FF00'); 
                    }
                    else if (op === '2') { t.setAttribute('data-estado', 'ABIERTO'); actualizarVisual(idItem, '#FF0000'); }
                    if (window.actualizarGatun) window.actualizarGatun();
                    return;
                }

                var op = prompt("MANIOBRA INTERRUPTOR: " + idItem + "\n" + ESTADOS[estAnt].label + "\n\nSELECCIONE POSICIÓN:\n1: CERRAR 🟢\n2: ABRIR 🔴\n3: DESACOPLAR ⚪ ", "2");
                var mapaEstados = { "1": "CERRADO", "2": "ABIERTO", "3": "DESACOPLADO" };

                if (mapaEstados[op]) {
                    var nuevoEst = mapaEstados[op]; var esValido = true; var mensajeError = "";
                    if (estAnt === nuevoEst) return;
                    if (estAnt === 'DESACOPLADO' && nuevoEst === 'CERRADO') { esValido = false; mensajeError = "⛔ OPERACIÓN NO PERMITIDA\n\nPrimero debe pasar a 🔴 ABIERTO."; }
                    if (estAnt === 'CERRADO' && nuevoEst === 'DESACOPLADO') { esValido = false; mensajeError = "⛔ OPERACIÓN NO PERMITIDA\n\nMantener secuencia de operación"; }

                    if (nuevoEst === 'CERRADO' && window.simularCierreParaSeguridad) {
                        var culpableTierra = window.simularCierreParaSeguridad(idItem);
                        if (culpableTierra) {
                            esValido = false;
                            mensajeError = "⛔ OPERACIÓN BLOQUEADA\n\nNo se puede CERRAR el interruptor " + idItem + ".\nCompletar esta maniobra inyectaría voltaje al tramo aislado asociado al equipo (" + culpableTierra + ") que está ⚫ ATERRIZADO.";
                        }
                    }

                    if (!esValido) { alert(mensajeError); } else {
                        t.setAttribute('data-estado', nuevoEst);
                        actualizarVisual(idItem, ESTADOS[nuevoEst].color);
                        if (window.actualizarGatun) window.actualizarGatun();
                    }
                }
            });
        }
    });

    seccionadoresGatun.forEach(function(idItem) {
        var elemento = document.getElementById(idItem);
        if (elemento) {
            limpiarDobleClic(elemento);
            elemento.style.cursor = 'pointer';
            elemento.addEventListener('click', function(e) {
                e.stopPropagation();
                if(window.maniobraSeccionador) window.maniobraSeccionador(this);
            });
        }
    });
};

// =============================================================================
// Función para pintar equipos (interruptores, seccionadores) según su estado
// Se llama al cargar la página
// =============================================================================
window.pintarEquipos = function () {
    var coloresPorEstado = {
        'CERRADO':    '#13c004ff',   // Verde
        'ABIERTO':    '#ffa500ff',   // Naranja
        'BLOQUEADO':  '#ff0000ff',   // Rojo
        'ATERRIZADO': '#000000ff',   // Negro
        'DESACOPLADO':'#808080ff'    // Gris
    };

    // Primero: buscar TODOS los elementos INT*, SE*, S*, etc. en el SVG
    var todosLosElementos = document.querySelectorAll('[id^="INT"], [id^="SE"], [id^="S"], [id^="ITR"], [id^="ITT"]');

    todosLosElementos.forEach(function(elemento) {
        var id = elemento.id;

        // Si no tiene data-estado, asignarlo por defecto
        if (!elemento.hasAttribute('data-estado')) {
            elemento.setAttribute('data-estado', 'ABIERTO');
        }

        var estado = elemento.getAttribute('data-estado');
        var color = coloresPorEstado[estado] || '#ffa500ff';

        // Aplicar color
        elemento.style.fill = color;
        elemento.setAttribute('fill', color);
    });

    // Segundo: iterar sobre todos los equipos del mapa de vecinos (redundante pero asegura cobertura)
    for (var id in window.mapaVecinos) {
        var el = document.getElementById(id);
        var rect = document.getElementById('rect_' + id);
        var elemento = el || rect;

        if (!elemento) continue;

        // Asegurar que tiene data-estado
        if (!elemento.hasAttribute('data-estado')) {
            elemento.setAttribute('data-estado', 'ABIERTO');
        }

        var estado = elemento.getAttribute('data-estado');
        var color = coloresPorEstado[estado] || '#ffa500ff';

        // Aplicar color
        elemento.style.fill = color;
        elemento.setAttribute('fill', color);
    }
};

window.pintarEquipos();
window.actualizarGatun();
window.inicializarEventosGatun();