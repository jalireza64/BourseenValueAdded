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
    public class ShrMeetingRepository
    {
        public static List<shr_meeting> GetCurrentMeetingByCompanyIdAndDate(decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/","");
                var meeting = context.shr_meeting.Where(t=> t.comp_id == compId && t.shr_meet_date == currentDate).ToList();
                return meeting;
            }
        }

        public static List<shr_meeting> GetMeetingByCompanyIdAndDate(decimal compId)
        {
            using (var context = new capitalEntities())
            {
                //var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now).Replace("/", "");
                var meeting = context.shr_meeting.Where(t => t.comp_id == compId).ToList();
                return meeting;
            }
        }

        public static Dictionary<int, string> GetAllMeetKinds()
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(MeetKind)))
            {
                dict.Add((int)Enum.Parse(typeof(MeetKind), name), ((MeetKind)(int)Enum.Parse(typeof(MeetKind), name)).GetDescription());
            }
            return dict;
        }

        public static KeyValuePair<int, string> GetMeetKind(int key)
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(MeetKind)))
            {
                dict.Add((int)Enum.Parse(typeof(MeetKind), name), ((MeetKind)(int)Enum.Parse(typeof(MeetKind), name)).GetDescription());
            }
            var selectedMeetKind = dict.Where(t => t.Key == key).FirstOrDefault();
            return selectedMeetKind;
        }

        public static bool AddShrMeeting(shr_meeting shrMeeting)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var shrMeetings = db.Set<shr_meeting>();
                shrMeetings.Add(shrMeeting);
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

        public static bool RemoveShrMeeting(shr_meeting shrMeeting)
        {
            // remove
            using (var db = new capitalEntities())
            {
                db.Configuration.ValidateOnSaveEnabled = false;
                db.shr_meeting.Attach(shrMeeting);
                db.Entry(shrMeeting).State = EntityState.Deleted;
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

        public static List<sp_fb_shr_trans_Result> GetSpFbShrTrans(string meetDate)
        {
            using (var context = new seasonFbShrEntities())
            {
                var listItem = context.sp_fb_shr_trans("", meetDate).Where(t=>t.share > 0).ToList();
                return listItem;
            }
        }

        public static List<shareholder> GetSpFbShrTransWithInfo(string meetDate, decimal compId)
        {
            using (var context = new seasonFbShrEntities())
            {
                var listItem = context.sp_fb_shr_trans("", meetDate).Where(t => t.share > 0);
                var listInfoItem = context.v_fb_shareholder2;

                var query = from t1 in listItem
                            join t2 in listInfoItem
                                 on t1.shrh_code equals t2.shrh_code
                            select new shareholder
                            {
                                shrh_code = t1.shrh_code?.Trim(),
                                name = t2.name1?.Trim(),
                                surname = t2.surname1?.Trim(),
                                bbs_code = t2.shrh_exch_code?.Trim(),
                                father = t2.father1?.Trim(),
                                cert_no = t2.cert_no?.Trim(),
                                nat_code = t2.nat_code?.Trim(),
                                password = null,
                                s_address = t2.address?.Trim(),
                                mobile = null,
                                s_postal_code = t2.zip_code?.Trim(),
                                kind = t2.shrh_kind?.Trim(),
                                shr_meet_date = meetDate.Replace("/", ""),
                                relation_id = null,
                                comp_id = compId,
                                share = t1.share
                            };

                return query.ToList();
            }
        }
    }
}