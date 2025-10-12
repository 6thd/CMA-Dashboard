using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class StudentProfileModel : PageModel
    {
        private readonly ILogger<StudentProfileModel> _logger;

    public Student? Student { get; set; }
    public List<ExamAttempt>? Attempts { get; set; }

        private List<Student> _allStudents = new List<Student>
        {
            new Student { Id = "1", FullName = "John Doe", Email = "john.doe@example.com" },
            new Student { Id = "2", FullName = "Jane Smith", Email = "jane.smith@example.com" },
        };

        private List<ExamAttempt> _allAttempts = new List<ExamAttempt>
        {
            new ExamAttempt { Id = "att1", StudentId = "1", StudentName = "John Doe", ExamId = "exam1", ExamName = "Calculus I Final", Score = 85, TotalMarks = 100, Percentage = 85, AttemptDate = DateTime.Now.AddDays(-10) },
            new ExamAttempt { Id = "att2", StudentId = "1", StudentName = "John Doe", ExamId = "exam2", ExamName = "Modern Physics Midterm", Score = 45, TotalMarks = 100, Percentage = 45, AttemptDate = DateTime.Now.AddDays(-5) },
            new ExamAttempt { Id = "att3", StudentId = "2", StudentName = "Jane Smith", ExamId = "exam1", ExamName = "Calculus I Final", Score = 92, TotalMarks = 100, Percentage = 92, AttemptDate = DateTime.Now.AddDays(-8) },
        };

        public StudentProfileModel(ILogger<StudentProfileModel> logger)
        {
            _logger = logger;
        }

        public IActionResult OnGet(string studentId)
        {
            Student = _allStudents.FirstOrDefault(s => s.Id == studentId);

            if (Student == null)
            {
                return NotFound();
            }

            Attempts = _allAttempts.Where(a => a.StudentId == studentId).ToList();

            return Page();
        }
    }
}
