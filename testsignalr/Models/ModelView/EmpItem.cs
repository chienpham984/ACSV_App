using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class EmpItem
    {
        public string TenPhong { get; set; }
        public string TenChucVu { get; set; }
        public int Id { get; set; }
        public string MaNhanVien { get; set; }
        public string HoTen { get; set; }
        public string NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string CCCD { get; set; }
        public string QueQuan { get; set; }
        public string HanLyLich { get; set; }
        public int TinhTrangLyLich { get; set; }
        public string AnhLyLich { get; set; }
        public string HanTheLamViec { get; set; }
        public string AnhTheLamViec { get; set; }
        public int TinhTrangTheLamViec { get; set; }
        public string LoaiHopDong { get; set; }
        public int TinhTrangHopDong { get; set; }
        public string AnhHopDong { get; set; }
    }
}