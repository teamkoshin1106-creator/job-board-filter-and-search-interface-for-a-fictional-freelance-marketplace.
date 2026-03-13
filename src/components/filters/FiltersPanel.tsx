/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FilterState, Category, ExperienceLevel } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertCircle, X } from 'lucide-react';

const CATEGORIES: Category[] = ["Web Development", "Mobile Dev", "Design", "Writing", "Marketing"];
const EXPERIENCE_LEVELS: (ExperienceLevel | "All")[] = ["All", "Beginner", "Intermediate", "Expert"];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
  showClear?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, onClear, showClear }) => (
  <div className="py-10 first:pt-0 border-t first:border-t-0 border-slate-100/80">
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400/80">{title}</h4>
      {showClear && onClear && (
        <button 
          onClick={onClear}
          className="px-4 py-1.5 rounded-full bg-primary/5 text-[10px] font-black text-primary border border-primary/10 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all duration-300 active:scale-95"
        >
          Clear
        </button>
      )}
    </div>
    <div className="px-1">
      {children}
    </div>
  </div>
);

export const FiltersPanel: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  className?: string;
}> = ({ filters, setFilters, onReset, className = "" }) => {
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const toggleCategory = (category: Category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleExperienceChange = (level: ExperienceLevel | "All") => {
    setFilters(prev => ({
      ...prev,
      experienceLevels: level === "All" ? [] : [level]
    }));
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
    if (isNaN(value)) return;

    setFilters(prev => {
      const newRange = [...prev.budgetRange] as [number, number];
      newRange[index] = value;
      return { ...prev, budgetRange: newRange };
    });
  };

  useEffect(() => {
    if (filters.budgetRange[1] < filters.budgetRange[0]) {
      setBudgetError("Max budget cannot be less than min budget");
    } else {
      setBudgetError(null);
    }
  }, [filters.budgetRange]);

  return (
    <div className={`flex flex-col h-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100/80 ${className}`}>
      <div className="flex-1 overflow-y-auto pr-4 -mr-4">
        <FilterSection 
          title="Categories" 
          showClear={filters.categories.length > 0}
          onClear={() => setFilters(prev => ({ ...prev, categories: [] }))}
        >
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                  ${filters.categories.includes(category)
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Experience Level">
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map(level => (
              <label key={level} className={`
                flex items-center p-3 rounded-2xl border transition-all cursor-pointer group
                ${(level === "All" ? filters.experienceLevels.length === 0 : filters.experienceLevels.includes(level as ExperienceLevel))
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-50 hover:border-slate-200 bg-slate-50/50 text-slate-500'}
              `}>
                <div className={`
                  flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all
                  ${(level === "All" ? filters.experienceLevels.length === 0 : filters.experienceLevels.includes(level as ExperienceLevel))
                    ? 'border-primary bg-primary'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'}
                `}>
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <input
                  type="radio"
                  name="experience"
                  checked={level === "All" ? filters.experienceLevels.length === 0 : filters.experienceLevels.includes(level as ExperienceLevel)}
                  onChange={() => handleExperienceChange(level)}
                  className="sr-only"
                />
                <span className="ml-3 text-sm font-bold">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Budget Range (₹)">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Min</label>
                <input
                  type="number"
                  value={filters.budgetRange[0]}
                  onChange={(e) => handleBudgetInputChange(e, 0)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Max</label>
                <input
                  type="number"
                  value={filters.budgetRange[1]}
                  onChange={(e) => handleBudgetInputChange(e, 1)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            {budgetError && (
              <div className="flex items-start text-red-500 text-[10px] font-bold bg-red-50 p-2 rounded-lg">
                <AlertCircle size={12} className="mr-1.5 mt-0.5 shrink-0" />
                <span>{budgetError}</span>
              </div>
            )}
          </div>
        </FilterSection>
      </div>

      <div className="pt-10 mt-auto">
        <button 
          onClick={onReset}
          className="group relative w-full py-5 rounded-2xl bg-slate-50 border-2 border-transparent text-xs font-black text-slate-400 hover:text-white transition-all duration-500 uppercase tracking-[0.2em] overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Reset All Filters</span>
        </button>
      </div>
    </div>
  );
};
