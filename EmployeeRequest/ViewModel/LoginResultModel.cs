using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class LoginResultModel
    {
        public string ShrhCode { get; set; }
        public string BBSCode { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }
        public decimal CompId { get; set; }
        public string ManagementUserId { get; set; }
        public string UserType { get; set; }
    }
}