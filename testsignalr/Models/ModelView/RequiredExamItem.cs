using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class RequiredExamItem
    {
        public int Id { get; set; }
        public int ThoiGianThi { get; set; }
        public string TenHinhThucThi { get; set; }
        public string MaHinhThucThi { get; set; }
        public int SoLuongDapAnDung { get; set; }
        public int SoLuongCauHoi { get; set; }
    }
}