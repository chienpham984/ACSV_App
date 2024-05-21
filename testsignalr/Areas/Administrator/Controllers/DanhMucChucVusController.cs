using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class DanhMucChucVusController : Controller
    {
        private HumanManagementEntities db = new HumanManagementEntities();

        // GET: Administrator/DanhMucChucVus
        public ActionResult Index()
        {
            return View(db.DanhMucChucVus.ToList());
        }

        // GET: Administrator/DanhMucChucVus/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucChucVu danhMucChucVu = db.DanhMucChucVus.Find(id);
            if (danhMucChucVu == null)
            {
                return HttpNotFound();
            }
            return View(danhMucChucVu);
        }

        // GET: Administrator/DanhMucChucVus/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Administrator/DanhMucChucVus/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,IdPhongBan,TenChucVu,stt")] DanhMucChucVu danhMucChucVu)
        {
            if (ModelState.IsValid)
            {
                db.DanhMucChucVus.Add(danhMucChucVu);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(danhMucChucVu);
        }

        // GET: Administrator/DanhMucChucVus/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucChucVu danhMucChucVu = db.DanhMucChucVus.Find(id);
            if (danhMucChucVu == null)
            {
                return HttpNotFound();
            }
            return View(danhMucChucVu);
        }

        // POST: Administrator/DanhMucChucVus/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,IdPhongBan,TenChucVu,stt")] DanhMucChucVu danhMucChucVu)
        {
            if (ModelState.IsValid)
            {
                db.Entry(danhMucChucVu).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(danhMucChucVu);
        }

        // GET: Administrator/DanhMucChucVus/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucChucVu danhMucChucVu = db.DanhMucChucVus.Find(id);
            if (danhMucChucVu == null)
            {
                return HttpNotFound();
            }
            return View(danhMucChucVu);
        }

        // POST: Administrator/DanhMucChucVus/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            DanhMucChucVu danhMucChucVu = db.DanhMucChucVus.Find(id);
            db.DanhMucChucVus.Remove(danhMucChucVu);
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
