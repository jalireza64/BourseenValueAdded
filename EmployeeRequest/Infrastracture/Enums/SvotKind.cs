using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum SvotKind
    {
        [Description("به میزان سهام")]
        ShareCount = 1,

        [Description("تعداد انتخاب در میزان سهام")]
        ShareCountXItemCount = 2,

        [Description("هر سهامدار یک رای")]
        OneVote = 3,

        [Description("به تعداد انتخاب")]
        ItemCount = 4,

        [Description("ثابت")]
        Fixed = 5
    }
}