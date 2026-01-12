
export interface UserProfile {
  name: string;
  age: string;
  weight: string;
  goal: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  instructions: string;
}

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  id: string;
  title: string;
  exercises: WorkoutExercise[];
}

export interface UserData {
  profile: UserProfile;
  workouts: Workout[];
}

export interface AppUser {
  email: string;
  passwordHash: string;
}

export enum TabType {
  PROFILE = 'PROFILE',
  LIBRARY = 'LIBRARY',
  ROUTINES = 'ROUTINES',
  AI_GENERATOR = 'AI_GENERATOR'
}
