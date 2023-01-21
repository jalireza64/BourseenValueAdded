using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.Repository.ShareSys;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers
{
    public class ShrMeetingController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAllMeetingByCompId()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = ShrMeetingRepository.GetMeetingByCompanyIdAndDate(loginResult.CompId);
            var result = meeting.Select(t => new
            {
                t.shr_meet_kind,
                t.shr_meet_date,
                shr_meet_date_formated = DateTimeHelper.ToPersianDateFormat(t.shr_meet_date),
                t.meet_add,
                t.meet_time,
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shr_meet_kind)).Value,
                t.form_name

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetAllMeetKind()
        {
            var meeting = ShrMeetingRepository.GetAllMeetKinds();
            var result = meeting.Select(t => new
            {
                t.Key,
                t.Value

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddShrMeeting(string meetKind, string meetDate, string meetAdd, string meetTime)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var notFormattedMeetDate = meetDate.Replace("/", "");

            CultureInfo culture = new CultureInfo("en-US");
            string time = Convert.ToDateTime(meetTime, culture).ToString("HH:mm");

            var shrMeetingObject = new shr_meeting
            {
                shr_meet_kind = meetKind,
                shr_meet_date = notFormattedMeetDate,
                comp_id = loginResult.CompId,
                meet_add = meetAdd,
                meet_time = time,
                user_id = loginResult.ManagementUserId,
                form_name = loginResult.CompId + meetKind + notFormattedMeetDate,
                update_date = DateTime.Now
            };

            var result = ShrMeetingRepository.AddShrMeeting(shrMeetingObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult RemoveShrMeeting(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var notFormattedMeetDate = meetDate.Replace("/", "");
            var shrMeetingObject = new shr_meeting
            {
                shr_meet_kind = meetKind,
                shr_meet_date = notFormattedMeetDate,
                comp_id = loginResult.CompId
            };

            var result = ShrMeetingRepository.RemoveShrMeeting(shrMeetingObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult GetSpFbShrTrans(string meetDate)
        {
            var listItem = ShrMeetingRepository.GetSpFbShrTrans(meetDate);
            var result = new
            {
                shareholderCount = listItem.Count(),
                shareholderShareSummary = listItem.Sum(t => t.share)
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult SyncFromSystem(string meetDate,bool isWithRepresentationInfo, GeneratedPasswordType generatedPasswordType)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shareholderGeneratedList = ShrMeetingRepository.GetSpFbShrTransWithInfo(meetDate, loginResult.CompId);
            var result = new List<bool>();
            foreach (shareholder shareholderItem in shareholderGeneratedList)
            {

                if (generatedPasswordType != 0)
                {
                    if (generatedPasswordType == GeneratedPasswordType.Unique)
                    {
                        var generatedPass = System.Web.Security.Membership.GeneratePassword(8, 3);
                        shareholderItem.password = generatedPass;
                    }

                    if (generatedPasswordType == GeneratedPasswordType.CertNo)
                    {
                        var generatedPass = shareholderItem.cert_no?.Trim();
                        shareholderItem.password = generatedPass;
                    }

                    if (generatedPasswordType == GeneratedPasswordType.NatCode)
                    {
                        var generatedPass = shareholderItem.nat_code?.Trim();
                        shareholderItem.password = generatedPass;
                    }
                }

                result.Add(ShareholerRepository.AddShareholder(shareholderItem));
            }

            if (isWithRepresentationInfo)
            {
                foreach (shareholder shareholderItem in shareholderGeneratedList)
                {
                    var shareholderRelList = ShareholderRelRepository.GetShareholderRel(shareholderItem.shrh_code);
                    foreach (SHAREHOLDER_REL relItem in shareholderRelList)
                    {
                        var shareholder = ShareholerRepository.GetCurrentShareholder(relItem.SHA_SHRH_CODE, loginResult.CompId, meetDate);
                        shareholder.relation_id = relItem.SHRH_CODE;
                        ShareholerRepository.ModifyShareholder(shareholder);
                    };

                    if (shareholderRelList.Any())
                    {
                        var shareholder = ShareholerRepository.GetCurrentShareholder(shareholderItem.shrh_code, loginResult.CompId, meetDate);
                        shareholder.relation_id = shareholderItem.shrh_code;
                        ShareholerRepository.ModifyShareholder(shareholder);
                    }
                }
            }

            if (!result.Contains(true))
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}