using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class KetQuaThi
    {
        public int Id { get; set; }
        public string TenKhoaHoc { get; set; }
        public string ThoiGianDaoTao { get; set; }
        public int SoLuongHocVien { get; set; }
        public string HinhThucThi { get; set; }
        public int DaDocTaiLieu { get; set; }
        public int DaThi { get; set; }
    }
}