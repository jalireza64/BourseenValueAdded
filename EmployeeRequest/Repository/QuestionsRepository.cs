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
    public class QuestionsRepository
    {
        public static List<question> GetAllQuestionsPerCompany(string shrMeetKind, string shrMeetDate, decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var questionList = context.questions.Include(t=>t.meeting_users.shareholder).Where(t => t.shr_meet_kind == shrMeetKind && t.shr_meet_date == shrMeetDate && t.comp_id == compId).OrderByDescending(t => t.qid).ToList();
                return questionList;
            }
        }

        public static List<question> GetQuestionsPerPerson(string shrMeetKind, string shrMeetDate, string shrhCode, decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var questionList = context.questions.Where(t => t.shr_meet_kind == shrMeetKind && t.shr_meet_date == shrMeetDate && t.comp_id == compId && t.shrh_code == shrhCode).OrderByDescending(t=>t.qid).ToList();
                return questionList;
            }
        }

        public static bool AddQuestion(question questionObject)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var questions = db.Set<question>();
                questions.Add(questionObject);
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