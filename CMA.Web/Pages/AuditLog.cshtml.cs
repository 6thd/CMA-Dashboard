using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMA.Web.Models;
namespace CMA.Web.Pages
{
    public class AuditLogModel : PageModel
    {
        private readonly ILogger<AuditLogModel> _logger;

    public List<LogEntry>? Logs { get; set; }
    public SelectList? ActionTypes { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? FilterUser { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? FilterAction { get; set; }

        // In a real app, this would come from a logging service/database
        private List<LogEntry> _allLogs = new List<LogEntry>
        {
            new LogEntry { Timestamp = DateTime.Now.AddHours(-1), User = "Admin User", Action = "UPDATE_SETTINGS", Details = "Saved application settings." },
            new LogEntry { Timestamp = DateTime.Now.AddHours(-2), User = "Moderator User", Action = "SUSPEND_STUDENT", Details = "Suspended student 'Emily Davis'." },
            new LogEntry { Timestamp = DateTime.Now.AddHours(-3), User = "Content Creator", Action = "CREATE_EXAM", Details = "Created new exam 'Advanced Costing'." },
        };

        public AuditLogModel(ILogger<AuditLogModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            var logsQuery = _allLogs.AsQueryable();

            if (!string.IsNullOrEmpty(FilterUser))
            {
                logsQuery = logsQuery.Where(l => l.User != null && l.User.Contains(FilterUser, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrEmpty(FilterAction))
            {
                logsQuery = logsQuery.Where(l => l.Action == FilterAction);
            }

            Logs = logsQuery.OrderByDescending(l => l.Timestamp).ToList();
            
            var allActions = _allLogs.Select(l => l.Action).Distinct().ToList();
            ActionTypes = new SelectList(allActions);
        }
    }
}
