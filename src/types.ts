/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = "Web Development" | "Mobile Dev" | "Design" | "Writing" | "Marketing";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Expert";

export interface Gig {
  id: number;
  title: string;
  category: Category;
  budget: number;
  experienceLevel: ExperienceLevel;
  description: string;
  postedDate: string;
  clientName: string;
  clientCompany?: string;
  clientType: 'Startup' | 'Enterprise' | 'Agency' | 'Individual';
  clientRating: number;
  location: string;
}

export interface User {
  name: string;
  skills: Category[];
  appliedGigIds: number[];
}

export interface FilterState {
  categories: Category[];
  budgetRange: [number, number];
  experienceLevels: ExperienceLevel[];
  showRecommended: boolean;
}

export type SortOption = "newest" | "oldest" | "budget_high" | "budget_low";
