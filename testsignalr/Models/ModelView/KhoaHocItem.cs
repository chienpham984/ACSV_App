using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class KhoaHocItem
    {
        public int Id { get; set; }
        public string TenKhoaHoc { get; set; }
        public string TuNgay { get; set; }
        public string DenNgay { get; set; }
        public int MaChungChi { get; set; }
        public string NgayCap { get; set; }
        public string NgayHetHan { get; set; }
        public int MaGiaoVien { get; set; }
    }
}