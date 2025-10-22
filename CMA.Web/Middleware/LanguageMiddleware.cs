using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace CMA.Web.Middleware
{
    public class LanguageMiddleware
    {
        private readonly RequestDelegate _next;

        public LanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var languageCookie = context.Request.Cookies["language"];
            
            if (!string.IsNullOrEmpty(languageCookie))
            {
                try
                {
                    var cultureInfo = new CultureInfo(languageCookie);
                    CultureInfo.CurrentCulture = cultureInfo;
                    CultureInfo.CurrentUICulture = cultureInfo;
                }
                catch (CultureNotFoundException)
                {
                    // If the culture is not found, use the default
                }
            }

            await _next(context);
        }
    }
}