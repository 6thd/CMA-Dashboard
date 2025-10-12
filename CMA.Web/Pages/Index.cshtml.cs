using Microsoft.Extensions.Logging;
using System.Collections.Generic;

using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class DashboardStats
    {
        public int TotalStudents { get; set; }
        public int ActiveExams { get; set; }
        public int TotalAttempts { get; set; }
        public int AverageScore { get; set; }
    }

    public class IndexModel : Microsoft.AspNetCore.Mvc.RazorPages.PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public DashboardStats Stats { get; set; }
        public List<ExamAttempt> RecentAttempts { get; set; }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
            Stats = new DashboardStats();
            RecentAttempts = new List<ExamAttempt>();
        }

        public void OnGet()
        {
            Stats = new DashboardStats
            {
                TotalStudents = 1250,
                ActiveExams = 15,
                TotalAttempts = 5678,
                AverageScore = 78
            };

            RecentAttempts = new List<ExamAttempt>
            {
                new ExamAttempt { Id = "1", StudentName = "John Doe", ExamName = "CMA Part 1 Practice", Score = 85, AttemptDate = System.DateTime.Now.AddHours(-1) },
                new ExamAttempt { Id = "2", StudentName = "Jane Smith", ExamName = "Financial Planning", Score = 72, AttemptDate = System.DateTime.Now.AddHours(-3) },
                new ExamAttempt { Id = "3", StudentName = "Peter Jones", ExamName = "Cost Management", Score = 91, AttemptDate = System.DateTime.Now.AddHours(-5) },
            };
        }
    }

    // Duplicate ExamAttempt class removed. Use the model from CMA.Web.Models.DataModels instead.
}
