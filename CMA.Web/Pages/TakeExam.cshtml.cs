using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class TakeExamModel : PageModel
    {
        private readonly ILogger<TakeExamModel> _logger;

        [BindProperty(SupportsGet = true)]
        public string? ExamId { get; set; }

        [BindProperty]
        public int CurrentQuestionIndex { get; set; }

        [BindProperty]
        public string? Answer { get; set; }

        public Exam? Exam { get; set; }
        public List<Question>? Questions { get; set; }
        public Question? CurrentQuestion { get; set; }

        private List<Exam> AllExams = new List<Exam>
        {
            new Exam { Id = "ex1", Title = "Calculus I Final", Description = "Final exam for first semester calculus." },
            new Exam { Id = "ex2", Title = "Modern Physics Midterm", Description = "Midterm covering relativity and quantum mechanics." },
        };

        private List<Question> AllQuestions = new List<Question>
        {
            new Question { Id = "q1", SectionId = "ex1", QuestionText = "What is the derivative of x^2?", Type = "multiple_choice", Options = new List<string> { "2x", "x", "x^2/2" } },
            new Question { Id = "q2", SectionId = "ex1", QuestionText = "What is the integral of 1?", Type = "multiple_choice", Options = new List<string> { "x", "1", "0" } },
            new Question { Id = "q3", SectionId = "ex2", QuestionText = "What is E=mc^2?", Type = "short_answer" },
        };

        public TakeExamModel(ILogger<TakeExamModel> logger)
        {
            _logger = logger;
        }

        public IActionResult OnGet(string examId, int? questionIndex)
        {
            Exam = AllExams.FirstOrDefault(e => e.Id == examId);
            if (Exam is null) return NotFound();

            Questions = AllQuestions.Where(q => q.SectionId == examId).ToList();
            CurrentQuestionIndex = questionIndex ?? 0;

            if (Questions.Any() && CurrentQuestionIndex < Questions.Count)
            {
                CurrentQuestion = Questions[CurrentQuestionIndex];
            }

            return Page();
        }

        public IActionResult OnPostNext()
        {
            return RedirectToPage(new { examId = ExamId, questionIndex = CurrentQuestionIndex + 1 });
        }

        public IActionResult OnPostPrevious()
        {
            return RedirectToPage(new { examId = ExamId, questionIndex = CurrentQuestionIndex - 1 });
        }

        public IActionResult OnPostSubmit()
        {
            _logger.LogInformation("Exam submitted for ExamId: {ExamId}", ExamId);
            return RedirectToPage("/Results");
        }
    }
}
