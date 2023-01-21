using App_Resources;
using EmployeeRequest.BaseClasses;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Config;
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
    public class MeetingController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetMeetingShrhVoteSub(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSubList = ShrhVoteSubRepository.GetMeetingShrhVoteSub(loginResult.CompId, meetKind, meetDate).Select(t => new { t.svot_no,t.desc1,t.svot_kind,t.vote_need, t.comp_id,vote_need_desc = t.vote_need == "1" ? CaptionsLibrary.Have : CaptionsLibrary.HaveNot });
            return Json(shrhVoteSubList);
        }

        [HttpPost]
        public virtual ActionResult AddQuestion(string desc1, string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var questionObject = new question
            {
                shr_meet_kind = meetKind,
                shr_meet_date = meetDate,
                comp_id = loginResult.CompId,
                shrh_code = loginResult.ShrhCode,
                desc1 = desc1,
                update_date = DateTime.Now
            };

            var result = QuestionsRepository.AddQuestion(questionObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult GetQuestionsPerPerson(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = QuestionsRepository.GetQuestionsPerPerson(meetKind, meetDate, loginResult.ShrhCode, loginResult.CompId);
            var result = meeting.Select(t => new
            {
                t.qid,
                t.desc1,
                time = t.update_date.ToString("HH:mm")

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetAparatLinkForCompany()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = CompanyRepository.GetCompany(loginResult.CompId);
            var result = meeting.Select(t => new
            {
                link_add_2 = AppSetting.GetLiveBroadcastLink()

            }).FirstOrDefault();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetVoteListByShrhCode(string meetKind, string meetDate, decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteList = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, loginResult.ShrhCode, svotNo);
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
        public virtual ActionResult GetTotalVotingNumber(string meetKind, string meetDate, decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var totalVoteNumber = ShrhVoteSubRepository.GetTotalVotingNumber(loginResult.ShrhCode, loginResult.CompId, meetKind, meetDate, svotNo);
            var result = totalVoteNumber;
            //if (result == null)
            //    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
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
                picture = "data:image/png;base64," + t.picture
            });
            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddShrhVote(string meetKind, string meetDate,decimal svotNo,decimal svotItemNo,decimal vote)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var votingStartFlag = ShrhVoteSubRepository.GetVotingStartFlag(loginResult.CompId, svotNo).voting_start_flag;

            if (votingStartFlag != "1")
            {
                return Json(ResponseType.Failed, MessagesLibrary.YouAreNotAllowedToVotingAtThisTime);
            }

            var totalVoteNumber = ShrhVoteSubRepository.GetTotalVotingNumber(loginResult.ShrhCode, loginResult.CompId, meetKind, meetDate, svotNo);
            var totalUsedshrhVoteNumber = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, loginResult.ShrhCode, svotNo).Sum(t=>t.vote);
            var totalRemainingVoteNumber = totalVoteNumber - totalUsedshrhVoteNumber - vote;

            var votedItemsCount = ShrhVoteRepository.GetVoteListByShrhCodeAndSvotItemNo(meetKind, meetDate, loginResult.CompId, loginResult.ShrhCode, svotNo).Where(t=>t.svot_no == svotNo && t.svot_item_no == svotItemNo).Count();

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
                comp_id = loginResult.CompId,
                shrh_code = loginResult.ShrhCode,
                svot_no = svotNo,
                svot_item_no = svotItemNo,
                vote = vote,
                update_date = currentDate,
                check_sum = AesEncryptDecryptor.Encrypt(meetKind.ToString() + ',' + meetDate + ',' + loginResult.CompId.ToString() + ',' + loginResult.ShrhCode + ',' + svotNo.ToString() + ',' + svotItemNo.ToString() + ',' + vote.ToString() + ',' + currentDate.ToString())
            };

            var result = ShrhVoteRepository.AddShrhVote(ShrhVoteObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}