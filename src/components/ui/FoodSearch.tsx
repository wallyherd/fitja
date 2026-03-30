'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { type FoodItem, searchFoods, calcNutrition } from '@/data/foods'

type SelectedFood = {
  food: FoodItem
  grams: number
}

type FoodSearchInputProps = {
  onChange: (item: SelectedFood | null) => void
  value?: SelectedFood | null
  placeholder?: string
}

export function FoodSearchInput({ onChange, value, placeholder = 'Buscar alimento...' }: FoodSearchInputProps) {
  const [query, setQuery] = useState(value?.food.name ?? '')
  const [results, setResults] = useState<FoodItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<FoodItem | null>(value?.food ?? null)
  const [grams, setGrams] = useState<string>(value?.grams?.toString() ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const nutrition = selected && grams ? calcNutrition(selected, parseFloat(grams) || 0) : null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (q: string) => {
    setQuery(q)
    const found = searchFoods(q)
    setResults(found)
    setIsOpen(found.length > 0)
    
    // Se no houver seleo, mas houver texto, reporta como "custom"
    if (q.length > 0) {
      const customFood: FoodItem = {
        id: `custom-${Date.now()}`,
        name: q,
        category: 'Personalizado',
        unit: 'g',
        per100: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      }
      setSelected(customFood)
      const currentGrams = grams || '100'
      if (!grams) setGrams('100')
      onChange({ food: customFood, grams: parseFloat(currentGrams) })
    } else {
      setSelected(null)
      onChange(null)
    }
  }

  const handleSelect = (food: FoodItem) => {
    setSelected(food)
    setQuery(food.name)
    setIsOpen(false)
    setResults([])
    const currentGrams = grams || '100'
    if (!grams) setGrams('100')
    onChange({ food, grams: parseFloat(currentGrams) })
  }

  const handleGramsChange = (val: string) => {
    setGrams(val)
    if (selected) {
      onChange({ food: selected, grams: parseFloat(val) || 0 })
    }
  }

  const handleClear = () => {
    setSelected(null)
    setQuery('')
    setGrams('')
    setResults([])
    setIsOpen(false)
    onChange(null)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-2">
      {/* Campo de busca */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true)
            }}
            placeholder={placeholder}
            className={`w-full pl-9 pr-9 py-3 rounded-2xl border-2 text-sm font-medium text-zinc-800 bg-white transition-all outline-none
              ${selected
                ? 'border-brand-500 bg-brand-50/30'
                : 'border-zinc-100 focus:border-brand-300'
              }`}
          />
          {query && (
            <button onClick={handleClear} className="absolute right-3 text-zinc-400 hover:text-zinc-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-hover border border-zinc-100 overflow-hidden max-h-60 overflow-y-auto">
            {results.map(food => (
              <button
                key={food.id}
                onClick={() => handleSelect(food)}
                className="w-full text-left px-4 py-3 hover:bg-brand-50 transition-colors border-b border-zinc-50 last:border-0 flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-bold text-zinc-800 group-hover:text-brand-700">{food.name}</p>
                  <p className="text-xs text-zinc-400">{food.category} · {food.per100.calories} kcal/100{food.unit}</p>
                </div>
                <div className="text-xs text-zinc-300 font-bold">
                  P {food.per100.protein}g · C {food.per100.carbs}g · G {food.per100.fat}g
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Após selecionar: campo de quantidade + preview de macros */}
      {selected && (
        <div className="bg-brand-50 rounded-2xl p-3 space-y-3 border border-brand-100">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-brand-700 mb-1 block">
                Quantidade ({selected.unit === 'ml' ? 'ml' : 'g'})
              </label>
              <input
                type="number"
                value={grams}
                onChange={e => handleGramsChange(e.target.value)}
                placeholder={`Ex: 150`}
                min="1"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-brand-200 text-sm font-bold text-zinc-800 bg-white outline-none focus:border-brand-500 transition-all"
              />
            </div>
            <div className="text-xs text-zinc-400 mt-5 font-bold">{selected.unit === 'ml' ? 'ml' : 'g'}</div>
          </div>

          {/* Preview de Macros ou Input Manual para Custom */}
          {selected.category === 'Personalizado' ? (
             <div className="pt-1">
                <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 mb-1 block">Calorias (Opcional)</label>
                <input
                  type="number"
                  placeholder="Estimativa de Kcal..."
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-orange-200 text-sm font-bold text-zinc-800 bg-white outline-none focus:border-orange-500 transition-all text-center"
                  onChange={(e) => {
                    const kcal = parseFloat(e.target.value) || 0
                    const updatedFood = { ...selected, per100: { ...selected.per100, calories: kcal * 100 / (parseFloat(grams) || 100) } }
                    setSelected(updatedFood)
                    onChange({ food: updatedFood, grams: parseFloat(grams) || 100 })
                  }}
                />
             </div>
          ) : (
            nutrition && parseFloat(grams) > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                <MacroChip label="Kcal" value={nutrition.calories.toString()} color="text-orange-600 bg-orange-50" />
                <MacroChip label="Prot" value={`${nutrition.protein}g`} color="text-blue-600 bg-blue-50" />
                <MacroChip label="Carb" value={`${nutrition.carbs}g`} color="text-green-600 bg-green-50" />
                <MacroChip label="Gord" value={`${nutrition.fat}g`} color="text-yellow-600 bg-yellow-50" />
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-xl px-2 py-1.5 text-center ${color}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  )
}

// ─── Versão para linha de item (múltiplos alimentos por refeição) ───
type MealItemRowProps = {
  index: number
  onChange: (index: number, item: SelectedFood | null) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function MealItemRow({ index, onChange, onRemove, canRemove }: MealItemRowProps) {
  return (
    <div className="relative">
      <FoodSearchInput
        placeholder={`Alimento ${index + 1}...`}
        onChange={item => onChange(index, item)}
      />
      {canRemove && (
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-rose-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
