using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum PresenceType
    {
        [Description("حضوری")]
        Real = 1,

        [Description("مجازی")]
        Virtual = 2,
    }
}