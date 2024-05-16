using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class EmpTracertItem
    {

        public string TenPhong { get; set; }
        public string TenChucVu { get; set; }
        public string HoTen { get; set; }
        public string MaNhanVien { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string TenChungChi { get; set; }
        public string MaChungChi { get; set; }
        public DateTime? NgayCap { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public int TinhTrang { get; set; }
    }
}