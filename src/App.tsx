/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, LayoutGrid, List as ListIcon, X, User, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gigs as initialGigs } from './data';
import { Gig, FilterState, SortOption, Category, ExperienceLevel, User as UserType } from './types';
import { GigCard } from './components/gigs/GigCard';
import { GigSkeleton } from './components/gigs/GigSkeleton';
import { FiltersPanel } from './components/filters/FiltersPanel';
import { ActiveFilters } from './components/filters/ActiveFilters';
import { GigDetailModal } from './components/gigs/GigDetailModal';
import { SignUpModal } from './components/SignUpModal';
import { ProfilePage } from './components/ProfilePage';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';

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
  experienceLevels: [],
  showRecommended: false
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gignest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setIsSignUpOpen(true);
    }
  }, []);

  const handleSignUp = (userData: UserType) => {
    const newUser = { ...userData, appliedGigIds: userData.appliedGigIds || [] };
    setUser(newUser);
    localStorage.setItem('gignest_user', JSON.stringify(newUser));
    setIsSignUpOpen(false);
    // Automatically show recommended if they have skills
    if (userData.skills.length > 0) {
      setFilters(prev => ({ ...prev, showRecommended: true }));
    }
  };

  const handleUpdateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
    localStorage.setItem('gignest_user', JSON.stringify(updatedUser));
  };

  const handleApply = (gigId: number) => {
    if (!user) {
      setIsSignUpOpen(true);
      return;
    }
    if (user.appliedGigIds.includes(gigId)) return;
    
    const updatedUser = {
      ...user,
      appliedGigIds: [...user.appliedGigIds, gigId]
    };
    handleUpdateUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gignest_user');
    setFilters(INITIAL_FILTERS);
    setCurrentPage('home');
  };

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
        // 0. Recommendation Filter: If active, only show gigs matching user skills
        if (filters.showRecommended && user && (user.skills || []).length > 0) {
          if (!(user.skills || []).includes(gig.category as Category)) return false;
        }

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

  if (currentPage === 'profile' && user) {
    return (
      <ProfilePage 
        user={user} 
        onBack={() => setCurrentPage('home')} 
        onLogout={handleLogout} 
        onUpdateUser={handleUpdateUser}
      />
    );
  }

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
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Welcome back,</p>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                </div>
                <div className="group relative">
                  <button 
                    onClick={() => setCurrentPage('profile')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="rounded-2xl bg-white p-4 shadow-2xl border border-slate-100">
                      <div className="mb-3 border-b border-slate-50 pb-3">
                        <p className="text-xs font-black uppercase tracking-widest text-text-secondary mb-1">Your Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {user.skills.length > 0 ? user.skills.map(skill => (
                            <span key={skill} className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded uppercase">{skill}</span>
                          )) : <span className="text-[10px] text-slate-400">No skills added</span>}
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex">Post a Job</Button>
                <Button size="sm" onClick={() => setIsSignUpOpen(true)}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 h-[calc(100vh-140px)]">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col">
                <h3 className="text-xl font-black mb-8">Filters</h3>
                <FiltersPanel 
                  filters={filters} 
                  setFilters={setFilters} 
                  onReset={resetFilters} 
                />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Mobile Search & Filter Toggle */}
            <div className="mb-6 flex flex-col gap-4 lg:hidden">
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
                className="w-full justify-between py-6 rounded-2xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className="flex items-center font-bold">
                  <SlidersHorizontal size={16} className="mr-2" />
                  Filters
                </span>
                {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : (v[0] !== 5000 || v[1] !== 50000)) && (
                  <span className="h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                    {filters.categories.length + filters.experienceLevels.length + (filters.budgetRange[0] !== 5000 || filters.budgetRange[1] !== 50000 ? 1 : 0)}
                  </span>
                )}
              </Button>
            </div>

            {/* Results Info & Sort */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">
                    {filteredGigs.length} gigs found
                  </h2>
                  {user && user.skills.length > 0 && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, showRecommended: !prev.showRecommended }))}
                      className={`
                        inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${filters.showRecommended 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                          : 'bg-white border border-slate-100 text-text-secondary hover:border-primary/30'}
                      `}
                    >
                      <Check size={14} className={`mr-2 transition-all ${filters.showRecommended ? 'scale-100' : 'scale-0 w-0'}`} />
                      Recommended
                    </button>
                  )}
                </div>
                
                <ActiveFilters filters={filters} setFilters={setFilters} />
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <div className="flex items-center bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-slate-100 shadow-sm rounded-xl pl-4 pr-10 py-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="budget_high">Highest Budget</option>
                    <option value="budget_low">Lowest Budget</option>
                  </select>
                  <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Gig Grid */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {[...Array(4)].map((_, i) => (
                  <GigSkeleton key={i} />
                ))}
              </div>
            ) : filteredGigs.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
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
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-black text-text-primary">No results found</h3>
                <p className="mt-2 text-sm text-text-secondary max-w-xs mx-auto">
                  Try adjusting your search or filters to see more opportunities.
                </p>
                <Button variant="primary" className="mt-8 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
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
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-8 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-black">Filters</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <FiltersPanel 
                filters={filters} 
                setFilters={setFilters} 
                onReset={resetFilters} 
              />
              <div className="mt-8">
                <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsSidebarOpen(false)}>
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
        onApply={handleApply}
        isApplied={user?.appliedGigIds?.includes(selectedGig?.id || -1) || false}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onSignUp={handleSignUp}
        onSkip={() => setIsSignUpOpen(false)}
      />
    </div>
  );
}
