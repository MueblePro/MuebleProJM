# MueblePro V20.10 — Motor constructivo

Versión desplegable para Vercel.

V20.10 toma los módulos preliminares de la IA y aplica reglas constructivas paramétricas por perfil (bajo/caja, alto suspendido, torre y especial). Mantiene el despiece como preliminar: no inventa precios y no considera definitivos los descuentos de puertas/cajones, mecanizados, veta, herrajes ni medidas de bases externas.

Estructura en raíz:
- index.html
- api/analyze.js
- package.json
- vercel.json
- .env.example

Mantener `OPENAI_API_KEY` únicamente como variable Secret/Production en Vercel. No subir claves a GitHub.
