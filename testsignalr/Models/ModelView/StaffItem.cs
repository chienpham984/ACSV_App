using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class StaffItem
    {
        public Int64 STT { get; set; }
        public string TenCongTy { get; set; }
        public string TenPhong { get; set; }
        public string TenChucVu { get; set; }
        public int Id { get; set; }
        public string HoTen { get; set; }
        public string MaNhanVien { get; set; }
        public string NgaySinh { get; set; }
        public string NoiSinh { get; set; }
        public string Email { get; set; }
        public string OTP { get; set; }
        public bool DaGuiMail { get; set; }
        public string ThoiGianGui { get; set; }
    }
}