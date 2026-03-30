// Banco de Dados Nutricional FitJá
// Referência: por 100g ou 100ml | Fonte: TACO + IBGE adaptado

export type FoodItem = {
  id: string
  name: string
  category: string
  unit: string
  per100: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export const FOOD_DATABASE: FoodItem[] = [
  // ─── CARNES BOVINAS ───
  { id: 'patinho', name: 'Patinho moído (cru)', category: 'Carnes', unit: 'g', per100: { calories: 145, protein: 22, carbs: 0, fat: 6 } },
  { id: 'alcatra', name: 'Alcatra grelhada', category: 'Carnes', unit: 'g', per100: { calories: 195, protein: 29, carbs: 0, fat: 8 } },
  { id: 'contrafile', name: 'Contrafilé grelhado', category: 'Carnes', unit: 'g', per100: { calories: 210, protein: 26, carbs: 0, fat: 11 } },
  { id: 'coxao-mole', name: 'Coxão mole cozido', category: 'Carnes', unit: 'g', per100: { calories: 180, protein: 28, carbs: 0, fat: 7 } },
  { id: 'filé-mignon', name: 'Filé mignon grelhado', category: 'Carnes', unit: 'g', per100: { calories: 185, protein: 30, carbs: 0, fat: 6.5 } },
  { id: 'picanha', name: 'Picanha assada', category: 'Carnes', unit: 'g', per100: { calories: 290, protein: 25, carbs: 0, fat: 21 } },
  { id: 'costela', name: 'Costela assada', category: 'Carnes', unit: 'g', per100: { calories: 310, protein: 22, carbs: 0, fat: 24 } },
  { id: 'hamburguer-bovino', name: 'Hambúrguer bovino (100g)', category: 'Carnes', unit: 'g', per100: { calories: 245, protein: 20, carbs: 5, fat: 17 } },
  { id: 'figado', name: 'Fígado bovino cozido', category: 'Carnes', unit: 'g', per100: { calories: 175, protein: 26, carbs: 5, fat: 5 } },

  // ─── CARNES SUÍNAS ───
  { id: 'lombo-suino', name: 'Lombo suíno assado', category: 'Carnes', unit: 'g', per100: { calories: 190, protein: 30, carbs: 0, fat: 7 } },
  { id: 'costelinha-suina', name: 'Costelinha suína assada', category: 'Carnes', unit: 'g', per100: { calories: 290, protein: 21, carbs: 0, fat: 23 } },
  { id: 'copa-lombo', name: 'Copa Lombo fatiada', category: 'Carnes', unit: 'g', per100: { calories: 255, protein: 18, carbs: 1, fat: 20 } },
  { id: 'bacon', name: 'Bacon frito', category: 'Carnes', unit: 'g', per100: { calories: 540, protein: 35, carbs: 1, fat: 44 } },

  // ─── FRANGO ───
  { id: 'peito-frango-grelhado', name: 'Peito de frango grelhado', category: 'Aves', unit: 'g', per100: { calories: 159, protein: 32, carbs: 0, fat: 3 } },
  { id: 'peito-frango-cru', name: 'Peito de frango cru', category: 'Aves', unit: 'g', per100: { calories: 119, protein: 24, carbs: 0, fat: 2.5 } },
  { id: 'coxa-frango', name: 'Coxa de frango assada (sem pele)', category: 'Aves', unit: 'g', per100: { calories: 187, protein: 26, carbs: 0, fat: 9 } },
  { id: 'sobrecoxa-frango', name: 'Sobrecoxa de frango assada', category: 'Aves', unit: 'g', per100: { calories: 215, protein: 24, carbs: 0, fat: 13 } },
  { id: 'asa-frango', name: 'Asa de frango assada', category: 'Aves', unit: 'g', per100: { calories: 261, protein: 25, carbs: 0, fat: 17 } },
  { id: 'frango-desfiado', name: 'Frango desfiado cozido', category: 'Aves', unit: 'g', per100: { calories: 170, protein: 30, carbs: 0, fat: 5 } },
  { id: 'nuggets', name: 'Nuggets de frango (empanado)', category: 'Aves', unit: 'g', per100: { calories: 255, protein: 15, carbs: 18, fat: 13 } },
  { id: 'frango-a-passarinho', name: 'Frango a passarinho frito', category: 'Aves', unit: 'g', per100: { calories: 290, protein: 24, carbs: 5, fat: 19 } },

  // ─── PEIXES E FRUTOS DO MAR ───
  { id: 'salmon', name: 'Salmão grelhado', category: 'Peixes', unit: 'g', per100: { calories: 208, protein: 28, carbs: 0, fat: 10 } },
  { id: 'tilapia', name: 'Tilápia grelhada', category: 'Peixes', unit: 'g', per100: { calories: 128, protein: 26, carbs: 0, fat: 3 } },
  { id: 'atum-natural', name: 'Atum em água (lata)', category: 'Peixes', unit: 'g', per100: { calories: 103, protein: 23, carbs: 0, fat: 1 } },
  { id: 'atum-oleo', name: 'Atum em óleo (lata)', category: 'Peixes', unit: 'g', per100: { calories: 190, protein: 20, carbs: 0, fat: 12 } },
  { id: 'sardinha', name: 'Sardinha em conserva', category: 'Peixes', unit: 'g', per100: { calories: 185, protein: 22, carbs: 0, fat: 11 } },
  { id: 'bacalhau', name: 'Bacalhau cozido desfiado', category: 'Peixes', unit: 'g', per100: { calories: 118, protein: 26, carbs: 0, fat: 1 } },
  { id: 'camarao', name: 'Camarão grelhado', category: 'Peixes', unit: 'g', per100: { calories: 99, protein: 21, carbs: 0.9, fat: 1 } },

  // ─── OVOS E DERIVADOS ───
  { id: 'ovo-inteiro', name: 'Ovo inteiro cozido', category: 'Ovos', unit: 'g', per100: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
  { id: 'clara-ovo', name: 'Clara de ovo cozida', category: 'Ovos', unit: 'g', per100: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 } },
  { id: 'gema-ovo', name: 'Gema de ovo', category: 'Ovos', unit: 'g', per100: { calories: 322, protein: 16, carbs: 3.6, fat: 27 } },
  { id: 'omelete', name: 'Omelete simples (1 ovo + azeite)', category: 'Ovos', unit: 'g', per100: { calories: 185, protein: 12, carbs: 1, fat: 15 } },

  // ─── EMBUTIDOS ───
  { id: 'peito-peru', name: 'Peito de peru fatiado', category: 'Embutidos', unit: 'g', per100: { calories: 109, protein: 18, carbs: 3, fat: 3 } },
  { id: 'presunto', name: 'Presunto fatiado', category: 'Embutidos', unit: 'g', per100: { calories: 145, protein: 15, carbs: 5, fat: 7 } },
  { id: 'mortadela', name: 'Mortadela fatiada', category: 'Embutidos', unit: 'g', per100: { calories: 295, protein: 12, carbs: 3, fat: 26 } },
  { id: 'salsicha', name: 'Salsicha de frango', category: 'Embutidos', unit: 'g', per100: { calories: 280, protein: 12, carbs: 7, fat: 23 } },
  { id: 'linguica-calabresa', name: 'Linguiça calabresa', category: 'Embutidos', unit: 'g', per100: { calories: 380, protein: 16, carbs: 2, fat: 35 } },
  { id: 'linguica-frango', name: 'Linguiça de frango', category: 'Embutidos', unit: 'g', per100: { calories: 250, protein: 15, carbs: 4, fat: 20 } },
  { id: 'salame', name: 'Salame italiano', category: 'Embutidos', unit: 'g', per100: { calories: 440, protein: 22, carbs: 2, fat: 38 } },
  { id: 'apresuntado', name: 'Apresuntado fatiado', category: 'Embutidos', unit: 'g', per100: { calories: 120, protein: 14, carbs: 4, fat: 5 } },

  // ─── LATICÍNIOS ───
  { id: 'queijo-mucarela', name: 'Queijo muçarela', category: 'Laticínios', unit: 'g', per100: { calories: 300, protein: 22, carbs: 2.2, fat: 23 } },
  { id: 'queijo-prato', name: 'Queijo prato', category: 'Laticínios', unit: 'g', per100: { calories: 358, protein: 25, carbs: 2, fat: 28 } },
  { id: 'queijo-coalho', name: 'Queijo coalho', category: 'Laticínios', unit: 'g', per100: { calories: 305, protein: 21, carbs: 3, fat: 24 } },
  { id: 'queijo-cottage', name: 'Cottage cheese', category: 'Laticínios', unit: 'g', per100: { calories: 98, protein: 11, carbs: 3.4, fat: 4.3 } },
  { id: 'queijo-ricota', name: 'Ricota', category: 'Laticínios', unit: 'g', per100: { calories: 174, protein: 11, carbs: 3, fat: 13 } },
  { id: 'requeijao', name: 'Requeijão cremoso', category: 'Laticínios', unit: 'g', per100: { calories: 245, protein: 7, carbs: 3, fat: 23 } },
  { id: 'iogurte-natural', name: 'Iogurte natural integral', category: 'Laticínios', unit: 'g', per100: { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 } },
  { id: 'iogurte-grego', name: 'Iogurte grego natural 0%', category: 'Laticínios', unit: 'g', per100: { calories: 57, protein: 9.6, carbs: 3.8, fat: 0.4 } },
  { id: 'leite-integral', name: 'Leite integral', category: 'Laticínios', unit: 'ml', per100: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 } },
  { id: 'leite-desnatado', name: 'Leite desnatado', category: 'Laticínios', unit: 'ml', per100: { calories: 35, protein: 3.4, carbs: 5.1, fat: 0.2 } },
  { id: 'leite-semidesnatado', name: 'Leite semidesnatado', category: 'Laticínios', unit: 'ml', per100: { calories: 47, protein: 3.3, carbs: 5.0, fat: 1.5 } },

  // ─── PROTEÍNA EM PÓ ───
  { id: 'whey-protein', name: 'Whey Protein (dose de 30g)', category: 'Suplementos', unit: 'g', per100: { calories: 370, protein: 75, carbs: 12, fat: 4 } },
  { id: 'albumina', name: 'Albumina em pó', category: 'Suplementos', unit: 'g', per100: { calories: 360, protein: 80, carbs: 7, fat: 0.5 } },

  // ─── LEGUMES E VERDURAS ───
  { id: 'brocolis', name: 'Brócolis cozido', category: 'Vegetais', unit: 'g', per100: { calories: 34, protein: 3.6, carbs: 4, fat: 0.4 } },
  { id: 'couve-flor', name: 'Couve-flor cozida', category: 'Vegetais', unit: 'g', per100: { calories: 22, protein: 2, carbs: 3, fat: 0.2 } },
  { id: 'espinafre', name: 'Espinafre cru', category: 'Vegetais', unit: 'g', per100: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
  { id: 'couve-manteiga', name: 'Couve manteiga refogada', category: 'Vegetais', unit: 'g', per100: { calories: 44, protein: 3, carbs: 4, fat: 1.5 } },
  { id: 'alface', name: 'Alface cru', category: 'Vegetais', unit: 'g', per100: { calories: 13, protein: 1.3, carbs: 1.6, fat: 0.2 } },
  { id: 'tomate', name: 'Tomate fresco', category: 'Vegetais', unit: 'g', per100: { calories: 15, protein: 0.9, carbs: 3.2, fat: 0.2 } },
  { id: 'cenoura', name: 'Cenoura crua', category: 'Vegetais', unit: 'g', per100: { calories: 34, protein: 0.6, carbs: 8, fat: 0.1 } },
  { id: 'chuchu', name: 'Chuchu cozido', category: 'Vegetais', unit: 'g', per100: { calories: 24, protein: 0.8, carbs: 5, fat: 0.1 } },
  { id: 'abobrinha', name: 'Abobrinha cozida', category: 'Vegetais', unit: 'g', per100: { calories: 17, protein: 1.2, carbs: 2.9, fat: 0.3 } },
  { id: 'pepino', name: 'Pepino cru', category: 'Vegetais', unit: 'g', per100: { calories: 13, protein: 0.7, carbs: 2.4, fat: 0.1 } },
  { id: 'beterraba', name: 'Beterraba cozida', category: 'Vegetais', unit: 'g', per100: { calories: 43, protein: 1.6, carbs: 9.6, fat: 0.1 } },
  { id: 'cebola', name: 'Cebola crua', category: 'Vegetais', unit: 'g', per100: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 } },
  { id: 'pimentao', name: 'Pimentão cru', category: 'Vegetais', unit: 'g', per100: { calories: 28, protein: 0.9, carbs: 6, fat: 0.3 } },
  { id: 'quiabo', name: 'Quiabo cozido', category: 'Vegetais', unit: 'g', per100: { calories: 25, protein: 1.9, carbs: 4, fat: 0.2 } },
  { id: 'jiló', name: 'Jiló cozido', category: 'Vegetais', unit: 'g', per100: { calories: 18, protein: 0.8, carbs: 3.5, fat: 0.2 } },
  { id: 'mandioquinha', name: 'Mandioquinha cozida', category: 'Vegetais', unit: 'g', per100: { calories: 90, protein: 1.8, carbs: 20, fat: 0.3 } },

  // ─── LEGUMINOSAS ───
  { id: 'feijao-preto', name: 'Feijão preto cozido', category: 'Leguminosas', unit: 'g', per100: { calories: 77, protein: 4.5, carbs: 14, fat: 0.5 } },
  { id: 'feijao-carioca', name: 'Feijão carioca cozido', category: 'Leguminosas', unit: 'g', per100: { calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5 } },
  { id: 'lentilha', name: 'Lentilha cozida', category: 'Leguminosas', unit: 'g', per100: { calories: 116, protein: 9, carbs: 20, fat: 0.4 } },
  { id: 'grao-bico', name: 'Grão de bico cozido', category: 'Leguminosas', unit: 'g', per100: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6 } },
  { id: 'soja', name: 'Soja cozida', category: 'Leguminosas', unit: 'g', per100: { calories: 141, protein: 12, carbs: 11, fat: 6 } },
  { id: 'proteina-soja', name: 'Proteína de soja texturizada (hidratada)', category: 'Leguminosas', unit: 'g', per100: { calories: 62, protein: 8, carbs: 5, fat: 0.5 } },
  { id: 'ervilha', name: 'Ervilha em conserva (lata)', category: 'Leguminosas', unit: 'g', per100: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4 } },
  { id: 'milho', name: 'Milho verde em conserva', category: 'Leguminosas', unit: 'g', per100: { calories: 69, protein: 2.6, carbs: 15, fat: 1 } },

  // ─── CARBOIDRATOS / GRÃOS ───
  { id: 'arroz-branco', name: 'Arroz branco cozido', category: 'Carboidratos', unit: 'g', per100: { calories: 128, protein: 2.5, carbs: 28, fat: 0.2 } },
  { id: 'arroz-integral', name: 'Arroz integral cozido', category: 'Carboidratos', unit: 'g', per100: { calories: 124, protein: 2.6, carbs: 25.8, fat: 1 } },
  { id: 'macarrao-cozido', name: 'Macarrão cozido (sem molho)', category: 'Carboidratos', unit: 'g', per100: { calories: 131, protein: 4.5, carbs: 27, fat: 0.9 } },
  { id: 'pao-frances', name: 'Pão francês (50g = 1 pão)', category: 'Carboidratos', unit: 'g', per100: { calories: 296, protein: 9.4, carbs: 58, fat: 3.1 } },
  { id: 'pao-de-forma', name: 'Pão de forma integral', category: 'Carboidratos', unit: 'g', per100: { calories: 243, protein: 8.5, carbs: 43, fat: 4 } },
  { id: 'pao-de-queijo', name: 'Pão de queijo (unidade ~25g)', category: 'Carboidratos', unit: 'g', per100: { calories: 337, protein: 5, carbs: 49, fat: 14 } },
  { id: 'batata-cozida', name: 'Batata cozida', category: 'Carboidratos', unit: 'g', per100: { calories: 86, protein: 2, carbs: 20, fat: 0.1 } },
  { id: 'batata-doce', name: 'Batata doce cozida', category: 'Carboidratos', unit: 'g', per100: { calories: 77, protein: 1.4, carbs: 18, fat: 0.1 } },
  { id: 'mandioca', name: 'Mandioca cozida', category: 'Carboidratos', unit: 'g', per100: { calories: 125, protein: 0.6, carbs: 30, fat: 0.3 } },
  { id: 'aveia', name: 'Aveia em flocos', category: 'Carboidratos', unit: 'g', per100: { calories: 394, protein: 13.9, carbs: 66.6, fat: 8.5 } },
  { id: 'tapioca', name: 'Tapioca (2 colheres = 30g)', category: 'Carboidratos', unit: 'g', per100: { calories: 359, protein: 0, carbs: 88, fat: 0 } },
  { id: 'cuscuz', name: 'Cuscuz de milho cozido', category: 'Carboidratos', unit: 'g', per100: { calories: 102, protein: 2, carbs: 22, fat: 0.5 } },
  { id: 'granola', name: 'Granola tradicional', category: 'Carboidratos', unit: 'g', per100: { calories: 430, protein: 10, carbs: 65, fat: 15 } },

  // ─── FRUTAS ───
  { id: 'banana', name: 'Banana prata', category: 'Frutas', unit: 'g', per100: { calories: 98, protein: 1.3, carbs: 26, fat: 0.1 } },
  { id: 'banana-nanica', name: 'Banana nanica', category: 'Frutas', unit: 'g', per100: { calories: 92, protein: 1.2, carbs: 23.8, fat: 0.1 } },
  { id: 'maca', name: 'Maçã com casca', category: 'Frutas', unit: 'g', per100: { calories: 56, protein: 0.3, carbs: 15.2, fat: 0.1 } },
  { id: 'laranja', name: 'Laranja pera', category: 'Frutas', unit: 'g', per100: { calories: 37, protein: 0.9, carbs: 8.9, fat: 0.1 } },
  { id: 'manga', name: 'Manga tommy', category: 'Frutas', unit: 'g', per100: { calories: 64, protein: 0.4, carbs: 16.9, fat: 0.3 } },
  { id: 'abacate', name: 'Abacate', category: 'Frutas', unit: 'g', per100: { calories: 196, protein: 2.3, carbs: 6.6, fat: 19.5 } },
  { id: 'morango', name: 'Morango fresco', category: 'Frutas', unit: 'g', per100: { calories: 30, protein: 0.7, carbs: 7, fat: 0.3 } },
  { id: 'uva', name: 'Uva itália', category: 'Frutas', unit: 'g', per100: { calories: 69, protein: 0.7, carbs: 17.9, fat: 0.2 } },
  { id: 'melancia', name: 'Melancia', category: 'Frutas', unit: 'g', per100: { calories: 33, protein: 0.6, carbs: 8.1, fat: 0.2 } },
  { id: 'mamao', name: 'Mamão formosa', category: 'Frutas', unit: 'g', per100: { calories: 40, protein: 0.5, carbs: 10.4, fat: 0.1 } },
  { id: 'abacaxi', name: 'Abacaxi fresco', category: 'Frutas', unit: 'g', per100: { calories: 48, protein: 0.9, carbs: 12.3, fat: 0.1 } },

  // ─── OLEAGINOSAS ───
  { id: 'amendoim', name: 'Amendoim torrado s/ sal', category: 'Oleaginosas', unit: 'g', per100: { calories: 568, protein: 24, carbs: 21, fat: 46 } },
  { id: 'pasta-amendoim', name: 'Pasta de amendoim integral', category: 'Oleaginosas', unit: 'g', per100: { calories: 590, protein: 25, carbs: 22, fat: 50 } },
  { id: 'castanha-para', name: 'Castanha do Pará', category: 'Oleaginosas', unit: 'g', per100: { calories: 656, protein: 14, carbs: 12, fat: 66 } },
  { id: 'castanha-caju', name: 'Castanha de caju (s/ sal)', category: 'Oleaginosas', unit: 'g', per100: { calories: 570, protein: 18, carbs: 32, fat: 44 } },
  { id: 'nozes', name: 'Nozes cruas', category: 'Oleaginosas', unit: 'g', per100: { calories: 654, protein: 15, carbs: 14, fat: 65 } },
  { id: 'amendoa', name: 'Amêndoa sem pele', category: 'Oleaginosas', unit: 'g', per100: { calories: 578, protein: 21, carbs: 19, fat: 50 } },

  // ─── GORDURAS E CONDIMENTOS ───
  { id: 'azeite', name: 'Azeite de oliva', category: 'Gorduras', unit: 'ml', per100: { calories: 884, protein: 0, carbs: 0, fat: 100 } },
  { id: 'manteiga', name: 'Manteiga comum', category: 'Gorduras', unit: 'g', per100: { calories: 717, protein: 0.5, carbs: 0, fat: 81 } },
  { id: 'margarina', name: 'Margarina cremosa', category: 'Gorduras', unit: 'g', per100: { calories: 610, protein: 0.2, carbs: 0.3, fat: 68 } },
  { id: 'oleo-coco', name: 'Óleo de coco', category: 'Gorduras', unit: 'ml', per100: { calories: 890, protein: 0, carbs: 0, fat: 99 } },

  // ─── LANCHES E FAST FOOD ───
  { id: 'x-burguer', name: 'X-Burguer (pão + carne + queijo)', category: 'Lanches', unit: 'g', per100: { calories: 265, protein: 14, carbs: 24, fat: 12 } },
  { id: 'x-salada', name: 'X-Salada', category: 'Lanches', unit: 'g', per100: { calories: 240, protein: 13, carbs: 22, fat: 11 } },
  { id: 'x-bacon', name: 'X-Bacon', category: 'Lanches', unit: 'g', per100: { calories: 295, protein: 15, carbs: 24, fat: 15 } },
  { id: 'pizza-mussarela', name: 'Pizza mussarela (1 fatia ~100g)', category: 'Lanches', unit: 'g', per100: { calories: 266, protein: 11, carbs: 30, fat: 12 } },
  { id: 'pizza-calabresa', name: 'Pizza calabresa (1 fatia ~100g)', category: 'Lanches', unit: 'g', per100: { calories: 282, protein: 11, carbs: 30, fat: 14 } },
  { id: 'coxinha', name: 'Coxinha de frango (1 un ~80g)', category: 'Lanches', unit: 'g', per100: { calories: 280, protein: 11, carbs: 30, fat: 13 } },
  { id: 'esfiha-carne', name: 'Esfiha de carne aberta', category: 'Lanches', unit: 'g', per100: { calories: 260, protein: 9, carbs: 35, fat: 10 } },
  { id: 'pao-de-mel', name: 'Pão de mel', category: 'Lanches', unit: 'g', per100: { calories: 390, protein: 4, carbs: 60, fat: 14 } },
  { id: 'hot-dog', name: 'Hot-dog completo', category: 'Lanches', unit: 'g', per100: { calories: 250, protein: 9.5, carbs: 27, fat: 12 } },
  { id: 'batata-frita', name: 'Batata frita (porção)', category: 'Lanches', unit: 'g', per100: { calories: 312, protein: 3.4, carbs: 41, fat: 15 } },

  // ─── DOCES E SOBREMESAS ───
  { id: 'chocolate-ao-leite', name: 'Chocolate ao leite', category: 'Doces', unit: 'g', per100: { calories: 535, protein: 7, carbs: 60, fat: 30 } },
  { id: 'chocolate-70', name: 'Chocolate amargo 70%', category: 'Doces', unit: 'g', per100: { calories: 598, protein: 8, carbs: 46, fat: 43 } },
  { id: 'sorvete', name: 'Sorvete de creme', category: 'Doces', unit: 'g', per100: { calories: 207, protein: 3.5, carbs: 25, fat: 11 } },
  { id: 'biscoito-cream-cracker', name: 'Biscoito cream cracker', category: 'Doces', unit: 'g', per100: { calories: 438, protein: 9, carbs: 65, fat: 16 } },
  { id: 'biscoito-recheado', name: 'Biscoito recheado (Oreo, Trakinas)', category: 'Doces', unit: 'g', per100: { calories: 490, protein: 5, carbs: 68, fat: 22 } },
  { id: 'bolo-simples', name: 'Bolo simples de fubá', category: 'Doces', unit: 'g', per100: { calories: 360, protein: 6, carbs: 57, fat: 13 } },
  { id: 'brigadeiro', name: 'Brigadeiro (1 un ~20g)', category: 'Doces', unit: 'g', per100: { calories: 400, protein: 5, carbs: 58, fat: 18 } },

  // ─── BEBIDAS ───
  { id: 'agua', name: 'Água', category: 'Bebidas', unit: 'ml', per100: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
  { id: 'cafe-puro', name: 'Café preto sem açúcar', category: 'Bebidas', unit: 'ml', per100: { calories: 2, protein: 0.3, carbs: 0, fat: 0 } },
  { id: 'cha-sem-acucar', name: 'Chá sem açúcar', category: 'Bebidas', unit: 'ml', per100: { calories: 1, protein: 0, carbs: 0.3, fat: 0 } },
  { id: 'suco-laranja', name: 'Suco de laranja natural', category: 'Bebidas', unit: 'ml', per100: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 } },
  { id: 'refrigerante-cola', name: 'Refrigerante cola (Coca/Pepsi)', category: 'Bebidas', unit: 'ml', per100: { calories: 37, protein: 0, carbs: 9.6, fat: 0 } },
  { id: 'refrigerante-zero', name: 'Refrigerante zero/diet', category: 'Bebidas', unit: 'ml', per100: { calories: 0, protein: 0, carbs: 0.1, fat: 0 } },
  { id: 'cerveja', name: 'Cerveja lager 5%', category: 'Bebidas', unit: 'ml', per100: { calories: 43, protein: 0.5, carbs: 3.6, fat: 0 } },
  { id: 'vinho-tinto', name: 'Vinho tinto seco', category: 'Bebidas', unit: 'ml', per100: { calories: 85, protein: 0.1, carbs: 2.6, fat: 0 } },
  { id: 'leite-vegetal', name: 'Leite de amêndoas sem açúcar', category: 'Bebidas', unit: 'ml', per100: { calories: 13, protein: 0.5, carbs: 0.6, fat: 1.1 } },
  { id: 'energetico', name: 'Energético (RedBull, Monster)', category: 'Bebidas', unit: 'ml', per100: { calories: 45, protein: 0.6, carbs: 11, fat: 0 } },
  { id: 'isojonico', name: 'Isotônico (Gatorade, Powerade)', category: 'Bebidas', unit: 'ml', per100: { calories: 26, protein: 0, carbs: 6.4, fat: 0 } },

  // ─── MARCAS POPULARES ───
  { id: 'whey-max-titanium', name: 'Whey 100% Max Titanium (30g)', category: 'Suplementos', unit: 'g', per100: { calories: 370, protein: 73, carbs: 10, fat: 5.5 } },
  { id: 'creatina', name: 'Creatina monohidratada (por dose 5g)', category: 'Suplementos', unit: 'g', per100: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
  { id: 'activia', name: 'Iogurte Activia natural (Danone)', category: 'Laticínios', unit: 'g', per100: { calories: 74, protein: 3.6, carbs: 9.8, fat: 2.5 } },
  { id: 'requeijao-catupiry', name: 'Catupiry original cremoso', category: 'Laticínios', unit: 'g', per100: { calories: 290, protein: 7, carbs: 2.5, fat: 28 } },
].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

export const FOOD_CATEGORIES = [...new Set(FOOD_DATABASE.map(f => f.category))]

export function searchFoods(query: string, limit = 10): FoodItem[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return FOOD_DATABASE
    .filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
    .slice(0, limit)
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find(f => f.id === id)
}

export function calcNutrition(food: FoodItem, grams: number) {
  const factor = grams / 100
  return {
    calories: Math.round(food.per100.calories * factor),
    protein: Math.round(food.per100.protein * factor * 10) / 10,
    carbs: Math.round(food.per100.carbs * factor * 10) / 10,
    fat: Math.round(food.per100.fat * factor * 10) / 10,
  }
}
