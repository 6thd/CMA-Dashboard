using Microsoft.AspNetCore.Mvc.RazorPages;
using CMA.Web.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
namespace CMA.Web.Pages
{
    public class QuestionsModel : PageModel
    {
        private readonly ILogger<QuestionsModel> _logger;

        public List<Question> Questions { get; set; }

        public QuestionsModel(ILogger<QuestionsModel> logger)
        {
            _logger = logger;
            Questions = new List<Question>();
        }

        public void OnGet()
        {
            Questions = new List<Question>
            {
                new Question
                {
                    Id = "q1",
                    SectionId = "sec1.1",
                    QuestionText = "What are the four main financial statements?",
                    Type = "multiple_choice",
                    Options = new List<string> { "Balance Sheet, Income Statement, Cash Flow Statement, Statement of Retained Earnings", "Trial Balance, General Ledger, Journal, Balance Sheet", "Income Statement, Balance Sheet, Tax Return, Bank Statement" },
                    CorrectAnswers = new List<int> { 0 },
                    Difficulty = "easy"
                },
                new Question
                {
                    Id = "q2",
                    SectionId = "sec2.1",
                    QuestionText = "True or False: Budgeting is the process of creating a plan to spend your money.",
                    Type = "true_false",
                    Options = new List<string> { "True", "False" },
                    CorrectAnswers = new List<int> { 0 },
                    Difficulty = "easy"
                },
                new Question
                {
                    Id = "q3",
                    SectionId = "sec4.2",
                    QuestionText = "Define 'variable cost'.",
                    Type = "short_answer",
                    Options = new List<string>(),
                    CorrectAnswers = new List<int>(),
                    Difficulty = "medium"
                }
            };
        }
    }
}
