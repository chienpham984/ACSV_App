using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class DiemItem
    {
        public int Id { get; set; }
        public string HoTen { get; set; }
        public string NgaySinh { get; set; }
        public string NoiSinh { get; set; }
        public string MaCongTy { get; set; }
        public string TenPhong { get; set; }
        public string TenChucVu { get; set; }
        public string BatDauThamGia { get; set; }
        public bool DaDocTaiLieu { get; set; }
        public string LamBaiLan1 { get; set; }
        public string DiemLan1 { get; set; }
        public string LamBaiLan2 { get; set; }
        public string DiemLan2 { get; set; }
        public bool DaLuuChungChi { get; set; }
        public string DanhGia { get; set; }
        public string Signature { get; set; }
    }
}