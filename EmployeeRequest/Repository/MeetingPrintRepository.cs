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
    public class MeetingPrintRepository
    {
        public static bool AddMeetingPrint(meeting_print meetingPrint)
        {
            // insert
            using (var context = new capitalEntities())
            {
                var meetingPrints = context.Set<meeting_print>();
                meetingPrints.Add(meetingPrint);
                var result = context.SaveChanges();
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

        public static bool CheckRecordExist(meeting_print meetingPrint)
        {
            // insert
            using (var context = new capitalEntities())
            {

                var result = context.meeting_print.Where(t => t.shrh_code == meetingPrint.shrh_code && t.shr_meet_date == meetingPrint.shr_meet_date && t.shr_meet_kind == meetingPrint.shr_meet_kind && t.comp_id == meetingPrint.comp_id).Any();
                return result;
            }
        }

        public static List<meeting_print> GetPrintedMeetingFormList(string shrMeetKind, string shrMeetDate,decimal compId)
        {
            // insert
            using (var context = new capitalEntities())
            {

                var printedShareholder = context.meeting_print.Where(t => t.comp_id == compId && t.shr_meet_date == shrMeetDate && t.shr_meet_kind == shrMeetKind && t.print_flag == "2").ToList();
                return printedShareholder;
            }
        }

        public static List<meeting_print> GetClientPrintedMeetingFormList(string shrMeetKind, string shrMeetDate, decimal compId, string lawyerId, string shrhCode)
        {
            // insert
            using (var context = new capitalEntities())
            {

                var printedShareholder = context.meeting_print.Where(t => t.comp_id == compId && t.shr_meet_date == shrMeetDate && t.shr_meet_kind == shrMeetKind && t.print_flag == "2" && t.shrh_code == shrhCode && t.status == lawyerId && t.status != null && t.status != shrhCode).ToList();
                return printedShareholder;
            }
        }
    }
}


