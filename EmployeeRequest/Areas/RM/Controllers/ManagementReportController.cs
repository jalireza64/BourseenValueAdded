using App_Resources;
using EmployeeRequest.BaseClasses;
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
    public class ManagementReportController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAllMeetingUser(string shrMeetKind, string shrMeetDate, string presenceType, string shrhCode, string bbsCode,string kind)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var usersList = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId,shrMeetKind, shrMeetDate, presenceType, shrhCode,bbsCode, kind);
            var result = usersList.Select(t => new
            {
                fullname = t.shareholder.kind == ((int)ShareholderKind.Actual).ToString() ? t.shareholder.name + ' ' + t.shareholder.surname : t.shareholder.surname,
                t.shareholder.name,
                t.shareholder.surname,
                t.shareholder.shrh_code,
                t.shareholder.bbs_code,
                t.shareholder.nat_code,
                t.shareholder.kind,
                kind_desc = ShareholerRepository.GetShareholderKind(Convert.ToInt32(t.shareholder.kind)).Value,
                t.presence_type,
                presence_type_desc = MeetingUsersRepository.GetPresenceType(Convert.ToInt32(t.presence_type)).Value,
                t.shareholder.share,
                time = t.update_date.ToString("HH:mm")

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                result
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetAllVote(string shrMeetKind, string shrMeetDate, string presenceType, string shrhCode, string bbsCode, string kind,decimal svotNo, string voteValidityType)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVote = ShrhVoteRepository.GetAllVote(loginResult.CompId, shrMeetKind, shrMeetDate, presenceType, shrhCode, bbsCode, kind, svotNo);
            var result = shrhVote.Select(t => new
            {
                fullname = t.meeting_users.shareholder.kind == ((int)ShareholderKind.Actual).ToString() ? t.meeting_users.shareholder.name + ' ' + t.meeting_users.shareholder.surname : t.meeting_users.shareholder.surname,
                t.meeting_users.shareholder.name,
                t.meeting_users.shareholder.surname,
                t.meeting_users.shareholder.shrh_code,
                t.meeting_users.shareholder.bbs_code,
                t.meeting_users.shareholder.nat_code,
                t.meeting_users.shareholder.kind,
                kind_desc = ShareholerRepository.GetShareholderKind(Convert.ToInt32(t.meeting_users.shareholder.kind)).Value,
                t.meeting_users.presence_type,
                presence_type_desc = MeetingUsersRepository.GetPresenceType(Convert.ToInt32(t.meeting_users.presence_type)).Value,
                t.meeting_users.shareholder.share,
                t.svot_item.desc1,
                t.vote,
                time = t.update_date.ToString("HH:mm"),
                vote_validity = ShrhVoteRepository.GetVoteValidity(t.check_sum, t.shr_meet_kind, t.shr_meet_date, t.comp_id, t.shrh_code, t.svot_no, t.svot_item_no, t.vote,t.update_date)

            }).ToList();

            if(voteValidityType != "")
            {
                result = voteValidityType == "1" ? result.Where(t => t.vote_validity == true).ToList() : result.Where(t => t.vote_validity == false).ToList();
            }
            else
            {
                result = result.ToList();
            }

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                result
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetAllTotalVote(string shrMeetKind, string shrMeetDate, string presenceType, string shrhCode, string bbsCode, string kind, decimal svotNo, string voteValidityType)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVote = ShrhVoteRepository.GetAllTotalVote(loginResult.CompId, shrMeetKind, shrMeetDate, presenceType, shrhCode, bbsCode, kind, svotNo, voteValidityType);
            var result = shrhVote;

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetMeetingState(string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var totalShares = ShareholerRepository.GetTotalSharesOfCompany(loginResult.CompId, shrMeetDate);

            var realActualCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate,"1","","","1").Count;
            var realLegalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate,"1","","","2").Count;
            var realTotalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate,"1","","","").Count;

            var realActualShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "1", "", "", "1").Sum(t=>t.shareholder.share);
            var realLegalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "1", "", "", "2").Sum(t => t.shareholder.share);
            var realTotalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "1", "", "", "").Sum(t => t.shareholder.share);

            var realActualPercent = ((float)realActualShares / totalShares) * 100;
            var realLegalPercent = ((float)realLegalShares / totalShares) * 100;
            var realTotalPercent = ((float)realTotalShares / totalShares) * 100;

            var realData = new
            {
                realActualCount,
                realLegalCount,
                realTotalCount,

                realActualShares,
                realLegalShares,
                realTotalShares,

                realActualPercent,
                realLegalPercent,
                realTotalPercent,
            };

            var virtualActualCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "1").Count;
            var virtualLegalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "2").Count;
            var virtualTotalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "").Count;

            var virtualActualShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "1").Sum(t => t.shareholder.share);
            var virtualLegalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "2").Sum(t => t.shareholder.share);
            var virtualTotalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "2", "", "", "").Sum(t => t.shareholder.share);

            var virtualActualPercent = ((float)virtualActualShares / totalShares) * 100;
            var virtualLegalPercent = ((float)virtualLegalShares / totalShares) * 100;
            var virtualTotalPercent = ((float)virtualTotalShares / totalShares) * 100;

            var virtualData = new
            {
                virtualActualCount,
                virtualLegalCount,
                virtualTotalCount,

                virtualActualShares,
                virtualLegalShares,
                virtualTotalShares,

                virtualActualPercent,
                virtualLegalPercent,
                virtualTotalPercent,
            };

            var allActualCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "1").Count;
            var allLegalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "2").Count;
            var allTotalCount = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "").Count;

            var allActualShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "1").Sum(t => t.shareholder.share);
            var allLegalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "2").Sum(t => t.shareholder.share);
            var allTotalShares = MeetingUsersRepository.GetAllMeetingUser(loginResult.CompId, shrMeetKind, shrMeetDate, "", "", "", "").Sum(t => t.shareholder.share);

            var allActualPercent = ((float)allActualShares / totalShares) * 100;
            var allLegalPercent = ((float)allLegalShares / totalShares) * 100;
            var allTotalPercent = ((float)allTotalShares / totalShares) * 100;

            var allData = new
            {
                allActualCount,
                allLegalCount,
                allTotalCount,

                allActualShares,
                allLegalShares,
                allTotalShares,

                allActualPercent,
                allLegalPercent,
                allTotalPercent,
            };

            var result = new {
                realData,
                virtualData,
                allData
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}