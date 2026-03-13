/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User as UserType, Category } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ArrowLeft, User, Mail, Shield, Briefcase, Star, Clock, Check, Edit2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gigs } from '../data';

interface ProfilePageProps {
  user: UserType;
  onBack: () => void;
  onLogout: () => void;
  onUpdateUser: (user: UserType) => void;
}

const ALL_SKILLS: Category[] = ["Web Development", "Mobile Dev", "Design", "Writing", "Marketing"];

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, onLogout, onUpdateUser }) => {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  
  const appliedGigs = gigs.filter(g => user.appliedGigIds?.includes(g.id));

  const handleToggleSkill = (skill: Category) => {
    const currentSkills = user.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    onUpdateUser({ ...user, skills: newSkills });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-bg-main pb-20"
    >
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Gigs
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
                <User size={48} />
              </div>
              <h1 className="text-2xl font-black text-text-primary tracking-tight">{user.name}</h1>
              <p className="text-sm font-bold text-text-secondary mt-1 uppercase tracking-widest">Freelancer</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center text-sm text-text-secondary">
                  <Mail size={16} className="mr-3 text-slate-300" />
                  <span className="font-medium">sowmya@example.com</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Shield size={16} className="mr-3 text-slate-300" />
                  <span className="font-medium">Verified Account</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-8 border-red-50 text-red-500 hover:bg-red-50 hover:border-red-100"
                onClick={onLogout}
              >
                Sign Out
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-xl font-black text-text-primary">{(user.appliedGigIds || []).length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Applied</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-xl font-black text-text-primary">0</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Earnings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-text-primary">Professional Skills</h2>
                <button 
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="text-xs font-bold text-primary hover:underline flex items-center"
                >
                  {isEditingSkills ? 'Done' : (
                    <>
                      <Edit2 size={12} className="mr-1" />
                      Edit Skills
                    </>
                  )}
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {isEditingSkills ? (
                  <motion.div 
                    key="editing"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {ALL_SKILLS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                          (user.skills || []).includes(skill)
                            ? 'bg-primary border-primary text-white'
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="viewing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-3"
                  >
                    {(user.skills || []).length > 0 ? (user.skills || []).map(skill => (
                      <Badge key={skill} variant="info" className="px-4 py-2 text-sm">
                        {skill}
                      </Badge>
                    )) : (
                      <p className="text-sm text-slate-400 italic">No skills added yet. Update your profile to show your expertise.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-text-primary mb-6">Applied Gigs</h2>
              <div className="space-y-4">
                {appliedGigs.length > 0 ? appliedGigs.map(gig => (
                  <div key={gig.id} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{gig.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gig.clientName}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">₹{gig.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="bg-emerald-100 text-emerald-700 border-none">Applied</Badge>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400 italic">You haven't applied to any gigs yet.</p>
                    <Button variant="ghost" className="mt-4 text-primary font-bold" onClick={onBack}>
                      Browse Gigs
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-100 rounded-3xl p-8 shadow-sm border border-emerald-200 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-2 text-emerald-900">Build Your Freelance Career</h2>
                <p className="text-emerald-700 text-sm mb-6 max-w-md">Add your professional skills above to get personalized gig recommendations from top clients.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-emerald-200/20 rounded-full blur-3xl" />
              <div className="absolute -left-10 -top-10 h-40 w-40 bg-emerald-200/30 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
