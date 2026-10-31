# Partituras (piloto) — rama `cm-partituras`

Rescatado de `ULTIMAOPTIMIZACION_CONPARTITURA` (versión del 2026-08-23). **Todavía no está integrado** a la app actual: esta rama solo lo guarda.

## Qué hace
En los cantos que tienen partitura aparece un botón ♪ que cambia entre la letra y el pentagrama (abcjs). Además, ▶ reproduce la melodía con Tone.js (sonido de guitarra).

## Piezas
| Archivo | Qué es |
|---|---|
| `assets/partituras.js` | `window.PARTITURAS`: notación ABC por id de canto (cantos 1–323). Es el mismo archivo que `partituras2pilot.js` |
| `assets/abcjs-basic-min.js` | abcjs (MIT): dibuja el pentagrama |
| `assets/Tone.js` | Tone.js (MIT): audio |
| `referencia-2026-08-23/` | `index.html`, `script.js`, `styles.css` y `sw.js` de esa versión, para copiar de ahí los puntos de integración |

## Dónde se conectaba (en `referencia-2026-08-23/`)
- `index.html` ~483-487: los tres `<script>` (abcjs, Tone, partituras) antes de `script.js`.
- `script.js` ~721: botón ♪ (`scoreBtn`), solo si el canto tiene ABC.
- `script.js` ~791: contenedor donde abcjs dibuja.
- `script.js` ~6089: bloque «PARTITURA (piloto) — toggle ♪ (abcjs) + ▶ audio» (~169 líneas).
- `styles.css` ~5642: bloque «PARTITURA (piloto) — botón ♪ + vista de pentagrama» (~218 líneas).
- `sw.js` ~39: `assets/partituras.js` en el precache.
