using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class CourseItem
    {
        public int Id { get; set; }
        public string TenKhoaHoc { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public string TenChungChi { get; set; }
        public DateTime NgayCap { get; set; }
        public DateTime NgayHetHan { get; set; }
        public string TenGiaoVien { get; set; }
        public bool TrangThai { get; set; }
        public string HinhThucDaoTao { get; set; }
    }
}