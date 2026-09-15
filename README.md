# Cantoral Mayo 📖✨

> **Sitio web oficial:** [cantoralmayo.com](https://cantoralmayo.com) 🌐

Un cantoral católico de más de 300 páginas con letras y acordes listos para tocar. Diseñado para sentirse como un libro físico, pero ligero, accesible y siempre a la mano en el bolsillo. 

Es un proyecto completamente libre, sin anuncios, sin registros y sin recopilación de datos de ningún tipo.

---

## Una dedicatoria especial 📖
Las hojas de papel se maltratan, se pierden o a veces simplemente no alcanzan para todos. Esta versión digital existe para que el canto siga vivo, al alcance de la mano y sin límites.

Nació como un detalle hecho a medida: este cantoral, el código y cada detalle del proyecto están dedicados a Abi, y le pertenecen por completo. 🌟

---

## ✨ Características principales

- 🎸 **Cantos con acordes al instante:** Cifrado alineado sobre la letra para acompañar y tocar sin rodeos.
- 📖 **Experiencia de lectura natural:** Pasa las páginas con un toque, deslizamiento o animación tipo libro real.
- 📴 **100% Offline (PWA):** Se instala directamente en el móvil y funciona perfecto en capillas o comunidades sin cobertura celular ni Wi-Fi.
- 🔍 **Búsqueda rápida e intuitiva:** Encuentra cualquier canto al instante por título, fragmento de la letra o número de canto.
- 🎼 **Diccionario interactivo:** Más de 85 acordes con diagramas visuales y soporte para personas zurdas.
- 🔄 **Transposición en tiempo real:** Cambia el tono de cualquier canto con un solo toque para adaptarlo a tu voz o instrumento.
- 🖐️ **Control por gestos sin contacto:** Cambia de página pasando la mano frente a la cámara frontal mientras tocas la guitarra. Todo el procesamiento de visión por computadora se realiza de forma local y privada en el dispositivo (el video nunca sale de tu teléfono).
- 🌙 **Lectura cómoda:** Modo oscuro para veladas o misas con poca luz, ajuste dinámico de tamaño de texto y separadores/listones virtuales para marcar cantos clave.

---

## 📲 Cómo instalarlo en el teléfono

No requiere descargar nada desde tiendas de aplicaciones:

1. Entra a **[cantoralmayo.com](https://cantoralmayo.com)** desde el navegador de tu móvil.
2. Toca el botón **Instalar** que aparecerá en la pantalla.
   - *En iPhone / iPad (Safari):* Presiona el botón **Compartir** (icono de cuadro con flecha) y selecciona **Añadir a pantalla de inicio**.
3. ¡Listo! Se abrirá como una aplicación nativa, a pantalla completa y disponible siempre que la necesites.

---

## 📄 Licencias

Este proyecto maneja dos esquemas de licencia según su naturaleza:

| Ámbito | Licencia | Resumen |
|---|---|---|
| **Contenido** (Letras y cifrados) | [CC BY-NC-SA 4.0](LICENSE-CONTENIDO.md) | Compártelo y adáptalo citando la fuente original. **Estrictamente sin fines comerciales.** |
| **Código fuente** (Motor interactivo) | [MIT](LICENSE) | Código abierto y libre para estudiar, mejorar o reutilizar. |

El cantoral nació como un regalo desinteresado. La cláusula no comercial protege la esencia del proyecto: el servicio litúrgico y la música compartida no deben venderse.

> *Nota:* La titularidad de los cantos corresponde a sus respectivos autores y compositores, quienes se encuentran debidamente reconocidos en los créditos del proyecto. Si eres autor y deseas actualizar una atribución o solicitar un retiro, solo hazlo saber mediante un ticket o contacto directo.

---

## 🛠️ Arquitectura y mantenimiento

El sitio está construido como una aplicación web estática pura: ultra ligera, sin bases de datos remotas ni servidores complejos que puedan fallar:

- `index.html` · `styles.css` · `script.js` — Estructura principal, diseño visual e interactividad del libro.
- `cantos.json` — Base de datos local con todo el repertorio. Para corregir una letra o ajustar un tono, basta con editar este archivo sin tocar el código central.
- `sw.js` — Service Worker encargado del almacenamiento en caché para garantizar funcionamiento sin conexión.
- `assets/mediapipe/` — Modelos y dependencias locales para el seguimiento de gestos sin conexión a internet.

### Despliegue y actualizaciones
Cada vez que se suben cambios al repositorio, basta con incrementar el número de versión en el Service Worker. Los dispositivos que ya tengan la aplicación instalada detectarán el cambio en segundo plano y mostrarán un aviso para actualizar con un solo clic.
