# Ficha de formulario

Herramienta para armar formularios a partir de un PDF y del JSON del cliente.

**Abrir la herramienta:** https://marcoslancellotti2225.github.io/SingaframeFormBuilder/

## Qué hace cada paso

0. **Nombres del PDF** — sube el PDF, propone nombres para cada casillero (AcroForm) y baja el PDF renombrado.
1. **JSON del cliente** — sube o pega el JSON de ejemplo y lo aplana en una fila por dato.
2. **Armar el formulario** — secciones y preguntas (con condiciones y ocultos), conectadas a sus casilleros del PDF y a su dato del JSON. Plantilla Excel de ida y vuelta para el cliente: *Bajar plantilla de preguntas*, editarla y volver a subirla.
3. **Probar** — el formulario funcionando, con el PDF llenándose en vivo y el JSON que sale. Desde acá se baja el PDF completado, el JSON y la ficha (.xlsx).

Trae un PDF y un JSON de ejemplo inventados para probarla sin datos reales.

## Plantilla de preguntas (Excel)

En el paso 2, «Bajar plantilla de preguntas» genera un Excel con el formato de `docs/plantilla_referencia_v12.xlsx`:

- **Preguntas** (la hoja de trabajo): una fila por pregunta (una fecha es una sola fila de tipo Fecha). Sección sale de una lista (se puede escribir una nueva) y Subsección es una lista que depende de la sección. **Ruta JSON** se elige de la lista del JSON cargado y «Valor en el JSON» muestra el dato de ejemplo (o «no está en el JSON»). Una ruta con `[i]` hace que la pregunta se repita. Cada sección tiene su color, aunque se agreguen filas al final. Tipo «Dato oculto» = no se le muestra a la persona; en Reglas / formato va el origen (Valor fijo / Viene del sistema / Se calcula). La columna **ID (no tocar)** conserva las conexiones al PDF y al JSON; las filas nuevas van sin ID.
- **JSON del cliente**: cada ruta del JSON cargado con su valor de ejemplo y si alguna pregunta ya la usa. Los arrays de varios elementos aparecen como `[i]`; los de uno solo, como `[0]`.
- **Cómo se completa**: ayuda fija, con la equivalencia con el machote del INS.
- **Listas** (oculta): secciones y subsecciones del machote más las del proyecto.

Al subirla, la herramienta agrupa siempre por Sección y Subsección (en el orden en que aparecen por primera vez; «Datos del sistema (oculto)» primero), así que una fila agregada al final de la hoja queda en su lugar. ¿Va? = No elimina la pregunta; una ruta que no está en el JSON da una advertencia; se muestra un resumen con actualizadas, nuevas, eliminadas y condiciones a revisar. También se pueden subir plantillas de los formatos anteriores.

Una pregunta Fecha conectada a 3 casilleros reparte día / mes / año (por el sufijo `_dia` / `_mes` / `_ano` o por orden, y se puede cambiar a mano en el editor). «En el PDF va partido en» (ej.: `código / número`) asigna cada casillero a una parte al conectarlos. El máximo de una pregunta repetible se define en el editor (por defecto, la cantidad de filas del PDF o 5).

## Privacidad

Los archivos se procesan en tu navegador, no se suben a ningún servidor. La página es estática (GitHub Pages) y solo descarga las librerías pdf.js, pdf-lib y ExcelJS desde CDN.

## Cómo actualizar

1. Crear una branch y reemplazar `index.html` por la versión nueva.
2. Abrir un PR a `main` y mergearlo.
3. GitHub Pages republica solo en uno o dos minutos (ver la pestaña *Actions* → *pages build and deployment*).

No commitear PDFs, JSON ni Excel de clientes: el `.gitignore` los bloquea.

## Técnico

Es una sola página (`index.html`) sin build: HTML, CSS y JS vanilla. Usa pdf.js 3.11.174 y pdf-lib 1.17.1 (cdnjs) y ExcelJS 4.4.0 (jsdelivr). `.nojekyll` hace que Pages sirva los archivos tal cual.
