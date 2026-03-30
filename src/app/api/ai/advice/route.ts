import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Busca os últimos 7 dias de logs do usuário
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString().split("T")[0];

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: logs } = await supabase.from('daily_logs').select('*').eq('user_id', user.id).gte('date', dateString);

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // 2. Monta o contexto para a IA
    const waterMetas = logs?.filter(l => l.water_ml >= (profile.daily_water_goal_ml || 2500)).length || 0;
    const workoutMetas = logs?.filter(l => l.workout_done).length || 0;
    const totalDays = logs?.length || 0;

    const prompt = `Você é SophIA, a treinadora de elite do app FitJá. 
    Analise estes dados da última semana do usuário ${profile.full_name}:
    - Metas de Água batidas: ${waterMetas} de ${totalDays} dias.
    - Treinos realizados: ${workoutMetas} de ${totalDays} dias.
    - Objetivo: ${profile.primary_goal}.
    
    Gere um conselho CURTO (máximo 2 frases), motivador e técnico. 
    Se ele estiver indo mal, use tom de alerta. Se estiver indo bem, use tom de orgulho. 
    Não use hashtags.`;

    const result = await model.generateContent(prompt);
    const advice = result.response.text();

    return NextResponse.json({ advice });
  } catch (err: any) {
    console.error("AI Advice Error:", err);
    return NextResponse.json({ 
       advice: "Você está evoluindo, mas o dia esfriou. Lance agora mesmo os seus progressos para a roda voltar a girar." 
    });
  }
}
