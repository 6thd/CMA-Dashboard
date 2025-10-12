using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using CMA.Web.Models;
using System;

namespace CMA.Web.Pages
{
    public class ResultsModel : PageModel
    {
        private readonly ILogger<ResultsModel> _logger;

        public List<ExamAttempt> Attempts { get; set; }

        public ResultsModel(ILogger<ResultsModel> logger)
        {
            _logger = logger;
            Attempts = new List<ExamAttempt>();
        }

        public void OnGet()
        {
            Attempts = new List<ExamAttempt>
            {
                new ExamAttempt { Id = "att1", StudentId = "1", StudentName = "John Doe", ExamId = "ex1", ExamName = "Calculus I Final", Score = 85, TotalMarks = 100, Percentage = 85, AttemptDate = new DateTime(2023, 5, 20) },
                new ExamAttempt { Id = "att2", StudentId = "2", StudentName = "Jane Smith", ExamId = "ex1", ExamName = "Calculus I Final", Score = 92, TotalMarks = 100, Percentage = 92, AttemptDate = new DateTime(2023, 5, 21) },
                new ExamAttempt { Id = "att3", StudentId = "3", StudentName = "Mike Johnson", ExamId = "ex2", ExamName = "Modern Physics Midterm", Score = 40, TotalMarks = 50, Percentage = 80, AttemptDate = new DateTime(2023, 5, 22) },
            };
        }
    }
}
