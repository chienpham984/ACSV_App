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
    
        public virtual DbSet<ChiTietHopDong> ChiTietHopDongs { get; set; }
        public virtual DbSet<ChiTietTaiLieu> ChiTietTaiLieux { get; set; }
        public virtual DbSet<CongTyThueNgoai> CongTyThueNgoais { get; set; }
        public virtual DbSet<DanhMucChucVu> DanhMucChucVus { get; set; }
        public virtual DbSet<DanhMucChungChi> DanhMucChungChis { get; set; }
        public virtual DbSet<DanhMucChungChiTheoHang> DanhMucChungChiTheoHangs { get; set; }
        public virtual DbSet<DanhMucCongTy> DanhMucCongTies { get; set; }
        public virtual DbSet<DanhMucCongTyNgoai> DanhMucCongTyNgoais { get; set; }
        public virtual DbSet<DanhMucHangHangKhong> DanhMucHangHangKhongs { get; set; }
        public virtual DbSet<DanhMucPhongBan> DanhMucPhongBans { get; set; }
        public virtual DbSet<LoaiChungChi> LoaiChungChis { get; set; }
        public virtual DbSet<LoaiHopDong> LoaiHopDongs { get; set; }
        public virtual DbSet<LoaiQuanHe> LoaiQuanHes { get; set; }
        public virtual DbSet<LyLichTuPhap> LyLichTuPhaps { get; set; }
        public virtual DbSet<LyLichTuPhapNgoai> LyLichTuPhapNgoais { get; set; }
        public virtual DbSet<NguoiPhuThuoc> NguoiPhuThuocs { get; set; }
        public virtual DbSet<NhomCCTheoChucVu> NhomCCTheoChucVus { get; set; }
        public virtual DbSet<NhomCCTheoHangHK> NhomCCTheoHangHKs { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<TheLamViec> TheLamViecs { get; set; }
        public virtual DbSet<LoaiTaiLieu> LoaiTaiLieux { get; set; }
        public virtual DbSet<GiaoTrinhDaoTao> GiaoTrinhDaoTaos { get; set; }
        public virtual DbSet<SiteMenu> SiteMenus { get; set; }
        public virtual DbSet<MucDo> MucDoes { get; set; }
        public virtual DbSet<DanhMucKhoaHoc> DanhMucKhoaHocs { get; set; }
        public virtual DbSet<GiaoVien> GiaoViens { get; set; }
        public virtual DbSet<GuiMail> GuiMails { get; set; }
        public virtual DbSet<HinhThucThi> HinhThucThis { get; set; }
        public virtual DbSet<DapAn> DapAns { get; set; }
        public virtual DbSet<NganHangCauHoi> NganHangCauHois { get; set; }
        public virtual DbSet<TaiLieuKhoaHoc> TaiLieuKhoaHocs { get; set; }
        public virtual DbSet<LanThi> LanThis { get; set; }
        public virtual DbSet<YeuCauThi> YeuCauThis { get; set; }
        public virtual DbSet<DeThi> DeThis { get; set; }
        public virtual DbSet<ChiTietSoLuongCauHoi> ChiTietSoLuongCauHois { get; set; }
        public virtual DbSet<ReadAndSign> ReadAndSigns { get; set; }
        public virtual DbSet<BaiThi> BaiThis { get; set; }
        public virtual DbSet<ChuKy> ChuKies { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<NhanVienThueNgoai> NhanVienThueNgoais { get; set; }
        public virtual DbSet<DanhSachHocVien> DanhSachHocViens { get; set; }
        public virtual DbSet<HistoryQuickTest> HistoryQuickTests { get; set; }
        public virtual DbSet<PhanQuyen> PhanQuyens { get; set; }
        public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }
        public virtual DbSet<NhiemVu> NhiemVus { get; set; }
        public virtual DbSet<ChungChiNhanVien> ChungChiNhanViens { get; set; }
        public virtual DbSet<ChungChiNhanVienNgoai> ChungChiNhanVienNgoais { get; set; }
        public virtual DbSet<QuaTrinhThi> QuaTrinhThis { get; set; }
    }
}
