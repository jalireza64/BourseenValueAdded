using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;

namespace EmployeeRequest.Repository.ShareSys
{
    public class ShareholderRelRepository
    {
        public static List<SHAREHOLDER_REL> GetShareholderRel(string shrhCode)
        {
            using (var context = new seasonFbShrEntities())
            {
                var currentDate = Convert.ToDecimal(DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", ""));
                var rel = context.SHAREHOLDER_REL.Where(t=>t.SHRH_CODE == shrhCode && t.INLAW != "1" && t.MEETING_FLAG == "2").ToList();
                var validRel = rel.Where(t => currentDate >= Convert.ToDecimal(t.EFF_DATE) && currentDate <= Convert.ToDecimal(t.TBL_DATE)).ToList();
                return rel;
            }
        }
    }
}