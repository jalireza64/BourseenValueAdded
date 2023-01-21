using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum MeetKind
    {
        [Description("مجمع عمومی عادی")]
        Normal = 1,

        [Description("مجمع عمومی فوق العاده")]
        Special = 2,

        [Description("مجمع عمومی عادی به طور فوق العاده")]
        NormalAndSpecial = 3,

    }
}