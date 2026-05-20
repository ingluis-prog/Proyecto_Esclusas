// =============================================================================
// cerebro.js — Motor de simulación eléctrica: Esclusa de Pedro Miguel
// Se ejecuta automáticamente al cargar para inicializar handlers
// =============================================================================

// =============================================================================
// 1. RESETEAR EQUIPOS
// =============================================================================
var equiposReset = [
    // --- Fuentes y Cabeceras ---
    'IM7', 'IM17', 'IM18', 'IM8', 'IM15', 'IM19',
    'I6AP1E', 'I6BP1E', 'I2BP1E', 'I6AP1W', 'I6BP1W', 'I2BP1W',
    'I1AP1E', 'I1AP1W', 'I2AP1E', 'I2AP1W',
    'I4BP1E', 'I4BP1W', 'I1BP1E', 'I1BP1W', 'I7BP1E', 'I7AP1E', 'IE11',
    // TRAFOS Y ENLACES
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
    // Extensiones
    'IBUSTIE557', 'IBUSTIE561', 'IBUSTIE765', 'IBUSTIE565', 'IBUSTIE558', 'IBUSTIE766',
    'IBUSTIE566', 'IBUSTIE559', 'IBUSTIE767', 'IBUSTIE567', 'IBUSTIE560',
    'IBUSTIE564', 'IBUSTIE768', 'IBUSTIE568',
    // INTERRUPTORES RIELES (RT)
    'INTRIELES-RT-TR557', 'INTRIELES-RT-TR559', 'INTRIELES-RT-TR560', 
    'INTRIELES-RT-TR568', 'INTRIELES-RT-TR567', 'INTRIELES-RT-TR565',
    // INTERRUPTORES DE TRANSFERENCIA (TT)
    'INTRIELES-TT-TR557', 'INTRIELES-TT-TR561',
    'INTRIELES-TTS-TR561', 'INTRIELES-TTN-TR565',
    'INTRIELES-TTS-TR558', 'INTRIELES-TTN-TR562',
    'INTRIELES-TTS-TR562', 'INTRIELES-TTN-TR566',
    'INTRIELES-TTS-TR559', 'INTRIELES-TTN-TR553',
    'INTRIELES-TTS-TR563', 'INTRIELES-TTN-TR567','INTRIELES-TTN-TR563',
    'INTRIELES-TTS-TR560', 'INTRIELES-TTN-TR564',
    'INTRIELES-TTS-TR564', 'INTRIELES-TTS-TR568',
    // SEGMENTADOS (CON IP INTERMEDIO)
    'INTRIELES-TTN-TR558', 'INTRIELES-TTN-TR559', 'ITIE-TT-558-559',
    'INTRIELES-TTS-TR566', 'INTRIELES-TTS-TR567', 'ITIE-TT-566-567', 

    // --- RUTAS ANTERIORES ---
    'I3BP1E', 'I5BP1W', 'SE5', 'SE5A1', 'SE5A2', 'SE5B1', 'SE5B2', 'SE5C1', 'SE5C2', 'SE5-W5-TIE1', 'SE5-W5-TIE2',
    'SW51', 'SW5A2', 'SW5A1', 'SW5B2', 'SW5B1', 'SW5C2', 'SW5C1',
    'I5BP1E', 'I3BP1W', 'SE2', 'SE2A', 'SE2A2', 'SE2B1', 'SE2B2', 'SE2C1', 'SE2C2', 'SW2-E2-TIE1', 'SW2-E2-TIE2',
    'SW2C1', 'SW2C2', 'SW2B1', 'SW2B2', 'SW2A1', 'SW2A2', 'SW21',
    'I3AP1E', 'I5AP1W', 'SE9-1', 'SE9-W10-TIE1', 'SE9-W10-TIE2', 'SW10', 'SW10-2', 'SW10A', 'SW10A2', 'SW10-E9-TIE1', 'SW10-E9-TIE2', 'SE9A1', 'SE9A2', 'SE9-2', 'SE92',
    'I5AP1E', 'I3AP1W', 'SE10', 'SE10-W6-TIE1', 'SE10-W6-TIE2', 'SW6-1', 'SW6-2', 'SW6A-1', 'SW6A-2', 'SW6-E10-TIE1', 'SW6-E10-TIE2', 'SE10A-1', 'SE10A-2', 'SE10-1',
    'SEW4', 'SEW3', 'SFIREA', 'SEW3A', 'SEW4A', 'SFIREB',
    'SE12A', 'SW11A', 'SE12-PUMP-A', 'SE12B', 'SW11B', 'SE12-PUMP-B', 'SE12C', 'SW11C', 'SE12-PUMP-C', 'SE12D', 'SW11D', 'SE12-PUMP-D',
    'SE7', 'SNACOMPRESSOR', 'SW7', 'SSACOMPRESSOR'
];

// Base de Datos de Trafos
var trafosDB = [
    ['557', 'TRAMOS9', 'SE2557', ['TRAMO557N', 'TR557N', 'TR557NA', 'TR557NB'], 'ITR557N', 'TRAMOS1', 'SE5557', ['TR557S1', 'TR557S2', 'TR557S3', 'TR557S4'], 'ITR557S', ['TR557C', 'TR557D', 'TR557E', 'TR557F', 'TR557G', 'TR557H', 'TR557I', 'TR557J', 'TR557K', 'TR557L', 'TR557M', 'TR557N2', 'TR557S5']],
    ['561', 'TRAMOS10', 'SE2561', ['TR5611', 'TR5612', 'TR5613', 'TR5614'], 'ITR561N', 'TRAMOS2', 'SE5561', ['TR5615', 'TR5616', 'TR5617', 'TR5618'], 'ITR561S', ['TR561A', 'TR561B', 'TR561C', 'TR561D', 'TR561E', 'TR561F', 'TR561G', 'TR561H', 'TR561I', 'TR561J', 'TR561K', 'TR561L', 'TR561M']],
    ['565', 'TRAMOS11', 'SE2565', ['TR5651', 'TR5652', 'TR5653', 'TR5654'], 'ITR565N', 'TRAMOS2', 'SE5565', ['TR5655', 'TR5656', 'TR5657', 'TR5658'], 'ITR565S', ['TR565A', 'TR565B', 'TR565C', 'TR565D', 'TR565E', 'TR565F', 'TR565G', 'TR565H', 'TR565I', 'TR565J', 'TR565K', 'TR565L', 'TR565M']],
    ['568', 'TRAMOS14', 'SW2568', ['TR5681', 'TR5682', 'TR5683', 'TR5684'], 'ITR568N', 'TRAMOS6', 'SW5568', ['TR5685', 'TR5686', 'TR5687', 'TR5688'], 'ITR568S', ['TR568A', 'TR568B', 'TR568C', 'TR568D', 'TR568E', 'TR568F', 'TR568G', 'TR568H', 'TR568I', 'TR568J', 'TR568K']],
    ['564', 'TRAMOS15', 'SW2564', ['TR5641', 'TR5642', 'TR5643', 'TR5644'], 'ITR564N', 'TRAMOS7', 'SW5564', ['TR5645', 'TR5646', 'TR5647', 'TR5648'], 'ITR564S', ['TR564A', 'TR564B', 'TR564C', 'TR564D', 'TR564E', 'TR564F', 'TR564G', 'TR564H', 'TR564I', 'TR564J', 'TR564K', 'TR564L', 'TR564M']],
    ['560', 'TRAMOS16', 'SW2560', ['TR5601', 'TR5602', 'TR5603', 'TR5604'], 'ITR560N', 'TRAMOS8', 'SW5560', ['TR5605', 'TR5606', 'TR5607', 'TR5608'], 'ITR560S', ['TR560A', 'TR560B', 'TR560C', 'TR560D', 'TR560E', 'TR560F', 'TR560G', 'TR560H', 'TR560I', 'TR560J', 'TR560K', 'TR560L', 'TR560M']],
    ['559', 'TRAMOS18', 'SW10559', ['TR5591', 'TR5592', 'TR5593', 'TR5594'], 'ITR559N', 'TRAMOS24', 'SW6559', ['TR5595', 'TR5596', 'TR5597', 'TR5598'], 'ITR559S', ['TR559A', 'TR559B', 'TR559C', 'TR559D', 'TR559E', 'TR559F', 'TR559G', 'TR559H', 'TR559I', 'TR559J', 'TR559K', 'TR559L', 'TR559M']],
    ['558', 'TRAMOS17', 'SE9558', ['TR5581', 'TR5582', 'TR5583', 'TR5584'], 'ITR558N', 'TRAMOS23', 'SE10558', ['TR5585', 'TR5586', 'TR5587', 'TR5588'], 'ITR558S', ['TR558A', 'TR558B', 'TR558C', 'TR558D', 'TR558E', 'TR558F', 'TR558G', 'TR558H', 'TR558I', 'TR558J', 'TR558K', 'TR558L', 'TR558M']],
    ['563', 'TRAMOS19', 'SW10563', ['TR5631', 'TR5632', 'TR5633', 'TR5634'], 'ITR563N', 'TRAMOS25', 'SW6563', ['TR5635', 'TR5636', 'TR5637', 'TR5638'], 'ITR563S', ['TR563A', 'TR563B', 'TR563C', 'TR563D', 'TR563E', 'TR563F', 'TR563G', 'TR563H', 'TR563I', 'TR563J', 'TR563K', 'TR563L', 'TR563M', 'TR563N', 'TR563O', 'TR563P', 'TR563Q', 'TR563R']],
    ['562', 'TRAMOS22', 'SE9562', ['TR5621', 'TR5622', 'TR5623', 'TR5624'], 'ITR562N', 'TRAMOS28', 'SE10562', ['TR5625', 'TR5626', 'TR5627', 'TR5628'], 'ITR562S', ['TR562A', 'TR562B', 'TR562C', 'TR562D', 'TR562E', 'TR562F', 'TR562G', 'TR562H', 'TR562I', 'TR562J', 'TR562K', 'TR562L', 'TR562M', 'TR562N', 'TR562O', 'TR562P', 'TR562Q', 'TR562R']],
    ['567', 'TRAMOS20', 'SW10567', ['TR5671', 'TR5672', 'TR5673', 'TR5674'], 'ITR567N', 'TRAMOS26', 'SW6567', ['TR5675', 'TR5676', 'TR5677', 'TR5678'], 'ITR567S', ['TR567A', 'TR567B', 'TR567C', 'TR567D', 'TR567E', 'TR567F', 'TR567G', 'TR567H', 'TR567I', 'TR567J', 'TR567K', 'TR567L', 'TR567M']],
    ['566', 'TRAMOS21', 'SE9566', ['TR5661', 'TR5662', 'TR5663', 'TR5664'], 'ITR566N', 'TRAMOS27', 'SE10566', ['TR5665', 'TR5666', 'TR5667', 'TR5668'], 'ITR566S', ['TR566A', 'TR566B', 'TR566C', 'TR566D', 'TR566E', 'TR566F', 'TR566G', 'TR566H', 'TR566I', 'TR566J', 'TR566K']],
    ['761', 'TRAMOE2A', null, ['TR7611', 'TR7612', 'TR7613', 'TR7614'], 'ITR761N', 'TRAMOE5A', null, ['TR7615', 'TR7616', 'TR7617', 'TR7618'], 'ITR761S', ['TR761A', 'TR761B', 'TR761C', 'TR761D', 'TR761E', 'TR761F', 'TR761G', 'TR761H', 'TR761I', 'TR761J', 'TR761K', 'TR761L', 'TR761M', 'TR761N', 'TR761O', 'TR761P', 'TR761Q', 'TR761R', 'TR761S']],
    ['765', 'TRAMOE2B', null, ['TR7651', 'TR7652', 'TR7653', 'TR7654'], 'ITR765N', 'TRAMOE5B', null, ['TR7655', 'TR7656', 'TR7657', 'TR7658'], 'ITR765S', ['TR765A', 'TR765B', 'TR765C', 'TR765D', 'TR765E', 'TR765F', 'TR765G', 'TR765H', 'TR765I', 'TR765J', 'TR765K', 'TR765L', 'TR765M', 'TR765N']],
    ['762', 'TRAMOE92', null, ['TR7621', 'TR7622', 'TR7623', 'TR7624'], 'ITR762N', 'TRAMOE10-A', null, ['TR7625', 'TR7626', 'TR7627', 'TR7628'], 'ITR762S', ['TR762A', 'TR762B', 'TR762C', 'TR762D', 'TR762E', 'TR762F', 'TR762G', 'TR762H', 'TR762I', 'TR762J', 'TR762K', 'TR762L', 'TR762M', 'TR762N', 'TR762O', 'TR762P', 'TR762Q', 'TR762R', 'TR762S']],
    ['763', 'TRAMOW10', null, ['TR7631', 'TR7632', 'TR7633', 'TR7634'], 'ITR763N', 'TRAMOW6-3', null, ['TR7635', 'TR7636', 'TR7637', 'TR7638'], 'ITR763S', ['TR763A', 'TR763B', 'TR763C', 'TR763D', 'TR763E', 'TR763F', 'TR763G', 'TR763H', 'TR763I', 'TR763J', 'TR763K', 'TR763L', 'TR763M', 'TR763N', 'TR763O', 'TR763P', 'TR763Q', 'TR763R', 'TR763S']],
    ['766', 'TRAMOE9A', null, ['TR7661', 'TR7662', 'TR7663', 'TR7664'], 'ITR766N', 'TRAMOE10A', null, ['TR7665', 'TR7666', 'TR7667', 'TR7668'], 'ITR766S', ['TR766A', 'TR766B', 'TR766C', 'TR766D', 'TR766E', 'TR766F', 'TR766G', 'TR766H', 'TR766I', 'TR766J', 'TR766K', 'TR766L', 'TR766M', 'TR766N']],
    ['767', 'TRAMOW10A', null, ['TR7671', 'TR7672', 'TR7673', 'TR7674'], 'ITR767N', 'TRAMOW6A', null, ['TR7675', 'TR7676', 'TR7677', 'TR7678'], 'ITR767S', ['TR767A', 'TR767B', 'TR767C', 'TR767D', 'TR767E', 'TR767F', 'TR767G', 'TR767H', 'TR767I', 'TR767J', 'TR767K', 'TR767L', 'TR767M', 'TR767N']],
    ['768', 'TRAMOW2B', null, ['TR7681', 'TR7682', 'TR7683', 'TR7684'], 'ITR768N', 'TRAMOW5B', null, ['TR7685', 'TR7686', 'TR7687', 'TR7688'], 'ITR768S', ['TR768A', 'TR768B', 'TR768C', 'TR768D', 'TR768E', 'TR768F', 'TR768G', 'TR768H', 'TR768I', 'TR768J', 'TR768K', 'TR768L', 'TR768M', 'TR768N']],
    ['764', 'TRAMOW2A', null, ['TR7641', 'TR7642', 'TR7643', 'TR7644'], 'ITR764N', 'TRAMOW5A', null, ['TR7645', 'TR7646', 'TR7647', 'TR7648'], 'ITR764S', ['TR764A', 'TR764B', 'TR764C', 'TR764D', 'TR764E', 'TR764F', 'TR764G', 'TR764H', 'TR764I', 'TR764J', 'TR764K', 'TR764L', 'TR764M', 'TR764N', 'TR764O', 'TR764P', 'TR764Q', 'TR764R', 'TR764S']]
];

// Matriz de Extensiones
var extensionesDB = [
    ['IBUSTIE557', 'TR557D', 'TRAMOT557'],
    ['IBUSTIE561', 'TR561B', 'TRAMOT561'],
    ['IBUSTIE765', 'TR765B', 'TRAMOT765'],
    ['IBUSTIE565', 'TR565B', 'TRAMOT565'],
    ['IBUSTIE558', 'TR558B', 'TRAMOT558'],
    ['IBUSTIE766', 'TR766B', 'TRAMOT766'],
    ['IBUSTIE566', 'TR566B', 'TRAMOT566'],
    ['IBUSTIE559', 'TR559B', 'TRAMOT559'],
    ['IBUSTIE767', 'TR767B', 'TRAMOT767'],
    ['IBUSTIE567', 'TR567B', 'TRAMOT567'],
    ['IBUSTIE560', 'TR560B', 'TRAMOT560'],
    ['IBUSTIE564', 'TR564B', 'TRAMOT564'],
    ['IBUSTIE768', 'TR768B', 'TRAMOT768'],
    ['IBUSTIE568', 'TR568B', 'TRAMOT568']
];

// Matriz de Rieles Especiales (Color Violeta) [Interruptor, Fuente, ListaTramos]
var rielesDB = [
    ['INTRIELES-RT-TR557', 'TR557D', ['INTRIELES-RT-TR557A', 'INTRIELES-RT-TR557B', 'INTRIELES-RT-TR557C', 'INTRIELES-RT-TR557D']],
    ['INTRIELES-RT-TR559', 'TR559B', ['path7469','path8397','path8398','path8261','path8474','path8586','path8475','path8476','path8477','path8478','path8479','path8585','path8581','path8583','path8582']],
    ['INTRIELES-RT-TR560', 'TR560B', ['path8841','path8842']],
    ['INTRIELES-RT-TR568', 'TR568B', ['path8962','path8963','path8965']],
    ['INTRIELES-RT-TR567', 'TR567B', ['path6780','path8663','path8732','path8664','path8596','path8595','path8594','path8593','path8592','path8591','path8590','path8597','path8589','path8599','path8661','path8598']],
    ['INTRIELES-RT-TR565', 'TR565B', ['path7414','path8836','path8837','path8839','path8840','path8838']],
    
    // Mitades 558-559
    ['INTRIELES-TTN-TR558', 'TR558B', ['path8087','path8088','path8588','path8362','path8364','path8089','path8361','path8358','path8356','path8355']],
    ['INTRIELES-TTN-TR559', 'TR559B', ['path8351','path8350','path8349','path8348','path8265','path8263','path8262','path8264','path8587','path8223','path8224','path8222','path7480']],

    // Mitades 566-567 (NUEVO)
    ['INTRIELES-TTS-TR566', 'TR566B', ['path8116','path7571','path8189','path8190','path8117','path8120','path8119','path8118']],
    ['INTRIELES-TTS-TR567', 'TR567B', ['path8124','path8125','path8126','path8128','path8127','path8129','path8130','path8191','path7436']]
];

// === TRANSFERENCIA DE RIELES (TT) ===
// [Source1, Switch1, Source2, Switch2, [Tramos]]
var transferRailsDB = [
    ['TR557D', 'INTRIELES-TT-TR557', 'TR561B', 'INTRIELES-TT-TR561', ['path6545','path8737','path8738','path8739','path8741','path8742','path8743','path8744','path8745','path8746','path8747','path8748','path8749','path8750','path8751','path8752','path8753','path8754','path8755','path7381']],
    ['TR561B', 'INTRIELES-TTS-TR561', 'TR565B', 'INTRIELES-TTN-TR565', ['path7392','path8756','path8757','path8758','path8759','path8760','path8761','path8762','path8763','path8764','path8765','path8766','path8767','path8768','path8769','path8770','path8773','path8772','path7403']],
    ['TR558B', 'INTRIELES-TTS-TR558', 'TR562B', 'INTRIELES-TTN-TR562', ['path8090','path8091','path8092','path8093','path8094','path8095','path8096','path8097','path8098','path8099','path8100','path8101','path8102','path8103']],
    ['TR562B', 'INTRIELES-TTS-TR562', 'TR566B', 'INTRIELES-TTN-TR566', ['path8104','path8105','path8106','path8107','path8108','path8109','path8110','path8111','path8112','path8113','path8114','path8115']],
    ['TR566B', 'INTRIELES-TTS-TR559', 'TR563B', 'INTRIELES-TTN-TR563', ['path7491','path8221','path8220','path8219','path8218','path8217','path8216','path8215','path8214','path8213','path8212','path8211','path8210','path8209','path8208','path8207','path8206','path7447']],
    ['TR563B', 'INTRIELES-TTS-TR563', 'TR567B', 'INTRIELES-TTN-TR567', ['path7458','path8205','path8204','path8203','path8202','path8201','path8200','path8199','path8198','path8197','path8196','path8195','path8194','path8193','path8192','path7425']],
    ['TR560B', 'INTRIELES-TTS-TR560', 'TR564B', 'INTRIELES-TTN-TR564', ['path8930','path8931','path8933','path8934','path8935','path8936','path8937','path8938','path8939','path8940','path8941','path8942','path8943','path8944','path8945','path8946']],
    ['TR564B', 'INTRIELES-TTS-TR564', 'TR568B', 'INTRIELES-TTS-TR568', ['path8947','path8948','path8949','path8950','path8951','path8952','path8953','path8954','path8955','path8956','path8957','path8958','path8959','path8960','path8964']]
];

// === ENLACES ENTRE RIELES (SEGMENTADOS) ===
// [SwitchID, PathEndA, PathStartB]
var railTiesDB = [
    ['ITIE-TT-558-559', 'path8355', 'path8351'],
    ['ITIE-TT-566-567', 'path8118', 'path8124'] // <--- NUEVO
];

// Añadir equipos dinámicamente
trafosDB.forEach(function(g) {
    if(g[2]) equiposReset.push(g[2]); // Secc N
    equiposReset.push(g[4]); // Intr N
    if(g[6]) equiposReset.push(g[6]); // Secc S
    equiposReset.push(g[8]); // Intr S
});

equiposReset.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        el.setAttribute('data-estado', 'ABIERTO');
        var rect = document.getElementById("rect_" + id) || (el.children && el.children[0]) || el;
        if(rect && rect.style) { 
            rect.style.fill = '#ffa500ff'; 
            rect.setAttribute('fill', '#ffa500ff'); 
        }
    }
});

// =============================================================================
// 2. DEFINIR EL CEREBRO MAESTRO
// =============================================================================
window.actualizarTodaLaRed = function() {
    var tension = {};
    var estaCerrado = function(id) {
        var el = document.getElementById(id);
        return el && el.getAttribute('data-estado') === 'CERRADO';
    };

    // --- A. ENTRADAS Y BARRAS PRINCIPALES ---
    ['IM7','IM17','IM18','IM8','IM15','IM19'].forEach(function(x){ tension['TRAMO'+x.substring(1)] = estaCerrado(x); });

    var eE = (tension['TRAMOM7'] && estaCerrado('I6AP1E')) || (tension['TRAMOM17'] && estaCerrado('I6BP1E')) || (tension['TRAMOM18'] && estaCerrado('I2BP1E'));
    var eW = (tension['TRAMOM8'] && estaCerrado('I6AP1W')) || (tension['TRAMOM15'] && estaCerrado('I6BP1W')) || (tension['TRAMOM19'] && estaCerrado('I2BP1W'));
    
    var tie1 = estaCerrado('I1AP1E') && estaCerrado('I1AP1W');
    var tie2 = estaCerrado('I2AP1E') && estaCerrado('I2AP1W');
    if (tie1 || tie2) { var t = eE || eW; eE = t; eW = t; }
    if (eE && estaCerrado('I1AP1E') || eW && estaCerrado('I1AP1W')) tension['TRAMOE3W3TIE'] = true; 
    if (eE && estaCerrado('I2AP1E') || eW && estaCerrado('I2AP1W')) tension['TRAMOE4W4TIE'] = true; 

    tension['TRAMOBUSP1E'] = eE; tension['TRAMOBUSP1W'] = eW;

    // --- B. ALIMENTACIÓN CABECERAS ---
    if (tension['TRAMOBUSP1E'] && estaCerrado('I2AP1E')) tension['TRAMOEW4-1'] = true;
    if (tension['TRAMOBUSP1E'] && estaCerrado('I1AP1E')) tension['TRAMOEW3'] = true;
    if (tension['TRAMOBUSP1W'] && estaCerrado('I1AP1W')) tension['TRAMOEW3A'] = true;
    if (tension['TRAMOBUSP1W'] && estaCerrado('I2AP1W')) tension['TRAMOEW4A'] = true;
    if (tension['TRAMOBUSP1E'] && estaCerrado('I4BP1E')) tension['TRAMOE12A'] = true;
    if (tension['TRAMOBUSP1W'] && estaCerrado('I4BP1W')) tension['TRAMOW11A'] = true;
    if (tension['TRAMOBUSP1E'] && estaCerrado('I1BP1E')) tension['TRAMOE7'] = true;
    if (tension['TRAMOBUSP1W'] && estaCerrado('I1BP1W')) tension['TRAMOW7'] = true;
    if (tension['TRAMOBUSP1E'] && estaCerrado('I7BP1E')) tension['TRAMOF4'] = true;
    if (tension['TRAMOBUSP1E'] && estaCerrado('I7AP1E')) tension['TRAMOE11'] = true;
    if (tension['TRAMOE11'] && estaCerrado('IE11')) tension['TRAMOE11G'] = true;

    // --- C. RUTAS DE PROPAGACIÓN ---
    var rutas = [
        ['TRAMOBUSP1E', 'I3BP1E', 'TRAMOE5', 'SE5', 'TRAMOS1', 'SE5A1', 'TRAMOE5A', 'SE5A2', 'TRAMOS2', 'SE5B1', 'TRAMOE5B', 'SE5B2', 'TRAMOS3', 'SE5C1', 'TRAMOE5C', 'SE5C2', 'TRAMOS4', 'SE5-W5-TIE1', 'TRAMOE5-W5-TIE', 'SE5-W5-TIE2', 'TRAMOS5', 'SW5C1', 'TRAMOW5C', 'SW5C2', 'TRAMOS6', 'SW5B1', 'TRAMOW5B', 'SW5B2', 'TRAMOS7', 'SW5A1', 'TRAMOW5A', 'SW5A2', 'TRAMOS8', 'SW51', 'TRAMOW5', 'I5BP1W', 'TRAMOBUSP1W'],
        ['TRAMOBUSP1E', 'I5BP1E', 'TRAMOE2', 'SE2', 'TRAMOS9', 'SE2A', 'TRAMOE2A', 'SE2A2', 'TRAMOS10', 'SE2B1', 'TRAMOE2B', 'SE2B2', 'TRAMOS11', 'SE2C1', 'TRAMOE2C', 'SE2C2', 'TRAMOS12', 'SW2-E2-TIE1', 'TRAMOW2-E2-TIE', 'SW2-E2-TIE2', 'TRAMOS13', 'SW2C1', 'TRAMOW2C', 'SW2C2', 'TRAMOS14', 'SW2B1', 'TRAMOW2B', 'SW2B2', 'TRAMOS15', 'SW2A1', 'TRAMOW2A', 'SW2A2', 'TRAMOS16', 'SW21', 'TRAMOW2', 'I3BP1W', 'TRAMOBUSP1W'],
        ['TRAMOBUSP1E', 'I3AP1E', 'TRAMOE9', 'SE9-1', 'TRAMOS17', 'SE9-W10-TIE1', 'TRAMOE9-W10-TIE1', 'TRAMOE9-W10-TIE2', 'SE9-W10-TIE2', 'TRAMOS18', 'SW10', 'TRAMOW10', 'I5AP1W', 'TRAMOBUSP1W'],
        ['TRAMOBUSP1E', 'I3AP1E', 'TRAMOE92', 'SE92', 'TRAMOS22', 'SE9A2', 'TRAMOE9A', 'SE9A1', 'TRAMOS21', 'SW10-E9-TIE2', 'TRAMOW10-E9-TIE', 'SW10-E9-TIE1', 'TRAMOS20', 'SW10A2', 'TRAMOW10A', 'SW10A', 'TRAMOS19', 'SW10-2', 'TRAMOW10-2', 'I5AP1W', 'TRAMOBUSP1W'],
        ['TRAMOBUSP1E', 'I5AP1E', 'TRAMOE10', 'SE10', 'TRAMOS23', 'SE10-W6-TIE1', 'TRAMOE10-W6-TIE', 'SE10-W6-TIE2', 'TRAMOS24', 'SW6-1', 'TRAMOW6-1', 'I3AP1W', 'TRAMOBUSP1W'],
        ['TRAMOBUSP1E', 'I5AP1E', 'TRAMOE10-A', 'SE10-1', 'TRAMOS28', 'SE10A-2', 'TRAMOE10A', 'SE10A-1', 'TRAMOS27', 'SW6-E10-TIE2', 'TRAMOW6-E10-TIE', 'SW6-E10-TIE1', 'TRAMOS26', 'SW6A-2', 'TRAMOW6A', 'SW6A-1', 'TRAMOS25', 'SW6-2', 'TRAMOW6-2', 'I3AP1W', 'TRAMOBUSP1W'],
        ['TRAMOEW4-1', 'SEW4', 'TRAMOS29', 'SEW3', 'TRAMOEW3'], ['TRAMOS29', 'SFIREA', 'FIRE-A1'], 
        ['TRAMOEW3A', 'SEW3A', 'TRAMOS30', 'SEW4A', 'TRAMOEW4A'], ['TRAMOS30', 'SFIREB', 'FIRE-B1'],
        ['TRAMOE12A', 'SE12A', 'TRAMOS31', 'SW11A', 'TRAMOW11A'], ['TRAMOS31', 'SE12-PUMP-A', 'WTRPUMP-A1'],
        ['TRAMOE12B', 'SE12B', 'TRAMOS32', 'SW11B', 'TRAMOW11B'], ['TRAMOS32', 'SE12-PUMP-B', 'WTRPUMP-B1'],
        ['TRAMOE12C', 'SE12C', 'TRAMOS33', 'SW11C', 'TRAMOW11C'], ['TRAMOS33', 'SE12-PUMP-C', 'WTR-PUMP-C1'],
        ['TRAMOE12D', 'SE12D', 'TRAMOS34', 'SW11D', 'TRAMOW11D'], ['TRAMOS34', 'SE12-PUMP-D', 'WTR-PUMP-D1'],
        ['TRAMOE7', 'SE7', 'TRAMOS36', 'SNACOMPRESSOR', 'TRAMONORTHCOMPRESSOR'],
        ['TRAMOW7', 'SW7', 'TRAMOS35', 'SSACOMPRESSOR', 'TRAMOSOUTHCOMPRESSOR'],
        ['TRAMOE11', 'TRAMOE11A', 'TRAMOE11B', 'TRAMOE11C', 'TRAMOE11D', 'TRAMOE11E', 'TRAMOE11F', 'IE11'],
        ['IE11', 'TRAMOE11G', 'TRAMOE11H', 'TRAMOE11I', 'TRAMOE11J', 'TRAMOE11K', 'TRAMOE11L', 'TRAMOE11M']
    ];

    var prop = function(orig, dest) {
        var elD = document.getElementById(dest); if(!elD) return;
        if (dest.startsWith('S') || dest.startsWith('I')) { if(tension[orig] && estaCerrado(dest)) tension[dest]=true; }
        else { if(tension[orig]) tension[dest]=true; }
    };
    
    // Helpers
    var syncList = function(list) {
        var active = false; for(var i=0; i<list.length; i++) if(tension[list[i]]) { active=true; break; }
        if(active) list.forEach(function(x){ tension[x]=true; });
    };

    var sincronizarTodo = function() {
        syncList(['TRAMOE9','TRAMOE92']);
        syncList(['TRAMOW10','TRAMOW10-1','TRAMOW10-2']);
        syncList(['TRAMOE9-W10-TIE1','TRAMOE9-W10-TIE2']);
        syncList(['TRAMOE10','TRAMOE10-A']);
        syncList(['TRAMOW6-1','TRAMOW6-2','TRAMOW6-3']);
        syncList(['TRAMOEW4-1','TRAMOEW4-2','TRAMOEW4A','TRAMOE4W4TIE']);
        syncList(['TRAMOEW3','TRAMOEW3A','TRAMOE3W3TIE']);
        syncList(['FIRE-A1','FIRE-A2','FIRE-A3','FIRE-A4']);
        syncList(['FIRE-B1','FIRE-B2','FIRE-B3','FIRE-B4']);
        syncList(['TRAMOE12A','TRAMOE12B','TRAMOE12C','TRAMOE12D']);
        syncList(['TRAMOW11A','TRAMOW11B','TRAMOW11C','TRAMOW11D','TRAMOW11E','TRAMOW11F','TRAMOW11G','TRAMOW11H','TRAMOW11I']);
        for(var k=2;k<=6;k++) { 
            if(tension['WTRPUMP-A1']) tension['WTRPUMP-A'+k]=true; 
            if(tension['WTRPUMP-B1']) tension['WTRPUMP-B'+k]=true;
            if(tension['WTR-PUMP-C1']) tension['WTR-PUMP-C'+k]=true;
            if(tension['WTR-PUMP-D1']) tension['WTR-PUMP-D'+k]=true;
        }
        syncList(['TRAMOF4','TRAMOF41']);
        syncList(['TRAMOE11','TRAMOE11A','TRAMOE11B','TRAMOE11C','TRAMOE11D','TRAMOE11E','TRAMOE11F']);
        syncList(['TRAMOE11G','TRAMOE11H','TRAMOE11I','TRAMOE11J','TRAMOE11K','TRAMOE11L','TRAMOE11M']);
        
        // Sincronizar Extensiones
        extensionesDB.forEach(function(ext) {
             var root = ext[2];
             var parts = ['A','B','C','D','E'].map(function(L){ return root + L; });
             syncList(parts);
        });
        
        // Sincronizar Rieles
        rielesDB.forEach(function(r) { syncList(r[2]); });
        
        // Sincronizar Transferencias
        transferRailsDB.forEach(function(tt) { syncList(tt[4]); });
        
        // Sincronizar Trafos DB
        trafosDB.forEach(function(g) {
            syncList(g[3]); // Prim N
            syncList(g[7]); // Prim S
            syncList(g[9]); // Sec
        });
    };

    // --- D. BUCLE DE CÁLCULO ---
    for(var k=0; k<5; k++) {
        sincronizarTodo();
        rutas.forEach(function(ruta) {
            for(var m=0; m<ruta.length-1; m++) prop(ruta[m], ruta[m+1]);
            for(var m=ruta.length-1; m>0; m--) prop(ruta[m], ruta[m-1]);
        });
        
        // Lógica de Trafos
        trafosDB.forEach(function(g) {
            var srcN=g[1], discN=g[2], primN=g[3], intrN=g[4];
            var srcS=g[5], discS=g[6], primS=g[7], intrS=g[8];
            var sec=g[9];
            // N
            if (discN) { if (tension[srcN] && estaCerrado(discN)) tension[primN[0]] = true; if (tension[primN[0]] && estaCerrado(discN)) tension[srcN] = true; }
            else { if (tension[srcN]) tension[primN[0]] = true; if (tension[primN[0]]) tension[srcN] = true; }
            // S
            if (discS) { if (tension[srcS] && estaCerrado(discS)) tension[primS[0]] = true; if (tension[primS[0]] && estaCerrado(discS)) tension[srcS] = true; }
            else { if (tension[srcS]) tension[primS[0]] = true; if (tension[primS[0]]) tension[srcS] = true; }
            // Intrs
            var lastPN = primN[primN.length-1]; var lastPS = primS[primS.length-1]; var firstSec = sec[0];
            if (estaCerrado(intrN)) { if (tension[lastPN]) tension[firstSec] = true; if (tension[firstSec]) tension[lastPN] = true; }
            if (estaCerrado(intrS)) { if (tension[lastPS]) tension[firstSec] = true; if (tension[firstSec]) tension[lastPS] = true; }
        });

        // Lógica de Extensiones (IBUSTIE)
        extensionesDB.forEach(function(ext) {
            var tie = ext[0]; var src = ext[1]; var tgt = ext[2] + 'A';
            if (estaCerrado(tie)) { if (tension[src]) tension[tgt] = true; if (tension[tgt]) tension[src] = true; }
        });
        
        // Lógica de Rieles (RT)
        rielesDB.forEach(function(r) {
            var sw = r[0]; var src = r[1]; var segs = r[2];
            if (estaCerrado(sw)) {
                if (tension[src]) tension[segs[0]] = true;
                if (tension[segs[0]]) tension[src] = true;
            }
        });

        // Lógica de Transferencia (TT)
        transferRailsDB.forEach(function(tt) {
            var src1 = tt[0]; var sw1 = tt[1]; 
            var src2 = tt[2]; var sw2 = tt[3];
            var path = tt[4]; 
            // Lado 1
            if (estaCerrado(sw1)) {
                if (tension[src1]) tension[path[0]] = true;
                if (tension[path[0]]) tension[src1] = true;
            }
            // Lado 2
            if (estaCerrado(sw2)) {
                if (tension[src2]) tension[path[0]] = true;
                if (tension[path[0]]) tension[src2] = true;
            }
        });
        
        // Lógica de Enlaces entre Rieles (Rail Ties - Segmentados)
        railTiesDB.forEach(function(rt) {
            var tie = rt[0]; var segA = rt[1]; var segB = rt[2];
            if (estaCerrado(tie)) {
                if (tension[segA]) tension[segB] = true;
                if (tension[segB]) tension[segA] = true;
            }
        });

        sincronizarTodo();
    }

    // --- E. PINTAR ---
    var pintar = function(id) { 
        var el = document.getElementById(id); 
        if(el) { 
            var esTrafo = false;
            var esRiel = false;
            // Check Trafos
            for(var i=0; i<trafosDB.length; i++) {
                var g = trafosDB[i];
                if (g[3].includes(id) || g[7].includes(id) || g[9].includes(id)) { esTrafo=true; break; }
            }
            // Check Extensiones
            if (!esTrafo) {
                for(var j=0; j<extensionesDB.length; j++) {
                    if (id.startsWith(extensionesDB[j][2])) { esTrafo=true; break; }
                }
            }
            // Check Rieles (RT)
            for(var k=0; k<rielesDB.length; k++) {
                if (rielesDB[k][2].includes(id)) { esRiel=true; break; }
            }
            // Check Transferencias (TT)
            if (!esRiel) {
                for(var m=0; m<transferRailsDB.length; m++) {
                    if (transferRailsDB[m][4].includes(id)) { esRiel=true; break; }
                }
            }

            var colorOn = '#b2ec5d';
            if (esTrafo) colorOn = '#5d8eecff';
            if (esRiel) colorOn = '#9700d4ff';

            el.style.stroke = tension[id] ? colorOn : '#000000'; 
            el.style.strokeWidth = tension[id] ? '2' : '1'; 
        }
    };
    
    // Pintado General
    ['TRAMOM7','TRAMOM17','TRAMOM18','TRAMOM8','TRAMOM15','TRAMOM19','TRAMOBUSP1E','TRAMOBUSP1W'].forEach(pintar);
    rutas.forEach(function(ruta) { ruta.forEach(function(x){ if(x.startsWith('TRAMO') && !x.includes('BUS')) pintar(x); }); });

    // Pintar manuales extra
    ['TRAMOE92', 'TRAMOW10-1', 'TRAMOW10-2', 'TRAMOE9-W10-TIE1', 'TRAMOE9-W10-TIE2',
     'TRAMOE10-A', 'TRAMOW6-1', 'TRAMOW6-2', 'TRAMOW6-3',
     'TRAMOEW4-1', 'TRAMOEW4-2', 'TRAMOEW4A', 'TRAMOE4W4TIE', 'TRAMOEW3', 'TRAMOEW3A', 'TRAMOE3W3TIE',
     'FIRE-A2', 'FIRE-A3', 'FIRE-A4', 'FIRE-B2', 'FIRE-B3', 'FIRE-B4',
     'TRAMOE12B', 'TRAMOE12C', 'TRAMOE12D', 'TRAMOW11E', 'TRAMOW11F', 'TRAMOW11G', 'TRAMOW11H', 'TRAMOW11I',
     'WTRPUMP-A2', 'WTRPUMP-A3', 'WTRPUMP-A4', 'WTRPUMP-A5', 'WTRPUMP-A6',
     'WTRPUMP-B2', 'WTRPUMP-B3', 'WTRPUMP-B4', 'WTRPUMP-B5', 'WTRPUMP-B6',
     'WTR-PUMP-C2', 'WTR-PUMP-C3', 'WTR-PUMP-C4', 'WTR-PUMP-C5', 'WTR-PUMP-C6',
     'WTR-PUMP-D2', 'WTR-PUMP-D3', 'WTR-PUMP-D4', 'WTR-PUMP-D5', 'WTR-PUMP-D6',
     'TRAMOF4', 'TRAMOF41',
     'TRAMOE11A', 'TRAMOE11B', 'TRAMOE11C', 'TRAMOE11D', 'TRAMOE11E', 'TRAMOE11F',
     'TRAMOE11H', 'TRAMOE11I', 'TRAMOE11J', 'TRAMOE11K', 'TRAMOE11L', 'TRAMOE11M'
    ].forEach(pintar);

    // Pintar Trafos
    trafosDB.forEach(function(g) { g[3].forEach(pintar); g[7].forEach(pintar); g[9].forEach(pintar); });
    // Pintar Extensiones
    extensionesDB.forEach(function(ext) { var root = ext[2]; ['A','B','C','D','E'].forEach(function(L){ pintar(root + L); }); });
    // Pintar Rieles RT
    rielesDB.forEach(function(r) { r[2].forEach(pintar); });
    // Pintar Rieles TT
    transferRailsDB.forEach(function(tt) { tt[4].forEach(pintar); });
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

// =============================================================================
// Z. MAPA DE SEGURIDAD (INTERLOCKS) - 16 REGLAS
// =============================================================================
// [ID_INTERRUPTOR] : { tramo: 'TRAMO_A_PROTEGER', tierras: ['SDE_QUE_LO_ATERRIZA', ...] }
window.mapaInterlocks = {
    'ITR761N': { tramo: 'TRAMOE2A', tierras: ['SE2A', 'SE2A2'] },
    'ITR761S': { tramo: 'TRAMOE5A', tierras: ['SE5A1', 'SE5A2'] },
    'ITR765N': { tramo: 'TRAMOE2B', tierras: ['SE2B1', 'SE2B2'] },
    'ITR765S': { tramo: 'TRAMOE5B', tierras: ['SE5B1', 'SE5B2'] },
    'ITR762N': { tramo: 'TRAMOE92', tierras: ['SE92', 'SE9-1'] },
    'ITR762S': { tramo: 'TRAMOE10-A', tierras: ['SE10', 'SE10-1'] },
    'ITR766N': { tramo: 'TRAMOE9A', tierras: ['SE9A2', 'SE9A1'] },
    'ITR766S': { tramo: 'TRAMOE10A', tierras: ['SE10A-2', 'SE10A-1'] },
    'ITR763N': { tramo: 'TRAMOW10', tierras: ['SW10', 'SW10-2'] },
    'ITR763S': { tramo: 'TRAMOW6-3', tierras: ['SW6-2', 'SW6-1'] },
    'ITR767N': { tramo: 'TRAMOW10A', tierras: ['SW10A', 'SW10A2'] },
    'ITR767S': { tramo: 'TRAMOW6A', tierras: ['SW6A-2', 'SW6A-1'] },
    'ITR764N': { tramo: 'TRAMOW2A', tierras: ['SW2A2', 'SW2A1'] },
    'ITR764S': { tramo: 'TRAMOW5A', tierras: ['SW5A2', 'SW5A1'] },
    'ITR768N': { tramo: 'TRAMOW2B', tierras: ['SW2B2', 'SW2B1'] },
    'ITR768S': { tramo: 'TRAMOW5B', tierras: ['SW5B2', 'SW5B1'] }
};

window.pintarEquipos();
window.actualizarTodaLaRed();
console.log("Cerebro Pedro Miguel: inicializado");