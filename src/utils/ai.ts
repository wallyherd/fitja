import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function getSophiaAdvice(userId: string) {
  try {
    const supabase = await createClient();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString().split("T")[0];

    // Busca o perfil estendido
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: logs } = await supabase.from('daily_logs').select('*').eq('user_id', userId).gte('date', dateString);

    if (!profile || !logs) return "Continue focado! A constância é o segredo do sucesso.";

    const waterMetas = logs.filter(l => l.water_ml >= (profile.daily_water_goal_ml || 2500)).length;
    const workoutMetas = logs.filter(l => l.workout_done).length;
    const totalDays = logs.length || 1;

    // Contexto adicional do Motor Metabólico e Restrições
    const macrosText = profile.target_calories 
      ? `Motor Metabólico: ${profile.target_calories} kcal/dia.` 
      : "";
    const resText = profile.dietary_restrictions?.length 
      ? `Restrições: ${profile.dietary_restrictions.join(', ')}.`
      : "";

    const prompt = `Você é SophIA, a treinadora médica e performance leader do app FitJá. 
    Analise estes dados contextuais da última semana do usuário ${profile.full_name}:
    - Metas de Água: ${waterMetas} de ${totalDays} dias.
    - Treinos realizados: ${workoutMetas} de ${totalDays} dias.
    - Objetivo: ${profile.primary_goal}.
    - Frequência ideal: ${profile.workout_frequency || 'Não informada'}.
    ${macrosText} ${resText}
    
    Lembre-se: O usuário não é iniciante frágil, tratar de forma direta, técnica mas ainda empática.
    Gere um conselho CURTO (máximo 2 a 3 frases) baseado unicamente nos dados de performance listados hoje.
    Se ele estiver indo mal, envie um incentivo ou alerta para calibrar a rotina. 
    Se estiver indo bem, elogie a consistência técnica.
    Não use hashtags nem emojis excessivos. Use linguagem premium.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Sophia Advice Error:", err);
    return "Sua performance dita o resultado. Registre seus dados de hoje para calibrarmos seu motor metabólico.";
  }
}
