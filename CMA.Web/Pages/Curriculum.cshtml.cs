using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using CMA.Web.Models;

namespace CMA.Web.Pages
{
    public class CurriculumModel : PageModel
    {
        private readonly ILogger<CurriculumModel> _logger;

        public List<SyllabusUnit> Syllabus { get; set; }

        public CurriculumModel(ILogger<CurriculumModel> logger)
        {
            _logger = logger;
            Syllabus = new List<SyllabusUnit>();
        }

        public void OnGet()
        {
            Syllabus = new List<SyllabusUnit>
            {
                new SyllabusUnit
                {
                    Id = "unit1",
                    Title = "Unit 1: External Financial Statements and Revenue Recognition",
                    Sections = new List<SyllabusSection>
                    {
                        new SyllabusSection { Id = "sec1.1", Title = "Financial Statements", Content = "Content for financial statements..." },
                        new SyllabusSection { Id = "sec1.2", Title = "Revenue Recognition", Content = "Content for revenue recognition..." }
                    }
                },
                new SyllabusUnit
                {
                    Id = "unit2",
                    Title = "Unit 2: Planning, Budgeting, and Forecasting",
                    Sections = new List<SyllabusSection>
                    {
                        new SyllabusSection { Id = "sec2.1", Title = "Strategic Planning", Content = "Content for strategic planning..." }
                    }
                }
            };
        }
    }
}
