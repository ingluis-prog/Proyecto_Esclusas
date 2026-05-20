# ACP — Simulador de Esclusas Eléctricas

Simulador interactivo de los diagramas eléctricos unifilares de las tres esclusas principales del Canal de Panamá: **Miraflores**, **Gatún** y **Pedro Miguel**.

---

## 📋 Descripción General

Este proyecto proporciona una plataforma web para visualizar, simular y analizar los sistemas eléctricos de las esclusas del Canal de Panamá. Cada esclusa tiene su propio diagrama eléctrico interactivo con capacidades de:

- **Simulación de maniobras**: Cambiar el estado de interruptores y seccionadores
- **Propagación de tensión**: Ver cómo la energía se distribuye por la red
- **Panel de inspección**: Consultar datos técnicos e imágenes de equipos
- **Zoom y navegación**: Ampliar/reducir el diagrama y desplazarse por él
- **Normalización y reset**: Restaurar estados predefinidos de la planta

---

## 🏗️ Estructura del Proyecto

```
files/
├── index.html                          ← Página principal con selector de esclusas
├── general_src/
│   └── img/
│       └── acp_logo.png                ← Logo del Canal de Panamá
│
└── proyectos/                          ← Tres esclusas, cada una independiente
    ├── miraflores/
    │   ├── index.html                  ← Diagrama SVG completo embebido + UI
    │   ├── diagrama.svg                ← Backup del SVG original
    │   ├── css/
    │   │   └── panel-acp.css           ← Estilos del panel de inspección
    │   ├── js/
    │   │   ├── cerebro.js              ← Motor de simulación (topología, voltage)
    │   │   ├── handlers.js             ← Manejadores de clics en equipos
    │   │   ├── comandos.js             ← Comandos masivos (normalizar, reset)
    │   │   ├── panel.js                ← Panel lateral de inspección
    │   │   └── visor.js                ← Visor de imágenes (solo Miraflores)
    │   ├── img_general/
    │   │   └── icono-esclusas.png
    │   └── img_equipos/                ← Galería de imágenes por categoría
    │       ├── interruptores-bt/       ← Interruptores de baja tensión
    │       ├── interruptores-motor/    ← Interruptores de motor
    │       ├── seccionadores-tr/       ← Seccionadores de transformador
    │       ├── seccionadores-primarios/← Seccionadores primarios
    │       └── auxiliares/             ← Equipos auxiliares
    │
    ├── gatun/
    │   ├── index.html
    │   ├── diagrama.svg
    │   ├── css/panel-acp.css
    │   ├── js/
    │   │   ├── cerebro.js
    │   │   ├── comandos.js
    │   │   └── panel.js
    │   ├── img_general/
    │   └── img_equipos/
    │       ├── interruptores/          ← 51 imágenes placeholder
    │       ├── seccionadores/          ← 45 imágenes placeholder
    │       ├── transformadores/        ← 24 imágenes placeholder
    │       └── auxiliares/             ← 8 imágenes placeholder
    │
    └── pedro-miguel/
        ├── index.html
        ├── diagrama.svg
        ├── css/panel-acp.css
        ├── js/
        │   ├── cerebro.js
        │   ├── comandos.js
        │   └── panel.js
        ├── img_general/
        └── img_equipos/
            ├── interruptores/          ← 55 imágenes placeholder
            ├── seccionadores/          ← 42 imágenes placeholder
            ├── transformadores/        ← 40 imágenes placeholder
            └── auxiliares/             ← 8 imágenes placeholder
```

---

## 🚀 Cómo Usar

### Acceder al Simulador

1. Abre el archivo `index.html` en tu navegador
2. Verás la página principal con tres tarjetas de proyectos
3. Haz clic en cualquiera de las esclusas para abrir su diagrama

### Dentro de un Diagrama

#### **Botones de la Barra de Herramientas**
- **◀ (Atrás)**: Vuelve a la página principal
- **✅ Normalizar**: Restaura el estado inicial predeterminado de todos los equipos
- **🔄 Reset Total**: Apaga toda la planta (simula un corte de energía)
- **🔍 Inspeccionar**: Activa el modo inspección para consultar datos técnicos

#### **Interactuar con el Diagrama**

**Modo Maniobra** (por defecto):
- Haz clic en cualquier interruptor o seccionador para cambiar su estado
- Se abrirá un diálogo mostrando:
  - ID del equipo
  - Estado actual
  - Opciones para cambiar (CERRADO, ABIERTO, etc.)
- El sistema valida las transiciones permitidas y actualiza automáticamente la red

**Modo Inspección**:
- Presiona el botón 🔍 o la tecla **I**
- Haz clic en cualquier equipo para abrir el panel de inspección
- Verás:
  - **Imagen** del equipo (placeholder o real)
  - **ID** y **Tipo técnico**
  - **Datos técnicos**: Voltaje, corriente, capacidad, fabricante
  - **Categoría**: Tipo de equipo
  - **Estado actual**: Cerrado/Abierto/Desacoplado
  - **Circuitos conectados**: Equipos vecinos en la red
- Presiona **Escape** o haz clic en **✕** para cerrar el panel

#### **Controles de Zoom**
- **+** / **−** / **⟳**: Botones en la esquina inferior derecha
- **Ctrl + Rueda del ratón**: Zoom con el ratón
- **Doble clic**: No disponible (reservado para zoom/pan futura)

#### **Leyenda de Colores**
Los equipos se colorean según su estado:
- 🟢 **Verde** (#13c004): Cerrado
- 🟠 **Naranja** (#ffa500): Abierto
- 🔴 **Rojo** (#ff0000): Bloqueado (estado anómalo)
- ⚫ **Negro** (#000000): Aterrizado
- 🟡 **Amarillo** (#FFC200): Tramo energizado
- 🔵 **Azul** (#00b4f8): Secundario energizado

---

## 🔧 Características Técnicas

### Motor de Simulación (cerebro.js)

Cada proyecto tiene su propio `cerebro.js` que implementa:

1. **Topología de la Red**
   - `mapaVecinos` / `mapaVecinosGatun` / `mapaInterlocks`: Conectividad entre equipos
   - Arrays de equipos: Interruptores, seccionadores, transformadores
   - Datos de transformadores, extensiones, rieles

2. **Propagación de Tensión**
   - `actualizarTodaLaRed()` (Miraflores/Pedro Miguel)
   - `actualizarGatun()` (Gatún)
   - Recorre la topología partiendo de las fuentes
   - Marca cada equipo como energizado o desenergizado

3. **Validación de Maniobras**
   - Bloqueo de maniobras inválidas (ej: no pasar de CERRADO a DESACOPLADO sin pasar por ABIERTO)
   - Bloqueo de equipos en estado BLOQUEADO
   - Simulación de interlocks y protecciones

### Panel de Inspección (panel.js)

Implementación consistente en los tres proyectos:

1. **Búsqueda de Imágenes**
   - Busca en `img_equipos/{categoría}/{ID}.{ext}`
   - Intenta extensiones: png, jpg, jpeg, webp, svg
   - Fallback: Captura automática del SVG del diagrama

2. **Base de Datos Técnica**
   - `DATOS_TECNICOS._tipos`: Mapeo prefijo → especificaciones
   - `CARPETAS_CATEGORIA`: Mapeo tipo → carpeta de imágenes
   - `COLORES_ESTADO`: Colores por estado (Cerrado, Abierto, Desacoplado, etc.)

3. **Detección de Equipos**
   - Lee el `onclick` attribute o detecta por prefijo del ID
   - Miraflores: `maniobrarInterruptor()`, `maniobrarSeccionadorTR()`, `maniobrarSeccionador()`
   - Gatún: `maniobraSeccionador()`, `maniobraSelector()`
   - Pedro Miguel: Onclick inline con lógica directa

### Zoom (index.html de cada proyecto)

- Almacena `_zoomLevel` (rango: 0.25 a 4x)
- Cambia el ancho real del SVG en píxeles
- Habilita barras de desplazamiento automáticas en el contenedor

### Colores de Marca

- **Azul ACP**: `#003d82` (barra de navegación, botones)
- **Blanco**: `#ffffff` (fondo del diagrama, texto de contraste)
- **Gris de texto**: `#64748b`, `#94a3b8` (anotaciones, leyendas)

---

## 📸 Galería de Imágenes

Cada proyecto tiene **273 imágenes SVG placeholder** distribuidas por categoría:

### **Miraflores**
- `interruptores-bt/`: Interruptores de baja tensión (IRT5xx, ITT5xx, etc.)
- `interruptores-motor/`: Interruptores de motor (INT1Axx, INT2Axx, etc.)
- `seccionadores-tr/`: Seccionadores de transformador (ITIETR5xx, etc.)
- `seccionadores-primarios/`: Seccionadores primarios (S-Nxx, S-Sxx, etc.)
- `auxiliares/`: Bombas, compresores, caissons (SFIREPUMPx, SCAISSONx, etc.)

### **Gatún** (128 imágenes)
- `interruptores/`: IHE-x, IGE-x, IGW-x, ICAP-x, ITRxxx, ITTxxx, IT-x, IFUS-x
- `seccionadores/`: SGW-x, SGE-x, SHE-x, S23-x, SEL-x
- `transformadores/`: STRxxx, ITRxxx
- `auxiliares/`: SCAISSON, STOWER, SWEST, SEAST, SHE-10

### **Pedro Miguel** (145 imágenes)
- `interruptores/`: IM, I*P1E/W, IE, IBUSTIE, INTRIELES, ITIE-TT
- `seccionadores/`: SE, SW, SEW, SE12-PUMP
- `transformadores/`: ITR5xx, ITR7xx
- `auxiliares/`: SFIRE, SE12-PUMP, SNACOMP, SSACOMP

**Reemplazo**: Para usar imágenes reales, reemplaza los archivos `.svg` con `.png` o `.jpg` manteniendo el mismo nombre del equipo.

---

## 🎯 Estados de Equipos

### Estados Válidos

```
CERRADO    → Verde (#13c004) — Equipo está cerrado/conectado
ABIERTO    → Naranja (#ffa500) — Equipo abierto/desconectado
DESACOPLADO → Gris (#808080) — Equipo sin energía o desacoplado
BLOQUEADO  → Rojo (#ff0000) — Equipo en estado anómalo
ATERRIZADO → Negro (#000000) — Equipo puesto a tierra
```

### Transiciones Permitidas

Miraflores/Pedro Miguel (con restricciones de disciplina):
```
CERRADO ←→ ABIERTO ←→ DESACOPLADO
```
No se puede pasar directamente de CERRADO a DESACOPLADO (debe pasar por ABIERTO).

Gatún:
```
CERRADO ←→ ABIERTO ←→ DESACOPLADO
```
Mismo sistema de restricciones.

---

## 🛠️ Personalizaciones

### Cambiar Colores de Fondo

Edita el atributo `inkscape:deskcolor` en el `<svg>`:
```html
<!-- Cambiar de #ffffff (blanco) a otro color -->
<sodipodi:namedview 
   ...
   inkscape:deskcolor="#e8f4f8"  <!-- Azul muy claro -->
   ...
/>
```

### Agregar Nuevas Imágenes

1. Reemplaza los archivos `.svg` en `img_equipos/{categoría}/` con imágenes reales
2. Mantén el mismo nombre del equipo
3. Formatos soportados: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`

### Actualizar Datos Técnicos

En `js/panel.js` de cada proyecto, actualiza `DATOS_TECNICOS._tipos`:
```javascript
window.DATOS_TECNICOS = {
   _tipos: {
      'IRT': {
         tipo: 'Interruptor Radial BT',
         descripcion: 'Descripción del equipo',
         voltaje: '480V AC',
         corriente: '3,200A',
         capacidad: '65kA',
         fabricante: 'ABB / Eaton',
         categoria: 'Interruptor BT'
      },
      // ...
   }
}
```

### Personalizar Leyenda

En `index.html` de cada proyecto, edita la sección `<div id="leyenda">`:
```html
<div class="leyenda-item">
   <div class="dot" style="background:#13c004"></div> Cerrado
</div>
```

---

## 📝 Archivos Clave por Proyecto

### **cerebro.js**
- Define la topología eléctrica
- Implementa las funciones de maniobra
- Propaga la tensión por la red
- Valida transiciones de estado

**Funciones principales:**
- `window.maniobraInterruptor(el)` / `window.maniobraSeccionador(el)` — Maniobra
- `window.actualizarTodaLaRed()` — Recalcula tensión
- `window.normalizarPlanta()` — Restaura estado inicial
- `window.resetearPlanta()` — Apaga todo

### **panel.js**
- Gestiona el panel lateral de inspección
- Busca y carga imágenes de equipos
- Muestra datos técnicos
- Implementa el modo inspección

**Funciones principales:**
- `window.abrirPanelInspeccion(elemento)` — Abre el panel
- `window.cerrarPanelInspeccion()` — Cierra el panel
- `window.toggleModoInspeccion()` — Alterna modo inspección
- `_buscarImagenEquipo(id, categoria)` — Busca imagen con fallback

### **comandos.js**
- Contiene lógica de comandos masivos
- `window.normalizarPlanta()` — Estado inicial
- `window.resetearPlanta()` — Corte de energía

### **panel-acp.css**
- Estilos del panel de inspección
- Colores ACP (azul #003d82 + blanco)
- Diseño responsive

---

## 🌐 Navegación

**Página Principal** (`index.html`)
- 3 tarjetas de proyectos con iconos
- Navegación directa a cada esclusa

**Dentro de un Proyecto**
- Botón ◀ (atrás) para volver a inicio
- Menú de zoom en esquina inferior derecha
- Panel de inspección deslizable desde la derecha
- Toolbar superior con controles principales

---

## 🔗 Dependencias

- **HTML5 / CSS3 / JavaScript vanilla** (sin frameworks externos)
- **SVG embebido** para diagramas (sin fetch, compatible con `file://`)
- **CSS Grid** para layout de tarjetas

---

## 📖 Ejemplo de Flujo

1. **Usuario abre `index.html`** → Ve página de bienvenida con 3 tarjetas
2. **Hace clic en "Esclusa de Miraflores"** → Se abre `proyectos/miraflores/index.html`
3. **Diagrama carga** → `cerebro.js` inicializa la topología, `panel.js` prepara búsqueda de imágenes
4. **Hace clic en un interruptor** → Abre diálogo de maniobra
5. **Cambia estado** → `cerebro.js` valida y actualiza el diagrama, `actualizarTodaLaRed()` propaga tensión
6. **Presiona "I" o haz clic en 🔍** → Activa modo inspección
7. **Hace clic en un equipo** → `panel.js` abre el panel lateral con imagen + datos técnicos
8. **Presiona ◀** → Vuelve a `index.html`

---

## 📧 Notas

- **Compatibilidad**: Funciona en navegadores modernos (Chrome, Firefox, Edge, Safari)
- **Resolución**: Optimizado para pantallas de escritorio (1920×1080 o superior recomendado)
- **Archivos grandes**: Los `index.html` contienen SVGs embebidos completos (~180KB Miraflores, ~100KB Gatún/Pedro Miguel)
- **Offline**: Completamente funcional sin conexión a internet (archivos estáticos)

---

**Versión**: 1.0  
**Última actualización**: Abril 2026  
**Desarrollador**: Claude Haiku 4.5  
**Licencia**: Autoridad del Canal de Panamá
