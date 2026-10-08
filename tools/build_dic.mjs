#!/usr/bin/env node
// Regenera la constante DIC de index.html a partir del Diccionario General del INS.
//
//   node tools/build_dic.mjs [docs/diccionario_v4.xlsx] [index.html]
//
// Lee la hoja «Diccionario General» (columnas: Paso, Sección, Visible, Nombre del campo en el PDF,
// Variables o Sinónimos, Nombre formularios WEB, …, Ruta JSON completa) y reemplaza lo que está
// entre /*DIC:BEGIN*/ y /*DIC:END*/ en index.html. Sin dependencias: solo Node (zlib + fs).
import { readFileSync, writeFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const [xlsxPath = "docs/diccionario_v4.xlsx", htmlPath = "index.html"] = process.argv.slice(2);
const SHEET = "Diccionario General";

/* ── zip mínimo: directorio central + inflate ── */
function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("No es un .xlsx válido (zip sin directorio central)");
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    files[name] = method === 8 ? inflateRawSync(raw) : raw;
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

/* ── XML mínimo ── */
const ent = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, "&");
const texts = xml => [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(m => ent(m[1])).join("");
const colIdx = ref => [...ref.replace(/\d+/g, "")].reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;

const files = unzip(readFileSync(xlsxPath));
const str = k => (files[k] ? files[k].toString("utf8") : "");
const shared = [...str("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => texts(m[1]));
const wbXml = str("xl/workbook.xml"), rels = str("xl/_rels/workbook.xml.rels");
const sheetTag = [...wbXml.matchAll(/<sheet\b[^>]*>/g)].map(m => m[0]).find(t => ent((t.match(/name="([^"]*)"/) || [])[1] || "") === SHEET);
if (!sheetTag) throw new Error(`No encontré la hoja «${SHEET}»`);
const rid = sheetTag.match(/r:id="([^"]+)"/)[1];
const target = rels.match(new RegExp(`<Relationship\\b[^>]*Id="${rid}"[^>]*>`))[0].match(/Target="([^"]+)"/)[1];
const sheetXml = str("xl/" + target.replace(/^\/?xl\//, ""));

const rows = [...sheetXml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map(m => {
  const out = [];
  for (const c of m[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const attrs = c[1], body = c[2] || "";
    const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
    const t = (attrs.match(/t="([^"]+)"/) || [])[1];
    const v = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
    let val = t === "s" ? shared[+v] : t === "inlineStr" ? texts(body) : v != null ? ent(v) : "";
    out[ref ? colIdx(ref) : out.length] = (val ?? "").trim();
  }
  return out;
});

/* ── columnas por nombre de encabezado ── */
const head = rows[0].map(h => (h || "").toLowerCase());
const col = name => { const i = head.findIndex(h => h.startsWith(name)); if (i < 0) throw new Error(`Falta la columna «${name}»`); return i };
const C = { paso: col("paso"), sec: col("sección"), vis: col("visible"), pdf: col("nombre del campo en el pdf"), syn: col("variables o sinónimos"), web: col("nombre formularios web"), ruta: col("ruta json completa") };

const DIC = rows.slice(1).filter(r => r[C.web] && r[C.ruta]).map(r => {
  const web = r[C.web];
  const syn = (r[C.syn] || "").split(";").map(s => s.trim()).filter(Boolean);
  const pdf = r[C.pdf];
  if (pdf && !/^no aplica$/i.test(pdf) && pdf !== web && !syn.includes(pdf)) syn.push(pdf);
  return [web, syn, r[C.paso], r[C.sec], r[C.ruta], /^s[ií]/i.test(r[C.vis]) ? 1 : 0];
});

const html = readFileSync(htmlPath, "utf8");
const re = /\/\*DIC:BEGIN\*\/[\s\S]*?\/\*DIC:END\*\//;
if (!re.test(html)) throw new Error("index.html no tiene los marcadores /*DIC:BEGIN*/ … /*DIC:END*/");
const block = `/*DIC:BEGIN*/\n/* Generado con tools/build_dic.mjs desde ${xlsxPath.split("/").pop()} (${DIC.length} campos). No editar a mano. */\n` +
  `/* [nombre web, sinónimos y nombre en el PDF, paso, sección, ruta JSON, visible (1) u oculto (0)] */\nconst DIC=[\n${DIC.map(d => JSON.stringify(d)).join(",\n")}\n];\n/*DIC:END*/`;
writeFileSync(htmlPath, html.replace(re, block));
console.log(`DIC actualizado: ${DIC.length} campos (${DIC.filter(d => !d[5]).length} ocultos) desde ${xlsxPath}`);
