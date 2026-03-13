/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, IndianRupee, Briefcase } from 'lucide-react';
import { Gig } from '../../types';
import { Badge } from '../ui/Badge';

interface GigCardProps {
  gig: Gig;
  onClick: (gig: Gig) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onClick }) => {
  const getExperienceVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'expert': return 'expert';
      default: return 'default';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-primary/10"
      onClick={() => onClick(gig)}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between">
          <Badge variant="info">
            {gig.category}
          </Badge>
          <div className="flex items-center text-primary font-extrabold text-lg">
            <IndianRupee size={18} className="mr-0.5" />
            <span>{gig.budget.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
          {gig.title}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm text-text-secondary leading-relaxed">
          {gig.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-slate-50">
          <Badge variant={getExperienceVariant(gig.experienceLevel) as any}>
            <Briefcase size={12} className="mr-1" />
            {gig.experienceLevel}
          </Badge>
          <div className="flex items-center text-xs font-medium text-text-secondary">
            <MapPin size={14} className="mr-1.5 text-slate-400" />
            <span>{gig.location}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-text-secondary">
            <Calendar size={14} className="mr-1.5 text-slate-400" />
            <span>{new Date(gig.postedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {gig.clientName.charAt(0)}
            </div>
            <div>
              <span className="block text-xs font-semibold text-text-primary leading-none">{gig.clientName}</span>
              {gig.clientCompany && (
                <span className="block text-[10px] font-medium text-text-secondary leading-tight mt-0.5">{gig.clientCompany}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
