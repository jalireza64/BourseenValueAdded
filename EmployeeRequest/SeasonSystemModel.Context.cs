﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmployeeRequest
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class seasonFbShrEntities : DbContext
    {
        public seasonFbShrEntities()
            : base("name=seasonFbShrEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<v_fb_shareholder> v_fb_shareholder { get; set; }
        public virtual DbSet<v_fb_shareholder2> v_fb_shareholder2 { get; set; }
        public virtual DbSet<SHAREHOLDER_REL> SHAREHOLDER_REL { get; set; }
    
        public virtual ObjectResult<sp_fb_shr_trans_Result> sp_fb_shr_trans(string shrh_code, string eff_date)
        {
            var shrh_codeParameter = shrh_code != null ?
                new ObjectParameter("shrh_code", shrh_code) :
                new ObjectParameter("shrh_code", typeof(string));
    
            var eff_dateParameter = eff_date != null ?
                new ObjectParameter("eff_date", eff_date) :
                new ObjectParameter("eff_date", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_fb_shr_trans_Result>("sp_fb_shr_trans", shrh_codeParameter, eff_dateParameter);
        }
    }
}
