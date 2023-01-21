using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareholderModel
    {
            public string shrh_code { get; set; }
            public string name { get; set; }
            public string surname { get; set; }
            public string bbs_code { get; set; }
            public string father { get; set; }
            public string cert_no { get; set; }
            public string nat_code { get; set; }
            public string password { get; set; }
            public string s_address { get; set; }
            public string mobile { get; set; }
            public string s_postal_code { get; set; }
            public string kind { get; set; }
            public string shr_meet_date { get; set; }
            public string relation_id { get; set; }
            public decimal comp_id { get; set; }
            public Nullable<long> share { get; set; }
    }
}