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
    public class ManagementVotingController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetFilteredRealUser(string shrMeetKind, string shrMeetDate, string natCode, string shrhKind, string name, string surname, string bbsCode, string certNo, string father)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shareholder = MeetingUsersRepository.GetFilteredRealUser(loginResult.CompId, shrMeetKind, shrMeetDate, natCode, shrhKind, name, surname, bbsCode, certNo, father);
            var result = shareholder.Select(t => new
            {
                fullName = t.shareholder.name + ' ' + t.shareholder.surname,
                t.shareholder.bbs_code,
                t.shareholder.share,
                t.shareholder.cert_no,
                t.comp_id,
                t.shareholder.father,
                t.shareholder.mobile,
                t.shareholder.name,
                t.shareholder.nat_code,
                t.shrh_code,
                t.shareholder.surname,
                t.shareholder.kind,
                t.presence_type,
                status = t.status == t.shrh_code ? PersonPresentStatus.Lawyer
                        : t.status == null ? PersonPresentStatus.Person
                        : PersonPresentStatus.Client,
                statusDesc = t.status == t.shrh_code ? CaptionsLibrary.Lawyer
                        : t.status == null ? CaptionsLibrary.Person
                        : CaptionsLibrary.Client
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

            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
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
        public virtual ActionResult GetMeetingShrhVoteSub(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSubList = ShrhVoteSubRepository.GetMeetingShrhVoteSub(loginResult.CompId, meetKind, meetDate).Where(t=>t.vote_need == "1").Select(t => new { t.svot_no, t.desc1, t.svot_kind, t.vote_need, t.comp_id, vote_need_desc = t.vote_need == "1" ? CaptionsLibrary.Have : CaptionsLibrary.HaveNot,t.voting_start_flag, voting_start_flag_desc = t.voting_start_flag == "1" ? CaptionsLibrary.Running : CaptionsLibrary.Stop });
            return Json(shrhVoteSubList);
        }

        [HttpPost]
        public virtual ActionResult GetTotalVotingNumber(string meetKind, string meetDate, decimal svotNo,string shrhCode)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var totalVoteNumber = ShrhVoteSubRepository.GetTotalVotingNumber(shrhCode, loginResult.CompId, meetKind, meetDate, svotNo, true);
            var result = totalVoteNumber;
            //if (result == null)
            //    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetVoteListByShrhCode(string meetKind, string meetDate,string shrhCode,decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteList = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, shrhCode, svotNo);
            var result = shrhVoteList.Select(t => new
            {
                t.svot_item.desc1,
                t.vote,
                t.shr_meet_kind,
                t.shr_meet_date,
                t.shrh_code,
                t.comp_id,
                voteTime = t.update_date.ToString("HH:mm:ss")

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }






        [HttpPost]
        public virtual ActionResult GetSvotItemBySvotNo(decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var svotItemList = svoteItemRepository.GetSvotItemBySvotNo(loginResult.CompId, svotNo).ToList();
            var result = svotItemList.Select(t=>new {
                t.svot_no,
                t.svot_item_no,
                t.desc1,
                picture = "data:image/png;base64,"+ t.picture
            });
            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddShrhVote(string meetKind, string meetDate,decimal svotNo,decimal svotItemNo,decimal vote,string shrhCode)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var totalVoteNumber = ShrhVoteSubRepository.GetTotalVotingNumber(shrhCode, loginResult.CompId, meetKind, meetDate, svotNo, true);
            var totalUsedshrhVoteNumber = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, shrhCode, svotNo).Sum(t=>t.vote);
            var totalRemainingVoteNumber = totalVoteNumber - totalUsedshrhVoteNumber - vote;

            var votedItemsCount = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, shrhCode, svotNo).Where(t=>t.svot_no == svotNo && t.svot_item_no == svotItemNo).Count();

            if (votedItemsCount > 0)
            {
                return Json(ResponseType.Failed, MessagesLibrary.YouVotedToThisItem);
            }

            if (totalRemainingVoteNumber < 0)
            {
                return Json(ResponseType.Failed, MessagesLibrary.TotalRemainingVoteNumberLessThanCurrentVoteNumber);
            }

            var currentDate = DateTime.Now;

            var ShrhVoteObject = new shrh_vote
            {
                shr_meet_kind = meetKind,
                shr_meet_date = meetDate,
                user_id = loginResult.ManagementUserId,
                comp_id = loginResult.CompId,
                shrh_code = shrhCode,
                svot_no = svotNo,
                svot_item_no = svotItemNo,
                vote = vote,
                update_date = currentDate,
                check_sum = AesEncryptDecryptor.Encrypt(meetKind.ToString()+','+ meetDate + ',' + loginResult.CompId.ToString() + ',' + shrhCode + ',' + svotNo.ToString() + ',' + svotItemNo.ToString() + ',' + vote.ToString() + ',' + currentDate.ToString())
            };

            var result = ShrhVoteRepository.AddShrhVote(ShrhVoteObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult SetVotingStartFlag(decimal svotNo, string votingStartFlag)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSub = ShrhVoteSubRepository.GetAllMeetingShrhVoteSub(loginResult.CompId).Where(t=>t.svot_no == svotNo).FirstOrDefault();

            shrhVoteSub.voting_start_flag = votingStartFlag;

            var result = ShrhVoteSubRepository.SetVotingStartFlag(shrhVoteSub);
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}