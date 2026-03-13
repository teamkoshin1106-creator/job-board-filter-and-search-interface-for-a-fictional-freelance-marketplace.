/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, IndianRupee, Briefcase, User, Send, Check } from 'lucide-react';
import { Gig } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface GigDetailModalProps {
  gig: Gig | null;
  onClose: () => void;
  onApply: (gigId: number) => void;
  isApplied: boolean;
}

export const GigDetailModal: React.FC<GigDetailModalProps> = ({ gig, onClose, onApply, isApplied }) => {
  if (!gig) return null;

  const handleApply = () => {
    onApply(gig.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-2xl flex flex-col"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-50 p-6 sm:px-10">
            <Badge variant="info">{gig.category}</Badge>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
            <h2 className="mb-6 text-3xl font-black text-text-primary sm:text-4xl leading-tight">
              {gig.title}
            </h2>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-primary/5 p-5 border border-primary/10">
                <div className="mb-1 flex items-center text-primary">
                  <IndianRupee size={14} className="mr-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Budget</span>
                </div>
                <p className="text-lg font-black text-primary">₹{gig.budget.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <div className="mb-1 flex items-center text-text-secondary">
                  <Briefcase size={14} className="mr-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Level</span>
                </div>
                <p className="text-sm font-bold text-text-primary">{gig.experienceLevel}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <div className="mb-1 flex items-center text-text-secondary">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                </div>
                <p className="text-sm font-bold text-text-primary">{gig.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <div className="mb-1 flex items-center text-text-secondary">
                  <Calendar size={14} className="mr-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Posted</span>
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {new Date(gig.postedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-text-secondary">Job Description</h3>
              <div className="space-y-4 text-lg leading-relaxed text-text-secondary">
                {gig.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-100">
              <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-text-secondary">About the Client</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                  <User size={40} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-2xl font-black text-text-primary">{gig.clientName}</p>
                    <div className="flex items-center bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-xs font-bold text-amber-500 mr-1">★</span>
                      <span className="text-xs font-black text-text-primary">{gig.clientRating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {gig.clientCompany && (
                      <p className="text-sm font-bold text-text-secondary">{gig.clientCompany}</p>
                    )}
                    <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
                    <Badge variant="info" className="bg-slate-200 text-slate-700 border-none">
                      {gig.clientType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-50 bg-white p-8 sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  Ready to start working?
                </p>
                <p className="text-xs text-slate-400">Applications close in 5 days</p>
              </div>
              <Button 
                onClick={handleApply}
                disabled={isApplied}
                className={`w-full sm:w-auto px-10 py-7 rounded-2xl text-lg font-black shadow-xl transition-all ${
                  isApplied 
                    ? 'bg-emerald-500 text-white shadow-emerald-200 cursor-default' 
                    : 'shadow-primary/20'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check size={20} className="mr-2" />
                    Applied
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Apply Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
