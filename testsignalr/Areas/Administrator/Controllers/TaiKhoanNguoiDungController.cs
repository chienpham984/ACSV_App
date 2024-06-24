using Microsoft.Office.Interop.Excel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;
using testsignalr.Filters;

namespace testsignalr.Areas.Administrator.Controllers
{
    [CustomAuthorize]
    public class TaiKhoanNguoiDungController : Controller
    {
        // GET: Administrator/TaiKhoanNguoiDung
        public ActionResult ShowAllUser()
        {
            List<NguoiDungItem> dsNguoiDung = new List<NguoiDungItem>();
            using (var db = new HumanManagementEntities())
            {
                dsNguoiDung = db.Database.SqlQuery<NguoiDungItem>("exec SPgetAllUser ").ToList();
            }
            return View(dsNguoiDung);
        }
        public ActionResult getUserRights(int IdTaiKhoan)
        {
            List<NhiemVu> danhsachnhiemvu = new List<NhiemVu>();
            ChucNangItem NguoiDungChucNang;
            using (var db = new HumanManagementEntities())
            {
                danhsachnhiemvu = db.NhiemVus.OrderBy(n => n.TenNhiemVu).ToList();
                NguoiDungChucNang = db.Database.SqlQuery<ChucNangItem>("exec SPgetUserRights " + IdTaiKhoan.ToString()).FirstOrDefault();
            }
            ViewBag.NguoiDungChucNang = NguoiDungChucNang;
            return PartialView("~/Areas/Administrator/Views/TaiKhoanNguoiDung/_ViewRights.cshtml", danhsachnhiemvu);
        }
    }
}