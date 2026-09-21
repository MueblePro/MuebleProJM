# MueblePro V20.9 — Despiece técnico preliminar

V20.9 parte de V20.8.1 y agrega un despiece paramétrico preliminar por módulo.

## Qué hace
- Conserva el flujo simple de 5 pasos.
- Conserva análisis visual con `/api/analyze` y la variable `OPENAI_API_KEY` en Vercel.
- Convierte cada módulo preliminar en una lista de piezas de referencia.
- Muestra dimensiones nominales en mm, material de referencia (Tablero 15 mm o Respaldo 6 mm) y canto aproximado.
- Marca las bases externas requeridas para módulos altos/suspendidos.
- No inventa precios ni presenta una cotización comercial.

## Importante
El despiece es paramétrico/preliminar. Antes de fabricar deben validarse: sistema constructivo, descuentos de puertas/frentes, mecanizados, ranuras, veta, orientación de corte, herrajes, respaldos, bases externas y medidas de obra.

## Despliegue
Mantener `OPENAI_API_KEY` solamente en Vercel. No subir claves a GitHub.
