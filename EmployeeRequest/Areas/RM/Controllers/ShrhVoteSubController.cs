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
    public class ShrhVoteSubController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetAllMeetingShrhVoteSub()
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var meeting = ShrhVoteSubRepository.GetAllMeetingShrhVoteSub(loginResult.CompId);
            var result = meeting.Select(t => new
            {
                t.svot_no,
                t.shr_meet_kind,
                t.shr_meet_date,
                shr_meet_date_formated = DateTimeHelper.ToPersianDateFormat(t.shr_meet_date),
                t.desc1,
                t.svot_kind,
                svot_kind_desc = ShrhVoteSubRepository.GetSvotKind(Convert.ToInt32(t.svot_kind)).Value,
                t.vote_need,
                vote_need_desc = t.vote_need == "1" ? CaptionsLibrary.Have : CaptionsLibrary.HaveNot,
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shr_meet_kind)).Value,
                t.max_item

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddShrhVoteSub(string meetKind, string meetDate, string desc1, string svotKind, string voteNeed, decimal? maxItem)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var notFormattedMeetDate = meetDate.Replace("/", "");

            var shrhVoteSubObject = new shrh_vote_sub
            {
                shr_meet_kind = meetKind,
                shr_meet_date = notFormattedMeetDate,
                comp_id = loginResult.CompId,
                desc1 = desc1,
                svot_kind = svotKind,
                vote_need = voteNeed,
                user_id = loginResult.ManagementUserId,
                max_item = maxItem
            };

            var result = ShrhVoteSubRepository.AddShrhVoteSub(shrhVoteSubObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult RemoveShrhVoteSub(decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSubObject = new shrh_vote_sub
            {
                svot_no = svotNo,
                comp_id = loginResult.CompId
            };

            var result = ShrhVoteSubRepository.RemoveShrhVoteSub(shrhVoteSubObject);

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
    }
}