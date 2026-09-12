# MueblePro V20.6 — IA real

Esta versión conecta la fotografía del cliente con la OpenAI Responses API desde una función serverless. La clave **OPENAI_API_KEY nunca debe ir en index.html ni en GitHub**.

## Despliegue recomendado

1. Sube esta carpeta completa a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. En Vercel → Settings → Environment Variables crea `OPENAI_API_KEY` con tu clave de OpenAI y aplica Production/Preview/Development.
4. Redeploy.
5. Abre la URL de Vercel en el celular.

La función usa Node.js 22 y el SDK oficial de OpenAI. La foto se comprime en el navegador antes de enviarse. El análisis devuelve JSON estructurado con tipo de mueble, distribución, medidas estimadas, módulos sugeridos, obstáculos y confianza.

## Importante

La API de OpenAI es de pago por uso; Vercel puede alojar el backend dentro de sus opciones gratuitas, pero las llamadas al modelo de OpenAI generan consumo de API. No publiques nunca la API key en el frontend o en GitHub.
