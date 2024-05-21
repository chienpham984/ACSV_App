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
    public class DanhMucPhongBansController : Controller
    {
        private HumanManagementEntities db = new HumanManagementEntities();

        // GET: Administrator/DanhMucPhongBans
        public ActionResult Index()
        {
            return View(db.DanhMucPhongBans.ToList());
        }

        // GET: Administrator/DanhMucPhongBans/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucPhongBan danhMucPhongBan = db.DanhMucPhongBans.Find(id);
            if (danhMucPhongBan == null)
            {
                return HttpNotFound();
            }
            return View(danhMucPhongBan);
        }

        // GET: Administrator/DanhMucPhongBans/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Administrator/DanhMucPhongBans/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,IdCongTy,TenPhong,stt")] DanhMucPhongBan danhMucPhongBan)
        {
            if (ModelState.IsValid)
            {
                db.DanhMucPhongBans.Add(danhMucPhongBan);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(danhMucPhongBan);
        }

        // GET: Administrator/DanhMucPhongBans/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucPhongBan danhMucPhongBan = db.DanhMucPhongBans.Find(id);
            if (danhMucPhongBan == null)
            {
                return HttpNotFound();
            }
            return View(danhMucPhongBan);
        }

        // POST: Administrator/DanhMucPhongBans/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,IdCongTy,TenPhong,stt")] DanhMucPhongBan danhMucPhongBan)
        {
            if (ModelState.IsValid)
            {
                db.Entry(danhMucPhongBan).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(danhMucPhongBan);
        }

        // GET: Administrator/DanhMucPhongBans/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucPhongBan danhMucPhongBan = db.DanhMucPhongBans.Find(id);
            if (danhMucPhongBan == null)
            {
                return HttpNotFound();
            }
            return View(danhMucPhongBan);
        }

        // POST: Administrator/DanhMucPhongBans/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            DanhMucPhongBan danhMucPhongBan = db.DanhMucPhongBans.Find(id);
            db.DanhMucPhongBans.Remove(danhMucPhongBan);
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
