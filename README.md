# Cantoral Mayo

### https://cantoralmayo.com

Un cantoral católico de más de 300 páginas, con sus letras y sus acordes, que se
abre como un libro y cabe en el bolsillo. Gratuito, sin anuncios, sin registro y
sin recoger datos de nadie.

---

## De dónde viene

Este cantoral existía antes en papel. Lo escribió **Abida Vázquez**, página por
página, y mandó imprimir cientos de copias del libro completo **pagándolas de su
bolsillo**, para repartirlas en su comunidad. No pidió nada a cambio ni esperaba
recibirlo.

Esta versión digital nació de ahí: para que ese mismo trabajo pueda llegar a
quien lo necesite sin depender de cuántas copias se puedan costear, y sin que
acaben en la basura las que nadie recoge.

El cantoral, este sitio y todo lo relacionado con el proyecto **le pertenecen a
ella**.

---

## Qué tiene

- **Los cantos, con acordes** — cifrados sobre la letra, para tocar directamente.
- **Se lee como un libro** — las páginas se pasan con el dedo, no se hace scroll.
- **Funciona sin internet** — se instala en el teléfono y sigue abriendo en una
  iglesia sin cobertura. No hace falta señal para cantar.
- **Buscador** — por título, por letra o por número de canto.
- **Diccionario de acordes** — 85 acordes con su diagrama, y una guía para
  aprender a leerlos (también para zurdos).
- **Transposición** — sube o baja el tono del canto entero.
- **Control por gestos** — pasa de página moviendo la mano frente a la cámara,
  sin tocar la pantalla. Pensado para quien toca con las manos ocupadas en la
  guitarra. Todo el reconocimiento ocurre dentro del teléfono: **el vídeo no sale
  del dispositivo ni se envía a ningún sitio**.
- **Modo noche**, tamaño de letra ajustable y listones para marcar páginas.

---

## Cómo se instala en el teléfono

No hace falta ninguna tienda de aplicaciones.

1. Abre **https://cantoralmayo.com** en el navegador del teléfono.
2. Toca el botón **Instalar** que aparece abajo.
   - En iPhone: pulsa *Compartir* → *Añadir a pantalla de inicio*.
3. Listo. Se abre como cualquier otra aplicación y funciona sin conexión.

---

## Licencias

Este proyecto tiene dos, porque son dos cosas distintas:

| | Licencia | Qué significa |
|---|---|---|
| **El contenido** (los cantos) | [CC BY-NC-SA 4.0](LICENSE-CONTENIDO.md) | Compártelo y adáptalo citando la autoría. **Nunca con fines comerciales.** |
| **El código** (el motor del libro) | [MIT](LICENSE) | Úsalo para lo que quieras, incluso para otro proyecto. |

El cantoral nació como un regalo. La condición de **no comercial** está ahí para
que siga siéndolo: nadie debería cobrar por esto.

Los cantos pertenecen a sus autores y compositores, reconocidos en la sección de
créditos del propio cantoral. Si eres titular de los derechos de alguna obra y
quieres una corrección en la atribución —o su retirada— basta con comunicarlo.

---

## Para quien mantiene el sitio

Es un sitio estático: no hay servidor, ni base de datos, ni nada que se caiga.

- `index.html` · `styles.css` · `script.js` — el libro entero.
- `cantos.json` — **todos los cantos**. Para corregir una letra o un acorde, se
  edita aquí; no hay que tocar el código.
- `sw.js` — lo que permite que funcione sin internet.
- `assets/mediapipe/` — el reconocimiento de gestos, servido desde el propio
  sitio para que también funcione sin conexión.

Al publicar cambios, se sube el número de versión en `index.html` y en `sw.js`;
quien tenga la aplicación instalada verá un aviso de **"Hay una versión nueva"**
y la aplicará cuando quiera.
