using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using System.Text;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Threading.Tasks;

namespace CMA.Web.Pages
{
    public class NotificationPrefsModel
    {
        public bool Registrations { get; set; } = true;
        public bool Submissions { get; set; } = true;
        public bool HighScores { get; set; } = false;
        public bool ExamPublished { get; set; } = true;
    }

    public class DisplayPrefsModel
    {
        public int ItemsPerPage { get; set; } = 10;
        public string DefaultDateRange { get; set; } = "30d";
    }

    public class SettingsModel : PageModel
    {
        private readonly ILogger<SettingsModel> _logger;

        [BindProperty]
        public NotificationPrefsModel NotificationPrefs { get; set; }

        [BindProperty]
        public DisplayPrefsModel DisplayPrefs { get; set; }

        [BindProperty]
        public string KnowledgeBase { get; set; }

    [BindProperty]
    public IFormFile? PdfFile { get; set; }

        public SettingsModel(ILogger<SettingsModel> logger)
        {
            _logger = logger;
            NotificationPrefs = new NotificationPrefsModel();
            DisplayPrefs = new DisplayPrefsModel();
            KnowledgeBase = string.Empty;
        }

        public void OnGet()
        {
            // Here you would typically load settings from a database or configuration
            // For now, we can load from a static file or leave empty
            if (System.IO.File.Exists("knowledgebase.txt"))
            {
                KnowledgeBase = System.IO.File.ReadAllText("knowledgebase.txt");
            }
            _logger.LogInformation("Settings page loaded.");
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (PdfFile != null && PdfFile.Length > 0)
            {
                _logger.LogInformation("PDF file uploaded: {FileName}", PdfFile.FileName);
                var sb = new StringBuilder();
                using (var reader = new PdfReader(PdfFile.OpenReadStream()))
                {
                    var pdfDoc = new PdfDocument(reader);
                    for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                    {
                        var page = pdfDoc.GetPage(i);
                        var strategy = new SimpleTextExtractionStrategy();
                        sb.Append(PdfTextExtractor.GetTextFromPage(page, strategy));
                    }
                }
                KnowledgeBase = sb.ToString();
            }

            // Save the extracted text (or manually entered text) to a file
            await System.IO.File.WriteAllTextAsync("knowledgebase.txt", KnowledgeBase);
            _logger.LogInformation("Knowledge base updated. Length: {Length}", KnowledgeBase.Length);

            // Here you would also save the other settings
            _logger.LogInformation("Settings saved.");
            _logger.LogInformation("Notification Prefs: {@Prefs}", NotificationPrefs);
            _logger.LogInformation("Display Prefs: {@Prefs}", DisplayPrefs);
            _logger.LogInformation("Knowledge Base Length: {Length}", KnowledgeBase.Length);

            // Redirect back to the settings page to show the saved state
            return RedirectToPage();
        }
    }
}
