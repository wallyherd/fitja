import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getPremiumStatus } from "@/utils/premium";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { isPremium } = await getPremiumStatus()
    if (!isPremium) {
      return NextResponse.json({ error: 'Premium required to use AI features.' }, { status: 403 })
    }

    const { image } = await req.json(); // Base64 image
    if (!image) return NextResponse.json({ error: "Image data required" }, { status: 400 });

    const prompt = `Analise a foto desta refeição e extraia os alimentos. 
    Retorne APENAS um JSON no formato: {"meals": [{"name": "Nome do alimento", "calories": number, "protein": number, "carbs": number, "fat": number}]}. 
    Seja específico e estime calorias e macros baseados em porções visuais reais do prato.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(",")[1], // Remove "data:image/png;base64,"
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Limpeza de Markdown do Gemini se houver (ex: ```json)
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(jsonString);

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error("AI Vision Error:", err);
    return NextResponse.json({ error: "Falha na análise da imagem.", details: err.message }, { status: 500 });
  }
}
