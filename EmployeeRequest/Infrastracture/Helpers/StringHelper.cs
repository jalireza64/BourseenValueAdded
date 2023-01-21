using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.Infrastracture.Helpers
{
    public class StringHelper
    {
        public static string ReplaceWithArabicChar(string input)
        {

            var result = input == null ? "" : input.Replace("ک", "ك").Replace("ی", "ي");
            return result;
        }
    }
}