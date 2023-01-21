using System;
using System.Web.Mvc;
using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using System.Linq;
using System.Collections.Generic;
using EmployeeRequest.Repository;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Config;

namespace EmployeeRequest.Controllers
{

    public partial class HomeController : BaseController
    {
        #region HttpGet Methods
        public virtual ActionResult Index()
        {
            return View();
        }

        #endregion

        [HttpPost]
        public virtual ActionResult GetShareholder()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            //var formPathForMeeting = ShrMeetingRepository.GetCurrentMeetingByCompanyIdAndDate(loginResult.CompId);
            var shareholder = ShareholerRepository.GetShareholder(loginResult.ShrhCode,loginResult.CompId);
            var result = shareholder.Select(t => new
            { t.bbs_code,
                t.share,
                t.cert_no,
                t.comp_id,
                t.credit_amnt,
                t.father,
                t.mobile,
                t.name,
                t.nat_code,
                t.pay_amnt,
                t.shrh_code,
                t.spri_amnt,
                t.spri_qunt,
                t.surname,
                t.s_address,
                t.s_postal_code,
                t.pay_id,
                t.kind,
                
                t.company.address,
                t.company.company_name,
                t.company.cap_percent,
                t.company.cap_amnt,
                t.company.pre_cap_amnt,
                t.company.reg_no,
                t.company.national_code,
                t.company.postal_code,
                t.company.tel,
                t.company.share_amnt,
                t.company.form_type,
                t.company.form_path,
                link_add_1 = AppSetting.GetCompanyLink(),
                link_add_2 = AppSetting.GetLiveBroadcastLink()
            }).FirstOrDefault();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        public virtual ActionResult GetMeetingPaperData(string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var formPathForMeeting = ShrMeetingRepository.GetCurrentMeetingByCompanyIdAndDate(loginResult.CompId).Where(t=>t.shr_meet_kind == shrMeetKind && t.shr_meet_date == shrMeetDate).FirstOrDefault();
            var shareholder = ShareholerRepository.GetShareholder(loginResult.ShrhCode, loginResult.CompId);
            var result = shareholder.Select(t => new
            {
                t.bbs_code,
                t.share,
                statusDesc = CaptionsLibrary.Shareholder,
                t.cert_no,
                t.comp_id,
                t.credit_amnt,
                t.father,
                t.mobile,
                t.name,
                t.nat_code,
                t.pay_amnt,
                t.shrh_code,
                t.spri_amnt,
                t.spri_qunt,
                t.surname,
                t.s_address,
                t.s_postal_code,
                t.pay_id,
                t.kind,

                t.company.address,
                t.company.company_name,
                t.company.cap_percent,
                t.company.cap_amnt,
                t.company.pre_cap_amnt,
                t.company.reg_no,
                t.company.national_code,
                t.company.postal_code,
                t.company.tel,
                t.company.share_amnt,
                t.company.form_type,
                form_path = formPathForMeeting.form_name,
                t.company.link_add_1,
                t.company.link_add_2
            }).FirstOrDefault();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetCurrentMeetingByCompanyIdAndDate()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = ShrMeetingRepository.GetCurrentMeetingByCompanyIdAndDate(loginResult.CompId);
            var result = meeting.Select(t => new
            {
                t.shr_meet_kind,
                t.shr_meet_date,
                shr_meet_date_formated = DateTimeHelper.ToPersianDateFormat(t.shr_meet_date),
                t.meet_add,
                t.meet_time,
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shr_meet_kind)).Value

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetCurrentDate()
        {
            var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now);
            var last1WeekDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddDays(-7));
            var last1MonthDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddMonths(-1));
            var last1YearDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddYears(-1));
            var beginOfMonthDate = DateTimeHelper.ToBeginOfMonth(DateTime.Now);
            var beginOfYearDate = DateTimeHelper.ToBeginOfYear(DateTime.Now);
            var result = new
            {
                currentDate,
                last1WeekDate,
                last1MonthDate,
                last1YearDate,
                beginOfMonthDate,
                beginOfYearDate
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetLoginResult()
        {
            var loginResult = Session["LoginResult"];         
            return Json(loginResult);
        }

        [HttpPost]
        public virtual ActionResult AddUserToMeeting(string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var isUserLoginAsReal = MeetingUsersRepository.GetAllRealUser(loginResult.CompId, shrMeetKind, shrMeetDate).Where(t=>t.shrh_code == loginResult.ShrhCode).Any();

            var meetingUser = new meeting_users
            {
                shr_meet_kind = shrMeetKind,
                shr_meet_date = shrMeetDate,
                comp_id = loginResult.CompId,
                shrh_code = loginResult.ShrhCode,
                presence_type = ((int)PresenceType.Virtual).ToString(),
                update_date = DateTime.Now
            };

            var userExistCount = MeetingUsersRepository.GetUserFromMeeting(meetingUser).Count;

            var result = userExistCount == 0 ? MeetingUsersRepository.AddUserToMeeting(meetingUser) : true;

            if (isUserLoginAsReal)
                return Json(ResponseType.Failed, MessagesLibrary.YouHaveAttendedTheMeetingInPerson);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}

