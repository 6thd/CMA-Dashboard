using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
namespace CMA.Web.Pages
{
    public class ExamSettings
    {
        [Display(Name = "Number of Questions")]
        public int QuestionCount { get; set; } = 50;

        [Display(Name = "Time Limit (minutes)")]
        public int TimeLimit { get; set; } = 180;

        [Display(Name = "Display Order")]
        public string DisplayOrder { get; set; } = "random";
    }

    public class ExamSimulationModel : PageModel
    {
        private readonly ILogger<ExamSimulationModel> _logger;

        [BindProperty]
        public ExamSettings Settings { get; set; }

        public ExamSimulationModel(ILogger<ExamSimulationModel> logger)
        {
            _logger = logger;
            Settings = new ExamSettings();
        }

        public void OnGet()
        {
            _logger.LogInformation("Exam Simulation setup page loaded.");
        }

        public IActionResult OnPost()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _logger.LogInformation("Starting exam with settings: {@Settings}", Settings);
            // In a real app, you would redirect to the exam-taking page with these settings
            // For now, we'll just redirect back to the setup page
            return RedirectToPage();
        }
    }
}
