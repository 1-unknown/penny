import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  budget: number;
  spent: number;
  color: string;
  period: 'weekly' | 'monthly';
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  vibeId: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: string;
}

interface AppState {
  hasOnboarded: boolean;
  userName: string;
  vibes: Vibe[];
  transactions: Transaction[];
  challenges: Challenge[];
  currentStreak: number;
  lastLoginDate: string | null;
  totalSaved: number;
  onboardingComplete: (name: string) => void;
  addVibe: (vibe: Omit<Vibe, 'id' | 'spent'>) => void;
  deleteVibe: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  completeChallenge: (id: string) => void;
  updateStreak: () => void;
  resetData: () => void;
}

const DEFAULT_VIBES: Vibe[] = [
  { id: '1', name: 'Coffee & Vibes', emoji: '☕', budget: 40, spent: 0, color: '#FF6B6B', period: 'weekly' },
  { id: '2', name: 'Japan Trip', emoji: '✈️', budget: 50, spent: 0, color: '#4ECDC4', period: 'monthly' },
  { id: '3', name: 'Sneaker Fund', emoji: '👟', budget: 30, spent: 0, color: '#45B7D1', period: 'monthly' },
  { id: '4', name: 'Food & Fun', emoji: '🍜', budget: 150, spent: 0, color: '#96CEB4', period: 'monthly' },
];

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: '1', title: 'No-Spend Weekend', description: 'Spend $0 this weekend', emoji: '🎯', progress: 0, target: 2, completed: false, reward: '100 pts' },
  { id: '2', title: 'Cook 3 Meals', description: 'Cook at home 3 times this week', emoji: '🍳', progress: 0, target: 3, completed: false, reward: '150 pts' },
  { id: '3', title: 'Coffee Skip', description: 'Skip coffee 5 days this week', emoji: '🚫', progress: 0, target: 5, completed: false, reward: '200 pts' },
  { id: '4', title: 'Round-Up Save', description: 'Round up every purchase this week', emoji: '🪙', progress: 0, target: 10, completed: false, reward: '120 pts' },
  { id: '5', title: 'Budget Check', description: 'Review your budget daily', emoji: '📊', progress: 0, target: 7, completed: false, reward: '300 pts' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      userName: '',
      vibes: DEFAULT_VIBES,
      transactions: [],
      challenges: DEFAULT_CHALLENGES,
      currentStreak: 0,
      lastLoginDate: null,
      totalSaved: 0,

      onboardingComplete: (name: string) =>
        set({ hasOnboarded: true, userName: name }),

      addVibe: (vibe) =>
        set((state) => ({
          vibes: [
            ...state.vibes,
            { ...vibe, id: Date.now().toString(), spent: 0 },
          ],
        })),

      deleteVibe: (id) =>
        set((state) => ({
          vibes: state.vibes.filter((v) => v.id !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => {
          const newTransactions = [
            { ...transaction, id: Date.now().toString() },
            ...state.transactions,
          ];

          const updatedVibes = state.vibes.map((vibe) => {
            if (vibe.id === transaction.vibeId) {
              const spentChange =
                transaction.type === 'expense'
                  ? transaction.amount
                  : -transaction.amount;
              return {
                ...vibe,
                spent: Math.max(0, vibe.spent + spentChange),
              };
            }
            return vibe;
          });

          return { transactions: newTransactions, vibes: updatedVibes };
        }),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      completeChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, completed: true, progress: c.target } : c
          ),
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          if (state.lastLoginDate === today) {
            return {};
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const newStreak =
            state.lastLoginDate === yesterday.toDateString()
              ? state.currentStreak + 1
              : 1;

          return {
            currentStreak: newStreak,
            lastLoginDate: today,
          };
        }),

      resetData: () =>
        set({
          hasOnboarded: false,
          userName: '',
          vibes: DEFAULT_VIBES,
          transactions: [],
          challenges: DEFAULT_CHALLENGES,
          currentStreak: 0,
          lastLoginDate: null,
          totalSaved: 0,
        }),
    }),
    {
      name: 'penny-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
