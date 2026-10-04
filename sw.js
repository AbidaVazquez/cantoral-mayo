// Service Worker — Cantoral Mayo. Navegación: red primero con 2.5 s de espera; resto:
// caché y refresco de fondo. Sube CACHE_VERSION para invalidar todo el precache.
const CACHE_VERSION = "cantoral-ultopt229";
const NETWORK_TIMEOUT_MS = 2500;
// Conteo de visitas (Umami): SIEMPRE red, nunca caché. Si se guardara, la PWA se
// quedaría con el script viejo hasta el siguiente cambio de CACHE_VERSION.
const STATS_HOST = "stats.cantoralmayo.com";
// ★Núcleo para abrir SIN internet. Se guarda ESTRICTO (si falta uno, la instalación
// falla y el navegador reintenta después): antes todo era tolerante y una
// actualización con la señal floja podía activarse SIN la página principal,
// borrar la caché anterior y dejar la PWA en "sin conexión" (reportes Samsung).
const CORE = [
  "./",
  "index.html",
  "manifest.json",
  "cantos.json",
  "styles.css?v=256",
  "script.js?v=274"
];
// Caché APARTE para el detector de gestos (assets/mediapipe/, ~12 MB en 7 archivos).
const GESTURE_CACHE = "cantoral-gestos-v1";
const GESTURE_PATH = "/assets/mediapipe/";
const PRECACHE = [
  "./",
  "index.html",
  "manifest.json",
  "favicon.svg",
  "assets/icon.svg",
  "apple-touch-icon.png",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/icon-maskable-512.png",
  "assets/portada.png",
  "assets/titulopasta.svg",
  "assets/siluetaVM_v5.svg",
  "assets/siluetaAdviento.svg?v=4",
  "assets/siluetaNavidad.svg?v=4",
  "assets/siluetaCuaresma.svg?v=7",
  "assets/siluetaPascua.svg?v=4",
  "assets/siluetaPentecostes.svg?v=9",
  "assets/hojasdis.png",
  "cantos.json",
  "styles.css?v=256",
  "script.js?v=274",
  "assets/qr_cantoralmayo.svg?v=2",
  "assets/guia_acordes.svg?v=2",
  "assets/guia_acordes_zurdo.svg?v=1",
  "assets/luciernaga.png?v=1",
  "assets/chords/A.svg",
  "assets/chords/A7.svg",
  "assets/chords/A9.svg",
  "assets/chords/Ab.svg",
  "assets/chords/Am.svg",
  "assets/chords/Asus.svg",
  "assets/chords/B.svg",
  "assets/chords/B7.svg",
  "assets/chords/Bm.svg",
  "assets/chords/B♭.svg",
  "assets/chords/C#7.svg",
  "assets/chords/C#m.svg",
  "assets/chords/C.svg",
  "assets/chords/C7.svg",
  "assets/chords/Cm.svg",
  "assets/chords/D.svg",
  "assets/chords/D7.svg",
  "assets/chords/D9.svg",
  "assets/chords/Db.svg",
  "assets/chords/Dm.svg",
  "assets/chords/Dm7.svg",
  "assets/chords/E.svg",
  "assets/chords/E7.svg",
  "assets/chords/Eb.svg",
  "assets/chords/Em.svg",
  "assets/chords/Em7.svg",
  "assets/chords/F#.svg",
  "assets/chords/F#7.svg",
  "assets/chords/F#m.svg",
  "assets/chords/F#m7.svg",
  "assets/chords/F.svg",
  "assets/chords/Fm.svg",
  "assets/chords/Fm7.svg",
  "assets/chords/G#.svg",
  "assets/chords/G#7.svg",
  "assets/chords/G#m.svg",
  "assets/chords/G.svg",
  "assets/chords/G7.svg",
  "assets/chords/Gm.svg",
  "assets/chords/Gsus4.svg",
  "assets/chords/Ab9.svg",
  "assets/chords/Abm7.svg",
  "assets/chords/Absus.svg",
  "assets/chords/Absus4.svg",
  "assets/chords/Am7.svg",
  "assets/chords/Asus4.svg",
  "assets/chords/B9.svg",
  "assets/chords/Bb7.svg",
  "assets/chords/Bb9.svg",
  "assets/chords/Bbm.svg",
  "assets/chords/Bbm7.svg",
  "assets/chords/Bbsus.svg",
  "assets/chords/Bbsus4.svg",
  "assets/chords/Bm7.svg",
  "assets/chords/Bsus.svg",
  "assets/chords/Bsus4.svg",
  "assets/chords/C9.svg",
  "assets/chords/Cm7.svg",
  "assets/chords/Csus.svg",
  "assets/chords/Csus4.svg",
  "assets/chords/Db9.svg",
  "assets/chords/Dbm7.svg",
  "assets/chords/Dbsus.svg",
  "assets/chords/Dbsus4.svg",
  "assets/chords/Dsus.svg",
  "assets/chords/Dsus4.svg",
  "assets/chords/E9.svg",
  "assets/chords/Eb7.svg",
  "assets/chords/Eb9.svg",
  "assets/chords/Ebm.svg",
  "assets/chords/Ebm7.svg",
  "assets/chords/Ebsus.svg",
  "assets/chords/Ebsus4.svg",
  "assets/chords/Esus.svg",
  "assets/chords/Esus4.svg",
  "assets/chords/F7.svg",
  "assets/chords/F9.svg",
  "assets/chords/Fsus.svg",
  "assets/chords/Fsus4.svg",
  "assets/chords/G9.svg",
  "assets/chords/Gb9.svg",
  "assets/chords/Gbsus.svg",
  "assets/chords/Gbsus4.svg",
  "assets/chords/Gm7.svg",
  "assets/chords/Gsus.svg"
];

// ★Sin skipWaiting(): la versión nueva ESPERA a que el usuario toque "Actualizar" (ver
// #updateBanner). Si entra sola, la pantalla sigue siendo la vieja y se purga su caché.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // El núcleo va con addAll (todo o nada); el resto, uno por uno y tolerante:
      // que falte un acorde no debe tumbar la instalación.
      cache.addAll(CORE).then(() =>
        Promise.all(PRECACHE.filter((url) => !CORE.includes(url)).map((url) =>
          cache.add(encodeURI(url).replace(/#/g, "%23")).catch(() => null)
        ))
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      // ★GESTURE_CACHE sobrevive a la purga: son 12 MB y no dependen de la versión del
      // cantoral. Si se borra, hay que rebajarlos con internet en cada actualización.
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION && k !== GESTURE_CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// La página pide entrar (el usuario tocó "Actualizar" en el aviso de versión nueva).
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Trae de la red cacheando la respuesta; si la red tarda más que el timeout o
// falla, responde desde caché (la red sigue y actualiza la caché de fondo).
function networkFirstWithTimeout(req, fallbackUrl) {
  const network = fetch(req).then((res) => {
    // ★Sólo se cachea si res.ok: un 502 guardado se sirve luego como si fuera el cantoral.
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
    }
    return res;
  });
  const timed = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
  return Promise.race([network.catch(() => null), timed]).then((res) => {
    // Una respuesta de error tampoco vale para MOSTRAR: si hay copia buena en
    // caché, se prefiere esa (el usuario ve el cantoral, no la pantalla de error).
    if (res && res.ok) return res;
    if (!fallbackUrl) return caches.match(req).then((hit) => hit || network);
    // Navegación: cualquier copia de la página sirve (con o sin ?parámetros, con o
    // sin index.html). Se busca en TODAS las cachés, no sólo en la versión actual.
    return caches.match(req, { ignoreSearch: true })
      .then((hit) => hit || caches.match(fallbackUrl))
      .then((hit) => hit || caches.match("./"))
      .then((hit) => {
        if (hit) return limpiarRedireccion(hit);
        return res || network.then((r) => r || paginaSinCopia(), paginaSinCopia);
      });
  });
}

// Chrome rechaza servir a una navegación una respuesta que vino de una redirección
// (sale la pantalla de error del navegador). Se re-empaqueta sin esa marca.
function limpiarRedireccion(res) {
  if (!res.redirected) return res;
  return res.blob().then((body) => new Response(body, {
    status: res.status, statusText: res.statusText, headers: res.headers
  }));
}

// Último recurso: sin red y sin copia guardada (p. ej. el teléfono borró los datos
// del sitio por falta de espacio). Mejor un aviso propio que el dinosaurio.
function paginaSinCopia() {
  return new Response(
    '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Cantoral Mayo</title></head>' +
    '<body style="font-family:Georgia,serif;background:#fbf9f2;color:#3b2f22;' +
    'text-align:center;padding:3rem 1.5rem;line-height:1.5">' +
    '<h1 style="font-weight:normal">Cantoral Mayo ✨</h1>' +
    '<p>Este teléfono no tiene guardada una copia del cantoral.</p>' +
    '<p>Ábrelo <b>una vez con internet</b> y espera a que cargue completo; ' +
    'después funcionará sin conexión.</p></body></html>',
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Umami: sin respondWith = el navegador va directo a la red, sin caché.
  if (url.hostname === STATS_HOST) return;

  // Otros orígenes (Google Fonts, etc.): cache-first.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          if (res && res.ok) {                       // no grabar errores (ver arriba)
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => hit)
      )
    );
    return;
  }

  // Detector de gestos: CACHE-FIRST contra su caché propia.
  if (url.pathname.includes(GESTURE_PATH)) {
    event.respondWith(
      caches.open(GESTURE_CACHE).then((c) =>
        c.match(req).then((hit) =>
          hit || fetch(req).then((res) => {
            // Sólo guardar respuestas buenas: un 404/500 cacheado dejaría los
            // gestos rotos para siempre sin forma de reintentar.
            if (res && res.ok) c.put(req, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  // Documento y contenido editable sin versión: red fresca si es rápida,
  // caché al instante si no.
  if (req.mode === "navigate") {
    event.respondWith(networkFirstWithTimeout(req, "index.html"));
    return;
  }
  if (url.pathname.endsWith("/cantos.json")) {
    event.respondWith(networkFirstWithTimeout(req));
    return;
  }

  // Estáticos del mismo origen: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {                         // no pisar una copia buena con un error
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return (res && res.ok) ? res : (hit || res);
      }).catch(() => hit);
      return hit || network;
    })
  );
});
