//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class DanhSachHocVien
    {
        public int Id { get; set; }
        public Nullable<int> Id_DM_KhoaHoc { get; set; }
        public Nullable<int> Id_NhanVien { get; set; }
        public string MaNhanVien { get; set; }
        public Nullable<bool> DaDocTaiLieu { get; set; }
        public Nullable<System.DateTime> BatDauThamGia { get; set; }
        public string OTP { get; set; }
        public Nullable<System.DateTime> ThoiGianXacNhan { get; set; }
    }
}
