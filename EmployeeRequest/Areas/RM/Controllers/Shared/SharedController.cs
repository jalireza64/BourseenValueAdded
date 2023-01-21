using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Config;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Shared
{
    public class SharedController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAppSettingKeyForLogin()
        {
            bool showPasswordInLoginState = AppSetting.GetShowPasswordInLoginState();
            bool showRememberMeInLoginState = AppSetting.GetShowRememberMeInLoginState();
            var result = new
            {
                showPasswordInLoginState,
                showRememberMeInLoginState
            };
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetVersion()
        {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
            string result = fvi.FileVersion;
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult setPrintFlag(string shrh_code, string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var shareholder = ShareholerRepository.GetShareholder(shrh_code, loginResult.CompId);
            var lawyerId = shareholder.FirstOrDefault().relation_id;
            var printedMeetingFormList = MeetingPrintRepository.GetPrintedMeetingFormList(shrMeetKind, shrMeetDate, loginResult.CompId);
            var printInfo = MeetingPrintRepository.GetClientPrintedMeetingFormList(shrMeetKind, shrMeetDate, loginResult.CompId, lawyerId, shrh_code);

            if (printInfo.Any())
                return Json(ResponseType.Failed, MessagesLibrary.ThisMeetingFormIsRecivedByLawyer);

            if (printedMeetingFormList.Where(t => t.shrh_code == shrh_code).Any())
                return Json(ResponseType.Failed, MessagesLibrary.ThisMeetingFormIsPrinted);

            var meetingPrint = new meeting_print
            {
                shr_meet_kind = shrMeetKind,
                shr_meet_date = shrMeetDate,
                comp_id = loginResult.CompId,
                shrh_code = shrh_code,
                print_flag = "2",
                user_id = null,
                update_date = DateTime.Now,
                status = null
            };
            var result = MeetingPrintRepository.AddMeetingPrint(meetingPrint);
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult setPrintFlagForManagement(string shrh_code, string shrMeetKind, string shrMeetDate, bool withRelation)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shareholderLawyerWithClient = ShareholerRepository.GetRelationShareholder(shrh_code, loginResult.CompId);
            var printedMeetingFormList = MeetingPrintRepository.GetPrintedMeetingFormList(shrMeetKind, shrMeetDate, loginResult.CompId);
            var shareholderLawyerWithNotPrintedClient = shareholderLawyerWithClient.Where(p => !printedMeetingFormList.Any(p2 => p2.shrh_code == p.shrh_code));

            var shareholder = ShareholerRepository.GetShareholder(shrh_code, loginResult.CompId);

            var lawyerId = shareholder.FirstOrDefault().relation_id;
            var shrhCode = shareholder.FirstOrDefault().shrh_code;
            var printInfo = MeetingPrintRepository.GetClientPrintedMeetingFormList(shrMeetKind, shrMeetDate, loginResult.CompId, lawyerId, shrhCode);

            if (printInfo.Any())
                return Json(ResponseType.Failed, MessagesLibrary.ThisMeetingFormIsRecivedByLawyer);

            if(printedMeetingFormList.Where(t=>t.shrh_code == shrh_code).Any())
                return Json(ResponseType.Failed, MessagesLibrary.ThisMeetingFormIsPrinted);

            Boolean outPut = false;

            if (withRelation)
            {
                if (shareholderLawyerWithClient.Any())
                {
                    foreach (shareholder element in shareholderLawyerWithNotPrintedClient)
                    {
                        var meetingPrint = new meeting_print
                        {
                            shr_meet_kind = shrMeetKind,
                            shr_meet_date = shrMeetDate,
                            comp_id = loginResult.CompId,
                            shrh_code = element.shrh_code,
                            print_flag = "2",
                            user_id = loginResult.ManagementUserId,
                            update_date = DateTime.Now,
                            status = shareholderLawyerWithNotPrintedClient.Count() > 1 ? shrh_code : null
                        };

                        outPut = !MeetingPrintRepository.CheckRecordExist(meetingPrint) ? MeetingPrintRepository.AddMeetingPrint(meetingPrint) : false;
                    }
                }
                else
                {
                    foreach (shareholder element in shareholder)
                    {
                        var meetingPrint = new meeting_print
                        {
                            shr_meet_kind = shrMeetKind,
                            shr_meet_date = shrMeetDate,
                            comp_id = loginResult.CompId,
                            shrh_code = element.shrh_code,
                            print_flag = "2",
                            user_id = loginResult.ManagementUserId,
                            update_date = DateTime.Now,
                            status = null
                        };

                        outPut = !MeetingPrintRepository.CheckRecordExist(meetingPrint) ? MeetingPrintRepository.AddMeetingPrint(meetingPrint) : false;
                    }
                }
            }
            else
            {
                foreach (shareholder element in shareholder)
                {
                    var meetingPrint = new meeting_print
                    {
                        shr_meet_kind = shrMeetKind,
                        shr_meet_date = shrMeetDate,
                        comp_id = loginResult.CompId,
                        shrh_code = element.shrh_code,
                        print_flag = "2",
                        user_id = loginResult.ManagementUserId,
                        update_date = DateTime.Now,
                        status = null
                    };

                    outPut = !MeetingPrintRepository.CheckRecordExist(meetingPrint) ? MeetingPrintRepository.AddMeetingPrint(meetingPrint) : false;
                }
            }


            var result = outPut;
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult GetMeetingByCompanyIdAndDate()
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
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shr_meet_kind)).Value + " - " + DateTimeHelper.ToPersianDateFormat(t.shr_meet_date)

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetAllVotedMeetingShrhVoteSub(string meetKind,string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var voteSub = ShrhVoteSubRepository.GetMeetingShrhVoteSub(loginResult.CompId, meetKind, meetDate).Where(t=>t.vote_need == "1");
            var result = voteSub.Select(t => new
            {
                t.desc1,
                t.svot_no,

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }
    }
}