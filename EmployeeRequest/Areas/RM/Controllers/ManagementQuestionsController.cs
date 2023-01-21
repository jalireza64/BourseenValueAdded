using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers
{
    public class ManagementQuestionsController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAllQuestionsPerCompany(string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var questionList = QuestionsRepository.GetAllQuestionsPerCompany(shrMeetKind, shrMeetDate, loginResult.CompId);
            var result = questionList.Select(t => new
            {
                fullname = t.meeting_users.shareholder.kind == ((int)ShareholderKind.Actual).ToString() ? t.meeting_users.shareholder.name + ' ' + t.meeting_users.shareholder.surname : t.meeting_users.shareholder.surname,
                t.meeting_users.shareholder.name,
                t.meeting_users.shareholder.surname,
                t.meeting_users.shareholder.shrh_code,
                t.meeting_users.shareholder.bbs_code,
                t.meeting_users.shareholder.nat_code,
                t.meeting_users.shareholder.kind,
                t.qid,
                t.desc1,
                time = t.update_date.ToString("HH:mm")

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}