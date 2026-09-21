# MueblePro V20.8.1 — IA + módulos + motor técnico preliminar

V20.8.1 conserva la interfaz sencilla de 5 pasos y agrega una segunda capa al análisis visual: la IA propone módulos preliminares editables.

## Qué agrega V20.7
- Análisis real de fotografía mediante `/api/analyze`.
- Propuesta preliminar de módulos con nombre, tipo, ancho, alto, profundidad, cantidad y motivo.
- Edición directa de las dimensiones preliminares de cada módulo.
- Identificación visible de módulos suspendidos que requieren **BASE EXTERNA** según la regla técnica de MueblePro.
- Resumen de módulos y centímetros lineales preliminares.
- No calcula todavía despiece, consumo de tablero, herrajes exactos ni cotización técnica real.

## Estructura para Vercel
- `index.html`
- `api/analyze.js`
- `package.json`
- `vercel.json`

## Variable de entorno
En Vercel debe existir:
- `OPENAI_API_KEY` → Production → Secret

Nunca pongas la clave dentro de `index.html` ni la subas a GitHub.

## Despliegue
1. Subir los archivos manteniendo `api/analyze.js` directamente dentro de `api/`.
2. Verificar que `vercel.json` no contenga una configuración manual de runtime.
3. En Vercel conservar `OPENAI_API_KEY` en Production.
4. Hacer Redeploy después de modificar la variable.
5. Probar una fotografía desde el Paso 2.

## Próxima etapa prevista
Conectar los módulos preliminares con la base técnica de MueblePro para pasar a despiece, tableros, herrajes y cotización real sin exponer costos internos al cliente.


## V20.8
Convierte los módulos preliminares en un pre-cálculo geométrico de piezas, área de tablero 15 mm, respaldo 6 mm y metros lineales de canto. No sustituye un despiece optimizado pieza por pieza ni una lista de precios vigente.


## V20.8.1 — Correcciones
- Actualiza la etiqueta de versión de la interfaz.
- Mantiene el flujo visible de 5 pasos.
- El valor comercial se muestra como "Pendiente" en lugar de un precio inventado o no sustentado.
- La pantalla aclara que el cálculo actual es preliminar y que la cotización comercial requiere despiece y una lista de precios vigente.
