import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipo_mueble: { type: "string", enum: ["Cocina", "Closet", "Baño", "Mueble", "No identificado"] },
    tipo_distribucion: { type: "string", enum: ["Lineal", "En L", "En U", "Enfrentada", "Con isla", "Península", "Otra", "No identificada"] },
    ancho_estimado_cm: { type: "number" },
    alto_estimado_cm: { type: "number" },
    profundidad_recomendada_cm: { type: "number" },
    modulos_sugeridos: { type: "array", items: { type: "string" } },
    elementos_visibles: { type: "array", items: { type: "string" } },
    obstaculos: { type: "array", items: { type: "string" } },
    recomendacion: { type: "string" },
    confianza: { type: "number" }
  },
  required: ["tipo_mueble","tipo_distribucion","ancho_estimado_cm","alto_estimado_cm","profundidad_recomendada_cm","modulos_sugeridos","elementos_visibles","obstaculos","recomendacion","confianza"]
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
      instructions: `Eres el analista visual de MueblePro, una aplicación colombiana de diseño de cocinas, closets, baños y muebles a medida. Analiza la fotografía como una primera visita técnica. No inventes medidas exactas: las dimensiones deben ser estimaciones y debes mantener una confianza realista. Identifica geometría del espacio, muebles existentes, electrodomésticos, ventanas, puertas, columnas, enchufes u obstáculos visibles. Propón una distribución coherente con el tipo de mueble seleccionado. Para muebles suspendidos, recuerda la regla técnica de MueblePro: los muebles altos/suspendidos usan bases externas. Si no puedes identificar algo, indícalo en obstáculos o recomendación. Devuelve solamente el JSON solicitado. ${context}`,
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Analiza esta fotografía y prepara los datos para la propuesta preliminar de MueblePro." },
          { type: "input_image", image_url: image, detail: "high" }
        ]
      }],
      text: { format: { type: "json_schema", name: "mueblepro_analisis", strict: true, schema } }
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
