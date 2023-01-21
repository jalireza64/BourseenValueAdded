using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum PersonPresentStatus
    {
        [Description("وکیل")]
        Lawyer = 1,

        [Description("موکل")]
        Client = 2,

        [Description("شخص")]
        Person = 3,
    }
}