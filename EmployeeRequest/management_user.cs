//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class management_user
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public management_user()
        {
            this.shr_meeting = new HashSet<shr_meeting>();
            this.shrh_vote_sub = new HashSet<shrh_vote_sub>();
            this.svot_item = new HashSet<svot_item>();
            this.shrh_vote = new HashSet<shrh_vote>();
            this.meeting_print = new HashSet<meeting_print>();
        }
    
        public string user_id { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string mobile { get; set; }
        public decimal comp_id { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<shr_meeting> shr_meeting { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<shrh_vote_sub> shrh_vote_sub { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<svot_item> svot_item { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<shrh_vote> shrh_vote { get; set; }
        public virtual company company { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<meeting_print> meeting_print { get; set; }
    }
}
