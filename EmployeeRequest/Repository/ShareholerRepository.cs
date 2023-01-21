using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;

namespace EmployeeRequest.Repository
{
    public class ShareholerRepository
    {
        public static List<shareholder> GetRelationShareholder(string shrhCode, decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var shareholderRelationId = context.shareholders.Include(t => t.company).Where(t => t.relation_id == shrhCode && t.comp_id == compId && currentDate == t.shr_meet_date).FirstOrDefault()?.relation_id;

                var shareholders = context.shareholders.Include(t => t.company).Where(t => shareholderRelationId != null ? t.relation_id == shareholderRelationId : false && t.comp_id == compId && currentDate == t.shr_meet_date).ToList();

                return shareholders;
            }
        }

        public static List<shareholder> GetShareholder(string shrhCode,decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var shareholderPerson = context.shareholders.Include(t=>t.company).Where(t => t.shrh_code == shrhCode && t.comp_id == compId && currentDate == t.shr_meet_date).ToList();
                return shareholderPerson;
            }
        }

        public static shareholder GetCurrentShareholder(string shrhCode, decimal compId,string meetDate)
        {
            using (var context = new capitalEntities())
            {
                var date = meetDate.Replace("/", "");
                var shareholderPerson = context.shareholders.Include(t => t.company).Where(t => t.shrh_code == shrhCode && t.comp_id == compId && date == t.shr_meet_date).FirstOrDefault();
                return shareholderPerson;
            }
        }

        public static List<shareholder> GetShareholdersForSearch(decimal compId, string natCode, string shrhKind, string name, string surname, string bbsCode, string certNo, string father, string shrhStatus)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var shareholderPerson = context.shareholders.AsEnumerable().Where(t =>
                (natCode != "" ? t.nat_code == natCode : 1 == 1) &&
                (shrhKind != "" ? t.kind == shrhKind : 1 == 1) &&
                (name != "" ? StringHelper.ReplaceWithArabicChar(t.name).Contains(StringHelper.ReplaceWithArabicChar(name)) : 1 == 1) &&
                (surname != "" ? StringHelper.ReplaceWithArabicChar(t.surname).Contains(StringHelper.ReplaceWithArabicChar(surname)) : 1 == 1) &&
                (bbsCode != "" ? StringHelper.ReplaceWithArabicChar(t.bbs_code).Contains(StringHelper.ReplaceWithArabicChar(bbsCode)) : 1 == 1) &&
                (father != "" ? StringHelper.ReplaceWithArabicChar(t.father).Contains(StringHelper.ReplaceWithArabicChar(father)) : 1 == 1) &&
                (certNo != "" ? t.cert_no == certNo : 1 == 1) &&
                (shrhStatus != "" ? (shrhStatus == "1" ? t.relation_id == t.shrh_code : t.relation_id == null) : 1 == 1) &&
                (t.comp_id == compId) &&
                (currentDate == t.shr_meet_date)).ToList();
                return shareholderPerson;
            }
        }

        public static List<shareholder> GetShareholdersClientsInfo(decimal compId, string lawyerShrhCode)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var shareholderList = context.shareholders.AsEnumerable().Where(t =>
                (t.relation_id == lawyerShrhCode && t.shrh_code != lawyerShrhCode) &&
                (t.comp_id == compId) &&
                (currentDate == t.shr_meet_date)).ToList();
                return shareholderList;
            }
        }

        public static List<shareholder> GetShareholdersLawyerInfo(decimal compId, string clientShrhCode)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var lawyerShrhCode = context.shareholders.AsEnumerable().Where(t =>
                (t.shrh_code != clientShrhCode) &&
                (t.comp_id == compId) &&
                (currentDate == t.shr_meet_date)).FirstOrDefault().shrh_code;

                var shareholderList = context.shareholders.AsEnumerable().Where(t =>
                (t.shrh_code == lawyerShrhCode) &&
                (t.comp_id == compId) &&
                (currentDate == t.shr_meet_date)).ToList();

                return shareholderList;
            }
        }

        public static Dictionary<int, string> GetAllShareholderKind()
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(ShareholderKind)))
            {
                dict.Add((int)Enum.Parse(typeof(ShareholderKind), name), ((ShareholderKind)(int)Enum.Parse(typeof(ShareholderKind), name)).GetDescription());
            }
            return dict;
        }

        public static KeyValuePair<int, string> GetShareholderKind(int key)
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(ShareholderKind)))
            {
                dict.Add((int)Enum.Parse(typeof(ShareholderKind), name), ((ShareholderKind)(int)Enum.Parse(typeof(ShareholderKind), name)).GetDescription());
            }
            var selectedShareholderKind = dict.Where(t => t.Key == key).FirstOrDefault();
            return selectedShareholderKind;
        }

        public static long? GetTotalSharesOfCompany(decimal compId,string date)
        {
            using (var context = new capitalEntities())
            {
                //var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var totalShares = context.shareholders.Where(t => t.comp_id == compId && date == t.shr_meet_date).Sum(t => t.share);
                return totalShares;
            }
        }

        public static bool AddShareholder(shareholder shareholder)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var shareholders = db.Set<shareholder>();
                shareholders.Add(shareholder);
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }


        public static bool ModifyShareholder(shareholder shareholder)
        {
            // modify
            using (var db = new capitalEntities())
            {
                db.shareholders.Attach(shareholder);
                db.Entry(shareholder).State = EntityState.Modified;
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}