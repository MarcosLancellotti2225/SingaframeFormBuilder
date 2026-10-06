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

En el paso 2, «Bajar plantilla de preguntas» genera un Excel con el formato de `docs/plantilla_referencia_v9_1.xlsx`:

- **Secciones**: Sección | Subsección | Oculta | Se repite hasta | Se muestra si | ¿Va? | Notas. El orden de las filas es el orden del formulario; la primera sección es siempre «Datos del sistema (oculto)». Oculta y Se muestra si de la **primera fila de cada sección** valen para toda la sección; en las filas siguientes valen para esa subsección. Se repite hasta convierte la subsección en un grupo repetible.
- **Preguntas**: una fila por pregunta (una fecha es una sola fila de tipo Fecha). Sección es una lista de la hoja Secciones y Subsección es una lista que depende de la sección elegida. Tipo «Dato oculto» = no se le muestra a la persona; en Reglas / formato va el origen (Valor fijo / Viene del sistema / Se calcula). La columna gris **ID (no tocar)** conserva las conexiones al PDF y al JSON; las filas nuevas van sin ID.
- **Equivalencias con su ficha**: tabla fija con la correspondencia con la ficha del INS.

Al subirla: el orden sale de las filas, ¿Va? = No elimina la pregunta (o la subsección con sus preguntas) y se muestra un resumen con actualizadas, nuevas, eliminadas y condiciones a revisar. También se puede subir una plantilla en el formato anterior.

Una pregunta Fecha conectada a 3 casilleros reparte día / mes / año (por el sufijo `_dia` / `_mes` / `_ano` o por orden, y se puede cambiar a mano en el editor). «En el PDF va partido en» (ej.: `código / número`) asigna cada casillero a una parte al conectarlos.

## Privacidad

Los archivos se procesan en tu navegador, no se suben a ningún servidor. La página es estática (GitHub Pages) y solo descarga las librerías pdf.js, pdf-lib y ExcelJS desde CDN.

## Cómo actualizar

1. Crear una branch y reemplazar `index.html` por la versión nueva.
2. Abrir un PR a `main` y mergearlo.
3. GitHub Pages republica solo en uno o dos minutos (ver la pestaña *Actions* → *pages build and deployment*).

No commitear PDFs, JSON ni Excel de clientes: el `.gitignore` los bloquea.

## Técnico

Es una sola página (`index.html`) sin build: HTML, CSS y JS vanilla. Usa pdf.js 3.11.174 y pdf-lib 1.17.1 (cdnjs) y ExcelJS 4.4.0 (jsdelivr). `.nojekyll` hace que Pages sirva los archivos tal cual.
