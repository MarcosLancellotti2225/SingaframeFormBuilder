# Ficha de formulario

Herramienta para armar formularios a partir de un PDF y del JSON del cliente.

**Abrir la herramienta:** https://marcoslancellotti2225.github.io/SingaframeFormBuilder/

## Qué hace cada paso

0. **Nombres del PDF** — sube el PDF, propone nombres para cada casillero (AcroForm) y baja el PDF renombrado.
1. **JSON del cliente** — sube o pega el JSON de ejemplo y lo aplana en una fila por dato.
2. **Armar el formulario** — secciones y preguntas (con condiciones y ocultos), conectadas a sus casilleros del PDF y a su dato del JSON. Plantilla Excel de ida y vuelta para el cliente: *Bajar plantilla de preguntas*, editarla y volver a subirla.
3. **Probar** — el formulario funcionando, con el PDF llenándose en vivo y el JSON que sale. Desde acá se baja el PDF completado, el JSON y la ficha (.xlsx).

Trae un PDF y un JSON de ejemplo inventados para probarla sin datos reales.

## Privacidad

Los archivos se procesan en tu navegador, no se suben a ningún servidor. La página es estática (GitHub Pages) y solo descarga las librerías pdf.js, pdf-lib y ExcelJS desde CDN.

## Cómo actualizar

1. Crear una branch y reemplazar `index.html` por la versión nueva.
2. Abrir un PR a `main` y mergearlo.
3. GitHub Pages republica solo en uno o dos minutos (ver la pestaña *Actions* → *pages build and deployment*).

No commitear PDFs, JSON ni Excel de clientes: el `.gitignore` los bloquea.

## Técnico

Es una sola página (`index.html`) sin build: HTML, CSS y JS vanilla. Usa pdf.js 3.11.174 y pdf-lib 1.17.1 (cdnjs) y ExcelJS 4.4.0 (jsdelivr). `.nojekyll` hace que Pages sirva los archivos tal cual.
