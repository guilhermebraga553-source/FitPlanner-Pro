
import { UserData, AppUser } from '../types';

const USERS_LIST_KEY = 'fitplanner_users';
const DATA_PREFIX = 'fitplanner_data_';

export const storageService = {
  // Auth simulation
  getUsers: (): AppUser[] => {
    const users = localStorage.getItem(USERS_LIST_KEY);
    return users ? JSON.parse(users) : [];
  },
  
  saveUser: (user: AppUser) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  },

  // Data persistence
  getUserData: (email: string): UserData | null => {
    const data = localStorage.getItem(`${DATA_PREFIX}${email}`);
    return data ? JSON.parse(data) : null;
  },

  saveUserData: (email: string, data: UserData) => {
    localStorage.setItem(`${DATA_PREFIX}${email}`, JSON.stringify(data));
  }
};
