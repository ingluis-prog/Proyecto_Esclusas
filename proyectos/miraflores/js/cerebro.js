// =============================================================================
// cerebro.js  —  Motor central del diagrama eléctrico
// Esclusa de Miraflores – Canal de Panamá
//
// Responsabilidades:
//   1. Datos de topología (mapaVecinos)
//   2. Reglas de seguridad (reglasTierra, reglasCierreSecc, reglasAperturaAnillo)
//   3. Función actualizarTodaLaRed() — propagación de tensión y pintado
// =============================================================================

// =============================================================================
// 1. TOPOLOGÍA FÍSICA (grafo de la red)
//    Cada clave es un equipo; el valor es [ladoA, ladoB] de los tramos que conecta.
// =============================================================================
window.mapaVecinos = {
    // --- ALIMENTADORES RADIALES (IRT) ---
    'IRT571': ['TRAMOTR571', 'TTTS'],
    'IRT585': ['TRAMOTR585', 'TTTN'],
    'IRT586': ['TRAMOTR586', 'TTTO'],
    'IRT574': ['TRAMOTR574', 'TTR574'],
    'IRT573': ['TRAMOTR573', 'TTTI'],

    // --- ENLACES SECCIONADOS (Topología con Central) ---
    'ITT572N': ['TRAMOTR572', 'TTTG'],
    'ITIETT-2': ['TTTG', 'TTTH'],
    'ITT573N': ['TTTH', 'TRAMOTR573'],
    'ITT584S': ['TRAMOTR584', 'TTTT'],
    'ITIETT':  ['TTTT', 'TTTM'],
    'ITT585S': ['TTTM', 'TRAMOTR585'],

    // --- ENLACES DIRECTOS ---
    'ITT575S': ['TRAMOTR575','TTTB'], 'ITT579N': ['TTTB','TRAMOTR579'],
    'ITT579S': ['TRAMOTR579','TTTC'], 'ITT583S': ['TTTC','TRAMOTR583'],
    'ITT584N': ['TRAMOTR584','TTTD'], 'ITT580S': ['TTTD','TRAMOTR580'],
    'ITT580N': ['TRAMOTR580','TTTE'], 'ITT576S': ['TTTE','TRAMOTR576'],
    'ITT576N': ['TRAMOTR576','TTTF'], 'ITT572S': ['TTTF','TRAMOTR572'],
    'ITT573S': ['TRAMOTR573','TTTJ'], 'ITT577N': ['TTTJ','TRAMOTR577'],
    'ITT577S': ['TRAMOTR577','TTTK'], 'ITT581N': ['TTTK','TRAMOTR581'],
    'ITT581S': ['TRAMOTR581','TTTL'], 'ITT585N': ['TTTL','TRAMOTR585'],
    'ITT586N': ['TRAMOTR586','TTTP'], 'ITT582S': ['TTTP','TRAMOTR582'],
    'ITT582N': ['TRAMOTR582','TTTQ'], 'ITT578S': ['TTTQ','TRAMOTR578'],
    'ITT578N': ['TRAMOTR578','TTTR'], 'ITT574S': ['TTTR','TRAMOTR574'],
    'ITT571S': ['TRAMOTR571','TTTA'], 'ITT575N': ['TTTA','TRAMOTR575'],

    // --- TR 500 ---
    'STR571N':['TRAMO571N','TR571N'], 'STR571S':['TRAMO571S','TR571S'], 'ITR571N':['TR571N','TRAMOTR571'], 'ITR571S':['TR571S','TRAMOTR571'], 'ITIETR571':['TRAMOTR571','TRAMOBUSTR571'],
    'STR572N':['TRAMO572N','TR572N'], 'STR572S':['TRAMO572S','TR572S'], 'ITR572N':['TR572N','TRAMOTR572'], 'ITR572S':['TR572S','TRAMOTR572'], 'ITIETR572':['TRAMOTR572','TRAMOBUSTR572'],
    'STR573N':['TRAMO573N','TR573N'], 'STR573S':['TRAMO573S','TR573S'], 'ITR573N':['TR573N','TRAMOTR573'], 'ITR573S':['TR573S','TRAMOTR573'], 'ITIETR573':['TRAMOTR573','TRAMOBUSTR573'],
    'STR574N':['TRAMO574N','TR574N'], 'STR574S':['TRAMO574S','TR574S'], 'ITR574N':['TR574N','TRAMOTR574'], 'ITR574S':['TR574S','TRAMOTR574'], 'ITIETR574':['TRAMOTR574','TRAMOBUSTR574'],
    'STR575N':['TRAMO575N','TR575N'], 'STR575S':['TRAMO575S','TR575S'], 'ITR575N':['TR575N','TRAMOTR575'], 'ITR575S':['TR575S','TRAMOTR575'], 'ITIETR575':['TRAMOTR575','TRAMOBUSTR575'],
    'STR576N':['TRAMO576N','TR576N'], 'STR576S':['TRAMO576S','TR576S'], 'ITR576N':['TR576N','TRAMOTR576'], 'ITR576S':['TR576S','TRAMOTR576'], 'ITIETR576':['TRAMOTR576','TRAMOBUSTR576'],
    'STR577N':['TRAMO577N','TR577N'], 'STR577S':['TRAMO577S','TR577S'], 'ITR577N':['TR577N','TRAMOTR577'], 'ITR577S':['TR577S','TRAMOTR577'], 'ITIETR577':['TRAMOTR577','TRAMOBUSTR577'],
    'STR578N':['TRAMO578N','TR578N'], 'STR578S':['TRAMO578S','TR578S'], 'ITR578N':['TR578N','TRAMOTR578'], 'ITR578S':['TR578S','TRAMOTR578'], 'ITIETR578':['TRAMOTR578','TRAMOBUSTR578'],
    'STR579N':['TRAMO579N','TR579N'], 'STR579S':['TRAMO579S','TR579S'], 'ITR579N':['TR579N','TRAMOTR579'], 'ITR579S':['TR579S','TRAMOTR579'], 'ITIETR579':['TRAMOTR579','TRAMOBUSTR579'],
    'STR580N':['TRAMO580N','TR580N'], 'STR580S':['TRAMO580S','TR580S'], 'ITR580N':['TR580N','TRAMOTR580'], 'ITR580S':['TR580S','TRAMOTR580'], 'ITIETR580':['TRAMOTR580','TRAMOBUSTR580'],
    'STR581N':['TRAMO581N','TR581N'], 'STR581S':['TRAMO581S','TR581S'], 'ITR581N':['TR581N','TRAMOTR581'], 'ITR581S':['TR581S','TRAMOTR581'], 'ITIETR581':['TRAMOTR581','TRAMOBUSTR581'],
    'STR582N':['TRAMO582N','TR582N'], 'STR582S':['TRAMO582S','TR582S'], 'ITR582N':['TR582N','TRAMOTR582'], 'ITR582S':['TR582S','TRAMOTR582'], 'ITIETR582':['TRAMOTR582','TRAMOBUSTR582'],
    'STR583N':['TRAMO583N','TR583N'], 'STR583S':['TRAMO583S','TR583S'], 'ITR583N':['TR583N','TRAMOTR583'], 'ITR583S':['TR583S','TRAMOTR583'], 'ITIETR583':['TRAMOTR583','TRAMOBUSTR583'],
    'STR584N':['TRAMO584N','TR584N'], 'STR584S':['TRAMO584S','TR584S'], 'ITR584N':['TR584N','TRAMOTR584'], 'ITR584S':['TR584S','TRAMOTR584'], 'ITIETR584':['TRAMOTR584','TRAMOBUSTR584'],
    'STR585N':['TRAMO585N','TR585N'], 'STR585S':['TRAMO585S','TR585S'], 'ITR585N':['TR585N','TRAMOTR585'], 'ITR585S':['TR585S','TRAMOTR585'], 'ITIETR585':['TRAMOTR585','TRAMOBUSTR585'],
    'STR586N':['TRAMO586N','TR586N'], 'STR586S':['TRAMO586S','TR586S'], 'ITR586N':['TR586N','TRAMOTR586'], 'ITR586S':['TR586S','TRAMOTR586'], 'ITIETR586':['TRAMOTR586','TRAMOBUSTR586'],

    // --- SECUNDARIOS 700 ---
    'ITR771N':['TRAMOTR771'], 'ITR771S':['TRAMOTR771'], 'ITIETR771':['TRAMOTR771','TRAMOBUSTR771'],
    'ITR772N':['TRAMOTR772'], 'ITR772S':['TRAMOTR772'], 'ITIETR772':['TRAMOTR772','TRAMOBUSTR772'],
    'ITR773N':['TRAMOTR773'], 'ITR773S':['TRAMOTR773'], 'ITIETR773':['TRAMOTR773','TRAMOBUSTR773'],
    'ITR774N':['TRAMOTR774'], 'ITR774S':['TRAMOTR774'], 'ITIETR774':['TRAMOTR774','TRAMOBUSTR774'],
    'ITR775N':['TRAMOTR775'], 'ITR775S':['TRAMOTR775'], 'ITIETR775':['TRAMOTR775','TRAMOBUSTR775'],
    'ITR776N':['TRAMOTR776'], 'ITR776S':['TRAMOTR776'], 'ITIETR776':['TRAMOTR776','TRAMOBUSTR776'],
    'ITR777N':['TRAMOTR777'], 'ITR777S':['TRAMOTR777'], 'ITIETR777':['TRAMOTR777','TRAMOBUSTR777'],
    'ITR778N':['TRAMOTR778'], 'ITR778S':['TRAMOTR778'], 'ITIETR778':['TRAMOTR778','TRAMOBUSTR778'],
    'ITR779N':['TRAMOTR779'], 'ITR779S':['TRAMOTR779'], 'ITIETR779':['TRAMOTR779','TRAMOBUSTR779'],
    'ITR780N':['TRAMOTR780'], 'ITR780S':['TRAMOTR780'], 'ITIETR780':['TRAMOTR780','TRAMOBUSTR780'],
    'ITR781N':['TRAMOTR781'], 'ITR781S':['TRAMOTR781'], 'ITIETR781':['TRAMOTR781','TRAMOBUSTR781'],
    'ITR782N':['TRAMOTR782'], 'ITR782S':['TRAMOTR782'], 'ITIETR782':['TRAMOTR782','TRAMOBUSTR782'],

    // --- PRIMARIOS ---
    'S-N11C': ['4WAY-BUSBAR-UPPER','TRAMOMTN11C'], 'SFIREPUMP-8': ['TRAMOMTN11C','TRAMOPUMPROOM'], 'SFIREPUMP-3': ['TRAMOPUMPROOM','PUMPROOM'],
    'SN7-S6B-TIE-2': ['TRAMO572N','TRAMO-N7-S6B-TIE'], 'SN7-S6B-TIE-1': ['TRAMO-N7-S6B-TIE','TRAMO573S'], 'SCAISSON-A': ['TRAMO-N7-S6B-TIE','TRAMOCAISSON'],
    'SCAISSON-B': ['TRAMOMTN7B','g52'], 'SCAISSON-C': ['TRAMOMTS6','g50'], 'SPMPW': ['TRAMOPUMPSTC','PMP'], 'SPMPSTAEAST': ['TRAMOPUMPSTA','PMPEAST'],
    'SPMP': ['TRAMOPUMPSTB','PMPCENTER'], 'SS12A-4': ['TRAMOMTS12A','TRAMOPUMPSTD'], 'SPMPSTB': ['TRAMOPUMPSTD','PMPSTA'], 'SSN9': ['TRAMOMTS9','TRAMOFIREPUMP'],
    'SFIREPUMP': ['TRAMOFIREPUMP','FIREPUMPA'], 'SS12A-1': ['TRAMOMTS12A','TRAMOPUMPSTA'], 'SS12A-2': ['TRAMOMTS12A','TRAMOPUMPSTB'], 'SS12A-3': ['TRAMOMTS12A','TRAMOPUMPSTC'],
    'SSN11-1': ['TRAMOPUMPSTA','TRAMOMTN11-2'], 'SSN11-2': ['TRAMOPUMPSTB','TRAMOMTN11-2'], 'SSN11-3': ['TRAMOPUMPSTC','TRAMOMTN11-2'], 'SSN11-4': ['TRAMOPUMPSTD','TRAMOMTN11-2'],
    'SS11': ['TRAMOMTS11'], 'SM20B': ['TRAMOMTM20','TRAMOBLDG'], 'SM20A': ['TRAMOMTM20','TRAMOTEST'], 'SBLDG': ['TRAMOBLDG','BLDG_50'],
    'STESTCABIA': ['TRAMOTEST','TEST2'], 'STESTCABIB': ['TRAMOTEST','TEST1'], 'SAIRCOMPRESSORPHASE1': ['TRAMOSWITCHPHASE1','AIRCOMPRESSORPHASE1'], 'SAIRCOMPRESSORPHASE2': ['TRAMOSWITCHPHASE2','AIRCOMPRESSORPHASE2'],
    'SN10': ['TRAMOMTN10','TRAMOSWITCHPHASE1'], 'STIEPHASE1': ['TRAMOSWITCHPHASE1','TRAMOTIE'], 'STIEPHASE2': ['TRAMOTIE','TRAMOSWITCHPHASE2'], 'SS11A': ['TRAMOSWITCHPHASE2','TRAMOMTS11A'],
    'SN9': ['TRAMO571S','TRAMOMTN9'], 'SN9FIREPUMP': ['TRAMOMTN9','TRAMOFIREPUMPEAST'], 'SFIREPUMPEAST': ['TRAMOFIREPUMPEAST','PUMPFIREEAST'], 'S-N11A': ['4WAY-BUSBAR-EAST','TRAMOMTN11A'],
    'SPMPA': ['TRAMOMTN11A','TRAMOPMPA'], 'SPMPSTA': ['TRAMOPMPA','g3'], 'SPMPB': ['TRAMOPMPA','g9'], 'SN5C-1': ['TRAMO582N','TRAMOMTN5C'], 'SN5C-2': ['TRAMOMTN5C','TRAMO586N'],
    'SDE5': ['TRAMOMTN5C','TRAMOMTDEB'], 'SDE6': ['TRAMOMTDEB','TRAMOTIE1'], 'SDE7': ['TRAMOTIE1','TRAMOMTDEA'], 'SDE8': ['TRAMOMTDEA','TRAMOMTS10'], 'SS10A': ['TRAMO586N','TRAMOMTS10'],
    'SS10': ['TRAMO583N','TRAMOMTS10'], 'SDE2': ['TRAMOMTS10','TRAMOMTDED'], 'S-N9': ['4WAY-BUSBAR-WEST','TRAMOMTN9B'], 'SN9-2': ['TRAMOMTN9B','TRAMO574S'], 'SS5C-1': ['TRAMO574S','TRAMOMTS5C'],
    'SS5C-2': ['TRAMOMTS5C','TRAMO578S'], 'SS5B-1': ['TRAMO578S','TRAMOMTS5B'], 'SS5B-2': ['TRAMOMTS5B','TRAMO582S'], 'SS5A-1': ['TRAMO582S','TRAMOMTS5A'], 'SS5A-2': ['TRAMOMTS5A','TRAMO586S'],
    'SS5': ['TRAMO586S','TRAMOMTS5'], 'S-OUT-N5': ['4WAY-BUSBAR-WEST','TRAMOMTN5-2'], 'SN5': ['TRAMOMTN5-2','TRAMO574N'], 'SN5A-1': ['TRAMO574N','TRAMOMTN5A'], 'SN5A-2': ['TRAMOMTN5A','TRAMO578N'],
    'SN5B-1': ['TRAMO578N','TRAMOMTN5B'], 'SN5B-2': ['TRAMOMTN5B','TRAMO582N'], 'SN7-2': ['TRAMOMTN7','TRAMO576N'], 'SN7A-1': ['TRAMO576N','TRAMOMTN7A'], 'SN7A-2': ['TRAMOMTN7A','TRAMO580N'],
    'SN7B-1': ['TRAMO580N','TRAMOMTN7B'], 'SN7B-2': ['TRAMOMTN7B','TRAMO584N'], 'SS6-N7B-TIE-1': ['TRAMO584N','TRAMO-S6-N7B-TIE'], 'SS6-N7B-TIE-2': ['TRAMO-S6-N7B-TIE','TRAMO585S'],
    'SS6-2': ['TRAMO585S','TRAMOMTS6'], 'S-N7': ['4WAY-BUSBAR-UPPER','TRAMOMTN7'], 'SN7-1': ['TRAMOMTN7','TRAMO572N'],
    'SS6B-1': ['TRAMO573S','TRAMOMTS6B'], 'SS6B-2': ['TRAMOMTS6B','TRAMO577S'], 'SS6A-1': ['TRAMO577S','TRAMOMTS6A'], 'SS6A-2': ['TRAMOMTS6A','TRAMO581S'],
    'SS6-1': ['TRAMO581S','TRAMOMTS6'], 'S-N6': ['4WAY-BUSBAR-UPPER','TRAMOMTN6'], 'SN6-2': ['TRAMOMTN6','TRAMO577N'], 'SN6A-1': ['TRAMO577N','TRAMOMTN6A'], 'SN6A-2': ['TRAMOMTN6A','TRAMO581N'],
    'SN6B-1': ['TRAMO581N','TRAMOMTN6B'], 'SN6B-2': ['TRAMOMTN6B','TRAMO585N'], 'SS7-N6B-TIE-2': ['TRAMO585N','TRAMO-S7-N6B-TIE'], 'SS7-N6B-TIE-1': ['TRAMO-S7-N6B-TIE','TRAMO584S'],
    'SS7-2': ['TRAMO584S','TRAMOMTS7'], 'SN6-1': ['TRAMOMTN6','TRAMO573N'], 'SN6-S7B-TIE-1': ['TRAMO573N','TRAMO-N6-S7B-TIE'], 'SN6-S7B-TIE-2': ['TRAMO-N6-S7B-TIE','TRAMO572S'],
    'SS7B-1': ['TRAMO572S','TRAMOMTS7B'], 'SS7B-2': ['TRAMOMTS7B','TRAMO576S'], 'SS7A-1': ['TRAMO576S','TRAMOMTS7A'], 'SS7A-2': ['TRAMOMTS7A','TRAMO580S'], 'SS7-1': ['TRAMO580S','TRAMOMTS7'],
    'S-IN-N11': ['TRAMOMTN11','4WAY-BUSBAR-EAST'], 'S-OUT-N11B': ['4WAY-BUSBAR-EAST','TRAMOMTN11B'], 'S-N11B': ['TRAMOMTN11B','4WAY-BUSBAR-UPPER'],
    'S-IN-N5': ['TRAMOMTN5','4WAY-BUSBAR-WEST'], 'SN8': ['TRAMOMTN8','TRAMO571N'], 'SN8A-1': ['TRAMO571N','TRAMOMTN8A'], 'SN8A-2': ['TRAMOMTN8A','TRAMO575N'], 'SN8B-1': ['TRAMO575N','TRAMOMTN8B'],
    'SN8B-2': ['TRAMOMTN8B','TRAMO579N'], 'SN8C-1': ['TRAMO579N','TRAMOMTN8C'], 'SN8C-2': ['TRAMOMTN8C','TRAMO583N'], 'SDE1': ['TRAMOMTDED','TRAMOTIE2'], 'SDE3': ['TRAMOTIE2','TRAMOMTDEC'],
    'SDE4': ['TRAMOMTDEC','TRAMOMTS8'], 'SS8': ['TRAMOMTS8','TRAMO583S'], 'SS8A-2': ['TRAMO583S','TRAMOMTS8A'], 'SS8A-1': ['TRAMOMTS8A','TRAMO579S'], 'SS8B-2': ['TRAMO579S','TRAMOMTS8B'],
    'SS8B-1': ['TRAMOMTS8B','TRAMO575S'], 'SS8C-2': ['TRAMO575S','TRAMOMTS8C'], 'SS8C-1': ['TRAMOMTS8C','TRAMO571S']
};

// =============================================================================
// 2. REGLAS DE SEGURIDAD — PUESTA A TIERRA
//    Mapea cada equipo con los tramos que quedan aterrizados cuando se pone a tierra.
// =============================================================================
window.reglasTierra = {
    'IRT571':['TTTS'], 'IRT585':['TTTN'], 'IRT586':['TTTO'], 'IRT574':['TTR574'], 'IRT573':['TTTI'],
    'ITT572N':['TTTG'], 'ITIETT-2':['TTTG','TTTH'], 'ITT573N':['TTTH'],
    'ITT584S':['TTTT'], 'ITIETT':['TTTT','TTTM'], 'ITT585S':['TTTM'],
    'ITT575S':['TTTB'], 'ITT579N':['TTTB'], 'ITT579S':['TTTC'], 'ITT583S':['TTTC'],
    'ITT584N':['TTTD'], 'ITT580S':['TTTD'], 'ITT580N':['TTTE'], 'ITT576S':['TTTE'],
    'ITT576N':['TTTF'], 'ITT572S':['TTTF'], 'ITT573S':['TTTJ'], 'ITT577N':['TTTJ'],
    'ITT577S':['TTTK'], 'ITT581N':['TTTK'], 'ITT581S':['TTTL'], 'ITT585N':['TTTL'],
    'ITT586N':['TTTP'], 'ITT582S':['TTTP'], 'ITT582N':['TTTQ'], 'ITT578S':['TTTQ'],
    'ITT578N':['TTTR'], 'ITT574S':['TTTR'], 'ITT571S':['TTTA'], 'ITT575N':['TTTA'],
    'STR571N':['TR571N'], 'STR571S':['TR571S'], 'ITR571N':['TRAMOTR571'], 'ITR571S':['TRAMOTR571'], 'ITIETR571':['TRAMOBUSTR571'],
    'STR572N':['TR572N'], 'STR572S':['TR572S'], 'ITR572N':['TRAMOTR572'], 'ITR572S':['TRAMOTR572'], 'ITIETR572':['TRAMOBUSTR572'],
    'STR573N':['TR573N'], 'STR573S':['TR573S'], 'ITR573N':['TRAMOTR573'], 'ITR573S':['TRAMOTR573'], 'ITIETR573':['TRAMOBUSTR573'],
    'STR574N':['TR574N'], 'STR574S':['TR574S'], 'ITR574N':['TRAMOTR574'], 'ITR574S':['TRAMOTR574'], 'ITIETR574':['TRAMOBUSTR574'],
    'STR575N':['TR575N'], 'STR575S':['TR575S'], 'ITR575N':['TRAMOTR575'], 'ITR575S':['TRAMOTR575'], 'ITIETR575':['TRAMOBUSTR575'],
    'STR576N':['TR576N'], 'STR576S':['TR576S'], 'ITR576N':['TRAMOTR576'], 'ITR576S':['TRAMOTR576'], 'ITIETR576':['TRAMOBUSTR576'],
    'STR577N':['TR577N'], 'STR577S':['TR577S'], 'ITR577N':['TRAMOTR577'], 'ITR577S':['TRAMOTR577'], 'ITIETR577':['TRAMOBUSTR577'],
    'STR578N':['TR578N'], 'STR578S':['TR578S'], 'ITR578N':['TRAMOTR578'], 'ITR578S':['TRAMOTR578'], 'ITIETR578':['TRAMOBUSTR578'],
    'STR579N':['TR579N'], 'STR579S':['TR579S'], 'ITR579N':['TRAMOTR579'], 'ITR579S':['TRAMOTR579'], 'ITIETR579':['TRAMOBUSTR579'],
    'STR580N':['TR580N'], 'STR580S':['TR580S'], 'ITR580N':['TRAMOTR580'], 'ITR580S':['TRAMOTR580'], 'ITIETR580':['TRAMOBUSTR580'],
    'STR581N':['TR581N'], 'STR581S':['TR581S'], 'ITR581N':['TRAMOTR581'], 'ITR581S':['TRAMOTR581'], 'ITIETR581':['TRAMOBUSTR581'],
    'STR582N':['TR582N'], 'STR582S':['TR582S'], 'ITR582N':['TRAMOTR582'], 'ITR582S':['TRAMOTR582'], 'ITIETR582':['TRAMOBUSTR582'],
    'STR583N':['TR583N'], 'STR583S':['TR583S'], 'ITR583N':['TRAMOTR583'], 'ITR583S':['TRAMOTR583'], 'ITIETR583':['TRAMOBUSTR583'],
    'STR584N':['TR584N'], 'STR584S':['TR584S'], 'ITR584N':['TRAMOTR584'], 'ITR584S':['TRAMOTR584'], 'ITIETR584':['TRAMOBUSTR584'],
    'STR585N':['TR585N'], 'STR585S':['TR585S'], 'ITR585N':['TRAMOTR585'], 'ITR585S':['TRAMOTR585'], 'ITIETR585':['TRAMOBUSTR585'],
    'STR586N':['TR586N'], 'STR586S':['TR586S'], 'ITR586N':['TRAMOTR586'], 'ITR586S':['TRAMOTR586'], 'ITIETR586':['TRAMOBUSTR586'],
    'ITR771N':['TRAMOTR771'], 'ITR771S':['TRAMOTR771'], 'ITIETR771':['TRAMOBUSTR771'],
    'ITR772N':['TRAMOTR772'], 'ITR772S':['TRAMOTR772'], 'ITIETR772':['TRAMOBUSTR772'],
    'ITR773N':['TRAMOTR773'], 'ITR773S':['TRAMOTR773'], 'ITIETR773':['TRAMOBUSTR773'],
    'ITR774N':['TRAMOTR774'], 'ITR774S':['TRAMOTR774'], 'ITIETR774':['TRAMOBUSTR774'],
    'ITR775N':['TRAMOTR775'], 'ITR775S':['TRAMOTR775'], 'ITIETR775':['TRAMOBUSTR775'],
    'ITR776N':['TRAMOTR776'], 'ITR776S':['TRAMOTR776'], 'ITIETR776':['TRAMOBUSTR776'],
    'ITR777N':['TRAMOTR777'], 'ITR777S':['TRAMOTR777'], 'ITIETR777':['TRAMOBUSTR777'],
    'ITR778N':['TRAMOTR778'], 'ITR778S':['TRAMOTR778'], 'ITIETR778':['TRAMOBUSTR778'],
    'ITR779N':['TRAMOTR779'], 'ITR779S':['TRAMOTR779'], 'ITIETR779':['TRAMOBUSTR779'],
    'ITR780N':['TRAMOTR780'], 'ITR780S':['TRAMOTR780'], 'ITIETR780':['TRAMOBUSTR780'],
    'ITR781N':['TRAMOTR781'], 'ITR781S':['TRAMOTR781'], 'ITIETR781':['TRAMOBUSTR781'],
    'ITR782N':['TRAMOTR782'], 'ITR782S':['TRAMOTR782'], 'ITIETR782':['TRAMOBUSTR782'],
    'SN8A-1':['TRAMOMTN8A'], 'SN8A-2':['TRAMOMTN8A'], 'SS8C-1':['TRAMOMTS8C'], 'SS8C-2':['TRAMOMTS8C'],
    'SN8B-1':['TRAMOMTN8B'], 'SN8B-2':['TRAMOMTN8B'], 'SS8B-1':['TRAMOMTS8B'], 'SS8B-2':['TRAMOMTS8B'],
    'SN8C-1':['TRAMOMTN8C'], 'SN8C-2':['TRAMOMTN8C'], 'SS8A-1':['TRAMOMTS8A'], 'SS8A-2':['TRAMOMTS8A'],
    'SN7-1':['TRAMOMTN7'], 'SN7-2':['TRAMOMTN7'], 'SS7B-1':['TRAMOMTS7B'], 'SS7B-2':['TRAMOMTS7B'],
    'SN6-1':['TRAMOMTN6'], 'SN6-2':['TRAMOMTN6'], 'SS6B-1':['TRAMOMTS6B'], 'SS6B-2':['TRAMOMTS6B'],
    'SN5A-1':['TRAMOMTN5A'], 'SN5A-2':['TRAMOMTN5A'], 'SS5C-1':['TRAMOMTS5C'], 'SS5C-2':['TRAMOMTS5C'],
    'SN7A-1':['TRAMOMTN7A'], 'SN7A-2':['TRAMOMTN7A'], 'SS7A-1':['TRAMOMTS7A'], 'SS7A-2':['TRAMOMTS7A'],
    'SN6A-1':['TRAMOMTN6A'], 'SN6A-2':['TRAMOMTN6A'], 'SS6A-1':['TRAMOMTS6A'], 'SS6A-2':['TRAMOMTS6A'],
    'SN5B-1':['TRAMOMTN5B'], 'SN5B-2':['TRAMOMTN5B'], 'SS5B-1':['TRAMOMTS5B'], 'SS5B-2':['TRAMOMTS5B'],
    'SN7B-1':['TRAMOMTN7B'], 'SN7B-2':['TRAMOMTN7B'], 'SS7-1':['TRAMOMTS7'], 'SS7-2':['TRAMOMTS7'],
    'SN6B-1':['TRAMOMTN6B'], 'SN6B-2':['TRAMOMTN6B'], 'SS6-1':['TRAMOMTS6'], 'SS6-2':['TRAMOMTS6'],
    'SN5C-1':['TRAMOMTN5C'], 'SN5C-2':['TRAMOMTN5C'], 'SS5A-1':['TRAMOMTS5A'], 'SS5A-2':['TRAMOMTS5A'],
    'SFIREPUMP-8':['TRAMOMTN11C'], 'SFIREPUMP-3':['PUMPROOM'], 'SCAISSON-A':['TRAMO-N7-S6B-TIE','TRAMOCAISSON'],
    'SN7-S6B-TIE-1':['TRAMO-N7-S6B-TIE'], 'SN7-S6B-TIE-2':['TRAMO-N7-S6B-TIE'], 'SCAISSON-C':['TRAMOMTS6','g50'],
    'SCAISSON-B':['TRAMOMTN7B','g52'], 'SPMPW':['PMP'], 'SPMP':['PMPCENTER'], 'SPMPSTAEAST':['PMPEAST'],
    'SPMPSTB':['PMPSTA'], 'SSN9':['TRAMOMTS9'], 'SFIREPUMP':['FIREPUMPA'], 'SS12A-1':['TRAMOMTS12A'],
    'SS12A-2':['TRAMOMTS12A'], 'SS12A-3':['TRAMOMTS12A'], 'SS12A-4':['TRAMOMTS12A'], 'SSN11-1':['TRAMOMTN11-2'],
    'SSN11-2':['TRAMOMTN11-2'], 'SSN11-3':['TRAMOMTN11-2'], 'SSN11-4':['TRAMOMTN11-2'], 'SS11':['TRAMOMTS11'],
    'SM20B':['TRAMOMTM20'], 'SBLDG':['BLDG_50'], 'SM20A':['TRAMOMTM20'], 'STESTCABIA':['TEST2'],
    'STESTCABIB':['TEST1'], 'SAIRCOMPRESSORPHASE1':['AIRCOMPRESSORPHASE1'], 'SAIRCOMPRESSORPHASE2':['AIRCOMPRESSORPHASE2'],
    'SN10':['TRAMOMTN10'], 'SS11A':['TRAMOMTS11A'], 'STIEPHASE1':['TRAMOTIE'], 'STIEPHASE2':['TRAMOTIE'],
    'SN9':['TRAMOMTN9'], 'SN9FIREPUMP':['TRAMOFIREPUMPEAST','TRAMOMTN9'], 'SFIREPUMPEAST':['PUMPFIREEAST'],
    'SPMPA':['TRAMOMTN11A'], 'S-N11A':['TRAMOMTN11A'], 'SPMPSTA':['g3'], 'SPMPB':['g9'], 'SDE5':['TRAMOMTN5C'],
    'SDE8':['TRAMOMTS10'], 'SS10A':['TRAMOMTS10'], 'SS10':['TRAMOMTS10'], 'SDE2':['TRAMOMTS10'], 'SDE6':['TRAMOTIE1'],
    'SDE7':['TRAMOTIE1'], 'SS5':['TRAMOMTS5'], 'S-N9':['TRAMOMTN9B'], 'SN9-2':['TRAMOMTN9B'], 'S-OUT-N5':['TRAMOMTN5-2'],
    'SN5':['TRAMOMTN5-2'], 'S-IN-N11':['TRAMOMTN11'], 'S-OUT-N11B':['TRAMOMTN11B'], 'S-N11B':['TRAMOMTN11B'],
    'S-N11C':['TRAMOMTN11C'], 'S-N7':['TRAMOMTN7'], 'S-N6':['TRAMOMTN6'], 'SN8':['TRAMOMTN8'], 'SDE1':['TRAMOTIE2'],
    'SDE3':['TRAMOTIE2'], 'SS6-N7B-TIE-1':['TRAMO-S6-N7B-TIE'], 'SS6-N7B-TIE-2':['TRAMO-S6-N7B-TIE'],
    'SS7-N6B-TIE-2':['TRAMO-S7-N6B-TIE'], 'SS7-N6B-TIE-1':['TRAMO-S7-N6B-TIE']
};

// =============================================================================
// 3. REGLAS DE CIERRE (INTERLOCKS)
//    Impide cerrar un equipo si un vecino está en estado prohibido.
// =============================================================================
window.reglasCierreSecc = {
    'IRT571':{ prohibidoSi:['STR571N','STR571S'], estadoProhibido:'ATERRIZADO' },
    'IRT585':{ prohibidoSi:['STR585N','STR585S'], estadoProhibido:'ATERRIZADO' },
    'IRT586':{ prohibidoSi:['STR586N','STR586S'], estadoProhibido:'ATERRIZADO' },
    'IRT574':{ prohibidoSi:['STR574N','STR574S'], estadoProhibido:'ATERRIZADO' },
    'IRT573':{ prohibidoSi:['STR573N','STR573S'], estadoProhibido:'ATERRIZADO' },
    'ITT572N':{ prohibidoSi:['STR572N','STR572S'], estadoProhibido:'ATERRIZADO' },
    'ITT573N':{ prohibidoSi:['STR573N','STR573S'], estadoProhibido:'ATERRIZADO' },
    'ITT584S':{ prohibidoSi:['STR584N','STR584S'], estadoProhibido:'ATERRIZADO' },
    'ITT585S':{ prohibidoSi:['STR585N','STR585S'], estadoProhibido:'ATERRIZADO' },
    'ITT575S':{ prohibidoSi:['STR575N','STR575S'], estadoProhibido:'ATERRIZADO' },
    'ITT579N':{ prohibidoSi:['STR579N','STR579S'], estadoProhibido:'ATERRIZADO' },
    'ITT579S':{ prohibidoSi:['STR579N','STR579S'], estadoProhibido:'ATERRIZADO' },
    'ITT583S':{ prohibidoSi:['STR583N','STR583S'], estadoProhibido:'ATERRIZADO' },
    'ITT584N':{ prohibidoSi:['STR584N','STR584S'], estadoProhibido:'ATERRIZADO' },
    'ITT580S':{ prohibidoSi:['STR580N','STR580S'], estadoProhibido:'ATERRIZADO' },
    'ITT580N':{ prohibidoSi:['STR580N','STR580S'], estadoProhibido:'ATERRIZADO' },
    'ITT576S':{ prohibidoSi:['STR576N','STR576S'], estadoProhibido:'ATERRIZADO' },
    'ITT576N':{ prohibidoSi:['STR576N','STR576S'], estadoProhibido:'ATERRIZADO' },
    'ITT572S':{ prohibidoSi:['STR572N','STR572S'], estadoProhibido:'ATERRIZADO' },
    'ITT573S':{ prohibidoSi:['STR573N','STR573S'], estadoProhibido:'ATERRIZADO' },
    'ITT577N':{ prohibidoSi:['STR577N','STR577S'], estadoProhibido:'ATERRIZADO' },
    'ITT577S':{ prohibidoSi:['STR577N','STR577S'], estadoProhibido:'ATERRIZADO' },
    'ITT581N':{ prohibidoSi:['STR581N','STR581S'], estadoProhibido:'ATERRIZADO' },
    'ITT581S':{ prohibidoSi:['STR581N','STR581S'], estadoProhibido:'ATERRIZADO' },
    'ITT585N':{ prohibidoSi:['STR585N','STR585S'], estadoProhibido:'ATERRIZADO' },
    'ITT586N':{ prohibidoSi:['STR586N','STR586S'], estadoProhibido:'ATERRIZADO' },
    'ITT582S':{ prohibidoSi:['STR582N','STR582S'], estadoProhibido:'ATERRIZADO' },
    'ITT582N':{ prohibidoSi:['STR582N','STR582S'], estadoProhibido:'ATERRIZADO' },
    'ITT578S':{ prohibidoSi:['STR578N','STR578S'], estadoProhibido:'ATERRIZADO' },
    'ITT578N':{ prohibidoSi:['STR578N','STR578S'], estadoProhibido:'ATERRIZADO' },
    'ITT574S':{ prohibidoSi:['STR574N','STR574S'], estadoProhibido:'ATERRIZADO' },
    'ITT571S':{ prohibidoSi:['STR571N','STR571S'], estadoProhibido:'ATERRIZADO' },
    'ITT575N':{ prohibidoSi:['STR575N','STR575S'], estadoProhibido:'ATERRIZADO' },
    'ITR571N':{ prohibidoSi:['STR571N'], estadoProhibido:'ATERRIZADO' }, 'ITR571S':{ prohibidoSi:['STR571S'], estadoProhibido:'ATERRIZADO' },
    'ITR572N':{ prohibidoSi:['STR572N'], estadoProhibido:'ATERRIZADO' }, 'ITR572S':{ prohibidoSi:['STR572S'], estadoProhibido:'ATERRIZADO' },
    'ITR573N':{ prohibidoSi:['STR573N'], estadoProhibido:'ATERRIZADO' }, 'ITR573S':{ prohibidoSi:['STR573S'], estadoProhibido:'ATERRIZADO' },
    'ITR574N':{ prohibidoSi:['STR574N'], estadoProhibido:'ATERRIZADO' }, 'ITR574S':{ prohibidoSi:['STR574S'], estadoProhibido:'ATERRIZADO' },
    'ITR575N':{ prohibidoSi:['STR575N'], estadoProhibido:'ATERRIZADO' }, 'ITR575S':{ prohibidoSi:['STR575S'], estadoProhibido:'ATERRIZADO' },
    'ITR576N':{ prohibidoSi:['STR576N'], estadoProhibido:'ATERRIZADO' }, 'ITR576S':{ prohibidoSi:['STR576S'], estadoProhibido:'ATERRIZADO' },
    'ITR577N':{ prohibidoSi:['STR577N'], estadoProhibido:'ATERRIZADO' }, 'ITR577S':{ prohibidoSi:['STR577S'], estadoProhibido:'ATERRIZADO' },
    'ITR578N':{ prohibidoSi:['STR578N'], estadoProhibido:'ATERRIZADO' }, 'ITR578S':{ prohibidoSi:['STR578S'], estadoProhibido:'ATERRIZADO' },
    'ITR579N':{ prohibidoSi:['STR579N'], estadoProhibido:'ATERRIZADO' }, 'ITR579S':{ prohibidoSi:['STR579S'], estadoProhibido:'ATERRIZADO' },
    'ITR580N':{ prohibidoSi:['STR580N'], estadoProhibido:'ATERRIZADO' }, 'ITR580S':{ prohibidoSi:['STR580S'], estadoProhibido:'ATERRIZADO' },
    'ITR581N':{ prohibidoSi:['STR581N'], estadoProhibido:'ATERRIZADO' }, 'ITR581S':{ prohibidoSi:['STR581S'], estadoProhibido:'ATERRIZADO' },
    'ITR582N':{ prohibidoSi:['STR582N'], estadoProhibido:'ATERRIZADO' }, 'ITR582S':{ prohibidoSi:['STR582S'], estadoProhibido:'ATERRIZADO' },
    'ITR583N':{ prohibidoSi:['STR583N'], estadoProhibido:'ATERRIZADO' }, 'ITR583S':{ prohibidoSi:['STR583S'], estadoProhibido:'ATERRIZADO' },
    'ITR584N':{ prohibidoSi:['STR584N'], estadoProhibido:'ATERRIZADO' }, 'ITR584S':{ prohibidoSi:['STR584S'], estadoProhibido:'ATERRIZADO' },
    'ITR585N':{ prohibidoSi:['STR585N'], estadoProhibido:'ATERRIZADO' }, 'ITR585S':{ prohibidoSi:['STR585S'], estadoProhibido:'ATERRIZADO' },
    'ITR586N':{ prohibidoSi:['STR586N'], estadoProhibido:'ATERRIZADO' }, 'ITR586S':{ prohibidoSi:['STR586S'], estadoProhibido:'ATERRIZADO' },
    'ITR771N':{ prohibidoSi:['SN8A-1','SN8A-2'], estadoProhibido:'ATERRIZADO' }, 'ITR771S':{ prohibidoSi:['SS8C-1','SS8C-2'], estadoProhibido:'ATERRIZADO' },
    'ITR772N':{ prohibidoSi:['SN7-1','SN7-2'],   estadoProhibido:'ATERRIZADO' }, 'ITR772S':{ prohibidoSi:['SS7B-1','SS7B-2'], estadoProhibido:'ATERRIZADO' },
    'ITR773N':{ prohibidoSi:['SN6-1','SN6-2'],   estadoProhibido:'ATERRIZADO' }, 'ITR773S':{ prohibidoSi:['SS6B-1','SS6B-2'], estadoProhibido:'ATERRIZADO' },
    'ITR774N':{ prohibidoSi:['SN5A-1','SN5A-2'], estadoProhibido:'ATERRIZADO' }, 'ITR774S':{ prohibidoSi:['SS5C-1','SS5C-2'], estadoProhibido:'ATERRIZADO' },
    'ITR775N':{ prohibidoSi:['SN8B-1','SN8B-2'], estadoProhibido:'ATERRIZADO' }, 'ITR775S':{ prohibidoSi:['SS8B-1','SS8B-2'], estadoProhibido:'ATERRIZADO' },
    'ITR776N':{ prohibidoSi:['SN7A-1','SN7A-2'], estadoProhibido:'ATERRIZADO' }, 'ITR776S':{ prohibidoSi:['SS7A-1','SS7A-2'], estadoProhibido:'ATERRIZADO' },
    'ITR777N':{ prohibidoSi:['SN6A-1','SN6A-2'], estadoProhibido:'ATERRIZADO' }, 'ITR777S':{ prohibidoSi:['SS6A-1','SS6A-2'], estadoProhibido:'ATERRIZADO' },
    'ITR778N':{ prohibidoSi:['SN5B-1','SN5B-2'], estadoProhibido:'ATERRIZADO' }, 'ITR778S':{ prohibidoSi:['SS5B-1','SS5B-2'], estadoProhibido:'ATERRIZADO' },
    'ITR779N':{ prohibidoSi:['SN8C-1','SN8C-2'], estadoProhibido:'ATERRIZADO' }, 'ITR779S':{ prohibidoSi:['SS8A-1','SS8A-2'], estadoProhibido:'ATERRIZADO' },
    'ITR780N':{ prohibidoSi:['SN7B-1','SN7B-2'], estadoProhibido:'ATERRIZADO' }, 'ITR780S':{ prohibidoSi:['SS7-1','SS7-2'],   estadoProhibido:'ATERRIZADO' },
    'ITR781N':{ prohibidoSi:['SN6B-1','SN6B-2'], estadoProhibido:'ATERRIZADO' }, 'ITR781S':{ prohibidoSi:['SS6-1','SS6-2'],   estadoProhibido:'ATERRIZADO' },
    'ITR782N':{ prohibidoSi:['SN5C-1','SN5C-2'], estadoProhibido:'ATERRIZADO' }, 'ITR782S':{ prohibidoSi:['SS5A-1','SS5A-2'], estadoProhibido:'ATERRIZADO' },
    'SN8A-1':{ prohibidoSi:['SN8A-2'], estadoProhibido:'ATERRIZADO' }, 'SN8A-2':{ prohibidoSi:['SN8A-1'], estadoProhibido:'ATERRIZADO' },
    'SS8C-1':{ prohibidoSi:['SS8C-2'], estadoProhibido:'ATERRIZADO' }, 'SS8C-2':{ prohibidoSi:['SS8C-1'], estadoProhibido:'ATERRIZADO' },
    'SN7-1':{ prohibidoSi:['SN7-2'], estadoProhibido:'ATERRIZADO' }, 'SN7-2':{ prohibidoSi:['SN7-1'], estadoProhibido:'ATERRIZADO' },
    'SS7B-1':{ prohibidoSi:['SS7B-2'], estadoProhibido:'ATERRIZADO' }, 'SS7B-2':{ prohibidoSi:['SS7B-1'], estadoProhibido:'ATERRIZADO' },
    'SN6-1':{ prohibidoSi:['SN6-2'], estadoProhibido:'ATERRIZADO' }, 'SN6-2':{ prohibidoSi:['SN6-1'], estadoProhibido:'ATERRIZADO' },
    'SS6B-1':{ prohibidoSi:['SS6B-2'], estadoProhibido:'ATERRIZADO' }, 'SS6B-2':{ prohibidoSi:['SS6B-1'], estadoProhibido:'ATERRIZADO' },
    'SN5A-1':{ prohibidoSi:['SN5A-2'], estadoProhibido:'ATERRIZADO' }, 'SN5A-2':{ prohibidoSi:['SN5A-1'], estadoProhibido:'ATERRIZADO' },
    'SS5C-1':{ prohibidoSi:['SS5C-2'], estadoProhibido:'ATERRIZADO' }, 'SS5C-2':{ prohibidoSi:['SS5C-1'], estadoProhibido:'ATERRIZADO' },
    'SN8B-1':{ prohibidoSi:['SN8B-2'], estadoProhibido:'ATERRIZADO' }, 'SN8B-2':{ prohibidoSi:['SN8B-1'], estadoProhibido:'ATERRIZADO' },
    'SS8B-1':{ prohibidoSi:['SS8B-2'], estadoProhibido:'ATERRIZADO' }, 'SS8B-2':{ prohibidoSi:['SS8B-1'], estadoProhibido:'ATERRIZADO' },
    'SN7A-1':{ prohibidoSi:['SN7A-2'], estadoProhibido:'ATERRIZADO' }, 'SN7A-2':{ prohibidoSi:['SN7A-1'], estadoProhibido:'ATERRIZADO' },
    'SS7A-1':{ prohibidoSi:['SS7A-2'], estadoProhibido:'ATERRIZADO' }, 'SS7A-2':{ prohibidoSi:['SS7A-1'], estadoProhibido:'ATERRIZADO' },
    'SN6A-1':{ prohibidoSi:['SN6A-2'], estadoProhibido:'ATERRIZADO' }, 'SN6A-2':{ prohibidoSi:['SN6A-1'], estadoProhibido:'ATERRIZADO' },
    'SS6A-1':{ prohibidoSi:['SS6A-2'], estadoProhibido:'ATERRIZADO' }, 'SS6A-2':{ prohibidoSi:['SS6A-1'], estadoProhibido:'ATERRIZADO' },
    'SN5B-1':{ prohibidoSi:['SN5B-2'], estadoProhibido:'ATERRIZADO' }, 'SN5B-2':{ prohibidoSi:['SN5B-1'], estadoProhibido:'ATERRIZADO' },
    'SS5B-1':{ prohibidoSi:['SS5B-2'], estadoProhibido:'ATERRIZADO' }, 'SS5B-2':{ prohibidoSi:['SS5B-1'], estadoProhibido:'ATERRIZADO' },
    'SN8C-1':{ prohibidoSi:['SN8C-2'], estadoProhibido:'ATERRIZADO' }, 'SN8C-2':{ prohibidoSi:['SN8C-1'], estadoProhibido:'ATERRIZADO' },
    'SS8A-1':{ prohibidoSi:['SS8A-2'], estadoProhibido:'ATERRIZADO' }, 'SS8A-2':{ prohibidoSi:['SS8A-1'], estadoProhibido:'ATERRIZADO' },
    'SN7B-1':{ prohibidoSi:['SN7B-2'], estadoProhibido:'ATERRIZADO' }, 'SN7B-2':{ prohibidoSi:['SN7B-1'], estadoProhibido:'ATERRIZADO' },
    'SS7-1':{ prohibidoSi:['SS7-2'], estadoProhibido:'ATERRIZADO' }, 'SS7-2':{ prohibidoSi:['SS7-1'], estadoProhibido:'ATERRIZADO' },
    'SN6B-1':{ prohibidoSi:['SN6B-2'], estadoProhibido:'ATERRIZADO' }, 'SN6B-2':{ prohibidoSi:['SN6B-1'], estadoProhibido:'ATERRIZADO' },
    'SS6-1':{ prohibidoSi:['SS6-2'], estadoProhibido:'ATERRIZADO' }, 'SS6-2':{ prohibidoSi:['SS6-1'], estadoProhibido:'ATERRIZADO' },
    'SN5C-1':{ prohibidoSi:['SN5C-2'], estadoProhibido:'ATERRIZADO' }, 'SN5C-2':{ prohibidoSi:['SN5C-1'], estadoProhibido:'ATERRIZADO' },
    'SS5A-1':{ prohibidoSi:['SS5A-2'], estadoProhibido:'ATERRIZADO' }, 'SS5A-2':{ prohibidoSi:['SS5A-1'], estadoProhibido:'ATERRIZADO' },
    'SCAISSON-A':{ prohibidoSi:['SN7-S6B-TIE-1','SN7-S6B-TIE-2'], estadoProhibido:'ATERRIZADO' },
    'SN7-S6B-TIE-1':{ prohibidoSi:['SCAISSON-A','SN7-S6B-TIE-2'], estadoProhibido:'ATERRIZADO' },
    'SN7-S6B-TIE-2':{ prohibidoSi:['SCAISSON-A','SN7-S6B-TIE-1'], estadoProhibido:'ATERRIZADO' },
    'SDE1':{ prohibidoSi:['SDE3'], estadoProhibido:'ATERRIZADO' }, 'SDE3':{ prohibidoSi:['SDE1'], estadoProhibido:'ATERRIZADO' },
    'STIEPHASE1':{ prohibidoSi:['STIEPHASE2'], estadoProhibido:'ATERRIZADO' }, 'STIEPHASE2':{ prohibidoSi:['STIEPHASE1'], estadoProhibido:'ATERRIZADO' },
    'SN9':{ prohibidoSi:['SN9FIREPUMP'], estadoProhibido:'ATERRIZADO' }, 'SN9FIREPUMP':{ prohibidoSi:['SN9'], estadoProhibido:'ATERRIZADO' },
    'SSN9':{ prohibidoSi:['SFIREPUMP'], estadoProhibido:'ATERRIZADO' },
    'SDE6':{ prohibidoSi:['SDE7'], estadoProhibido:'ATERRIZADO' }, 'SDE7':{ prohibidoSi:['SDE6'], estadoProhibido:'ATERRIZADO' },
    'SDE5':{ prohibidoSi:['SN5C-1','SN5C-2'], estadoProhibido:'ATERRIZADO' }
};

// =============================================================================
// 4. REGLAS DE APERTURA EN ANILLO
//    Previene aislar un tramo con carga sin abrir el interruptor ITR primero.
// =============================================================================
window.reglasAperturaAnillo = {
    'SN8A-1':{ pareja:'SN8A-2', itr:'ITR771N', tramo:'TRAMOMTN8A', tr:'TR771N' },
    'SN8A-2':{ pareja:'SN8A-1', itr:'ITR771N', tramo:'TRAMOMTN8A', tr:'TR771N' },
    'SS8C-1':{ pareja:'SS8C-2', itr:'ITR771S', tramo:'TRAMOMTS8C', tr:'TR771S' },
    'SS8C-2':{ pareja:'SS8C-1', itr:'ITR771S', tramo:'TRAMOMTS8C', tr:'TR771S' },
    'SN7-1':{ pareja:'SN7-2',  itr:'ITR772N', tramo:'TRAMOMTN7',  tr:'TR772N' },
    'SN7-2':{ pareja:'SN7-1',  itr:'ITR772N', tramo:'TRAMOMTN7',  tr:'TR772N' },
    'SS7B-1':{ pareja:'SS7B-2',itr:'ITR772S', tramo:'TRAMOMTS7B', tr:'TR772S' },
    'SS7B-2':{ pareja:'SS7B-1',itr:'ITR772S', tramo:'TRAMOMTS7B', tr:'TR772S' },
    'SN6-1':{ pareja:'SN6-2',  itr:'ITR773N', tramo:'TRAMOMTN6',  tr:'TR773N' },
    'SN6-2':{ pareja:'SN6-1',  itr:'ITR773N', tramo:'TRAMOMTN6',  tr:'TR773N' },
    'SS6B-1':{ pareja:'SS6B-2',itr:'ITR773S', tramo:'TRAMOMTS6B', tr:'TR773S' },
    'SS6B-2':{ pareja:'SS6B-1',itr:'ITR773S', tramo:'TRAMOMTS6B', tr:'TR773S' },
    'SN5A-1':{ pareja:'SN5A-2',itr:'ITR774N', tramo:'TRAMOMTN5A', tr:'TR774N' },
    'SN5A-2':{ pareja:'SN5A-1',itr:'ITR774N', tramo:'TRAMOMTN5A', tr:'TR774N' },
    'SS5C-1':{ pareja:'SS5C-2',itr:'ITR774S', tramo:'TRAMOMTS5C', tr:'TR774S' },
    'SS5C-2':{ pareja:'SS5C-1',itr:'ITR774S', tramo:'TRAMOMTS5C', tr:'TR774S' },
    'SN8B-1':{ pareja:'SN8B-2',itr:'ITR775N', tramo:'TRAMOMTN8B', tr:'TR775N' },
    'SN8B-2':{ pareja:'SN8B-1',itr:'ITR775N', tramo:'TRAMOMTN8B', tr:'TR775N' },
    'SS8B-1':{ pareja:'SS8B-2',itr:'ITR775S', tramo:'TRAMOMTS8B', tr:'TR775S' },
    'SS8B-2':{ pareja:'SS8B-1',itr:'ITR775S', tramo:'TRAMOMTS8B', tr:'TR775S' },
    'SN7A-1':{ pareja:'SN7A-2',itr:'ITR776N', tramo:'TRAMOMTN7A', tr:'TR776N' },
    'SN7A-2':{ pareja:'SN7A-1',itr:'ITR776N', tramo:'TRAMOMTN7A', tr:'TR776N' },
    'SS7A-1':{ pareja:'SS7A-2',itr:'ITR776S', tramo:'TRAMOMTS7A', tr:'TR776S' },
    'SS7A-2':{ pareja:'SS7A-1',itr:'ITR776S', tramo:'TRAMOMTS7A', tr:'TR776S' },
    'SN6A-1':{ pareja:'SN6A-2',itr:'ITR777N', tramo:'TRAMOMTN6A', tr:'TR777N' },
    'SN6A-2':{ pareja:'SN6A-1',itr:'ITR777N', tramo:'TRAMOMTN6A', tr:'TR777N' },
    'SS6A-1':{ pareja:'SS6A-2',itr:'ITR777S', tramo:'TRAMOMTS6A', tr:'TR777S' },
    'SS6A-2':{ pareja:'SS6A-1',itr:'ITR777S', tramo:'TRAMOMTS6A', tr:'TR777S' },
    'SN5B-1':{ pareja:'SN5B-2',itr:'ITR778N', tramo:'TRAMOMTN5B', tr:'TR778N' },
    'SN5B-2':{ pareja:'SN5B-1',itr:'ITR778N', tramo:'TRAMOMTN5B', tr:'TR778N' },
    'SS5B-1':{ pareja:'SS5B-2',itr:'ITR778S', tramo:'TRAMOMTS5B', tr:'TR778S' },
    'SS5B-2':{ pareja:'SS5B-1',itr:'ITR778S', tramo:'TRAMOMTS5B', tr:'TR778S' },
    'SN8C-1':{ pareja:'SN8C-2',itr:'ITR779N', tramo:'TRAMOMTN8C', tr:'TR779N' },
    'SN8C-2':{ pareja:'SN8C-1',itr:'ITR779N', tramo:'TRAMOMTN8C', tr:'TR779N' },
    'SS8A-1':{ pareja:'SS8A-2',itr:'ITR779S', tramo:'TRAMOMTS8A', tr:'TR779S' },
    'SS8A-2':{ pareja:'SS8A-1',itr:'ITR779S', tramo:'TRAMOMTS8A', tr:'TR779S' },
    'SN7B-1':{ pareja:'SN7B-2',itr:'ITR780N', tramo:'TRAMOMTN7B', tr:'TR780N' },
    'SN7B-2':{ pareja:'SN7B-1',itr:'ITR780N', tramo:'TRAMOMTN7B', tr:'TR780N' },
    'SS7-1':{ pareja:'SS7-2',  itr:'ITR780S', tramo:'TRAMOMTS7',  tr:'TR780S' },
    'SS7-2':{ pareja:'SS7-1',  itr:'ITR780S', tramo:'TRAMOMTS7',  tr:'TR780S' },
    'SN6B-1':{ pareja:'SN6B-2',itr:'ITR781N', tramo:'TRAMOMTN6B', tr:'TR781N' },
    'SN6B-2':{ pareja:'SN6B-1',itr:'ITR781N', tramo:'TRAMOMTN6B', tr:'TR781N' },
    'SS6-1':{ pareja:'SS6-2',  itr:'ITR781S', tramo:'TRAMOMTS6',  tr:'TR781S' },
    'SS6-2':{ pareja:'SS6-1',  itr:'ITR781S', tramo:'TRAMOMTS6',  tr:'TR781S' },
    'SN5C-1':{ pareja:'SN5C-2',itr:'ITR782N', tramo:'TRAMOMTN5C', tr:'TR782N' },
    'SN5C-2':{ pareja:'SN5C-1',itr:'ITR782N', tramo:'TRAMOMTN5C', tr:'TR782N' },
    'SS5A-1':{ pareja:'SS5A-2',itr:'ITR782S', tramo:'TRAMOMTS5A', tr:'TR782S' },
    'SS5A-2':{ pareja:'SS5A-1',itr:'ITR782S', tramo:'TRAMOMTS5A', tr:'TR782S' }
};

// =============================================================================
// 5. MOTOR DE PROPAGACIÓN Y PINTADO
// =============================================================================
window.actualizarTodaLaRed = function () {
    var tension    = {};
    var aterrizados = {};

    // Helpers de lectura de estado
    var estaCerrado = function (id) {
        var el   = document.getElementById(id);
        var rect = document.getElementById('rect_' + id);
        return (el   && el.getAttribute('data-estado')   === 'CERRADO') ||
               (rect && rect.getAttribute('data-estado') === 'CERRADO');
    };
    var estaAterrizado = function (id) {
        var el   = document.getElementById(id);
        var rect = document.getElementById('rect_' + id);
        return (el   && el.getAttribute('data-estado')   === 'ATERRIZADO') ||
               (rect && rect.getAttribute('data-estado') === 'ATERRIZADO');
    };

    // A. Detectar tierras activas
    for (var idSecc in window.mapaVecinos) {
        if (estaAterrizado(idSecc)) {
            var tramosRegla = window.reglasTierra[idSecc];
            if (tramosRegla) {
                tramosRegla.forEach(function (t) { aterrizados[t] = true; });
            } else {
                window.mapaVecinos[idSecc].forEach(function (t) {
                    var esBarra = t && (t.includes('BUSBAR') || t.includes('BARRASWITCHROOM') || t === 'TRAMOBUS');
                    if (!esBarra && t) aterrizados[t] = true;
                });
            }
        }
    }

    // B. Fuente principal y lista de conexiones [ladoA, interruptor, ladoB]
    tension['TRAMOBUS'] = true;
    var conexiones = [
        ['TRAMOBUS','INTM20','TRAMOMTM20'], ['TRAMOBUS','INTM13','TRAMOMTM13'],
        ['TRAMOBUS','INTM12','TRAMOMTM12'], ['TRAMOBUS','INTM11','TRAMOMTM11'],
        ['TRAMOBUS','INTM6','TRAMOMTM6'],   ['TRAMOBUS','INTM5','TRAMOMTM5'],
        ['TRAMOBUS','INTM4','TRAMOMTM4'],
        ['TRAMOMTM13','INT2B785N','BARRASWITCHROOM785N'],
        ['TRAMOMTM12','INT2A785N','BARRASWITCHROOM785N'],
        ['TRAMOMTM11','INT1A785N','BARRASWITCHROOM785N'],
        ['TRAMOMTM6','INT3B786S','BARRASWITCHROOM786S'],
        ['TRAMOMTM5','INT3A786S','BARRASWITCHROOM786S'],
        ['TRAMOMTM4','INT2A786S','BARRASWITCHROOM786S'],
        ['BARRASWITCHROOM785N','INT6B785N','TRAMOMTN11'],
        ['BARRASWITCHROOM785N','INT3A785N','TRAMOMTN5'],
        ['BARRASWITCHROOM785N','INT5A785N','TRAMOMTN10'],
        ['BARRASWITCHROOM785N','INT6A785N','TRAMOMTN12'],
        ['BARRASWITCHROOM785N','INT4B785N','TRAMOMTN8'],
        ['BARRASWITCHROOM785N','INT5B785N','TRAMOMTN9'],
        ['BARRASWITCHROOM785N','INT1B785N','TRAMOMT1B'],
        ['BARRASWITCHROOM786S','INT1A786S','TRAMOMTS11A'],
        ['BARRASWITCHROOM786S','INT4A786S','TRAMOMTS5'],
        ['BARRASWITCHROOM786S','INT5A786S','TRAMOMTS7'],
        ['BARRASWITCHROOM786S','INT6A786S','TRAMOMTS10'],
        ['BARRASWITCHROOM786S','INT7A786S','TRAMOMTS12'],
        ['BARRASWITCHROOM786S','INT1B786S','TRAMOMTS12A'],
        ['BARRASWITCHROOM786S','INT2B786S','TRAMOMT2B'],
        ['BARRASWITCHROOM786S','INT4B786S','TRAMOMTS6'],
        ['BARRASWITCHROOM786S','INT5B786S','TRAMOMTS8'],
        ['BARRASWITCHROOM786S','INT6B786S','TRAMOMTS9'],
        ['BARRASWITCHROOM786S','INT7B786S','TRAMOMTS11'],
        // Secundarios 700
        ['TR771N','ITR771N','TRAMOTR771'],['TR771S','ITR771S','TRAMOTR771'],['TRAMOTR771','ITIETR771','TRAMOBUSTR771'],
        ['TR772N','ITR772N','TRAMOTR772'],['TR772S','ITR772S','TRAMOTR772'],['TRAMOTR772','ITIETR772','TRAMOBUSTR772'],
        ['TR773N','ITR773N','TRAMOTR773'],['TR773S','ITR773S','TRAMOTR773'],['TRAMOTR773','ITIETR773','TRAMOBUSTR773'],
        ['TR774N','ITR774N','TRAMOTR774'],['TR774S','ITR774S','TRAMOTR774'],['TRAMOTR774','ITIETR774','TRAMOBUSTR774'],
        ['TR775N','ITR775N','TRAMOTR775'],['TR775S','ITR775S','TRAMOTR775'],['TRAMOTR775','ITIETR775','TRAMOBUSTR775'],
        ['TR776N','ITR776N','TRAMOTR776'],['TR776S','ITR776S','TRAMOTR776'],['TRAMOTR776','ITIETR776','TRAMOBUSTR776'],
        ['TR777N','ITR777N','TRAMOTR777'],['TR777S','ITR777S','TRAMOTR777'],['TRAMOTR777','ITIETR777','TRAMOBUSTR777'],
        ['TR778N','ITR778N','TRAMOTR778'],['TR778S','ITR778S','TRAMOTR778'],['TRAMOTR778','ITIETR778','TRAMOBUSTR778'],
        ['TR779N','ITR779N','TRAMOTR779'],['TR779S','ITR779S','TRAMOTR779'],['TRAMOTR779','ITIETR779','TRAMOBUSTR779'],
        ['TR780N','ITR780N','TRAMOTR780'],['TR780S','ITR780S','TRAMOTR780'],['TRAMOTR780','ITIETR780','TRAMOBUSTR780'],
        ['TR781N','ITR781N','TRAMOTR781'],['TR781S','ITR781S','TRAMOTR781'],['TRAMOTR781','ITIETR781','TRAMOBUSTR781'],
        ['TR782N','ITR782N','TRAMOTR782'],['TR782S','ITR782S','TRAMOTR782'],['TRAMOTR782','ITIETR782','TRAMOBUSTR782']
    ];

    // Añadir automáticamente todos los seccionadores del mapa de vecinos
    for (var id in window.mapaVecinos) {
        var par  = window.mapaVecinos[id];
        var ladoA = par[0];
        var ladoB = par[1] ? par[1] : ('PUNTO_CIEGO_' + id);
        conexiones.push([ladoA, id, ladoB]);
    }

    // C. Propagación iterativa (50 pasadas garantiza convergencia en redes complejas)
    var puentes = [
        {p:'TRAMOMTN8A',t:'TR771N'},{s:'TRAMOMTS8C',t:'TR771S'},{p:'TRAMOMTN7',t:'TR772N'},{s:'TRAMOMTS7B',t:'TR772S'},
        {p:'TRAMOMTN6',t:'TR773N'},{s:'TRAMOMTS6B',t:'TR773S'},{p:'TRAMOMTN5A',t:'TR774N'},{s:'TRAMOMTS5C',t:'TR774S'},
        {p:'TRAMOMTN8B',t:'TR775N'},{s:'TRAMOMTS8B',t:'TR775S'},{p:'TRAMOMTN7A',t:'TR776N'},{s:'TRAMOMTS7A',t:'TR776S'},
        {p:'TRAMOMTN6A',t:'TR777N'},{s:'TRAMOMTS6A',t:'TR777S'},{p:'TRAMOMTN5B',t:'TR778N'},{s:'TRAMOMTS5B',t:'TR778S'},
        {p:'TRAMOMTN8C',t:'TR779N'},{s:'TRAMOMTS8A',t:'TR779S'},{p:'TRAMOMTN7B',t:'TR780N'},{s:'TRAMOMTS7',t:'TR780S'},
        {p:'TRAMOMTN6B',t:'TR781N'},{s:'TRAMOMTS6',t:'TR781S'},{p:'TRAMOMTN5C',t:'TR782N'},{s:'TRAMOMTS5A',t:'TR782S'}
    ];

    for (var k = 0; k < 50; k++) {
        puentes.forEach(function (br) {
            var cable = br.p || br.s; var trafo = br.t;
            if (tension[cable] && !aterrizados[trafo]) tension[trafo] = true;
            if (tension[trafo] && !aterrizados[cable]) tension[cable] = true;
        });
        conexiones.forEach(function (link) {
            var a = link[0], sw = link[1], b = link[2];
            if (!a || !b || a === 'undefined' || b === 'undefined') return;
            if (estaCerrado(sw)) {
                if (tension[a] && !aterrizados[b]) tension[b] = true;
                if (tension[b] && !aterrizados[a]) tension[a] = true;
                if (aterrizados[b]) aterrizados[a] = true;
                if (aterrizados[a]) aterrizados[b] = true;
            }
        });
    }

    window.tensionGlobal   = tension;
    window.tierrasGlobal   = aterrizados;

    // D. Pintado de tramos energizados
    var pintar = function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var color = '#000000', width = '1';
        var esSecundario = id.includes('TR7') || id.includes('BUSTR7') ||
                           id.includes('TR5') || id.includes('BUSTR5') ||
                           id.startsWith('TTT') || id.startsWith('TTR');
        if (tension[id] && !aterrizados[id]) {
            color = esSecundario ? '#00b4f8ff' : '#FFC200';
            width = '2';
        }
        if (id === 'TRAMOBUS') { width = '4'; if (tension[id]) color = '#FFC200'; }
        el.style.stroke = color;
        el.style.strokeWidth = width;
        el.querySelectorAll('*').forEach(function (h) {
            h.style.stroke = color; h.style.strokeWidth = width;
        });
    };

    pintar('TRAMOBUS');
    conexiones.forEach(function (l) { pintar(l[0]); pintar(l[2]); });
    ['4WAY-BUSBAR-EAST','4WAY-BUSBAR-UPPER','4WAY-BUSBAR-WEST'].forEach(pintar);
    [
        'TR771N','TR771S','TR772N','TR772S','TR773N','TR773S','TR774N','TR774S',
        'TR775N','TR775S','TR776N','TR776S','TR777N','TR777S','TR778N','TR778S',
        'TR779N','TR779S','TR780N','TR780S','TR781N','TR781S','TR782N','TR782S',
        'TR571N','TR571S','TR572N','TR572S','TR573N','TR573S','TR574N','TR574S',
        'TR575N','TR575S','TR576N','TR576S','TR577N','TR577S','TR578N','TR578S',
        'TR579N','TR579S','TR580N','TR580S','TR581N','TR581S','TR582N','TR582S',
        'TR583N','TR583S','TR584N','TR584S','TR585N','TR585S','TR586N','TR586S'
    ].forEach(pintar);
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
