using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class ContractItem
    {
        public Int64  STT { get; set; }
        public string TenCongTy { get; set; }
        public string MaCongTy { get; set; }
        
        public string TenPhong { get; set; }
        public string TenChucVu { get; set; }
        public string HoTen { get; set; }
        public string MaNhanVien { get; set; }
        public string NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string CCCD { get; set; }
        public string QueQuan { get; set; }
        public string TenLoaiHopDong { get; set; }
        public string NgayCap { get; set; }
        public int TinhTrang { get; set; }
    }
}