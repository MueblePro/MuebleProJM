# MueblePro V20.6.2 — IA real

Estructura preparada para Vercel: `index.html` y la carpeta `api/` están directamente en la raíz del proyecto.

## Despliegue
1. Sube/reemplaza estos archivos en la raíz de tu repositorio GitHub `MuebleProJM`.
2. Conserva tu variable `OPENAI_API_KEY` en Vercel. No la pongas en GitHub ni en `index.html`.
3. Haz Redeploy en Vercel.
4. Prueba `https://TU-PROYECTO.vercel.app/api/analyze`: al abrirla directamente debe responder `Método no permitido` (eso confirma que la función existe).
5. Abre MueblePro, sube una foto y pulsa `Analizar fotografía con IA`.

## Estructura
- `index.html`
- `api/analyze.js`
- `package.json`
- `vercel.json`
- `.env.example`

La API de OpenAI es de pago por uso. La clave permanece únicamente en el servidor mediante `OPENAI_API_KEY`.
