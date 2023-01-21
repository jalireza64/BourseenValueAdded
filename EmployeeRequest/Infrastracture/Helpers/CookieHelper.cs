using System;
using System.Linq;
using System.Web;

//using Ets.Web.Core.Shared.Enums.General;
//using Ets.Web.Core.Shared.Helpers.GeneralHelpers;
//using Ets.Web.Core.Shared.Security.HttpCookieSecurity;

namespace EmployeeRequest.Infrastracture.Helpers
{
    public class CookieHelper
    {
        public static void SetCookie(string key, string value, TimeSpan expires)
        {
                var encodedCookie = new HttpCookie(key, value);

                if (HttpContext.Current.Request.Cookies[key] != null)
                {
                    var cookieOld = HttpContext.Current.Request.Cookies[key];
                    cookieOld.Expires = DateTime.Now.Add(expires);
                    cookieOld.Value = encodedCookie.Value;
                    cookieOld.HttpOnly = true;
                    HttpContext.Current.Response.Cookies.Set(cookieOld);
                }
                else
                {
                    encodedCookie.Expires = DateTime.Now.Add(expires);
                    encodedCookie.HttpOnly = true;
                    HttpContext.Current.Response.Cookies.Add(encodedCookie);
                }
        }
        public static string GetCookie(string key)
        {
            var value = string.Empty;
            HttpCookie cookie = null;

            if (HttpContext.Current.Response.Cookies.AllKeys.Contains(key))
                cookie = HttpContext.Current.Response.Cookies[key];

            if (HttpContext.Current.Request.Cookies.AllKeys.Contains(key))
                cookie = HttpContext.Current.Request.Cookies[key];
            
            if (cookie != null) 
                value = cookie.Value;

            if (cookie == null) 
                return value;

            // For security purpose
            var decodedCookie = cookie;
            value = decodedCookie.Value;
            return value;
        }

        public static bool HasCookie(string key)
        {
            var cookie = HttpContext.Current.Request.Cookies[key];
            return cookie != null;
        }

        public static void RemoveCookie(string cookieName)
        {
                if (!HttpContext.Current.Request.Cookies.AllKeys.Any(p => p.Contains(cookieName))) return;

                var cookie = HttpContext.Current.Request.Cookies[cookieName];
                if (cookie == null) return;
                cookie.Expires = DateTime.Now.AddDays(-1);
                HttpContext.Current.Response.Cookies.Add(cookie);
                HttpContext.Current.Response.Cookies.Set(cookie);
        }
    }
}
