using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;
using EmployeeRequest.BaseClasses;

namespace EmployeeRequest.Repository
{
    public class ShrhVoteRepository
    {
        public static List<shrh_vote> GetAllVote(decimal compId, string shrMeetKind, string shrMeetDate, string presenceType, string shrhCode, string bbsCode, string kind,decimal svotNo)
        {
            using (var context = new capitalEntities())
            {
                var shrhVote = context.shrh_vote.Include(t => t.meeting_users.shareholder).Include(t=>t.svot_item).Where(t =>
                (shrMeetKind != "" ? t.shr_meet_kind == shrMeetKind : true) &&
                (shrMeetDate != "" ? t.shr_meet_date == shrMeetDate : true) &&
                (svotNo != 0 ? t.svot_no == svotNo : true) &&
                (presenceType != "" ? t.meeting_users.presence_type == presenceType : true) &&
                (shrhCode != "" ? t.shrh_code == shrhCode : true) &&
                (kind != "" ? t.meeting_users.shareholder.kind == kind : true) &&
                (bbsCode != "" ? t.meeting_users.shareholder.bbs_code.Contains(bbsCode) : 1 == 1) &&
                (t.comp_id == compId)).ToList();
                return shrhVote;
            }
        }

        public static Array GetAllTotalVote(decimal compId, string shrMeetKind, string shrMeetDate, string presenceType, string shrhCode, string bbsCode, string kind, decimal svotNo, string voteValidityType)
        {
            using (var context = new capitalEntities())
            {
                var output = context.shrh_vote.Include(t => t.meeting_users.shareholder).Include(t => t.svot_item).Where(t =>
                  (shrMeetKind != "" ? t.shr_meet_kind == shrMeetKind : true) &&
                  (shrMeetDate != "" ? t.shr_meet_date == shrMeetDate : true) &&
                  (svotNo != 0 ? t.svot_no == svotNo : true) &&
                  (presenceType != "" ? t.meeting_users.presence_type == presenceType : true) &&
                  (shrhCode != "" ? t.shrh_code == shrhCode : true) &&
                  (kind != "" ? t.meeting_users.shareholder.kind == kind : true) &&
                  (bbsCode != "" ? t.meeting_users.shareholder.bbs_code.Contains(bbsCode) : 1 == 1) &&
                  (t.comp_id == compId)).ToList();

                if (voteValidityType != "")
                {
                    output = voteValidityType == "1" ? output.Where(t => GetVoteValidity(t.check_sum, t.shr_meet_kind, t.shr_meet_date, t.comp_id, t.shrh_code, t.svot_no, t.svot_item_no, t.vote, t.update_date) == true).ToList() : output.Where(t => GetVoteValidity(t.check_sum, t.shr_meet_kind, t.shr_meet_date, t.comp_id, t.shrh_code, t.svot_no, t.svot_item_no, t.vote, t.update_date) == false).ToList();
                }
                else
                {
                    output = output.ToList();
                }

                var result = output
                .Select(z => new { z.svot_item.desc1, z.svot_item_no, z.vote })
                .GroupBy(x => new { x.svot_item_no,x.desc1 })
                .Select(t=> new {
                    t.Key.desc1,
                    t.Key.svot_item_no,
                    sumTotalVote = t.Sum(y=>y.vote)
                }).ToArray();
  
                return result;
            }
        }

        public static List<shrh_vote> GetVoteListByShrhCodeAndSvotItemNo(string meetKind,string meetDate, decimal compId, string shrhCode, decimal svotNo)
        {
            using (var context = new capitalEntities())
            {
                meetDate = meetDate.Replace("/","");
                var shrhVote = context.shrh_vote.Include(t=>t.svot_item).Where(t=> t.comp_id == compId && t.shr_meet_date == meetDate && t.shr_meet_kind == meetKind && t.shrh_code == shrhCode && t.svot_no == svotNo).ToList();
                return shrhVote;
            }
        }

        public static bool AddShrhVote(shrh_vote shrhVote)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var shrhVotes = db.Set<shrh_vote>();
                shrhVotes.Add(shrhVote);
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

        public static bool GetVoteValidity(string checkSum, string shrMeetKind, string shrMeetDate, decimal compId, string shrhCode, decimal svotNo, decimal svotItemNo, decimal vote, DateTime updateDate)
        {
            var decryptedCheckSum = AesEncryptDecryptor.Decrypt(checkSum);
            var checkSumArray = decryptedCheckSum.Split(',');
            if(checkSumArray[0] == shrMeetKind &&
               checkSumArray[1] == shrMeetDate && 
               checkSumArray[2] == compId.ToString() && 
               checkSumArray[3] == shrhCode && 
               checkSumArray[4] == svotNo.ToString() && 
               checkSumArray[5] == svotItemNo.ToString() && 
               checkSumArray[6] == vote.ToString() &&
               checkSumArray[7].ToString() == updateDate.ToString())
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