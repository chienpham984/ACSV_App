using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class MailItem
    {
        public int Id { get; set; }
        public string TenKhoaHoc { get; set; }
        public string TenChungChi { get; set; }
        public string TenHinhThucThi { get; set; }
        public int ThoiGianThi { get; set; }
        public int SoLuongCauHoi { get; set; }
        public int SoLuongDapAnDung { get; set; }
        public string ThoiGianThiLan1 { get; set; }
        public string ThoiGianKetThucLan1 { get; set; }
        public string ThoiGianThiLan2 { get; set; }
        public string ThoiGianKetThucLan2 { get; set; }

        public string TuNgay { get; set; }
        public string DenNgay { get; set; }
        public string NgayCap { get; set; }
        public string NgayHetHan { get; set; }
    }
}