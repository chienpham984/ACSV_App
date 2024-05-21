using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class NhanViensController : Controller
    {
        private HumanManagementEntities db = new HumanManagementEntities();

        // GET: Administrator/NhanViens
        public ActionResult Index()
        {
            List<DanhMucCongTy> dsCongTy = new List<DanhMucCongTy>();
            using (var db = new HumanManagementEntities())
            {
                dsCongTy = db.DanhMucCongTies.ToList();
            }
            return View(dsCongTy);
        }
        public ActionResult getEmployeeByCompany(string companyCode)
        {
            List<EmpItem> dsEmp = new List<EmpItem>();
            using (var db = new HumanManagementEntities())
            {
                dsEmp = db.Database.SqlQuery<EmpItem>("exec SPGetAllEmployee '" + companyCode.Trim() + "'").ToList();
            }

            ViewBag.dsTracert = dsEmp;
            if (dsEmp.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/NhanViens/_ListEmployee.cshtml");
        }
        public ActionResult OutSourceEmployee()
        {
            return View();
        }
        public ActionResult getOutSourceEmployee()
        {
            List<OutSourceEmpItem> dsEmp = new List<OutSourceEmpItem>();
            using (var db = new HumanManagementEntities())
            {
                dsEmp = db.Database.SqlQuery<OutSourceEmpItem>("exec SPGetAllOurSourceEmployee ").ToList();
            }

            ViewBag.dsTracert = dsEmp;
            if (dsEmp.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/NhanViens/_ListOutSourceEmployee.cshtml");
        }
        public ActionResult getJsonData(string MaNhanVien)
        {
            List<HopDongItem> danhSachHopDong = new List<HopDongItem>();
            List<LyLichTuPhapItem> danhSachTheLamViec = new List<LyLichTuPhapItem>();
            List<LyLichTuPhapItem> danhSachLyLichTuPhap = new List<LyLichTuPhapItem>();
            using (var db = new HumanManagementEntities())
            {
                danhSachHopDong = db.Database.SqlQuery<HopDongItem>("exec SPgetListcontractByEmpId '" + MaNhanVien.Trim() + "'").ToList();
                danhSachTheLamViec = db.Database.SqlQuery<LyLichTuPhapItem>("exec SPgetListWorkingCardByEmpId '" + MaNhanVien.Trim() + "'").ToList();
                danhSachLyLichTuPhap = db.Database.SqlQuery<LyLichTuPhapItem>("exec SPgetListbackgroundByEmpId '" + MaNhanVien.Trim() + "'").ToList();
            }
            return Json(new { danhSachHopDong=danhSachHopDong, danhSachTheLamViec= danhSachTheLamViec , danhSachLyLichTuPhap= danhSachLyLichTuPhap }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            NhanVien nhanVien = db.NhanViens.Find(id);
            if (nhanVien == null)
            {
                return HttpNotFound();
            }
            return View(nhanVien);
        }

        // GET: Administrator/NhanViens/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Administrator/NhanViens/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,HoTen,NgaySinh,GioiTinh,DiaChiThuongTru,QueQuan,HonNhan,NgayVaoCongTy,SoDienThoai,Email,NgayVaoDang,MaNhanVien,CCCD,NgayCap,NoiCap,NoiSinh,IdCongTy,IdPhongBan,IdChucVu,NgayNghiViec")] NhanVien nhanVien)
        {
            if (ModelState.IsValid)
            {
                db.NhanViens.Add(nhanVien);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(nhanVien);
        }

        // GET: Administrator/NhanViens/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            NhanVien nhanVien = db.NhanViens.Find(id);
            if (nhanVien == null)
            {
                return HttpNotFound();
            }
            return View(nhanVien);
        }

        // POST: Administrator/NhanViens/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,HoTen,NgaySinh,GioiTinh,DiaChiThuongTru,QueQuan,HonNhan,NgayVaoCongTy,SoDienThoai,Email,NgayVaoDang,MaNhanVien,CCCD,NgayCap,NoiCap,NoiSinh,IdCongTy,IdPhongBan,IdChucVu,NgayNghiViec")] NhanVien nhanVien)
        {
            if (ModelState.IsValid)
            {
                db.Entry(nhanVien).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(nhanVien);
        }

        // GET: Administrator/NhanViens/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            NhanVien nhanVien = db.NhanViens.Find(id);
            if (nhanVien == null)
            {
                return HttpNotFound();
            }
            return View(nhanVien);
        }

        // POST: Administrator/NhanViens/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            NhanVien nhanVien = db.NhanViens.Find(id);
            db.NhanViens.Remove(nhanVien);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
