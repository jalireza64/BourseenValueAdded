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
    public class svoteItemRepository
    {
        public static List<svot_item> GetAllSvotItem(decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var svotItem = context.svot_item.Include(t=>t.shrh_vote_sub).Where(t => t.comp_id == compId).ToList();
                return svotItem;
            }
        }

        public static List<svot_item> GetSvotItemBySvotNo(decimal compId, decimal svotNo)
        {
            using (var context = new capitalEntities())
            {
                var svotItemList = context.svot_item.Where(t=> t.comp_id == compId && t.svot_no == svotNo).ToList();
                return svotItemList;
            }
        }

        public static bool AddSvotItem(svot_item svotItem)
        {
            // insert
            using (var db = new capitalEntities())
            {
                var svotItems = db.Set<svot_item>();
                svotItems.Add(svotItem);
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

        public static bool RemoveSvotItem(svot_item svotItem)
        {
            // remove
            using (var db = new capitalEntities())
            {
                db.Configuration.ValidateOnSaveEnabled = false;
                db.svot_item.Attach(svotItem);
                db.Entry(svotItem).State = EntityState.Deleted;
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