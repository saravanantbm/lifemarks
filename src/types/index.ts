export type GoalCategory = 'Life' | 'Personal' | 'Lifestyle' | 'Finance' | 'Family' | 'Custom';
export type GoalPriority = 'High' | 'Medium' | 'Low';
export type GoalStatus = 'active' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  customCategoryName?: string;
  priority: GoalPriority;
  targetDate?: string;
  milestones: Milestone[];
  status: GoalStatus;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  imageUrl?: string;
}

export type ExperienceType = 'Movie' | 'TV Show' | 'Music' | 'Restaurant' | 'Play' | 'Art' | 'Book' | 'Custom';
export type ExperienceStatus = 'want' | 'done';

export interface Experience {
  id: string;
  title: string;
  type: ExperienceType;
  status: ExperienceStatus;
  rating?: number;
  review?: string;
  notes?: string;
  link?: string;
  priceEstimate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  joinedAt: string;
}

export type TabKey = 'home' | 'goals' | 'experiences' | 'lived-it' | 'settings';
