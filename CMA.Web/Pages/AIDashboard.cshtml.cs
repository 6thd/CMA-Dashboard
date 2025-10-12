using Microsoft.AspNetCore.Mvc.RazorPages;
namespace CMA.Web.Pages
{
    public class AIDashboardModel : PageModel
    {
        private readonly ILogger<AIDashboardModel> _logger;

        public AIDashboardModel(ILogger<AIDashboardModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            _logger.LogInformation("AI Dashboard page loaded.");
        }
    }
}
