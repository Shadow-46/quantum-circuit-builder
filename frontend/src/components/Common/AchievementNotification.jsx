import { useEffect } from 'react';
import useProgressStore, { achievements } from '../../store/progressStore';
import '../../styles/components.css';

export default function AchievementNotification() {
  const { newAchievements, clearNewAchievements } = useProgressStore();

  useEffect(() => {
    if (newAchievements.length > 0) {
      const timer = setTimeout(() => {
        clearNewAchievements();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newAchievements, clearNewAchievements]);

  if (newAchievements.length === 0) return null;

  return (
    <div className="achievement-notifications">
      {newAchievements.map((achievementId) => {
        const achievement = achievements.find((a) => a.id === achievementId);
        if (!achievement) return null;

        return (
          <div key={achievementId} className="achievement-notification">
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <div className="achievement-title">🎉 Achievement Unlocked!</div>
              <div className="achievement-name">{achievement.title}</div>
              <div className="achievement-desc">{achievement.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
