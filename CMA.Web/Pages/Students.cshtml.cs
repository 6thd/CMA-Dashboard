using Microsoft.AspNetCore.Mvc.RazorPages;
using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class StudentsModel : PageModel
    {
        private readonly ILogger<StudentsModel> _logger;

        public List<Student> Students { get; set; }

        public StudentsModel(ILogger<StudentsModel> logger)
        {
            _logger = logger;
            Students = new List<Student>();
        }

        public void OnGet()
        {
            Students = new List<Student>
            {
                new Student { Id = "1", FullName = "John Doe", Email = "john.doe@example.com", Phone = "123-456-7890", EnrollmentDate = new DateTime(2023, 1, 15), Status = "active" },
                new Student { Id = "2", FullName = "Jane Smith", Email = "jane.smith@example.com", Phone = "234-567-8901", EnrollmentDate = new DateTime(2023, 2, 20), Status = "active" },
                new Student { Id = "3", FullName = "Mike Johnson", Email = "mike.j@example.com", Phone = "345-678-9012", EnrollmentDate = new DateTime(2023, 3, 10), Status = "inactive" },
                new Student { Id = "4", FullName = "Emily Davis", Email = "emily.d@example.com", Phone = "456-789-0123", EnrollmentDate = new DateTime(2023, 4, 5), Status = "suspended" },
            };
        }
    }
}
