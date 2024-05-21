using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class ChungChiController : Controller
    {
        // GET: Administrator/ChungChi
        public ActionResult DanhsachChungChi()
        {
            List<DanhMucChungChi> dsChungChi = new List<DanhMucChungChi>();
            using (var db = new HumanManagementEntities())
            {
                dsChungChi = db.DanhMucChungChis.OrderBy(c => c.MaChungChi).ToList();
            }
            return View(dsChungChi);
        }
        public ActionResult NhomChungChiTheoChucVu(int? IdCongTy)
        {
            List<DanhMucCongTy> dsCongTy = new List<DanhMucCongTy>();
            List<ChucVuItem> dsChucVu = new List<ChucVuItem>();
            using (var db = new HumanManagementEntities())
            {
                dsCongTy = db.DanhMucCongTies.OrderBy(c => c.TenCongTy).ToList();
                if (IdCongTy == null)
                    IdCongTy = dsCongTy[0].Id;
                dsChucVu = db.Database.SqlQuery<ChucVuItem>("exec SPGetListJob " + IdCongTy.ToString()).ToList();
            }
            ViewBag.IdCongTy = IdCongTy;
            ViewBag.dsCongTy = dsCongTy;
            return View(dsChucVu);
        }

        public ActionResult getListTracert(int tracertId)
        {
            List<TracertItem> dsChungChi = new List<TracertItem>();
            using (var db = new HumanManagementEntities())
            {
                dsChungChi = db.Database.SqlQuery<TracertItem>("exec SPGetListTracert " + tracertId.ToString()).ToList();
            }
            if (dsChungChi.Count == 0)
                return Json("Data empty", JsonRequestBehavior.AllowGet);
            return PartialView("~/Areas/Administrator/Views/ChungChi/_NhomChungChiTheoChucVu.cshtml", dsChungChi);
        }

        public ActionResult getEmployeeTracert()
        {
            List<DanhMucCongTy> dsCongTy = new List<DanhMucCongTy>();
            using (var db = new HumanManagementEntities())
            {
                dsCongTy = db.DanhMucCongTies.OrderBy(c => c.MaCongTy).ToList();
            }
            return View(dsCongTy);
        }
        public ActionResult getOutSourceEmployeeTracert()
        {
            return View();
        }
        public ActionResult getEmployeeTracertSimple()
        {
            List<DanhMucCongTy> dsCongTy = new List<DanhMucCongTy>();
            using (var db = new HumanManagementEntities())
            {
                dsCongTy = db.DanhMucCongTies.OrderBy(c => c.MaCongTy).ToList();
            }
            return View(dsCongTy);
        }
        public ActionResult getDetailEmployeeTracert(string MaCongTy)
        {
           List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
           using (var db = new HumanManagementEntities())
            {
                dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPGetListEmployeeTracert '" + MaCongTy.ToString() + "'").ToList();
            }
            ViewBag.dsTracert = dsTracert;
            if(dsTracert.Count==0)
            return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/ChungChi/_PVEmpTracert.cshtml");
        }
        public ActionResult getDetailOutSourceEmployeeTracert()
        {
            List<OutSourceEmpTracertItem> dsTracert = new List<OutSourceEmpTracertItem>();
            using (var db = new HumanManagementEntities())
            {
                dsTracert = db.Database.SqlQuery<OutSourceEmpTracertItem>("exec SPGetListOutSourceEmployeeTracert ").ToList();
            }
            ViewBag.dsTracert = dsTracert;
            if (dsTracert.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/ChungChi/_PVOutSourceEmpTracert.cshtml");
        }
        public ActionResult getDetailEmployeeTracertSimple(string MaCongTy)
        {
            List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
            using (var db = new HumanManagementEntities())
            {
                dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPGetListEmployeeTracertSimple '" + MaCongTy.ToString() + "'").ToList();
            }
            ViewBag.dsTracert = dsTracert;
            if (dsTracert.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/ChungChi/_PVEmpTracertSimple.cshtml");
        }
        public ActionResult showTracertDetailByEmployeeCode(string MaNhanVien, string MaChungChi)
        {
            List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
            using (var db = new HumanManagementEntities())
            {
                dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPGetEmployeeTracertDetail '" + MaNhanVien.Trim() + "','" + MaChungChi.Trim() + "'").ToList();
            }
            return View(dsTracert);
        }

    }

}