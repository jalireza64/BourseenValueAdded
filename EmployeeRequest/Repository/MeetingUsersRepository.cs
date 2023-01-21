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
    public class MeetingUsersRepository
    {
        public static List<meeting_users> GetAllRealUser(decimal compId,string shrMeetKind, string shrMeetDate)
        {
            using (var context = new capitalEntities())
            {
                var presenceType = Convert.ToString((int)PresenceType.Real);
                var userList = context.meeting_users.Include(t=>t.shareholder).Where(t => t.shr_meet_kind == shrMeetKind && t.shr_meet_date == shrMeetDate && t.comp_id == compId && t.presence_type == presenceType).ToList();
                return userList;
            }
        }

        public static List<meeting_users> GetFilteredRealUser(decimal compId, string shrMeetKind, string shrMeetDate, string natCode, string shrhKind, string name, string surname, string bbsCode, string certNo, string father)
        {
            using (var context = new capitalEntities())
            {
                var presenceType = Convert.ToString((int)PresenceType.Real);
                var userList = context.meeting_users.Include(t => t.shareholder).AsEnumerable().Where(t =>
                  (natCode != "" ? t.shareholder.nat_code == natCode : 1 == 1) &&
                  (shrhKind != "" ? t.shareholder.kind == shrhKind : 1 == 1) &&
                  (name != "" ? StringHelper.ReplaceWithArabicChar(t.shareholder.name).Contains(StringHelper.ReplaceWithArabicChar(name)) : 1 == 1) &&
                  (surname != "" ? StringHelper.ReplaceWithArabicChar(t.shareholder.surname).Contains(StringHelper.ReplaceWithArabicChar(surname)) : 1 == 1) &&
                  (bbsCode != "" ? StringHelper.ReplaceWithArabicChar(t.shareholder.bbs_code).Contains(StringHelper.ReplaceWithArabicChar(bbsCode)) : 1 == 1) &&
                  (father != "" ? StringHelper.ReplaceWithArabicChar(t.shareholder.father).Contains(StringHelper.ReplaceWithArabicChar(father)) : 1 == 1) &&
                  (certNo != "" ? t.shareholder.cert_no == certNo : 1 == 1) &&
                  (t.shr_meet_kind == shrMeetKind) &&
                  (t.shr_meet_date == shrMeetDate) &&
                  (t.comp_id == compId) &&
                  (t.presence_type == presenceType)
                ).ToList();
                return userList;
            }
        }

        public static List<meeting_users> GetAllMeetingUser(decimal compId, string shrMeetKind, string shrMeetDate,string presenceType,string shrhCode,string bbsCode,string kind)
        {
            using (var context = new capitalEntities())
            {
                var userList = context.meeting_users.Include(t => t.shareholder).Where(t =>
                (shrMeetKind != "" ? t.shr_meet_kind == shrMeetKind : true) &&
                (shrMeetDate != "" ? t.shr_meet_date == shrMeetDate : true) &&
                (presenceType != "" ? t.presence_type == presenceType : true) &&
                (shrhCode != "" ? t.shrh_code == shrhCode : true) &&
                (kind != "" ? t.shareholder.kind == kind : true) &&
                (bbsCode != "" ? t.shareholder.bbs_code.Contains(bbsCode) : 1 == 1) &&
                (t.comp_id == compId)).ToList();
                return userList;
            }
        }

        public static Dictionary<int, string> GetAllPresenceType()
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(PresenceType)))
            {
                dict.Add((int)Enum.Parse(typeof(PresenceType), name), ((PresenceType)(int)Enum.Parse(typeof(PresenceType), name)).GetDescription());
            }
            return dict;
        }

        public static KeyValuePair<int, string> GetPresenceType(int key)
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(PresenceType)))
            {
                dict.Add((int)Enum.Parse(typeof(PresenceType), name), ((PresenceType)(int)Enum.Parse(typeof(PresenceType), name)).GetDescription());
            }
            var selectedPresenceType = dict.Where(t => t.Key == key).FirstOrDefault();
            return selectedPresenceType;
        }

        public static List<meeting_users> GetUserFromMeeting(meeting_users meetingUser)
        {
            using (var context = new capitalEntities())
            {
                var userList = context.meeting_users.Where(t => t.shr_meet_kind == meetingUser.shr_meet_kind && t.shr_meet_date == meetingUser.shr_meet_date && t.comp_id == meetingUser.comp_id && t.shrh_code == meetingUser.shrh_code).ToList();
                return userList;
            }
        }

        public static bool AddUserToMeeting(meeting_users meetingUser)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var meetingUsers = db.Set<meeting_users>();
                meetingUsers.Add(meetingUser);
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

        public static List<meeting_users> GetPresentedMeetingUsersList(string shrMeetKind, string shrMeetDate, decimal compId)
        {
            // insert
            using (var context = new capitalEntities())
            {

                var presentedShareholder = context.meeting_users.Where(t => t.comp_id == compId && t.shr_meet_date == shrMeetDate && t.shr_meet_kind == shrMeetKind).ToList();
                return presentedShareholder;
            }
        }
    }
}