import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement definitions
export const achievements = [
  {
    id: 'first-circuit',
    title: 'First Steps',
    description: 'Create your first quantum circuit',
    icon: '🌟',
    category: 'beginner',
    condition: (stats) => stats.circuitsCreated >= 1,
  },
  {
    id: 'gate-master',
    title: 'Gate Master',
    description: 'Use 50 different gates',
    icon: '🎯',
    category: 'intermediate',
    condition: (stats) => stats.gatesUsed >= 50,
  },
  {
    id: 'superposition-explorer',
    title: 'Superposition Explorer',
    description: 'Create 10 circuits with H gates',
    icon: '🌊',
    category: 'intermediate',
    condition: (stats) => stats.hadamardGatesUsed >= 10,
  },
  {
    id: 'entanglement-architect',
    title: 'Entanglement Architect',
    description: 'Create 5 Bell states using CNOT gates',
    icon: '🔗',
    category: 'advanced',
    condition: (stats) => stats.cnotGatesUsed >= 5,
  },
  {
    id: 'simulation-veteran',
    title: 'Simulation Veteran',
    description: 'Run 100 simulations',
    icon: '⚡',
    category: 'intermediate',
    condition: (stats) => stats.simulationsRun >= 100,
  },
  {
    id: 'tutorial-novice',
    title: 'Tutorial Novice',
    description: 'Complete your first tutorial',
    icon: '📚',
    category: 'beginner',
    condition: (stats) => stats.tutorialsCompleted >= 1,
  },
  {
    id: 'tutorial-adept',
    title: 'Tutorial Adept',
    description: 'Complete 3 tutorials',
    icon: '🎓',
    category: 'intermediate',
    condition: (stats) => stats.tutorialsCompleted >= 3,
  },
  {
    id: 'tutorial-master',
    title: 'Tutorial Master',
    description: 'Complete all tutorials',
    icon: '👑',
    category: 'advanced',
    condition: (stats) => stats.tutorialsCompleted >= 4,
  },
  {
    id: 'algorithm-explorer',
    title: 'Algorithm Explorer',
    description: 'Try 5 different quantum algorithm templates',
    icon: '🧪',
    category: 'intermediate',
    condition: (stats) => stats.templatesUsed >= 5,
  },
  {
    id: 'quantum-architect',
    title: 'Quantum Architect',
    description: 'Create a circuit with 5+ qubits',
    icon: '🏗️',
    category: 'advanced',
    condition: (stats) => stats.maxQubitsUsed >= 5,
  },
  {
    id: 'persistent-learner',
    title: 'Persistent Learner',
    description: 'Use the platform for 7 different days',
    icon: '📅',
    category: 'advanced',
    condition: (stats) => stats.daysActive >= 7,
  },
  {
    id: 'circuit-saver',
    title: 'Circuit Saver',
    description: 'Save 10 circuits',
    icon: '💾',
    category: 'intermediate',
    condition: (stats) => stats.circuitsSaved >= 10,
  },
];

const useProgressStore = create(
  persist(
    (set, get) => ({
      // User statistics
      stats: {
        circuitsCreated: 0,
        gatesUsed: 0,
        hadamardGatesUsed: 0,
        cnotGatesUsed: 0,
        simulationsRun: 0,
        tutorialsCompleted: 0,
        tutorialsInProgress: {},
        templatesUsed: 0,
        maxQubitsUsed: 0,
        circuitsSaved: 0,
        daysActive: 1,
        lastActiveDate: new Date().toDateString(),
        totalTimeSpent: 0, // in minutes
        startTime: null,
      },

      // Achievements
      unlockedAchievements: [],
      newAchievements: [],

      // Actions
      incrementCircuitsCreated: () => {
        set((state) => ({
          stats: { ...state.stats, circuitsCreated: state.stats.circuitsCreated + 1 },
        }));
        get().checkAchievements();
      },

      incrementGatesUsed: (gateType) => {
        set((state) => {
          const updates = { gatesUsed: state.stats.gatesUsed + 1 };
          
          if (gateType === 'H') {
            updates.hadamardGatesUsed = state.stats.hadamardGatesUsed + 1;
          } else if (gateType === 'CNOT') {
            updates.cnotGatesUsed = state.stats.cnotGatesUsed + 1;
          }
          
          return { stats: { ...state.stats, ...updates } };
        });
        get().checkAchievements();
      },

      incrementSimulations: () => {
        set((state) => ({
          stats: { ...state.stats, simulationsRun: state.stats.simulationsRun + 1 },
        }));
        get().checkAchievements();
      },

      completeTutorial: (tutorialId) => {
        set((state) => {
          const inProgress = { ...state.stats.tutorialsInProgress };
          delete inProgress[tutorialId];
          
          return {
            stats: {
              ...state.stats,
              tutorialsCompleted: state.stats.tutorialsCompleted + 1,
              tutorialsInProgress: inProgress,
            },
          };
        });
        get().checkAchievements();
      },

      updateTutorialProgress: (tutorialId, step) => {
        set((state) => ({
          stats: {
            ...state.stats,
            tutorialsInProgress: {
              ...state.stats.tutorialsInProgress,
              [tutorialId]: step,
            },
          },
        }));
      },

      incrementTemplatesUsed: () => {
        set((state) => ({
          stats: { ...state.stats, templatesUsed: state.stats.templatesUsed + 1 },
        }));
        get().checkAchievements();
      },

      updateMaxQubits: (numQubits) => {
        set((state) => ({
          stats: {
            ...state.stats,
            maxQubitsUsed: Math.max(state.stats.maxQubitsUsed, numQubits),
          },
        }));
        get().checkAchievements();
      },

      incrementCircuitsSaved: () => {
        set((state) => ({
          stats: { ...state.stats, circuitsSaved: state.stats.circuitsSaved + 1 },
        }));
        get().checkAchievements();
      },

      updateDaysActive: () => {
        const today = new Date().toDateString();
        const lastActive = get().stats.lastActiveDate;
        
        if (today !== lastActive) {
          set((state) => ({
            stats: {
              ...state.stats,
              daysActive: state.stats.daysActive + 1,
              lastActiveDate: today,
            },
          }));
          get().checkAchievements();
        }
      },

      startSession: () => {
        get().updateDaysActive();
        set((state) => ({
          stats: { ...state.stats, startTime: Date.now() },
        }));
      },

      endSession: () => {
        const { startTime, totalTimeSpent } = get().stats;
        if (startTime) {
          const sessionTime = Math.floor((Date.now() - startTime) / 60000); // Convert to minutes
          set((state) => ({
            stats: {
              ...state.stats,
              totalTimeSpent: totalTimeSpent + sessionTime,
              startTime: null,
            },
          }));
        }
      },

      checkAchievements: () => {
        const { stats, unlockedAchievements } = get();
        const newUnlocked = [];

        achievements.forEach((achievement) => {
          if (!unlockedAchievements.includes(achievement.id) && achievement.condition(stats)) {
            newUnlocked.push(achievement.id);
          }
        });

        if (newUnlocked.length > 0) {
          set((state) => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlocked],
            newAchievements: [...state.newAchievements, ...newUnlocked],
          }));
        }
      },

      clearNewAchievements: () => {
        set({ newAchievements: [] });
      },

      resetProgress: () => {
        set({
          stats: {
            circuitsCreated: 0,
            gatesUsed: 0,
            hadamardGatesUsed: 0,
            cnotGatesUsed: 0,
            simulationsRun: 0,
            tutorialsCompleted: 0,
            tutorialsInProgress: {},
            templatesUsed: 0,
            maxQubitsUsed: 0,
            circuitsSaved: 0,
            daysActive: 1,
            lastActiveDate: new Date().toDateString(),
            totalTimeSpent: 0,
            startTime: null,
          },
          unlockedAchievements: [],
          newAchievements: [],
        });
      },
    }),
    {
      name: 'quantum-progress-storage',
    }
  )
);

export default useProgressStore;
