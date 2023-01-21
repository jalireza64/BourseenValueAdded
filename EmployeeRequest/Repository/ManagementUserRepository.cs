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
    public class ManagementUserRepository
    {
        public static List<management_user> GetAllManagementUser(decimal compId)
        {
            using (var context = new capitalEntities())
            {
                var userList = context.management_user.Where(t => t.comp_id == compId).ToList();
                return userList;
            }
        }

        public static bool AddManagementUser(management_user managementUser)
        {
            using (var context = new capitalEntities())
            {
                var managementUsers = context.Set<management_user>();
                managementUsers.Add(managementUser);
                var result = context.SaveChanges();
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

        public static bool RemoveManagementUser(management_user managementUser)
        {
            using (var context = new capitalEntities())
            {
                //var customers = db.Set<USER>();
                context.Configuration.ValidateOnSaveEnabled = false;
                context.management_user.Attach(managementUser);
                context.Entry(managementUser).State = EntityState.Deleted;
                var result = context.SaveChanges();
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