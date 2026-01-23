import { useState, useEffect, useCallback } from 'react';
import cloudStorageService from '../services/cloudStorage';
import useAuthStore from '../store/authStore';

/**
 * useCloudSync - Custom hook for syncing circuit data with cloud storage
 */
export const useCloudSync = () => {
  const { isAuthenticated } = useAuthStore();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const saveToCloud = useCallback(async (circuitData) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to save to cloud');
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const saved = await cloudStorageService.saveCircuit(circuitData);
      setSyncing(false);
      return saved;
    } catch (error) {
      setSyncError(error.message);
      setSyncing(false);
      throw error;
    }
  }, [isAuthenticated]);

  const loadFromCloud = useCallback(async (circuitId) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to load from cloud');
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const circuit = await cloudStorageService.getCircuit(circuitId);
      setSyncing(false);
      return circuit;
    } catch (error) {
      setSyncError(error.message);
      setSyncing(false);
      throw error;
    }
  }, [isAuthenticated]);

  const syncLocalToCloud = useCallback(async () => {
    if (!isAuthenticated) {
      return { synced: [], failed: [] };
    }

    setSyncing(true);
    setSyncError(null);

    try {
      // Get circuits from localStorage
      const localCircuits = JSON.parse(localStorage.getItem('circuits') || '[]');
      const result = await cloudStorageService.syncLocalToCloud(localCircuits);
      
      // Clear localStorage after successful sync
      if (result.synced.length > 0 && result.failed.length === 0) {
        localStorage.removeItem('circuits');
      }
      
      setSyncing(false);
      return result;
    } catch (error) {
      setSyncError(error.message);
      setSyncing(false);
      throw error;
    }
  }, [isAuthenticated]);

  return {
    syncing,
    syncError,
    saveToCloud,
    loadFromCloud,
    syncLocalToCloud
  };
};

/**
 * useLearningProgress - Custom hook for syncing learning progress
 */
export const useLearningProgress = () => {
  const { isAuthenticated } = useAuthStore();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProgress = useCallback(async (pathId = null) => {
    if (!isAuthenticated) {
      // Load from localStorage
      const localProgress = JSON.parse(localStorage.getItem('learningProgress') || '[]');
      setProgress(localProgress);
      return localProgress;
    }

    setLoading(true);
    setError(null);

    try {
      const cloudProgress = await cloudStorageService.getProgress(pathId);
      setProgress(cloudProgress);
      setLoading(false);
      return cloudProgress;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthenticated]);

  const saveProgress = useCallback(async (progressData) => {
    if (!isAuthenticated) {
      // Save to localStorage
      const localProgress = JSON.parse(localStorage.getItem('learningProgress') || '[]');
      const existingIndex = localProgress.findIndex(
        p => p.pathId === progressData.path_id && p.lessonId === progressData.lesson_id
      );

      if (existingIndex >= 0) {
        localProgress[existingIndex] = { ...localProgress[existingIndex], ...progressData };
      } else {
        localProgress.push(progressData);
      }

      localStorage.setItem('learningProgress', JSON.stringify(localProgress));
      setProgress(localProgress);
      return progressData;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = await cloudStorageService.saveProgress(progressData);
      await loadProgress(); // Reload all progress
      setLoading(false);
      return saved;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthenticated, loadProgress]);

  const syncProgressToCloud = useCallback(async () => {
    if (!isAuthenticated) {
      return { synced: [], failed: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const localProgress = JSON.parse(localStorage.getItem('learningProgress') || '[]');
      const synced = [];
      const failed = [];

      for (const prog of localProgress) {
        try {
          await cloudStorageService.saveProgress({
            path_id: prog.pathId,
            lesson_id: prog.lessonId,
            status: prog.status,
            quiz_score: prog.quizScore
          });
          synced.push(prog);
        } catch (err) {
          failed.push({ progress: prog, error: err.message });
        }
      }

      if (synced.length > 0 && failed.length === 0) {
        localStorage.removeItem('learningProgress');
      }

      setLoading(false);
      return { synced, failed };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProgress();
  }, [isAuthenticated]); // Don't include loadProgress to avoid infinite loop

  return {
    progress,
    loading,
    error,
    loadProgress,
    saveProgress,
    syncProgressToCloud
  };
};

/**
 * useAchievements - Custom hook for managing achievements
 */
export const useAchievements = () => {
  const { isAuthenticated } = useAuthStore();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ total_achievements: 0, total_points: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAchievements = useCallback(async () => {
    if (!isAuthenticated) {
      const localAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      setAchievements(localAchievements);
      setStats({
        total_achievements: localAchievements.length,
        total_points: localAchievements.reduce((sum, a) => sum + (a.points || 0), 0)
      });
      return localAchievements;
    }

    setLoading(true);
    setError(null);

    try {
      const [cloudAchievements, cloudStats] = await Promise.all([
        cloudStorageService.getAchievements(),
        cloudStorageService.getAchievementStats()
      ]);
      setAchievements(cloudAchievements);
      setStats(cloudStats);
      setLoading(false);
      return cloudAchievements;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthenticated]);

  const unlockAchievement = useCallback(async (achievementData) => {
    if (!isAuthenticated) {
      const localAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      const exists = localAchievements.find(a => a.achievement_id === achievementData.achievement_id);
      
      if (!exists) {
        localAchievements.push({
          ...achievementData,
          unlocked_at: new Date().toISOString()
        });
        localStorage.setItem('achievements', JSON.stringify(localAchievements));
        setAchievements(localAchievements);
      }
      return achievementData;
    }

    setLoading(true);
    setError(null);

    try {
      const unlocked = await cloudStorageService.unlockAchievement(achievementData);
      await loadAchievements(); // Reload all achievements
      setLoading(false);
      return unlocked;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthenticated, loadAchievements]);

  useEffect(() => {
    loadAchievements();
  }, [isAuthenticated]); // Don't include loadAchievements to avoid infinite loop

  return {
    achievements,
    stats,
    loading,
    error,
    loadAchievements,
    unlockAchievement
  };
};

export default useCloudSync;
