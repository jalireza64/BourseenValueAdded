using EmployeeRequest.Infrastracture.Enums;
using System;
using System.Web;

//using Eos.Core.Enums;
//using Ets.Data.Basic;
//using Ets.Web.Core.Shared.Enums.CRUD;
//using Ets.Web.Core.Shared.Helpers.GeneralHelpers;

namespace EmployeeRequest.Infrastracture.Helpers
{
    public class CultureHelper
    {
        const string CultureKey = "EtsCulture";
        // fa-IR  || en-US
        const string DeafultCultureValue = "fa-IR";

        //public static void Initilize()
        //{
        //    if (!ConfigurationHelper.HasConfig(CultureKey))
        //        ConfigurationHelper.AddConfig(CultureKey, DeafultCultureValue);
        //}

        #region Common Methods

        public static CultureType GetCultureSession()
        {
            try
            {
                return (CultureType)HttpContext.Current.Session["appCulture"];
            }
            catch (Exception ex)
            {
                return GetCulture();
            }
        }
        public static CultureType GetCulture()
        {
            try
            {
                var httpContext = HttpContext.Current;
                var session = httpContext?.Session;
                var appCulture = session?["appCulture"];

                if (appCulture != null)
                    return (CultureType)appCulture;

                var culture = CookieHelper.GetCookie(CultureKey);
                if (!string.IsNullOrEmpty(culture))
                    return GetCulture(culture);

                var userCultureType = CultureType.Persian;

                return userCultureType;
            }
            catch
            {
                // ErrorSignal.FromCurrentContext().Raise(ex);
                return CultureType.Persian;
            }
        }
        public static CultureType GetCulture(string culture)
        {
            switch (culture.ToLower())
            {
                case "persian":
                case "fa-ir":
                    return CultureType.Persian;
                case "english":
                case "en-us":
                    return CultureType.English;
            }
            return CultureType.Persian;
        }
        public static string GetCultureString()
        {
            var culture = GetCulture();
            switch (culture)
            {
                case CultureType.Persian:
                    return "fa-IR";
                case CultureType.English:
                    return "en-US";
            }
            return "fa-IR";
        }
        public static string GetCulture(CultureType culture)
        {
            switch (culture)
            {
                case CultureType.Persian:
                    return "fa-IR";
                case CultureType.English:
                    return "en-US";
            }
            return "fa-IR";
        }
        public static bool ChangeCulture(CultureType cultureType)
        {
            try
            {
                CookieHelper.SetCookie(CultureKey, GetCulture(cultureType), TimeSpan.FromDays(365));
                HttpContext.Current.Session["appCulture"] = cultureType;

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public void RewriteCultureSession()
        {
            try
            {
                var selectedCulture = GetCulture();
                var storedCulture = HttpContext.Current.Session["appCulture"] ?? selectedCulture;

                if ((CultureType)storedCulture != selectedCulture)
                    storedCulture = selectedCulture;

                HttpContext.Current.Session["appCulture"] = storedCulture;
            }
            catch (Exception ex)
            {
            }
        }


        #endregion
    }
}
