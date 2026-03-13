/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Check, ChevronRight } from 'lucide-react';
import { Category, User as UserType } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface SignUpModalProps {
  isOpen: boolean;
  onSignUp: (user: UserType) => void;
  onSkip: () => void;
}

const SKILLS: Category[] = ["Web Development", "Mobile Dev", "Design", "Writing", "Marketing"];

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onSignUp, onSkip }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Category[]>([]);

  const handleToggleSkill = (skill: Category) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleComplete = () => {
    onSignUp({ name, skills: selectedSkills, appliedGigIds: [] });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
        >
          <div className="p-8 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User size={24} />
              </div>
              <button 
                onClick={onSkip}
                className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
              >
                Skip for now
              </button>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-text-primary leading-tight">Create your account</h2>
                  <p className="mt-2 text-sm font-medium text-text-secondary">Join the world's best marketplace for freelancers.</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User size={18} />}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                  />
                </div>

                <Button 
                  className="w-full py-6 rounded-2xl font-black text-lg"
                  disabled={!name || !password}
                  onClick={() => setStep(2)}
                >
                  Next Step
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-text-primary leading-tight">What are your skills?</h2>
                  <p className="mt-2 text-sm font-medium text-text-secondary">We'll recommend the best gigs based on your expertise.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`
                        flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left
                        ${selectedSkills.includes(skill)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-slate-50 text-text-secondary hover:border-primary/30'}
                      `}
                    >
                      <span className="font-bold">{skill}</span>
                      {selectedSkills.includes(skill) && <Check size={18} />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 py-6 rounded-2xl font-black"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-[2] py-6 rounded-2xl font-black text-lg"
                    onClick={handleComplete}
                  >
                    Complete Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
