//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmployeeRequest
{
    using System;
    using System.Collections.Generic;
    
    public partial class shrh_vote
    {
        public string shr_meet_kind { get; set; }
        public string shr_meet_date { get; set; }
        public decimal svot_no { get; set; }
        public decimal svot_item_no { get; set; }
        public string user_id { get; set; }
        public decimal vote { get; set; }
        public System.DateTime update_date { get; set; }
        public string shrh_code { get; set; }
        public decimal comp_id { get; set; }
        public string check_sum { get; set; }
    
        public virtual management_user management_user { get; set; }
        public virtual shr_meeting shr_meeting { get; set; }
        public virtual svot_item svot_item { get; set; }
        public virtual company company { get; set; }
        public virtual meeting_users meeting_users { get; set; }
    }
}
