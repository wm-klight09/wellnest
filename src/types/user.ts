export interface User {
  id?: string;
  name: string;
  email: string;
  hobbies: string[];
  height: number; // in cm
  weight: number; // in kg
  dateOfBirth: Date;
  goals: MentalHealthGoal[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  meditationReminders: boolean;
  exerciseReminders: boolean;
  sleepSchedule: {
    bedtime: string; // HH:mm format
    wakeTime: string; // HH:mm format
  };
  dietaryRestrictions: string[];
}

export enum MentalHealthGoal {
  STRESS_REDUCTION = 'Stress Reduction',
  MOOD_IMPROVEMENT = 'Mood Improvement',
  ANXIETY_MANAGEMENT = 'Anxiety Management',
  BETTER_SLEEP = 'Better Sleep',
  WORK_LIFE_BALANCE = 'Work-Life Balance'
}

export interface QuizResponse {
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  exerciseFrequency: number; // hours per week
  primaryConcerns: string[];
  preferredActivities: string[];
  currentMood: string;
  energyLevel: number; // 1-10
  socialConnections: number; // 1-10
} 