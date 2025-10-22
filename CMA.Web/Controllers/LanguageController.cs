using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace CMA.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguageController : ControllerBase
    {
        [HttpPost("set")]
        public IActionResult SetLanguage([FromBody] LanguageModel model)
        {
            Console.WriteLine($"Received language change request: {model.Language}");
            
            if (string.IsNullOrEmpty(model.Language))
            {
                Console.WriteLine("Language is null or empty");
                return BadRequest("Language is required");
            }

            // Validate language
            var supportedLanguages = new[] { "en", "ar" };
            if (!supportedLanguages.Contains(model.Language))
            {
                Console.WriteLine($"Unsupported language: {model.Language}");
                return BadRequest("Unsupported language");
            }

            Console.WriteLine($"Setting language cookie to: {model.Language}");
            // Set the language cookie
            Response.Cookies.Append(
                "language",
                model.Language,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    IsEssential = true,
                    Path = "/",
                    HttpOnly = false, // Allow client-side access
                    SameSite = SameSiteMode.Lax
                });

            return Ok(new { message = "Language set successfully" });
        }
    }

    public class LanguageModel
    {
        public string? Language { get; set; }
    }
}