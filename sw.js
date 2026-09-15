// Service Worker — Cantoral Mayo (offline)
// Estrategia:
//  • Navegación (index.html) y cantos.json: NETWORK-FIRST con TIMEOUT — si la
//    red responde rápido llega lo último; si tarda o no hay, arranca AL
//    INSTANTE desde caché (clave para la PWA instalada con señal débil).
//    La respuesta de red se cachea igual en segundo plano.
//  • Resto del mismo origen (css/js con ?v=N, SVGs, PNGs): STALE-WHILE-
//    REVALIDATE — responde ya desde caché y refresca la copia de fondo. Los
//    archivos versionados (?v=N) nunca se sirven viejos porque un cambio de
//    versión cambia la URL y fuerza red.
//  • Fuentes de Google (otro origen): CACHE-FIRST (son inmutables/versionadas).
// Sube CACHE_VERSION solo si quieres invalidar TODO el precache de golpe.
const CACHE_VERSION = "cantoral-ultopt226";
const NETWORK_TIMEOUT_MS = 2500;
// Caché APARTE para el detector de gestos (assets/mediapipe/, ~12 MB en 7
// archivos). No lleva el número de versión del cantoral a propósito: así una
// actualización del libro NO obliga a rebajar el detector con internet. Se llena
// sola la primera vez que el usuario activa ✋ (nunca en el install: quien no use
// gestos no gasta 12 MB). Subir este número sólo si cambia la versión de
// MediaPipe (hoy: paquete npm @mediapipe/hands 0.4.1675469240).
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
  "styles.css?v=255",
  "script.js?v=273",
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

// ★YA NO se hace skipWaiting() aquí. Antes el SW nuevo tomaba el mando en cuanto
// terminaba de instalarse, PERO la pantalla ya pintada seguía siendo la vieja: el
// usuario no veía los cambios y encima el SW nuevo purgaba la caché anterior bajo
// los pies de esa página. Ahora la versión nueva se queda ESPERANDO, la página la
// anuncia (ver #updateBanner en index.html) y sólo entra cuando el usuario acepta,
// vía el mensaje SKIP_WAITING de abajo. Así el cantoral nunca cambia solo a mitad
// de un canto, y cuando cambia, cambia entero.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // addAll falla si un solo recurso falla; usamos add individual tolerante.
      // Codificamos la URL (# -> %23, ♭ -> %E2%99%AD) porque hay SVGs de acordes
      // como "C#7.svg" o "B♭.svg"; así coincide con cómo los pide la app en runtime.
      Promise.all(PRECACHE.map((url) =>
        cache.add(encodeURI(url).replace(/#/g, "%23")).catch(() => null)
      ))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      // ★GESTURE_CACHE sobrevive a la purga. Es la razón de que exista: el detector
      // de gestos son 12 MB y antes vivía en CACHE_VERSION, así que CADA
      // actualización del cantoral lo borraba y el usuario tenía que volver a
      // bajarlo con internet. Su contenido no depende de la versión del cantoral.
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION && k !== GESTURE_CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// La página pide entrar (el usuario tocó "Actualizar" en el aviso de versión
// nueva). Al activarse, clients.claim() toma el control y la página recarga sola
// escuchando 'controllerchange'.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Trae de la red cacheando la respuesta; si la red tarda más que el timeout o
// falla, responde desde caché (la red sigue y actualiza la caché de fondo).
function networkFirstWithTimeout(req, fallbackUrl) {
  const network = fetch(req).then((res) => {
    // ★Sólo se guarda lo BUENO. Antes se cacheaba cualquier respuesta: bastaba un
    // 502/503 del servidor (o del túnel) para que ese error quedara grabado COMO
    // SI FUERA index.html o cantos.json, y la PWA arrancaba rota desde la caché
    // aun con el sitio ya restablecido.
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
    return caches.match(req).then((hit) =>
      hit || (fallbackUrl ? caches.match(fallbackUrl) : undefined) || network
    );
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

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

  // Detector de gestos: CACHE-FIRST contra su caché propia. Son archivos
  // inmutables (versión de MediaPipe congelada), así que una vez guardados no se
  // vuelven a pedir nunca — ni aunque haya red. Se cachean al vuelo la primera
  // vez que el usuario activa ✋; a partir de ahí los gestos funcionan sin señal.
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
