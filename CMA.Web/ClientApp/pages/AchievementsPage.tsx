import React from 'react';
import { Achievement, LeaderboardEntry } from '../types.js';

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first study unit.', icon: '🎓', unlocked: true },
  { id: 'a2', title: 'Consistent Learner', description: 'Study for 7 days in a row.', icon: '🔥', unlocked: true },
  { id: 'a3', title: 'Top Performer', description: 'Score 90% or higher on an exam.', icon: '🏆', unlocked: false },
  { id: 'a4', title: 'Unit Master', description: 'Complete all sections in any study unit.', icon: '⭐', unlocked: true },
  { id: 'a5', title: 'Quiz Whiz', description: 'Complete 10 quizzes.', icon: '⚡', unlocked: false },
  { id: 'a6', title: 'CMA Explorer', description: 'Complete all 6 CMA Part 1 study units.', icon: '🏅', unlocked: false },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, studentName: 'Emily Davis', xp: 12500 },
    { rank: 2, studentName: 'Jane Smith', xp: 11800 },
    { rank: 3, studentName: 'John Doe', xp: 10500 },
    { rank: 4, studentName: 'Alex Ray', xp: 9800 },
    { rank: 5, studentName: 'Mike Johnson', xp: 8500 },
]

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <div className={`p-4 rounded-lg text-center enhanced-card ${!achievement.unlocked ? 'opacity-50 grayscale' : 'achievement-unlock'}`}>
    <div className="text-5xl mx-auto mb-3">{achievement.icon}</div>
    <h3 className="font-bold text-white text-md text-shadow">{achievement.title}</h3>
    <p className="text-xs text-gray-300 mt-1">{achievement.description}</p>
    {achievement.unlocked && <div className="absolute top-2 right-2 text-yellow-300" title="Unlocked"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>}
  </div>
);

const AchievementsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-white text-shadow mb-6">Achievements & Leaderboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white text-shadow mb-4">Your Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {MOCK_ACHIEVEMENTS.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-white text-shadow mb-4">Top Students Leaderboard</h2>
        <div className="enhanced-card overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Student</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider text-shadow">XP</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.map((entry, index) => (
                <tr key={entry.rank} className={`border-t border-white/10 ${index === 0 ? 'bg-yellow-500/20' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white text-shadow">{entry.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-100">{entry.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-md text-cyan-300 font-semibold">{entry.xp.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;