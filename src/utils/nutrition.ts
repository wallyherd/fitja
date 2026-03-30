export interface ProfileData {
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  activity_level?: string | null;
  primary_goal?: string | null;
  workout_frequency?: string | null;
}

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor.
 */
function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'Masculino') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return bmr;
}

/**
 * Converte o nível de atividade em um multiplicador.
 */
function getActivityMultiplier(activityLevel?: string | null, frequency?: string | null): number {
  let multiplier = 1.2; // Sedentário base

  if (activityLevel?.includes('Sedentário')) {
    multiplier = 1.2;
  } else if (activityLevel?.includes('Levemente')) {
    multiplier = 1.375;
  } else if (activityLevel?.includes('Ativo (3-5x') || activityLevel === 'Ativo') {
    multiplier = 1.55;
  } else if (activityLevel?.includes('Muito Ativo')) {
    multiplier = 1.725;
  }

  // Refinamento baseado na frequência de treino informada
  if (frequency === 'Todo dia' && multiplier < 1.725) multiplier += 0.1;
  if (frequency === 'Nenhuma' && multiplier > 1.2) multiplier = 1.2;

  return multiplier;
}

/**
 * Calcula calorias alvo e distribuição de macros com base no objetivo.
 */
export function calculateTargetMacros(data: ProfileData): MacroResult | null {
  if (!data.weight || !data.height || !data.age || !data.gender) {
    return null; // Dados insuficientes
  }

  const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
  const tdee = bmr * getActivityMultiplier(data.activity_level, data.workout_frequency);

  let targetCalories = tdee;
  let proteinRatio = 0.25;
  let fatRatio = 0.30;
  let carbsRatio = 0.45;

  // Ajustes de calorias baseados no objetivo
  const goal = data.primary_goal || 'Manter';
  
  if (goal.includes('Emagrecer')) {
    targetCalories = tdee - 500; // Déficit agressivo/moderado
    proteinRatio = 0.40; // High protein para preservar massa
    fatRatio = 0.35;
    carbsRatio = 0.25; // Low carb relativo
  } else if (goal.includes('Definir')) {
    targetCalories = tdee - 200; // Déficit leve
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbsRatio = 0.40;
  } else if (goal.includes('Ganhar Massa')) {
    targetCalories = tdee + 300; // Superávit leve
    proteinRatio = 0.30;
    fatRatio = 0.25;
    carbsRatio = 0.45; // High carb para energia de treino
  } else {
    // Manutenção / Saúde
    targetCalories = tdee;
    proteinRatio = 0.25;
    fatRatio = 0.30;
    carbsRatio = 0.45;
  }

  // Se déficit for muito severo, limitar ao valor basal p/ segurança
  if (targetCalories < bmr && goal.includes('Emagrecer')) {
      targetCalories = bmr;
  }

  // Convertendo ratios para gramas (Carb 4kcal/g, Prot 4kcal/g, Fat 9kcal/g)
  const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const carbsGrams = Math.round((targetCalories * carbsRatio) / 4);
  const fatGrams = Math.round((targetCalories * fatRatio) / 9);

  return {
    calories: Math.round(targetCalories),
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams
  };
}
