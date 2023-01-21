using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers
{
    public class SvotItemController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAllSvotItem()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = svoteItemRepository.GetAllSvotItem(loginResult.CompId);
            var result = meeting.Select(t => new
            {
                t.svot_no,
                t.svot_item_no,
                votingOptionDesc = t.desc1,
                t.shrh_vote_sub.shr_meet_kind,
                t.shrh_vote_sub.shr_meet_date,
                shr_meet_date_formated = DateTimeHelper.ToPersianDateFormat(t.shrh_vote_sub.shr_meet_date),
                t.shrh_vote_sub.desc1,
                t.shrh_vote_sub.svot_kind,
                svot_kind_desc = ShrhVoteSubRepository.GetSvotKind(Convert.ToInt32(t.shrh_vote_sub.svot_kind)).Value,
                t.shrh_vote_sub.vote_need,
                vote_need_desc = t.shrh_vote_sub.vote_need == "1" ? CaptionsLibrary.Have : CaptionsLibrary.HaveNot,
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shrh_vote_sub.shr_meet_kind)).Value,
                t.shrh_vote_sub.max_item

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddSvotItem(decimal svotNo,string desc1, string picture)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var svotItemObject = new svot_item
            {
                svot_no = svotNo,
                comp_id = loginResult.CompId,
                desc1 = desc1,
                update_date = DateTime.Now,
                user_id = loginResult.ManagementUserId,
                picture = picture
            };

            var result = svoteItemRepository.AddSvotItem(svotItemObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult RemoveSvotItem(decimal svotNo,decimal svotItemNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var svotItemObject = new svot_item
            {
                svot_no = svotNo,
                svot_item_no = svotItemNo,
                comp_id = loginResult.CompId
            };

            var result = svoteItemRepository.RemoveSvotItem(svotItemObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult GetAllSvotKind()
        {
            var meeting = ShrhVoteSubRepository.GetAllSvotKinds();
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
        public virtual ActionResult GetMeetingShrhVoteSub(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSubs = ShrhVoteSubRepository.GetMeetingShrhVoteSub(loginResult.CompId, meetKind, meetDate).Where(t=>t.vote_need == "1").ToList();
            var result = shrhVoteSubs.Select(t => new
            {
                t.desc1,
                t.svot_no,
                t.shr_meet_kind,
                t.shr_meet_date

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetSvotItemBySvotNo(decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var svotItems = svoteItemRepository.GetSvotItemBySvotNo(loginResult.CompId, svotNo);
            var result = svotItems.Select(t => new
            {
                t.desc1,
                t.svot_no,
                t.svot_item_no

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }
    }
}