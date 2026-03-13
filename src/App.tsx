/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, LayoutGrid, List as ListIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gigs as initialGigs } from './data';
import { Gig, FilterState, SortOption, Category, ExperienceLevel } from './types';
import { GigCard } from './components/gigs/GigCard';
import { GigSkeleton } from './components/gigs/GigSkeleton';
import { GigFilters } from './components/gigs/GigFilters';
import { GigDetailModal } from './components/gigs/GigDetailModal';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';

// Custom hook for debouncing search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const INITIAL_FILTERS: FilterState = {
  categories: [],
  budgetRange: [5000, 50000],
  experienceLevels: []
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Simulate data fetching whenever filters or search change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second simulation as per requirements
    return () => clearTimeout(timer);
  }, [debouncedSearch, filters, sortBy]);

  /**
   * Core Filtering Logic
   * Combines search query, category selection, experience level, and budget range.
   * All filters are applied additively (AND logic).
   */
  const filteredGigs = useMemo(() => {
    return initialGigs
      .filter(gig => {
        // 1. Search Filter: Checks title and description (case-insensitive)
        const matchesSearch = 
          gig.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          gig.description.toLowerCase().includes(debouncedSearch.toLowerCase());
        
        // 2. Category Filter: Matches if no categories selected OR gig category is in the selected list
        const matchesCategory = 
          filters.categories.length === 0 || 
          filters.categories.includes(gig.category as Category);
        
        // 3. Experience Filter: Matches if no levels selected OR gig level is in the selected list
        const matchesExperience = 
          filters.experienceLevels.length === 0 || 
          filters.experienceLevels.includes(gig.experienceLevel as ExperienceLevel);
        
        // 4. Budget Filter: Checks if gig budget falls within the min/max range
        const matchesBudget = 
          gig.budget >= filters.budgetRange[0] && 
          gig.budget <= filters.budgetRange[1];

        return matchesSearch && matchesCategory && matchesExperience && matchesBudget;
      })
      .sort((a, b) => {
        // Sorting Logic based on selected sort option
        switch (sortBy) {
          case 'newest':
            return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
          case 'oldest':
            return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
          case 'budget_high':
            return b.budget - a.budget;
          case 'budget_low':
            return a.budget - b.budget;
          default:
            return 0;
        }
      });
  }, [debouncedSearch, filters, sortBy]);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans text-text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Briefcase size={22} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-text-primary">GigNest</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search for projects, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">Post a Job</Button>
            <Button size="sm">Sign In</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Search & Filter Toggle */}
        <div className="mb-6 flex flex-col gap-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="flex items-center">
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
            </span>
            {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : (v[0] !== 5000 || v[1] !== 50000)) && (
              <span className="h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Desktop Filters - Above Results */}
        <div className="hidden lg:block mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <GigFilters 
              filters={filters} 
              setFilters={setFilters} 
              onReset={resetFilters} 
            />
          </div>
        </div>

        {/* Results Info & Sort */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-text-primary tracking-tight">
              Showing {filteredGigs.length} of {initialGigs.length} gigs
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 transition-colors"
                >
                  {cat} <X size={10} className="ml-1" />
                </button>
              ))}
              {filters.experienceLevels.map(exp => (
                <button
                  key={exp}
                  onClick={() => setFilters(prev => ({ ...prev, experienceLevels: prev.experienceLevels.filter(e => e !== exp) }))}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 transition-colors"
                >
                  {exp} <X size={10} className="ml-1" />
                </button>
              ))}
              {(filters.budgetRange[0] !== 5000 || filters.budgetRange[1] !== 50000) && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, budgetRange: [5000, 50000] }))}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 transition-colors"
                >
                  ₹{filters.budgetRange[0]} - ₹{filters.budgetRange[1]} <X size={10} className="ml-1" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon size={20} />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-slate-100 shadow-sm rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget_high">Highest Budget</option>
                <option value="budget_low">Lowest Budget</option>
              </select>
              <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Gig Grid */}
        {isLoading ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <GigSkeleton key={i} />
            ))}
          </div>
        ) : filteredGigs.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence mode="popLayout">
              {filteredGigs.map(gig => (
                <GigCard 
                  key={gig.id} 
                  gig={gig} 
                  onClick={setSelectedGig} 
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-black text-text-primary">No results found</h3>
            <p className="mt-2 text-text-secondary max-w-sm">
              We couldn't find any gigs matching your current filters. Try adjusting your search or filters to see more opportunities.
            </p>
            <Button variant="primary" className="mt-8 px-8 py-6 rounded-2xl font-black" onClick={resetFilters}>
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-bold">Filters</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <GigFilters 
                filters={filters} 
                setFilters={setFilters} 
                onReset={resetFilters} 
              />
              <div className="mt-8">
                <Button className="w-full" onClick={() => setIsSidebarOpen(false)}>
                  Show {filteredGigs.length} Results
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Gig Detail Modal */}
      <GigDetailModal 
        gig={selectedGig} 
        onClose={() => setSelectedGig(null)} 
      />
    </div>
  );
}
