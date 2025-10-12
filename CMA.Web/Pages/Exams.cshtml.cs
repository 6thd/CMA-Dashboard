using Microsoft.AspNetCore.Mvc.RazorPages;
using CMA.Web.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
namespace CMA.Web.Pages
{
    public class ExamsModel : PageModel
    {
        private readonly ILogger<ExamsModel> _logger;

        public List<Exam> Exams { get; set; }

        public ExamsModel(ILogger<ExamsModel> logger)
        {
            _logger = logger;
            Exams = new List<Exam>();
        }

        public void OnGet()
        {
            Exams = new List<Exam>
            {
                new Exam { Id = "ex1", UnitId = "unit1", Title = "Calculus I Final", Description = "Final exam for first semester calculus.", DurationMinutes = 120, TotalMarks = 100, Status = "published" },
                new Exam { Id = "ex2", UnitId = "unit2", Title = "Modern Physics Midterm", Description = "Midterm covering relativity and quantum mechanics.", DurationMinutes = 90, TotalMarks = 50, Status = "published" },
                new Exam { Id = "ex3", UnitId = "unit1", Title = "Organic Chemistry Quiz", Description = "Quiz on nomenclature.", DurationMinutes = 30, TotalMarks = 20, Status = "archived" },
                new Exam { Id = "ex4", UnitId = "unit3", Title = "World History I", Description = "Comprehensive exam on ancient civilizations.", DurationMinutes = 150, TotalMarks = 100, Status = "draft" },
            };
        }
    }
}
