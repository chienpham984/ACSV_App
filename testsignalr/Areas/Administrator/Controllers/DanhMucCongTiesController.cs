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
    public class DanhMucCongTiesController : Controller
    {
        private HumanManagementEntities db = new HumanManagementEntities();

        // GET: Administrator/DanhMucCongTies
        public ActionResult Index()
        {
            return View(db.DanhMucCongTies.ToList());
        }

        // GET: Administrator/DanhMucCongTies/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucCongTy danhMucCongTy = db.DanhMucCongTies.Find(id);
            if (danhMucCongTy == null)
            {
                return HttpNotFound();
            }
            return View(danhMucCongTy);
        }

        // GET: Administrator/DanhMucCongTies/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Administrator/DanhMucCongTies/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,MaCongTy,TenCongTy")] DanhMucCongTy danhMucCongTy)
        {
            if (ModelState.IsValid)
            {
                db.DanhMucCongTies.Add(danhMucCongTy);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(danhMucCongTy);
        }

        // GET: Administrator/DanhMucCongTies/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucCongTy danhMucCongTy = db.DanhMucCongTies.Find(id);
            if (danhMucCongTy == null)
            {
                return HttpNotFound();
            }
            return View(danhMucCongTy);
        }

        // POST: Administrator/DanhMucCongTies/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,MaCongTy,TenCongTy")] DanhMucCongTy danhMucCongTy)
        {
            if (ModelState.IsValid)
            {
                db.Entry(danhMucCongTy).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(danhMucCongTy);
        }

        // GET: Administrator/DanhMucCongTies/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DanhMucCongTy danhMucCongTy = db.DanhMucCongTies.Find(id);
            if (danhMucCongTy == null)
            {
                return HttpNotFound();
            }
            return View(danhMucCongTy);
        }

        // POST: Administrator/DanhMucCongTies/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            DanhMucCongTy danhMucCongTy = db.DanhMucCongTies.Find(id);
            db.DanhMucCongTies.Remove(danhMucCongTy);
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
