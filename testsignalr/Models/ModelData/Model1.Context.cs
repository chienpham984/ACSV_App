﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace testsignalr.Models.ModelData
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class HumanManagementEntities : DbContext
    {
        public HumanManagementEntities()
            : base("name=HumanManagementEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<ChiTietTaiLieu> ChiTietTaiLieux { get; set; }
        public virtual DbSet<DanhMucChucVu> DanhMucChucVus { get; set; }
        public virtual DbSet<DanhMucCongTy> DanhMucCongTies { get; set; }
        public virtual DbSet<DanhMucPhongBan> DanhMucPhongBans { get; set; }
        public virtual DbSet<LoaiTaiLieu> LoaiTaiLieux { get; set; }
        public virtual DbSet<ChungChiNhanVien> ChungChiNhanViens { get; set; }
        public virtual DbSet<DanhMucChungChi> DanhMucChungChis { get; set; }
        public virtual DbSet<LoaiChungChi> LoaiChungChis { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<NhomCCTheoChucVu> NhomCCTheoChucVus { get; set; }
    }
}
