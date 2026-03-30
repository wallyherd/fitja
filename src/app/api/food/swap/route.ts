import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

import { getPremiumStatus } from "@/utils/premium"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check Premium Status
    const { isPremium } = await getPremiumStatus()
    if (!isPremium) {
       return NextResponse.json({ error: "Premium subscription required for AI Substitution." }, { status: 403 })
    }
    
    // Pega as restrições
    const { data: profile } = await supabase.from('profiles').select('dietary_restrictions').eq('id', user.id).single()

    const { mealToSwap, currentMacros } = await req.json()
    if (!mealToSwap) return NextResponse.json({ error: "Missing meal data." }, { status: 400 })

    const restrictions = profile?.dietary_restrictions && profile?.dietary_restrictions.length > 0
       ? `Atenção às restrições do usuário: ${profile?.dietary_restrictions.join(', ')}.`
       : "O usuário não possui restrições alimentares específicas."

    const prompt = `Você é um nutricionista esportivo. O usuário pediu para trocar a seguinte refeição:
    "${mealToSwap.name}" que contém os seguintes itens: ${mealToSwap.items.join(', ')}.
    Essa refeição tem os seguintes macros: Calorias: ${currentMacros.calories}, Proteínas: ${currentMacros.p}g, Carboidratos: ${currentMacros.c}g, Gorduras: ${currentMacros.f}g.
    
    ${restrictions}

    Substitua a refeição por ingredientes equivalentes em macros (variação máxima de 10%). 
    Retorne APENAS um JSON no formato EXATO:
    {
      "name": "Nome da nova refeição",
      "items": ["Item 1 (quant.)", "Item 2 (quant.)"],
      "calories": number,
      "macros": { "p": number, "c": number, "f": number }
    }`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Limpeza de Markdown do Gemini se houver
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim()
    const substitution = JSON.parse(jsonString)

    return NextResponse.json(substitution)
  } catch (err: any) {
    console.error("AI Substitution Error:", err)
    return NextResponse.json({ error: "Falha ao calcular substituição.", details: err.message }, { status: 500 })
  }
}
