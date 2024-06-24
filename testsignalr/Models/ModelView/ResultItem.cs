using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class ResultItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ThoiGianBatDauThi { get; set; }
        public string ThoiGianKetThucThi { get; set; }
        public string ThoiGianBatDau  { get; set; }
        public string ThoiGianKetThuc { get; set; }
        public int Diem { get; set; }
        public bool? TrangThai { get; set; }
        public int TrangThaiThi { get; set; }
        public int Timeplaps { get; set; }
        public bool TrangThaiKhoaHoc { get; set; }
    }
}