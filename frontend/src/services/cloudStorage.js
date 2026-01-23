import api from './api';

/**
 * Cloud Storage Service - Handles circuit storage and synchronization with backend
 */

const cloudStorageService = {
  // Circuit Management
  async saveCircuit(circuitData) {
    try {
      const response = await api.post('/circuits/', circuitData);
      return response.data;
    } catch (error) {
      console.error('Error saving circuit:', error);
      throw error;
    }
  },

  async listCircuits(params = {}) {
    try {
      const response = await api.get('/circuits/', { params });
      return response.data;
    } catch (error) {
      console.error('Error listing circuits:', error);
      throw error;
    }
  },

  async getCircuit(circuitId) {
    try {
      const response = await api.get(`/circuits/${circuitId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting circuit:', error);
      throw error;
    }
  },

  async updateCircuit(circuitId, updates) {
    try {
      const response = await api.put(`/circuits/${circuitId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating circuit:', error);
      throw error;
    }
  },

  async deleteCircuit(circuitId) {
    try {
      const response = await api.delete(`/circuits/${circuitId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting circuit:', error);
      throw error;
    }
  },

  // Version Control
  async saveVersion(circuitId, versionData) {
    try {
      const response = await api.post(`/circuits/${circuitId}/versions`, versionData);
      return response.data;
    } catch (error) {
      console.error('Error saving version:', error);
      throw error;
    }
  },

  async getVersions(circuitId) {
    try {
      const response = await api.get(`/circuits/${circuitId}/versions`);
      return response.data;
    } catch (error) {
      console.error('Error getting versions:', error);
      throw error;
    }
  },

  // Comments
  async addComment(circuitId, commentData) {
    try {
      const response = await api.post(`/circuits/${circuitId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async getComments(circuitId) {
    try {
      const response = await api.get(`/circuits/${circuitId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/circuits/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Learning Progress
  async saveProgress(progressData) {
    try {
      const response = await api.post('/learning/progress', progressData);
      return response.data;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  async getProgress(pathId = null) {
    try {
      const params = pathId ? { path_id: pathId } : {};
      const response = await api.get('/learning/progress', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw error;
    }
  },

  async getLessonProgress(pathId, lessonId) {
    try {
      const response = await api.get(`/learning/progress/${lessonId}`, {
        params: { path_id: pathId }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      throw error;
    }
  },

  async updateProgress(pathId, lessonId, updates) {
    try {
      const response = await api.patch(`/learning/progress/${lessonId}`, updates, {
        params: { path_id: pathId }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // Achievements
  async unlockAchievement(achievementData) {
    try {
      const response = await api.post('/learning/achievements', achievementData);
      return response.data;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  },

  async getAchievements() {
    try {
      const response = await api.get('/learning/achievements');
      return response.data;
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  },

  async getAchievementStats() {
    try {
      const response = await api.get('/learning/achievements/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      throw error;
    }
  },

  // Sync Helper - Sync local storage to cloud
  async syncLocalToCloud(localCircuits) {
    const synced = [];
    const failed = [];

    for (const circuit of localCircuits) {
      try {
        const cloudCircuit = await this.saveCircuit({
          name: circuit.name || 'Untitled Circuit',
          description: circuit.description || '',
          num_qubits: circuit.numQubits || 2,
          gates: circuit.gates || [],
          visibility: 'private',
          tags: circuit.tags || []
        });
        synced.push({ local: circuit, cloud: cloudCircuit });
      } catch (error) {
        failed.push({ circuit, error: error.message });
      }
    }

    return { synced, failed };
  }
};

export default cloudStorageService;
