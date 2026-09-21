import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const moduleSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nombre: { type: "string" },
    tipo: { type: "string", enum: ["Bajo", "Alto", "Torre", "Especial", "Lateral", "Otro"] },
    ancho_estimado_cm: { type: "number" },
    alto_estimado_cm: { type: "number" },
    profundidad_cm: { type: "number" },
    cantidad: { type: "integer", minimum: 1 },
    motivo: { type: "string" },
    suspendido: { type: "boolean" },
    base_externa_requerida: { type: "boolean" },
    perfil: { type: "string", enum: ["Bajo_caja", "Alto_suspendido", "Torre", "Especial"] }
  },
  required: ["nombre", "tipo", "ancho_estimado_cm", "alto_estimado_cm", "profundidad_cm", "cantidad", "motivo", "suspendido", "base_externa_requerida", "perfil"]
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipo_mueble: { type: "string", enum: ["Cocina", "Closet", "Baño", "Mueble", "No identificado"] },
    tipo_distribucion: { type: "string", enum: ["Lineal", "En L", "En U", "Enfrentada", "Con isla", "Península", "Otra", "No identificada"] },
    ancho_estimado_cm: { type: "number" },
    alto_estimado_cm: { type: "number" },
    profundidad_recomendada_cm: { type: "number" },
    modulos_sugeridos: { type: "array", items: moduleSchema },
    elementos_visibles: { type: "array", items: { type: "string" } },
    obstaculos: { type: "array", items: { type: "string" } },
    recomendacion: { type: "string" },
    confianza: { type: "number" }
  },
  required: ["tipo_mueble", "tipo_distribucion", "ancho_estimado_cm", "alto_estimado_cm", "profundidad_recomendada_cm", "modulos_sugeridos", "elementos_visibles", "obstaculos", "recomendacion", "confianza"]
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Falta OPENAI_API_KEY en las variables de entorno del servidor." });

  try {
    const { image, tipoSeleccionado, distribucionSeleccionada, medidas } = req.body || {};
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Debes enviar una imagen en formato data URL." });
    }
    if (image.length > 6_500_000) return res.status(413).json({ error: "La foto es demasiado grande. Intenta nuevamente." });

    const context = `Tipo seleccionado por el cliente: ${tipoSeleccionado || "no indicado"}. Distribución seleccionada: ${distribucionSeleccionada || "no indicada"}. Medidas ingresadas (cm): ${JSON.stringify(medidas || {})}.`;
    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      store: false,
      instructions: `Eres el analista visual y pre-planificador de módulos de MueblePro, una aplicación colombiana de diseño de cocinas, closets, baños y muebles a medida.

Analiza la fotografía como una primera visita técnica. No inventes medidas exactas: todas las dimensiones son PRELIMINARES y deben confirmarse en visita técnica. Usa las medidas escritas por el cliente cuando existan y la fotografía para estimar lo demás.

Identifica geometría del espacio, muebles existentes, electrodomésticos, ventanas, puertas, columnas, enchufes, puntos visibles y obstáculos. Propón una distribución coherente con el tipo de mueble seleccionado.

NUEVO EN V20.7/V20.8: genera una propuesta preliminar de módulos. Cada módulo debe tener nombre claro para el cliente, tipo, ancho/alto/profundidad estimados, cantidad y motivo. No generes módulos absurdos ni dupliques elementos. La suma de los anchos de los módulos de una misma línea debe ser razonable frente al ancho estimado del proyecto; si hay una ventana u obstáculo, deja espacio libre y explícalo. Prioriza módulos funcionales y deja los especiales solo cuando la foto lo justifique.

REGLA TÉCNICA DE MUEBLEPRO: los muebles altos, superiores, suspendidos o colgantes usan BASES EXTERNAS. Si un módulo es suspendido, base_externa_requerida debe ser true. V20.8: asigna además un perfil constructivo preliminar (Bajo_caja, Alto_suspendido, Torre o Especial) para permitir un pre-cálculo geométrico de piezas. No calcules todavía un despiece optimizado, mecanizados, herrajes exactos ni precios.

La aplicación mostrará estos módulos como una propuesta editable. Por eso debes ser conservador y marcar la propuesta como preliminar mediante motivos y recomendación. Si algo no puede determinarse, dilo en obstáculos o recomendación.

Devuelve solamente el JSON solicitado. ${context}`,
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Analiza esta fotografía y prepara el análisis visual y la propuesta preliminar de módulos de MueblePro V20.8." },
          { type: "input_image", image_url: image, detail: "high" }
        ]
      }],
      text: { format: { type: "json_schema", name: "mueblepro_analisis_v208", strict: true, schema } }
    });

    let data;
    try { data = JSON.parse(response.output_text); }
    catch { return res.status(502).json({ error: "La IA respondió en un formato inesperado.", raw: response.output_text }); }
    return res.status(200).json({ ok: true, analysis: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "No fue posible analizar la imagen." });
  }
}
