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
    public class ManagementMeetingController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetShareholdersForSearch(string natCode, string shrhKind, string name, string surname, string bbsCode, string certNo, string father, string shrhStatus)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shareholder = ShareholerRepository.GetShareholdersForSearch(loginResult.CompId, natCode, shrhKind, name, surname, bbsCode, certNo, father, shrhStatus);
            var result = shareholder.Select(t => new
            {
                fullName = t.name + ' ' + t.surname,
                t.bbs_code,
                t.share,
                t.cert_no,
                t.comp_id,
                t.father,
                t.mobile,
                t.name,
                t.nat_code,
                t.shrh_code,
                t.surname,
                t.s_address,
                t.s_postal_code,
                t.kind,
                status = t.relation_id == t.shrh_code ? PersonPresentStatus.Lawyer
                        : t.relation_id == null ? PersonPresentStatus.Person
                        : PersonPresentStatus.Client,
                statusDesc = t.relation_id == t.shrh_code ? CaptionsLibrary.Lawyer
                        : t.relation_id == null ? CaptionsLibrary.Person
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
        public virtual ActionResult GetShareholderStatusInformation(string shrhCode, string shrhStatus)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shareholder = shrhStatus == "1" ? ShareholerRepository.GetShareholdersClientsInfo(loginResult.CompId, shrhCode) : ShareholerRepository.GetShareholdersLawyerInfo(loginResult.CompId, shrhCode);

            var result = shareholder.Select(t => new
            {
                fullName = t.name + ' ' + t.surname,
                t.bbs_code,
                t.share,
                t.cert_no,
                t.comp_id,
                t.father,
                t.mobile,
                t.name,
                t.nat_code,
                t.shrh_code,
                t.surname,
                t.s_address,
                t.s_postal_code,
                t.kind,
                status = t.relation_id == t.shrh_code ? PersonPresentStatus.Lawyer
                        : t.relation_id == null ? PersonPresentStatus.Person
                        : PersonPresentStatus.Client,
                statusDesc = t.relation_id == t.shrh_code ? CaptionsLibrary.Lawyer
                        : t.relation_id == null ? CaptionsLibrary.Person
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
                shr_meet_kind_desc = ShrMeetingRepository.GetMeetKind(Convert.ToInt32(t.shr_meet_kind)).Value + " - " + DateTimeHelper.ToPersianDateFormat(t.shr_meet_date)

            }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddUserToMeeting(string shrhCode,string shrMeetKind, string shrMeetDate,bool withRelation)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var shareholderLawyerWithClient = ShareholerRepository.GetRelationShareholder(shrhCode, loginResult.CompId);
            var presentedMeetingUsersList = MeetingUsersRepository.GetPresentedMeetingUsersList(shrMeetKind, shrMeetDate, loginResult.CompId);
            var shareholderLawyerWithNotPresentedClient = shareholderLawyerWithClient.Where(p => !presentedMeetingUsersList.Any(p2 => p2.shrh_code == p.shrh_code));

            bool result = false;
            var shareholder = ShareholerRepository.GetShareholder(shrhCode, loginResult.CompId);

            if (withRelation)
            {
                if (shareholderLawyerWithClient.Any())
                {
                    foreach (shareholder element in shareholderLawyerWithNotPresentedClient)
                    {
                        var meetingUser = new meeting_users
                        {
                            shr_meet_kind = shrMeetKind,
                            shr_meet_date = shrMeetDate,
                            comp_id = loginResult.CompId,
                            shrh_code = element.shrh_code,
                            presence_type = ((int)PresenceType.Real).ToString(),
                            update_date = DateTime.Now,
                            status = shareholderLawyerWithNotPresentedClient.Count() > 1 ? shrhCode : null
                        };
                        var userExistCount = MeetingUsersRepository.GetUserFromMeeting(meetingUser).Count;
                        result = userExistCount == 0 ? MeetingUsersRepository.AddUserToMeeting(meetingUser) : false;
                    }
                }
                else
                {
                    foreach (shareholder element in shareholder)
                    {
                        var meetingUser = new meeting_users
                        {
                            shr_meet_kind = shrMeetKind,
                            shr_meet_date = shrMeetDate,
                            comp_id = loginResult.CompId,
                            shrh_code = element.shrh_code,
                            presence_type = ((int)PresenceType.Real).ToString(),
                            update_date = DateTime.Now,
                            status = null
                        };
                        var userExistCount = MeetingUsersRepository.GetUserFromMeeting(meetingUser).Count;
                        result = userExistCount == 0 ? MeetingUsersRepository.AddUserToMeeting(meetingUser) : false;
                    }
                }
                
                

                if (!result)
                    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
                return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
            }
            else
            {
                foreach (shareholder element in shareholder)
                {
                    var meetingUser = new meeting_users
                    {
                        shr_meet_kind = shrMeetKind,
                        shr_meet_date = shrMeetDate,
                        comp_id = loginResult.CompId,
                        shrh_code = element.shrh_code,
                        presence_type = ((int)PresenceType.Real).ToString(),
                        update_date = DateTime.Now,
                        status = null
                    };
                    var userExistCount = MeetingUsersRepository.GetUserFromMeeting(meetingUser).Count;
                    result = userExistCount == 0 ? MeetingUsersRepository.AddUserToMeeting(meetingUser) : true;
                }

                if (!result)
                    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
                return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
            }
        }

        public virtual ActionResult GetMeetingPaperData(string shrhCode,string shrMeetKind, string shrMeetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

            var shareholderLawyerWithClient = ShareholerRepository.GetRelationShareholder(shrhCode, loginResult.CompId);
            var printedMeetingFormList = MeetingPrintRepository.GetPrintedMeetingFormList(shrMeetKind, shrMeetDate, loginResult.CompId);
            var shareholderLawyerWithNotPrintedClient = shareholderLawyerWithClient.Where(p => !printedMeetingFormList.Any(p2 => p2.shrh_code == p.shrh_code));

            var formPathForMeeting = ShrMeetingRepository.GetCurrentMeetingByCompanyIdAndDate(loginResult.CompId).Where(t => t.shr_meet_kind == shrMeetKind && t.shr_meet_date == shrMeetDate).FirstOrDefault();
            var shareholder = ShareholerRepository.GetShareholder(shrhCode, loginResult.CompId);
            var result = shareholder.Select(t => new
            {
                t.bbs_code,
                share = shareholderLawyerWithClient.Any() ? shareholderLawyerWithNotPrintedClient.Sum(x=>x.share) : t.share,
                statusDesc = shareholderLawyerWithClient.Any() ? CaptionsLibrary.Lawyer : CaptionsLibrary.Shareholder,
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
        public virtual ActionResult GetMeetingShrhVoteSub(string meetKind, string meetDate)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var shrhVoteSubList = ShrhVoteSubRepository.GetMeetingShrhVoteSub(loginResult.CompId, meetKind, meetDate).Select(t => new { t.svot_no,t.desc1,t.svot_kind,t.vote_need, t.comp_id,vote_need_desc = t.vote_need == "1" ? CaptionsLibrary.Have : CaptionsLibrary.HaveNot });
            return Json(shrhVoteSubList);
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
        public virtual ActionResult GetSvotItemBySvotNo(decimal svotNo)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];
            var svotItemList = svoteItemRepository.GetSvotItemBySvotNo(loginResult.CompId, svotNo).ToList();
            var result = svotItemList.Select(t=>new {
                t.svot_no,
                t.svot_item_no,
                t.desc1
            });
            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult AddShrhVote(string meetKind, string meetDate,decimal svotNo,decimal svotItemNo,decimal vote)
        {
            var loginResult = (LoginResultModel)Session["LoginResult"];

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

            var ShrhVoteObject = new shrh_vote
            {
                shr_meet_kind = meetKind,
                shr_meet_date = meetDate,
                comp_id = loginResult.CompId,
                shrh_code = loginResult.ShrhCode,
                svot_no = svotNo,
                svot_item_no = svotItemNo,
                vote = vote,
                update_date = DateTime.Now,
                check_sum = AesEncryptDecryptor.Encrypt(meetKind.ToString() + ',' + meetDate + ',' + loginResult.CompId.ToString() + ',' + loginResult.ShrhCode + ',' + svotNo.ToString() + ',' + svotItemNo.ToString() + ',' + vote.ToString())
            };

            var result = ShrhVoteRepository.AddShrhVote(ShrhVoteObject);

            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}