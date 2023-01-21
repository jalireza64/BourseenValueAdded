using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;

namespace EmployeeRequest.Repository
{
    public class ShrhVoteSubRepository
    {
        public static shrh_vote_sub GetVotingStartFlag(decimal compId, decimal svotNo)
        {
            using (var context = new capitalEntities())
            {
                var shrhVoteSub = context.shrh_vote_sub.Where(t => t.comp_id == compId && t.svot_no == svotNo).FirstOrDefault();
                return shrhVoteSub;
            }
        }

        public static bool SetVotingStartFlag(shrh_vote_sub shrhVoteSub)
        {
            // modify
            using (var db = new capitalEntities())
            {
                var shareholders = db.Set<shrh_vote_sub>();
                db.shrh_vote_sub.Attach(shrhVoteSub);
                db.Entry(shrhVoteSub).State = EntityState.Modified;
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static List<shrh_vote_sub> GetMeetingShrhVoteSub(decimal compId,string meetKind,string meetDate)
        {
            using (var context = new capitalEntities())
            {
                meetDate = meetDate.Replace("/","");
                var shrhVoteSub = context.shrh_vote_sub.Where(t=> t.comp_id == compId && t.shr_meet_date == meetDate && t.shr_meet_kind == meetKind).ToList();
                return shrhVoteSub;
            }
        }

        public static List<shrh_vote_sub> GetAllMeetingShrhVoteSub(decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var shrhVoteSub = context.shrh_vote_sub.Where(t => t.comp_id == compId).ToList();
                return shrhVoteSub;
            }
        }

        public static long GetTotalVotingNumber(string shrhCode,decimal compId, string meetKind, string meetDate, decimal svotNo, bool withRelation=false)
        {
            using (var context = new capitalEntities())
            {
                long? totalShare;
                meetDate = meetDate.Replace("/", "");
                var shrhVoteSubItemCount = context.svot_item.Where(t => t.svot_no == svotNo).ToList().Count;
                var fixedCount = context.shrh_vote_sub.Where(t => t.svot_no == svotNo).FirstOrDefault().max_item;
                var shrhVoteKind = (SvotKind)(Convert.ToInt16(context.shrh_vote_sub.Where(t => t.comp_id == compId && t.shr_meet_date == meetDate && t.shr_meet_kind == meetKind && t.svot_no == svotNo).Select(t=>t.svot_kind).FirstOrDefault()));

                var shareholder = ShareholerRepository.GetShareholder(shrhCode, compId);

                var meetingUser = new meeting_users
                {
                    shr_meet_kind = meetKind,
                    shr_meet_date = meetDate,
                    comp_id = compId,
                    shrh_code = shrhCode,
                };
                var user = MeetingUsersRepository.GetUserFromMeeting(meetingUser);
                var lawyerId = user.FirstOrDefault().status;

                var shareholderLawyerWithClient = ShareholerRepository.GetRelationShareholder(shrhCode, compId);
                var presentedLawyerUsersListWithClient = MeetingUsersRepository.GetPresentedMeetingUsersList(meetKind, meetDate, compId).Where(t=>t.status == lawyerId && t.status != null);
                var shareholderLawyerWithNotPresentedClient = shareholderLawyerWithClient.Where(p => presentedLawyerUsersListWithClient.Any(p2 => p2.shrh_code == p.shrh_code));

                if (withRelation)
                {
                    if (presentedLawyerUsersListWithClient.Any())
                    {
                        totalShare = shareholderLawyerWithNotPresentedClient.Sum(t => t.share);
                    }
                    else
                    {
                        totalShare = context.shareholders.Where(t => t.comp_id == compId && t.shrh_code == shrhCode).Select(t => t.share).FirstOrDefault();
                    }

                }
                else
                {
                    totalShare = context.shareholders.Where(t => t.comp_id == compId && t.shrh_code == shrhCode).Select(t => t.share).FirstOrDefault();
                }

                long totalVote = 0;
                switch (shrhVoteKind)
                {
                    case SvotKind.ShareCount:
                        {
                            totalVote = (long)totalShare;
                        }
                        break;
                    case SvotKind.ShareCountXItemCount:
                        {
                            totalVote = (long)totalShare * shrhVoteSubItemCount;
                        }
                        break;
                    case SvotKind.OneVote:
                        {
                            totalVote = 1;
                        }
                        break;
                    case SvotKind.ItemCount:
                        {
                            totalVote = shrhVoteSubItemCount;
                        }
                        break;
                    case SvotKind.Fixed:
                        {
                            totalVote = Convert.ToInt64(fixedCount);
                        }
                        break;
                }

                return totalVote;
            }
        }

        public static Dictionary<int, string> GetAllSvotKinds()
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(SvotKind)))
            {
                dict.Add((int)Enum.Parse(typeof(SvotKind), name), ((SvotKind)(int)Enum.Parse(typeof(SvotKind), name)).GetDescription());
            }
            return dict;
        }

        public static KeyValuePair<int, string> GetSvotKind(int key)
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(SvotKind)))
            {
                dict.Add((int)Enum.Parse(typeof(SvotKind), name), ((SvotKind)(int)Enum.Parse(typeof(SvotKind), name)).GetDescription());
            }
            var selectedSvotKind = dict.Where(t => t.Key == key).FirstOrDefault();
            return selectedSvotKind;
        }

        public static bool AddShrhVoteSub(shrh_vote_sub shrhVoteSub)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var shrhVoteSubs = db.Set<shrh_vote_sub>();
                shrhVoteSubs.Add(shrhVoteSub);
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static bool RemoveShrhVoteSub(shrh_vote_sub shrhVoteSub)
        {
            // remove
            using (var db = new capitalEntities())
            {
                db.Configuration.ValidateOnSaveEnabled = false;
                db.shrh_vote_sub.Attach(shrhVoteSub);
                db.Entry(shrhVoteSub).State = EntityState.Deleted;
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}