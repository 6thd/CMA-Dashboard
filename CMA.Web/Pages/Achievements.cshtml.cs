using Microsoft.AspNetCore.Mvc.RazorPages;
using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class AchievementsModel : PageModel
    {
        private readonly ILogger<AchievementsModel> _logger;

        public List<Achievement> Achievements { get; set; }
        public List<LeaderboardEntry> Leaderboard { get; set; }

        public AchievementsModel(ILogger<AchievementsModel> logger)
        {
            _logger = logger;
            Achievements = new List<Achievement>();
            Leaderboard = new List<LeaderboardEntry>();
        }

        public void OnGet()
        {
            Achievements = new List<Achievement>
            {
                new Achievement { Id = "a1", Title = "First Steps", Description = "Complete your first study unit.", Icon = "🎓", Unlocked = true },
                new Achievement { Id = "a2", Title = "Consistent Learner", Description = "Study for 7 days in a row.", Icon = "🔥", Unlocked = true },
                new Achievement { Id = "a3", Title = "Top Performer", Description = "Score 90% or higher on an exam.", Icon = "🏆", Unlocked = false },
                new Achievement { Id = "a4", Title = "Unit Master", Description = "Complete all sections in any study unit.", Icon = "⭐", Unlocked = true },
                new Achievement { Id = "a5", Title = "Quiz Whiz", Description = "Complete 10 quizzes.", Icon = "⚡", Unlocked = false },
                new Achievement { Id = "a6", Title = "CMA Explorer", Description = "Complete all 6 CMA Part 1 study units.", Icon = "🏅", Unlocked = false },
            };

            Leaderboard = new List<LeaderboardEntry>
            {
                new LeaderboardEntry { Rank = 1, StudentName = "Emily Davis", XP = 12500 },
                new LeaderboardEntry { Rank = 2, StudentName = "Jane Smith", XP = 11800 },
                new LeaderboardEntry { Rank = 3, StudentName = "John Doe", XP = 10500 },
                new LeaderboardEntry { Rank = 4, StudentName = "Alex Ray", XP = 9800 },
                new LeaderboardEntry { Rank = 5, StudentName = "Mike Johnson", XP = 8500 },
            };
        }
    }
}
