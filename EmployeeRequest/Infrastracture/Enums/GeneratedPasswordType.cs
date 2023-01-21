using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum GeneratedPasswordType
    {
        [Description("یکتا")]
        Unique = 1,

        [Description("شماره شناسنامه")]
        CertNo = 2,

        [Description("شماره ملی")]
        NatCode = 3,

    }
}