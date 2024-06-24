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
using OfficeOpenXml;
using System.Drawing;

using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;
using testsignalr.Filters;
using OfficeOpenXml.Drawing;
using Aspose.Cells;

namespace testsignalr.Areas.Administrator.Controllers
{
    [CustomAuthorize]
    public class KhoaHocController : Controller
    {
        // GET: Administrator/KhoaHoc
        public ActionResult TaoKhoaHocMoi()
        {
            List<DanhMucChungChi> dsChungChi = new List<DanhMucChungChi>();
            List<GiaoVien> dsGiaoVien = new List<GiaoVien>();
            using (var db = new HumanManagementEntities())
            {
                dsChungChi = db.DanhMucChungChis.OrderBy(c => c.MaChungChi).ToList();
                dsGiaoVien = db.GiaoViens.OrderBy(g => g.TenGiaoVien).ToList();
            }
            ViewBag.dsGiaoVien = dsGiaoVien;
            ViewBag.dsChungChi = dsChungChi;
            return View();
        }
        [HttpPost]
        public ActionResult SaveNewCourse(KhoaHocItem obj)
        {
            int id = 0;
            if (obj == null)
                return RedirectToAction("TaoKhoaHocMoi");
            DanhMucKhoaHoc myCourse = new DanhMucKhoaHoc();
            myCourse.TenKhoaHoc = obj.TenKhoaHoc.Trim();
            myCourse.TuNgay = DateTime.ParseExact(obj.TuNgay, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            myCourse.DenNgay = DateTime.ParseExact(obj.DenNgay, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            myCourse.NgayCap = DateTime.ParseExact(obj.NgayCap, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            myCourse.NgayHetHan = DateTime.ParseExact(obj.NgayHetHan, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            myCourse.MaChungChi = obj.MaChungChi;
            myCourse.MaGiaoVien = obj.MaGiaoVien;
            myCourse.TrangThai = false;
            myCourse.DaXoa = false;
            using (var db = new HumanManagementEntities())
            {
                db.DanhMucKhoaHocs.Add(myCourse);
                db.SaveChanges();
            }
            id = myCourse.Id;
            return RedirectToAction("EditCourse", new { CourseId = id });
        }

        public ActionResult EditCourse(int CourseId, int? slidePosition)
        {
            CourseItem myCourse;
            string loaihinhthi;
            using (var db = new HumanManagementEntities())
            {
                myCourse = db.Database.SqlQuery<CourseItem>("exec SPGetCourseDetails " + CourseId.ToString()).FirstOrDefault();
                var result = (from yeucauthi in db.YeuCauThis
                              join HinhThucThi in db.HinhThucThis
                              on yeucauthi.IdHinhThucThi equals HinhThucThi.Id
                              select new
                              {
                                  tenhinhthuc = HinhThucThi.TenHinhThucThi
                              }
                         ).FirstOrDefault();
                loaihinhthi = result != null ? result.tenhinhthuc : "";
            }
            ViewBag.CourseId = CourseId;
            ViewBag.myCourse = myCourse;
            ViewBag.loaihinhthi = loaihinhthi;
            return View();
        }


        public ActionResult getListDocument(int CourserId)
        {
            List<TaiLieuKhoaHoc> dsTaiLieu = new List<TaiLieuKhoaHoc>();
            using (var db = new HumanManagementEntities())
            {
                dsTaiLieu = db.TaiLieuKhoaHocs.Where(t => t.Id_DM_KhoaHoc == CourserId).OrderBy(t => t.TenTaiLieu).ToList();
            }
            ViewBag.CourserId = CourserId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ListDocument.cshtml", dsTaiLieu);
        }
        public ActionResult getListStudent(int CourserId)
        {
            List<StaffItem> dsHocVien = new List<StaffItem>();
            using (var db = new HumanManagementEntities())
            {
                dsHocVien = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourserId.ToString()).ToList();
            }
            ViewBag.CourseId = CourserId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ListStaff.cshtml", dsHocVien);
        }
        public ActionResult ShowEmployeeToListExam(int CourseId)
        {
            List<StaffItem> dsHocVien = new List<StaffItem>();
            using (var db = new HumanManagementEntities())
            {
                dsHocVien = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourseId.ToString()).ToList();
            }
            ViewBag.CourseId = CourseId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ShowListStaff.cshtml", dsHocVien);
        }
        public ActionResult getRequireExam(int CourserId)
        {
            RequiredExamItem requiredExam;
            List<LanThi> dsLanThi = new List<LanThi>();
            List<SoLuongItem> dsSoLuong = new List<SoLuongItem>();
            using (var db = new HumanManagementEntities())
            {
                requiredExam = db.Database.SqlQuery<RequiredExamItem>("exec SPGetRequiredExam " + CourserId.ToString()).FirstOrDefault();
                dsLanThi = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourserId).OrderBy(l => l.Stt).ToList();
                dsSoLuong = db.Database.SqlQuery<SoLuongItem>("exec SPGetRequiredNumberQuestion " + CourserId.ToString()).ToList();

            }
            ViewBag.dsLanThi = dsLanThi;
            ViewBag.dsSoLuong = dsSoLuong;
            ViewBag.CourseId = CourserId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_RequiredExamDetail.cshtml", requiredExam);
        }
        public ActionResult getListExam(int CourserId)
        {
            List<Exam> dsdethi = new List<Exam>();
            using (var db = new HumanManagementEntities())
            {
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetListExamByCourseId " + CourserId.ToString()).ToList();
            }
            ViewBag.CourserId = CourserId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ListExamDetail.cshtml", dsdethi);
        }
        public ActionResult checkHasData(int CourserId)
        {
            List<TaiLieuKhoaHoc> dstailieukhoahoc = new List<TaiLieuKhoaHoc>();
            List<DanhSachHocVien> dshocvien = new List<DanhSachHocVien>();
            YeuCauThi yc;
            List<DeThi> dsDethi = new List<DeThi>();
            List<StaffItem> guimail = new List<StaffItem>();
            HinhThucThi htt;
            int idYCT = 0;
            //kiem tra hinh thuc thi
            //finish
            using (var db = new HumanManagementEntities())
            {
                dstailieukhoahoc = db.TaiLieuKhoaHocs.Where(t => t.Id_DM_KhoaHoc == CourserId).ToList();
                dshocvien = db.DanhSachHocViens.Where(d => d.Id_DM_KhoaHoc == CourserId).ToList();
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourserId).FirstOrDefault();
                dsDethi = db.DeThis.Where(i => i.Id_DM_KhoaHoc == CourserId).ToList();
                guimail = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourserId.ToString()).ToList();
                idYCT = yc == null ? 0 : yc.IdHinhThucThi.Value;
                htt = db.HinhThucThis.Where(h => h.Id == idYCT).FirstOrDefault();
            }
            string dagui = guimail.Count == 0 ? "" : guimail.Where(g => g.DaGuiMail == false).ToList().Count > 0 ? "" : "Yes";
            string isRNS = htt == null ? "" : (htt.MaHinhThucThi.Trim() == "READANDSIGN") ? "Yes" : "";
            return Json(new { document = dstailieukhoahoc.Count == 0 ? "" : "Yes", HocVien = dshocvien.Count == 0 ? "" : "Yes", yeucau = yc == null ? "" : "Yes", DeThi = dsDethi.Count == 0 ? "" : "Yes", GuiMail = dagui, HinhThucThi = isRNS }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteCourse(int CourseId)
        {
            DanhMucKhoaHoc course;
            using (var db = new HumanManagementEntities())
            {
                course = db.DanhMucKhoaHocs.Where(c => c.Id == CourseId).FirstOrDefault();
                if (course != null)
                {
                    course.DaXoa = true;
                }
                db.SaveChanges();
            }
            return RedirectToAction("ShowAllCourse");
        }

        public ActionResult ShowAllOpeningCourse()
        {
            List<KhoaHocModal> dsKhoaHoc = new List<KhoaHocModal>();
            using (var db = new HumanManagementEntities())
            {
                dsKhoaHoc = db.Database.SqlQuery<KhoaHocModal>("exec SPGetAllOpenCourse 0").ToList();
            }
            ViewBag.TieuDeTrang = "Danh sách khóa học đang mở";
            return View(dsKhoaHoc);
        }
        public ActionResult ShowAllClosedCourse()
        {
            List<KhoaHocModal> dsKhoaHoc = new List<KhoaHocModal>();
            using (var db = new HumanManagementEntities())
            {
                dsKhoaHoc = db.Database.SqlQuery<KhoaHocModal>("exec SPGetAllOpenCourse 1").ToList();
            }
            return View(dsKhoaHoc);
        }
        public ActionResult EditCourseInfor(int CourseId)
        {
            List<DanhMucChungChi> ListTracert = new List<DanhMucChungChi>();
            List<GiaoVien> dsgiaovien = new List<GiaoVien>();
            DanhMucKhoaHoc course;

            using (var db = new HumanManagementEntities())
            {
                ListTracert = db.DanhMucChungChis.OrderBy(c => c.MaChungChi).ToList();
                dsgiaovien = db.GiaoViens.OrderBy(g => g.TenGiaoVien).ToList();
                course = db.DanhMucKhoaHocs.Where(k => k.Id == CourseId).FirstOrDefault();

            }
            if (course == null)
                return RedirectToAction("ShowAllOpeningCourse");
            ViewBag.Listcertificate = ListTracert;
            ViewBag.dsgiaovien = dsgiaovien;
            return View(course);
        }


        [HttpPost]
        public ActionResult SaveCourseInfor(int IdKhoaHoc, string TenKhoaHoc, string TuNgay, string DenNgay, int ListTracert, string NgayCap, string NgayHetHan, int ListTeacher, string trangthai)
        {
            DateTime _tungay, _denngay, _ngaycap, _ngayhethan;
            _tungay = DateTime.ParseExact(TuNgay, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            _denngay = DateTime.ParseExact(DenNgay, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            _ngaycap = DateTime.ParseExact(NgayCap, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            _ngayhethan = DateTime.ParseExact(NgayHetHan, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            DanhMucKhoaHoc myCourser;

            using (var db = new HumanManagementEntities())
            {
                myCourser = db.DanhMucKhoaHocs.Where(d => d.Id == IdKhoaHoc).FirstOrDefault();

                if (myCourser != null)
                {
                    //kiem tra trang thai. neu dong thi luu chung chi


                    myCourser.TenKhoaHoc = TenKhoaHoc.Trim();
                    myCourser.MaChungChi = ListTracert;
                    myCourser.TuNgay = _tungay;
                    myCourser.DenNgay = _denngay;
                    myCourser.NgayCap = _ngaycap;
                    myCourser.NgayHetHan = _ngayhethan;
                    myCourser.MaGiaoVien = ListTeacher;
                    myCourser.DaXoa = false;
                    //myCourser.TrangThai = trangthai.Trim() == "Open" ? false : true;


                    if (trangthai == "Closed")
                    {
                        myCourser.TrangThai = true;
                        db.Database.ExecuteSqlCommand("EXEC SPSaveUserTracertAfterFinishing " + IdKhoaHoc.ToString());
                    }
                    else
                    {
                        myCourser.TrangThai = false;
                    }
                    db.SaveChanges();
                }
            }
            return RedirectToAction("EditCourse", new { CourseId = IdKhoaHoc });
        }

        public ActionResult EditListDocument(int CourseId)
        {
            List<TaiLieuKhoaHoc> dsTaiLieu = new List<TaiLieuKhoaHoc>();
            using (var db = new HumanManagementEntities())
            {
                dsTaiLieu = db.TaiLieuKhoaHocs.Where(t => t.Id_DM_KhoaHoc == CourseId).OrderBy(t => t.TenTaiLieu).ToList();
            }
            ViewBag.CourseId = CourseId;
            return View(dsTaiLieu);
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> AddDocument(int CourseId, HttpPostedFileBase fileUpload)
        {
            string extension = "";
            string fileName = "";
            string path = "";
            //kiem tra ton tai thu muc chua
            if (!System.IO.Directory.Exists(Server.MapPath("~/Content/Doc/TaiLieuKhoaHoc/" + CourseId.ToString())))
            {
                System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Doc/TaiLieuKhoaHoc/" + CourseId.ToString()));
            }
            if (fileUpload != null && fileUpload.ContentLength > 0)
            {
                fileName = Path.GetFileName(fileUpload.FileName);
                path = "~/Content/Doc/TaiLieuKhoaHoc/" + CourseId.ToString() + "/" + fileName.Trim();
                extension = Path.GetExtension(fileName);
                // Kiểm tra xem tập tin đã tồn tại hay không
                if (System.IO.File.Exists(Server.MapPath(path)))
                {

                    string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                    int count = 1;

                    // Thêm số vào sau tên file cho đến khi không còn trùng
                    while (System.IO.File.Exists(Server.MapPath(path)))
                    {
                        fileName = $"{fileNameWithoutExtension} ({count}){extension}";
                        path = "~/Content/Doc/TaiLieuKhoaHoc/" + CourseId.ToString() + "/" + fileName.Trim();
                        count++;
                    }
                }

                try
                {
                    await System.Threading.Tasks.Task.Run(() => fileUpload.SaveAs(Server.MapPath(path)));
                    TaiLieuKhoaHoc newDoc = new TaiLieuKhoaHoc();
                    newDoc.Id_DM_KhoaHoc = CourseId;
                    newDoc.DuongDan = path.Trim();
                    newDoc.LoaiFile = extension.Replace(".", "").ToUpper();
                    newDoc.TenTaiLieu = fileName;
                    using (var db = new HumanManagementEntities())
                    {
                        db.TaiLieuKhoaHocs.Add(newDoc);
                        db.SaveChanges();
                    }
                }
                catch { }
            }
            return RedirectToAction("EditListDocument", new { CourseId = CourseId });
        }
        public ActionResult OpenFile(int DocId)
        {
            string filePath = "";
            TaiLieuKhoaHoc mydoc;
            using (var db = new HumanManagementEntities())
            {
                mydoc = db.TaiLieuKhoaHocs.Where(t => t.Id == DocId).FirstOrDefault();
            }
            filePath = mydoc == null ? "" : mydoc.DuongDan.Trim().Replace("~", "");
            return Redirect(filePath);
        }
        public ActionResult DeleleDocument(int Fileid, int CourseId)
        {
            TaiLieuKhoaHoc myDoc;
            using (var db = new HumanManagementEntities())
            {
                myDoc = db.TaiLieuKhoaHocs.Where(t => t.Id == Fileid && t.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                string filePath = "";
                if (myDoc != null)
                {
                    filePath = myDoc.DuongDan.Trim();
                    db.TaiLieuKhoaHocs.Remove(myDoc);
                    db.SaveChanges();
                    if (System.IO.File.Exists(Server.MapPath(filePath)))
                    {
                        try
                        {
                            System.IO.File.Delete(Server.MapPath(filePath));
                        }
                        catch { }
                    }
                }
            }
            return RedirectToAction("EditListDocument", new { CourseId = CourseId });
        }

        public ActionResult EditListEmplyee(int CourseId)
        {
            ViewBag.CourseId = CourseId;
            return View();
        }
        public ActionResult searchStaffByExpirationDate(int CourseId)
        {
            List<TracertExpired> dsNhanVienHetHan = new List<TracertExpired>();
            using (var db = new HumanManagementEntities())
            {
                dsNhanVienHetHan = db.Database.SqlQuery<TracertExpired>("exec SPGetListEmployeeTracertExpired " + CourseId.ToString()).ToList();
            }
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ShowListStaffResult.cshtml", dsNhanVienHetHan);
        }
        public ActionResult searchStaffByName(string Name)
        {
            List<TracertExpired> dsNhanVienHetHan = new List<TracertExpired>();
            using (var db = new HumanManagementEntities())
            {
                dsNhanVienHetHan = db.Database.SqlQuery<TracertExpired>("exec SPFindEmployeeByName N'" + Name.Trim() + "'").ToList();
            }
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ShowListStaffResult.cshtml", dsNhanVienHetHan);
        }
        public ActionResult AddStaffToList(string listStaff, int CourseId)
        {
            string manv = "";
            DanhSachHocVien hocvien;
            NhanVienThueNgoai nvn;
            NhanVien nv;
            string[] item = listStaff.Split(',');
            int Id = 0;
            Random rd = new Random();
            if (item.Count() > 0)
            {
                using (var db = new HumanManagementEntities())
                {
                    foreach (string subItem in item)
                    {
                        try { Id = Int32.Parse(subItem); } catch { Id = 0; }
                        if (Id != 0)
                        {
                            nv = db.NhanViens.Where(n => n.Id == Id).FirstOrDefault();
                            nvn = db.NhanVienThueNgoais.Where(n => n.Id == Id).FirstOrDefault();
                            hocvien = db.DanhSachHocViens.Where(h => h.Id_DM_KhoaHoc == CourseId && h.Id_NhanVien == Id).FirstOrDefault();
                            if (hocvien == null)
                            {
                                hocvien = new DanhSachHocVien();
                                if (nv != null)
                                    manv = nv.MaNhanVien.Trim();
                                else if (nvn != null)
                                    manv = nvn.MaNhanVien.Trim();
                                hocvien.MaNhanVien = manv;
                                hocvien.DaDocTaiLieu = false;
                                hocvien.Id_DM_KhoaHoc = CourseId;
                                hocvien.OTP = Generateintrandome(6, rd);
                                hocvien.Id_NhanVien = Id;
                                db.DanhSachHocViens.Add(hocvien);
                                db.SaveChanges();
                            }
                        }
                    }
                }
            }
            return RedirectToAction("EditListEmplyee", new { CourseId = CourseId });
        }
        private static string Generateintrandome(int length, Random random)
        {
            string characters = "0123456789";
            StringBuilder result = new StringBuilder(length);
            for (int i = 0; i < length; i++)
            {
                result.Append(characters[random.Next(characters.Length)]);
            }
            return result.ToString();
        }

        public ActionResult downloadListStaff(int CourseId)
        {
            List<StaffItem> dsHocVien = new List<StaffItem>();
            DanhMucKhoaHoc kh;
            uint dongtinh = 9;
            int stt = 0;
            string fileName = "";
            using (var db = new HumanManagementEntities())
            {
                kh = db.DanhMucKhoaHocs.Where(c => c.Id == CourseId).FirstOrDefault();
                dsHocVien = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourseId.ToString()).ToList();
            }
            fileName = "Danh sách ngày " + DateTime.Now.ToString("ddMMyyyy") + ".xlsx";
            string templatePath = Server.MapPath("~/Content/Template/template.xlsx");
            fileName = Server.MapPath("~/Content/FileDownLoad/" + fileName);
            // Tạo một bản sao của file mẫu Excel
            Microsoft.Office.Interop.Excel.Application xlApp = new Microsoft.Office.Interop.Excel.Application();
            Microsoft.Office.Interop.Excel.Workbook SourceWork, NewBook;
            Microsoft.Office.Interop.Excel.Worksheet SheetToCopy, Wsheets;
            NewBook = xlApp.Workbooks.Add(System.Reflection.Missing.Value);

            try
            {
                System.IO.File.Delete(fileName);
            }
            catch
            { }

            try
            {
                NewBook.SaveAs(fileName);
                SourceWork = xlApp.Workbooks.Open(templatePath);
                SheetToCopy = SourceWork.Sheets[1];
                SheetToCopy.Copy(NewBook.Sheets[1]);
                SourceWork.Close(false, Type.Missing, Type.Missing);
                Wsheets = NewBook.Worksheets[1];
                Wsheets.Activate();
                Wsheets.Cells[5, "A"] = "KHOÁ ĐÀO TẠO NGHIỆP VỤ " + kh.TenKhoaHoc.Trim();
                string[,] saNames = new string[dsHocVien.Count(), 8];

                foreach (var item in dsHocVien)
                {
                    stt++;
                    saNames[stt, 0] = stt.ToString();
                    saNames[stt, 1] = item.HoTen.Trim();
                    saNames[stt, 2] = item.NgaySinh;
                    saNames[stt, 3] = item.NoiSinh;
                    saNames[stt, 4] = item.TenCongTy;
                    saNames[stt, 5] = item.TenChucVu;
                    saNames[stt, 6] = item.TenPhong;
                    saNames[stt, 7] = "";

                    Microsoft.Office.Interop.Excel.Range range = (Microsoft.Office.Interop.Excel.Range)Wsheets.Rows[9];

                    // Chèn một dòng mới dưới dòng 10
                    range.Insert(XlInsertShiftDirection.xlShiftDown, XlInsertFormatOrigin.xlFormatFromLeftOrAbove);

                    // Sao chép định dạng từ dòng 10 sang dòng mới
                    Microsoft.Office.Interop.Excel.Range newRow = (Microsoft.Office.Interop.Excel.Range)Wsheets.Rows[9];
                    newRow.Copy();
                    range.PasteSpecial(XlPasteType.xlPasteFormats);

                    //// Giải phóng tài nguyên
                    //System.Runtime.InteropServices.Marshal.ReleaseComObject(range);
                    //System.Runtime.InteropServices.Marshal.ReleaseComObject(newRow);
                }

                Wsheets.get_Range("A9", "H" + (dsHocVien.Count() + 8).ToString()).Value2 = saNames;
                NewBook.Save();
            }
            catch
            {

            }
            finally
            {
                NewBook.Close(false, Type.Missing, Type.Missing);
                xlApp.DisplayAlerts = true;
                xlApp.Quit();
                System.Runtime.InteropServices.Marshal.ReleaseComObject(xlApp);
                xlApp = null;
            }
            return File(fileName, "application/force-download", System.IO.Path.GetFileName(fileName));
        }
        public ActionResult EditRequest(int CourseId)
        {
            YeuCauThi yc;
            List<HinhThucThi> dsHinhThuc = new List<HinhThucThi>();
            List<LanThi> dsLanThi = new List<LanThi>();
            List<SoLuongItem> dsSoLuong = new List<SoLuongItem>();
            using (var db = new HumanManagementEntities())
            {
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                dsHinhThuc = db.HinhThucThis.OrderBy(h => h.MaHinhThucThi).ToList();
                dsLanThi = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourseId).OrderBy(l => l.Stt).ToList();
                dsSoLuong = db.Database.SqlQuery<SoLuongItem>("exec SPGetRequiredNumberQuestion " + CourseId.ToString()).ToList();
            }
            if (yc == null)
            {
                yc = new YeuCauThi();
                yc.SoLuongCauHoi = 0;
                yc.SoLuongDapAnDung = 0;
                yc.ThoiGianThi = 0;
                yc.IdHinhThucThi = 1;
            }
            ViewBag.dsHinhThuc = dsHinhThuc;
            ViewBag.dsLanThi = dsLanThi;
            ViewBag.CourseId = CourseId;
            ViewBag.dsSoLuong = dsSoLuong;
            return View(yc);
        }
        [HttpPost]
        public ActionResult EditRNSRequest(int maHinhThucRNS, int Idcourse)
        {
            //cap nhat yeu cau thi
            YeuCauThi yc;
            using (var db = new HumanManagementEntities())
            {
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == Idcourse).FirstOrDefault();
                if (yc == null)
                {
                    yc = new YeuCauThi();
                    yc.Id_DM_KhoaHoc = Idcourse;
                    yc.SoLuongCauHoi = 0;
                    yc.SoLuongDapAnDung = 0;
                    yc.ThoiGianThi = 0;
                    yc.IdHinhThucThi = maHinhThucRNS;
                    db.YeuCauThis.Add(yc);
                    db.SaveChanges();
                }
                else
                {
                    yc.Id_DM_KhoaHoc = Idcourse;
                    yc.IdHinhThucThi = maHinhThucRNS;
                    db.SaveChanges();
                }
            }

            return RedirectToAction("EditCourse", new { CourseId = Idcourse });
        }
        [HttpPost]
        public ActionResult EditRequest(int CourseId, int ThoiGianThi, List<int> SoLuongCauHoi, List<int> IdMucDoCauHoi, int SoLuongDung, string thoigianthi1, string thoigiankethuc1, string thoigianthi2, string thoigiankethuc2, int ExamType)
        {
            YeuCauThi yc;
            LanThi dsLanThi;
            using (var db = new HumanManagementEntities())
            {
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                if (yc == null)
                {
                    yc = new YeuCauThi();
                    yc.Id_DM_KhoaHoc = CourseId;
                    yc.SoLuongCauHoi = SoLuongCauHoi.Sum();
                    yc.SoLuongDapAnDung = SoLuongDung;
                    yc.ThoiGianThi = ThoiGianThi;
                    yc.IdHinhThucThi = ExamType;
                    db.YeuCauThis.Add(yc);
                    db.SaveChanges();
                }
                else
                {
                    yc.Id_DM_KhoaHoc = CourseId;
                    yc.SoLuongCauHoi = SoLuongCauHoi.Sum();
                    yc.SoLuongDapAnDung = SoLuongDung;
                    yc.ThoiGianThi = ThoiGianThi;
                    yc.IdHinhThucThi = ExamType;
                    db.SaveChanges();
                }

                dsLanThi = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourseId && l.Stt == 0).FirstOrDefault();
                if (dsLanThi == null)
                {
                    dsLanThi = new LanThi();
                    dsLanThi.id_DM_KhoaHoc = CourseId;
                    dsLanThi.Stt = 0;
                    dsLanThi.thoigianthi = DateTime.ParseExact(thoigianthi1.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    dsLanThi.thoigiankethuc = DateTime.ParseExact(thoigiankethuc1.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    db.LanThis.Add(dsLanThi);
                    db.SaveChanges();
                }
                else
                {
                    dsLanThi.id_DM_KhoaHoc = CourseId;
                    dsLanThi.Stt = 0;
                    dsLanThi.thoigianthi = DateTime.ParseExact(thoigianthi1.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    dsLanThi.thoigiankethuc = DateTime.ParseExact(thoigiankethuc1.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    db.SaveChanges();
                }
                dsLanThi = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourseId && l.Stt == 1).FirstOrDefault();
                if (dsLanThi == null)
                {
                    dsLanThi = new LanThi();
                    dsLanThi.id_DM_KhoaHoc = CourseId;
                    dsLanThi.Stt = 1;
                    dsLanThi.thoigianthi = DateTime.ParseExact(thoigianthi2.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    dsLanThi.thoigiankethuc = DateTime.ParseExact(thoigiankethuc2.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    db.LanThis.Add(dsLanThi);
                    db.SaveChanges();
                }
                else
                {
                    dsLanThi.id_DM_KhoaHoc = CourseId;
                    dsLanThi.Stt = 1;
                    dsLanThi.thoigianthi = DateTime.ParseExact(thoigianthi2.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    dsLanThi.thoigiankethuc = DateTime.ParseExact(thoigiankethuc2.Trim(), "yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);
                    db.SaveChanges();
                }
                int i = 0;
                ChiTietSoLuongCauHoi ct;
                int idmucdo = 0;
                foreach (var item in SoLuongCauHoi)
                {
                    idmucdo = IdMucDoCauHoi[i];
                    ct = db.ChiTietSoLuongCauHois.Where(c => c.Id_DM_KhoaHoc == CourseId && c.IdMucDo == idmucdo).FirstOrDefault();
                    if (ct == null)
                    {
                        ct = new ChiTietSoLuongCauHoi();
                        ct.IdMucDo = idmucdo;
                        ct.Id_DM_KhoaHoc = CourseId;
                        ct.SoLuongCau = item;
                        db.ChiTietSoLuongCauHois.Add(ct);
                        db.SaveChanges();
                    }
                    else
                    {
                        ct.IdMucDo = idmucdo;
                        ct.Id_DM_KhoaHoc = CourseId;
                        ct.SoLuongCau = item;
                        db.SaveChanges();
                    }
                    i++;
                }
            }

            return RedirectToAction("EditCourse", new { CourseId = CourseId });
        }

        public ActionResult EditListQuestion(int CourseId)
        {
            List<MucDo> dsMucdo = new List<MucDo>();
            using (var db = new HumanManagementEntities())
            {
                dsMucdo = db.MucDoes.OrderBy(m => m.Id).ToList();
            }
            List<dropdownlist> mylist = new List<dropdownlist>();
            var dr = new dropdownlist();
            dr.Value = 1;
            dr.Text = "A";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 2;
            dr.Text = "B";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 3;
            dr.Text = "C";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 4;
            dr.Text = "D";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 5;
            dr.Text = "E";
            mylist.Add(dr);
            ViewBag.mylist = mylist;
            ViewBag.dsMucDo = dsMucdo;
            ViewBag.CourseId = CourseId;
            return View();
        }
        public ActionResult ShowListQuestion(int CourseId)
        {
            List<Exam> dsdethi = new List<Exam>();
            using (var db = new HumanManagementEntities())
            {
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetListExamByCourseId " + CourseId.ToString()).ToList();
            }
            ViewBag.CourseId = CourseId;
            return PartialView("_ShowListQuestion", dsdethi);
        }
        public ActionResult getAllQuestionByTracertCode(int CourseId)
        {
            List<cauhoi> dsCauHoi = new List<cauhoi>();
            using (var db = new HumanManagementEntities())
            {
                dsCauHoi = db.Database.SqlQuery<cauhoi>("exec SPGetListQuestionByCourseId " + CourseId.ToString()).ToList();
            }
            return PartialView("_ShowAllQuestionByTracertCode", dsCauHoi);
        }
        public ActionResult AddQuestionToExam(string ListquestionId, int CourseId)
        {
            DeThi dt;
            NganHangCauHoi bank;
            List<DapAn> dsDapAn = new List<DapAn>();
            string[] item = ListquestionId.Split(',');
            int Id = 0;
            int i = 0;
            if (item.Count() > 0)
            {
                using (var db = new HumanManagementEntities())
                {
                    foreach (string subItem in item)
                    {
                        try { Id = Int32.Parse(subItem); } catch { Id = 0; }
                        if (Id != 0)
                        {
                            //kiem tra da ton tai trong de thi chua
                            dt = db.DeThis.Where(d => d.IdNganHangCauHoi == Id && d.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                            if (dt == null)
                            {
                                bank = db.NganHangCauHois.Where(b => b.QuestionId == Id).FirstOrDefault();
                                dsDapAn = db.DapAns.Where(a => a.IdCauHoi == Id).ToList();
                                if (bank != null && dsDapAn.Count > 0)
                                {
                                    dt = new DeThi();
                                    dt.CauHoi = bank.CauHoi.Trim();
                                    dt.IdMucDo = bank.IdMucDo;
                                    dt.DuongDan = bank.DuongDan == null ? "" : bank.DuongDan.Trim();
                                    dt.Id_DM_KhoaHoc = CourseId;
                                    dt.IdNganHangCauHoi = Id;
                                    i = 0;
                                    foreach (var temp in dsDapAn)
                                    {
                                        if (i == 0)
                                        {
                                            dt.TraLoiA = temp.TraLoi.Trim();
                                            if (temp.DapAnDung == true)
                                            {
                                                dt.DapAn = "A";
                                            }
                                        }
                                        else if (i == 1)
                                        {
                                            dt.TraLoiB = temp.TraLoi.Trim();
                                            if (temp.DapAnDung == true)
                                            {
                                                dt.DapAn = "B";
                                            }
                                        }
                                        else if (i == 2)
                                        {
                                            dt.TraLoiC = temp.TraLoi.Trim();
                                            if (temp.DapAnDung == true)
                                            {
                                                dt.DapAn = "C";
                                            }
                                        }
                                        else if (i == 3)
                                        {
                                            dt.TraLoiD = temp.TraLoi.Trim();
                                            if (temp.DapAnDung == true)
                                            {
                                                dt.DapAn = "D";
                                            }
                                        }
                                        else if (i == 4)
                                        {
                                            dt.TraLoiE = temp.TraLoi.Trim();
                                            if (temp.DapAnDung == true)
                                            {
                                                dt.DapAn = "E";
                                            }
                                        }
                                        i++;
                                    }
                                    db.DeThis.Add(dt);
                                    db.SaveChanges();
                                }
                            }
                        }
                    }
                }
            }
            return RedirectToAction("EditListQuestion", new { CourseId = CourseId });
        }
        public ActionResult EditSelectedQuestion(int ExamId, int CourseId)
        {
            List<MucDo> dsMucDo = new List<MucDo>();
            DeThi _dethi;
            using (var db = new HumanManagementEntities())
            {
                _dethi = db.DeThis.Where(d => d.Id == ExamId && d.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                dsMucDo = db.MucDoes.OrderBy(m => m.Id).ToList();
                if (_dethi == null)
                    return RedirectToAction("EditListQuestion", new { CourseId = CourseId });
            }
            List<dropdownlist> mylist = new List<dropdownlist>();
            var dr = new dropdownlist();
            dr.Value = 1;
            dr.Text = "A";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 2;
            dr.Text = "B";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 3;
            dr.Text = "C";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 4;
            dr.Text = "D";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 5;
            dr.Text = "E";
            mylist.Add(dr);
            ViewBag.mylist = mylist;
            ViewBag.dsMucDo = dsMucDo;
            ViewBag.CourseId = CourseId;
            return View(_dethi);
        }
        public ActionResult SaveSelectedQuestion(int CourseId, int ExamId, string cauhoi_, string traloia, string traloib, string traloic, string traloid, string traloie, string ddlDapAnDung, int ddlMucDo)
        {
            //kiem tra xem examId có tồn tại ko
            DeThi dt;
            using (var db = new HumanManagementEntities())
            {
                dt = db.DeThis.Where(d => d.Id == ExamId).FirstOrDefault();
                if (dt != null)
                {
                    dt.CauHoi = cauhoi_.Trim();
                    dt.TraLoiA = traloia.Trim();
                    dt.TraLoiB = traloib.Trim();
                    dt.TraLoiC = traloic.Trim();
                    dt.TraLoiD = traloid.Trim();
                    dt.TraLoiE = traloie.Trim();
                    dt.DapAn = ddlDapAnDung.Trim();
                    dt.IdMucDo = ddlMucDo;
                    db.SaveChanges();
                }
            }
            return RedirectToAction("EditListQuestion", new { CourseId = CourseId });
        }
        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> uploadPictureQuestion(int fileId, HttpPostedFileBase fileUpload)
        {
            string fileName = "";
            string path = "";
            string extension = "";
            int CourseId = 0;
            DeThi dt;
            using (var db = new HumanManagementEntities())
            {
                dt = db.DeThis.Where(d => d.Id == fileId).FirstOrDefault();
                if (dt == null)
                    return RedirectToAction("ShowAllOpeningCourse");

                CourseId = dt.Id_DM_KhoaHoc.Value;
                if (!System.IO.Directory.Exists(Server.MapPath("~/Content/DeThi/" + CourseId.ToString())))
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/DeThi/" + CourseId.ToString()));
                }
                if (fileUpload != null && fileUpload.ContentLength > 0)
                {
                    fileName = Path.GetFileName(fileUpload.FileName);
                    path = "~/Content/DeThi/" + CourseId.ToString() + "/" + fileName.Trim();
                    extension = Path.GetExtension(fileName);
                    // Kiểm tra xem tập tin đã tồn tại hay không
                    if (System.IO.File.Exists(Server.MapPath(path)))
                    {

                        string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                        int count = 1;

                        // Thêm số vào sau tên file cho đến khi không còn trùng
                        while (System.IO.File.Exists(Server.MapPath(path)))
                        {
                            fileName = $"{fileNameWithoutExtension} ({count}){extension}";
                            path = "~/Content/DeThi/" + CourseId.ToString() + "/" + fileName.Trim();
                            count++;
                        }
                    }
                    try
                    {
                        await System.Threading.Tasks.Task.Run(() => fileUpload.SaveAs(Server.MapPath(path)));
                        dt.DuongDan = path.Replace("~", "");
                        db.SaveChanges();
                    }
                    catch { }
                }
            }
            return RedirectToAction("EditListQuestion", new { CourseId = CourseId });
        }
        public ActionResult DownloadQuestionTemplate()
        {
            string filepath = Server.MapPath("~/Content/Template/quiz_Pic.xlsx");
            return File(filepath, "application/force-download", System.IO.Path.GetFileName(filepath));
        }
        [HttpPost]
        public async Task<ActionResult> AddNewQuestion(int CourseId, string cauhoi_, string traloia, string traloib, string traloic, string traloid, string traloie, string ddlDapAnDung, int ddlMucDo, HttpPostedFileBase QuestionfileUpload)
        {
            //kiem tra xem examId có tồn tại ko
            string fileName = "";
            string path = "";
            string extension = "";
            DeThi dt;
            if (QuestionfileUpload != null && QuestionfileUpload.ContentLength > 0)
            {
                if (!System.IO.Directory.Exists(Server.MapPath("~/Content/DeThi/" + CourseId.ToString())))
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/DeThi/" + CourseId.ToString()));
                }
                fileName = Path.GetFileName(QuestionfileUpload.FileName);
                path = "~/Content/DeThi/" + CourseId.ToString() + "/" + fileName.Trim();
                extension = Path.GetExtension(fileName);
                if (System.IO.File.Exists(Server.MapPath(path)))
                {

                    string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                    int count = 1;

                    // Thêm số vào sau tên file cho đến khi không còn trùng
                    while (System.IO.File.Exists(Server.MapPath(path)))
                    {
                        fileName = $"{fileNameWithoutExtension} ({count}){extension}";
                        path = "~/Content/DeThi/" + CourseId.ToString() + "/" + fileName.Trim();
                        count++;
                    }
                }
                try
                {
                    await System.Threading.Tasks.Task.Run(() => QuestionfileUpload.SaveAs(Server.MapPath(path)));
                    path = path.Replace("~", "");
                }
                catch { }
            }
            using (var db = new HumanManagementEntities())
            {
                dt = new DeThi();
                dt.DuongDan = path;
                dt.CauHoi = cauhoi_.Trim();
                dt.TraLoiA = traloia.Trim();
                dt.TraLoiB = traloib.Trim();
                dt.TraLoiC = traloic.Trim();
                dt.TraLoiD = traloid.Trim();
                dt.TraLoiE = traloie.Trim();
                dt.DapAn = ddlDapAnDung.Trim();
                dt.Id_DM_KhoaHoc = CourseId;
                dt.IdMucDo = ddlMucDo;
                db.DeThis.Add(dt);
                db.SaveChanges();
            }
            return RedirectToAction("EditListQuestion", new { CourseId = CourseId });
        }
        public ActionResult ViewListQuestion(int CourseId)
        {
            List<Exam> dsdethi = new List<Exam>();
            DanhMucKhoaHoc kh;
            using (var db = new HumanManagementEntities())
            {
                kh = db.DanhMucKhoaHocs.Where(d => d.Id == CourseId).FirstOrDefault();
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetListExamByCourseId " + CourseId.ToString()).ToList();
            }
            ViewBag.TieuDeTrang = kh == null ? "" : "Danh sách câu hỏi bài thi khóa học[" + kh.TenKhoaHoc.Trim() + "]";
            ViewBag.CourseId = CourseId;
            return View(dsdethi);
        }

        public ActionResult FinishAndSendMail(int CourseId)
        {
            List<StaffItem> dsHocVien = new List<StaffItem>();
            using (var db = new HumanManagementEntities())
            {
                dsHocVien = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourseId.ToString()).ToList();
            }
            ViewBag.CourseId = CourseId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_FinishAndSendMail.cshtml", dsHocVien);
        }
        public void sendCourseInforToMail(int CourseId, string MailTo, string ListIdEmp)
        {
            GuiMail guimail;
            string smtpAddress = "smtp.gmail.com";
            int portNumber = 587;
            bool enableSSL = true;
            string emailFrom = "messages@hgs.vn";
            string password = "Hgs@2022";
            string body = "";
            MailItem MyInf;
            using (var db = new HumanManagementEntities())
            {
                MyInf = db.Database.SqlQuery<MailItem>("EXEC SPInformationToSendMail " + CourseId.ToString()).FirstOrDefault();

                if (MyInf == null)
                    return;
                try
                {
                    using (System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage())
                    {
                        mail.To.Add(MailTo);
                        mail.From = new System.Net.Mail.MailAddress(emailFrom);
                        mail.Subject = "Trung tâm Đào tạo Huấn luyện Thông báo khóa học - " + MyInf.TenKhoaHoc.Trim().ToUpper();
                        body = "Chào bạn! <br/>";
                        body += "Trung tâm đào tạo HGS xin trân trọng thông báo: <br/><br/>";
                        body += "<b>Trung tâm sẽ triển khai khóa học mới sau:</b> <br/>";
                        body += "- Tên khóa học: " + MyInf.TenKhoaHoc.Trim() + " <br/>";
                        body += "- Thời gian đào tạo: từ ngày " + MyInf.TuNgay.Trim() + " - " + MyInf.DenNgay.Trim() + " <br/>";
                        if (MyInf.ThoiGianThiLan1.Trim() != "")
                        {
                            body += "- Thời gian làm bài thi từ " + MyInf.ThoiGianThiLan1.Trim() + " - " + MyInf.ThoiGianKetThucLan1.Trim() + " <br/>";
                        }
                        if (MyInf.ThoiGianThiLan2.Trim() != "")
                        {
                            body += "- Thời gian làm bài thi lại từ " + MyInf.ThoiGianThiLan2.Trim() + " - " + MyInf.ThoiGianKetThucLan2.Trim() + " <br/>";
                        }
                        body += "- Chứng chỉ cấp: " + MyInf.TenChungChi + " <br/>";
                        body += "- Thời hạn chứng chỉ cấp: " + MyInf.NgayCap.Trim() + " - " + MyInf.NgayHetHan.Trim() + " <br/><br/>";
                        body += "<b>Phương thức học và làm bài thi trực tuyến: </b> <br/>";
                        if (MyInf.TenHinhThucThi.Trim() != "")
                        {
                            body += " - " + MyInf.TenHinhThucThi + " <br/>";
                        }

                        body += " - Truy cập ứng dụng qua địa chỉ: http://113.190.42.178:8001/ <br/>";
                        body += " - Nhập tài khoản được cấp và chọn khóa học trong mục [Danh sách khóa học mới] <br/>";
                        body += " - Đọc tài liệu trực tiếp trên trình duyệt web của điện thoại/ máy tính.<br/><br/><br/>";

                        body += "<b><i> Lưu ý:</i></b> <br/>";
                        body += "<i>- Chương trình sẽ giám nắm toàn bộ quá trình tham gia học và thi của các bạn. Kết quả bài thi có giá trị như bài thi giấy.<br/>";
                        body += "<i>- Nếu các bạn sử dụng trên điện thoại thông minh, các bạn xem video thứ 2 ngay khi đăng nhập để biết cách xem tài liệu khóa học.</i> <br/>";
                        body += "<i>- Khi chọn nút làm bài thi, thời gian làm bài thi sẽ tự động đếm ngược về 0 theo thời gian thực. Khi hết giờ chương trình sẽ tự động gửi bài và kết thúc quá trình thi.</i> <br/><br/><br/>";
                        body += "<i>- Với hình thức làm bài tập trung tại phòng máy. Khi thi, Giáo viên sẽ cấp mã bài thi và mã sẽ thay đổi mỗi khi đăng nhập. Do vậy các bạn không thoát ra hay quay lại trang trước trong quá trình làm bài thi.</i> <br/><br/><br/>";


                        body += "Thông tin hỗ trợ: <br/>";
                        body += "Email: trainingcenter@hgs.vn <br/>";
                        body += "<i>Chúc bạn làm bài tốt</i> <br/>";
                        mail.Body = body;
                        mail.IsBodyHtml = true;
                        using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                        {
                            smtp.Credentials = new NetworkCredential(emailFrom, password);
                            smtp.EnableSsl = enableSSL;
                            smtp.Send(mail);
                        }
                        db.SaveChanges();
                    }
                    string[] ListMailTo = MailTo.Split(',');
                    string[] ListIdNhanVien = ListIdEmp.Split(',');
                    int ma = 0;
                    string _ma = "";
                    int i = 0;
                    foreach (string item in ListMailTo)
                    {

                        _ma = ListIdNhanVien[i];
                        try
                        {
                            ma = int.Parse(_ma);
                            guimail = new GuiMail();
                            guimail.Id_DM_KhoaHoc = CourseId;
                            guimail.Id_NhanVien = ma;
                            guimail.HasSent = true;
                            guimail.ThoiGianGui = DateTime.Now;
                            db.GuiMails.Add(guimail);
                            db.SaveChanges();
                        }
                        catch { }
                        i++;
                    }
                }
                catch
                {
                }
            }
        }

        public ActionResult QuanLyKetQuaThi()
        {
            List<KetQuaThi> danhsachketquathi = new List<KetQuaThi>();
            using (var db = new HumanManagementEntities())
            {
                danhsachketquathi = db.Database.SqlQuery<KetQuaThi>("exec SPGetResultExam ").ToList();
            }
            ViewBag.TieuDeTrang = "Quản lý điêm thi";
            return View(danhsachketquathi);
        }
        public ActionResult ChiTIetKetQuaThi(int CourseId)
        {
            List<DiemItem> danhsachdiemthi = new List<DiemItem>();
            RequiredExamItem requiredExam;
            DanhMucKhoaHoc dmkh;
            using (var db = new HumanManagementEntities())
            {
                dmkh = db.DanhMucKhoaHocs.Where(d => d.Id == CourseId).FirstOrDefault();
                requiredExam = db.Database.SqlQuery<RequiredExamItem>("exec SPGetRequiredExam " + CourseId.ToString()).FirstOrDefault();
                danhsachdiemthi = db.Database.SqlQuery<DiemItem>("exec DetalsCourseExam " + CourseId.ToString()).ToList();
            }
            ViewBag.CourseId = CourseId;
            ViewBag.TenKhoaHoc = dmkh == null ? "" : dmkh.TenKhoaHoc.Trim();
            ViewBag.yeucauthi = requiredExam;
            ViewBag.TieuDeTrang = dmkh == null ? "Chi tiết điểm thi khóa học " : "Chi tiết điểm thi khóa học " + dmkh.TenKhoaHoc.Trim();
            return View(danhsachdiemthi);

        }

        public ActionResult getReadAndSign(int CourserId)
        {
            List<Exam> dsdethi = new List<Exam>();
            using (var db = new HumanManagementEntities())
            {
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetReadAndSignQuestion " + CourserId.ToString()).ToList();
            }
            ViewBag.CourserId = CourserId;
            return PartialView("~/Areas/Administrator/Views/KhoaHoc/_ListReadAndSign.cshtml", dsdethi);
        }

        public ActionResult ViewReadAndSign(int CourseId)
        {
            List<Exam> dsdethi = new List<Exam>();
            DanhMucKhoaHoc kh;
            using (var db = new HumanManagementEntities())
            {
                kh = db.DanhMucKhoaHocs.Where(d => d.Id == CourseId).FirstOrDefault();
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetReadAndSignQuestion " + CourseId.ToString()).ToList();
            }
            ViewBag.TieuDeTrang = kh == null ? "" : "Danh sách câu hỏi R&S khóa học[" + kh.TenKhoaHoc.Trim() + "]";
            ViewBag.CourseId = CourseId;
            return View(dsdethi);
        }
        public ActionResult EditReadAndSign(int CourseId)
        {
            List<dropdownlist> mylist = new List<dropdownlist>();
            var dr = new dropdownlist();
            dr.Value = 1;
            dr.Text = "A";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 2;
            dr.Text = "B";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 3;
            dr.Text = "C";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 4;
            dr.Text = "D";
            mylist.Add(dr);
            dr = new dropdownlist();
            dr.Value = 5;
            dr.Text = "E";
            mylist.Add(dr);
            ViewBag.mylist = mylist;
            ViewBag.CourseId = CourseId;
            return View();
        }
        public ActionResult ShowReadAndSign(int CourseId)
        {
            List<Exam> dsdethi = new List<Exam>();
            using (var db = new HumanManagementEntities())
            {
                dsdethi = db.Database.SqlQuery<Exam>("exec SPGetReadAndSignQuestion " + CourseId.ToString()).ToList();
            }
            ViewBag.CourseId = CourseId;
            return PartialView("_ShowReadAdnSign", dsdethi);
        }
        public async Task<ActionResult> AddNewReadAndSign(int CourseId, string cauhoi_, string traloia, string traloib, string traloic, string traloid, string traloie, string ddlDapAnDung, HttpPostedFileBase QuestionfileUpload)
        {
            //kiem tra xem examId có tồn tại ko
            string fileName = "";
            string path = "";
            string extension = "";
            ReadAndSign dt;
            if (QuestionfileUpload != null && QuestionfileUpload.ContentLength > 0)
            {
                if (!System.IO.Directory.Exists(Server.MapPath("~/Content/ReadAndSign/" + CourseId.ToString())))
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/ReadAndSign/" + CourseId.ToString()));
                }
                fileName = Path.GetFileName(QuestionfileUpload.FileName);
                path = "~/Content/ReadAndSign/" + CourseId.ToString() + "/" + fileName.Trim();
                extension = Path.GetExtension(fileName);
                if (System.IO.File.Exists(Server.MapPath(path)))
                {

                    string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                    int count = 1;

                    // Thêm số vào sau tên file cho đến khi không còn trùng
                    while (System.IO.File.Exists(Server.MapPath(path)))
                    {
                        fileName = $"{fileNameWithoutExtension} ({count}){extension}";
                        path = "~/Content/ReadAndSign/" + CourseId.ToString() + "/" + fileName.Trim();
                        count++;
                    }
                }
                try
                {
                    await System.Threading.Tasks.Task.Run(() => QuestionfileUpload.SaveAs(Server.MapPath(path)));
                    path = path.Replace("~", "");
                }
                catch { }
            }
            using (var db = new HumanManagementEntities())
            {
                dt = new ReadAndSign();
                dt.DuongDan = path;
                dt.CauHoi = cauhoi_.Trim();
                dt.TraLoiA = traloia.Trim();
                dt.TraLoiB = traloib.Trim();
                dt.TraLoiC = traloic.Trim();
                dt.TraLoiD = traloid.Trim();
                dt.TraLoiE = traloie.Trim();
                dt.DapAn = ddlDapAnDung.Trim();
                dt.Id_DM_KhoaHoc = CourseId;

                db.ReadAndSigns.Add(dt);
                db.SaveChanges();
            }
            return RedirectToAction("EditReadAndSign", new { CourseId = CourseId });
        }

        public async Task<ActionResult> sendmailToStaff(int CourseId)
        {
            int dem = 0;
            string MailTo = "";
            string ListIdNhanVien = "";
            List<StaffItem> dsHocVien = new List<StaffItem>();
            using (var db = new HumanManagementEntities())
            {
                dsHocVien = db.Database.SqlQuery<StaffItem>("exec SPGetListStudent " + CourseId.ToString()).ToList();
            }
            foreach (var item in dsHocVien)
            {
                if (item.DaGuiMail == false && item.Email.Trim() != "")
                {
                    if (MailTo.Trim() == "") MailTo = item.Email.Trim(); else MailTo += "," + item.Email.Trim();
                    if (ListIdNhanVien.Trim() == "") ListIdNhanVien = item.Id.ToString(); else ListIdNhanVien += "," + item.Id.ToString();
                    dem++;
                    if (dem == 15)
                    {
                        await System.Threading.Tasks.Task.Run(() => { sendCourseInforToMail(CourseId, MailTo, ListIdNhanVien); });
                        MailTo = "";
                        dem = 0;
                    }
                }
            }
            return RedirectToAction("EditCourse", new { CourseId = CourseId });
        }
        private Image ResizeImage(Image img, int width, int height)
        {
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            var resizedImg = new Bitmap(width, height);

            using (var graphics = Graphics.FromImage(resizedImg))
            {
                graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;

                graphics.DrawImage(img, rect);
            }

            return resizedImg;
        }
        public ActionResult InDanhSach(int CourseId)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            List<DiemItem> danhsachdiemthi = new List<DiemItem>();
            DanhMucKhoaHoc dmkh;
            using (var db = new HumanManagementEntities())
            {
                dmkh = db.DanhMucKhoaHocs.Where(d => d.Id == CourseId).FirstOrDefault();
                danhsachdiemthi = db.Database.SqlQuery<DiemItem>("exec DetalsCourseExam " + CourseId.ToString()).ToList();
            }
            // Đường dẫn tới file Excel xuất ra
            string templatePath = Server.MapPath("~/Content/Template/ketquathi.xls");

            string excelFilePath = Server.MapPath("~/Content/Filedownload/BM-HGS-128_danhsachhocvien.xlsx");
            try
            {
                System.IO.File.Delete(Server.MapPath(excelFilePath));
            }
            catch
            { }
            System.Threading.Thread.Sleep(100);
            System.IO.File.Copy(templatePath, excelFilePath, true) ;

            // Load file Excel mới vào một package EPPlus
            using (ExcelPackage package = new ExcelPackage(new FileInfo(excelFilePath)))
            {
                // Lấy sheet từ package
                ExcelWorksheet worksheet = package.Workbook.Worksheets["Sheet1"]; // Đổi tên sheet nếu cần thiết

                // Bắt đầu từ dòng 2 (dòng đầu tiên là tiêu đề)
                int row = 0;

                foreach (var user in danhsachdiemthi)
                {
                    // Điền thông tin người dùng vào file Excel từ cột 1 đến cột 2
                    worksheet.Cells[row + 8, 1].Value = row +1; // Ví dụ, lấy họ tên từ model của bạn
                    worksheet.Cells[row + 8, 2].Value = user.HoTen;
                    worksheet.Cells[row + 8, 3].Value = user.NgaySinh;
                    worksheet.Cells[row + 8, 4].Value = user.NoiSinh;
                    worksheet.Cells[row + 8, 5].Value = user.MaCongTy;
                    worksheet.Cells[row + 8, 6].Value = user.TenPhong;
                    worksheet.Cells[row + 8, 7].Value = user.TenChucVu;
                    worksheet.Cells[row + 8, 8].Value = user.DaDocTaiLieu == true ? "Đã đọc tài liệu" : "";
                    worksheet.Cells[row + 8, 9].Value = user.LamBaiLan1;
                    worksheet.Cells[row + 8, 10].Value = user.DiemLan1;
                    worksheet.Cells[row + 8, 11].Value = user.LamBaiLan2;
                    worksheet.Cells[row + 8, 12].Value = user.DiemLan2;
                    worksheet.Cells[row + 8, 13].Value = user.DanhGia;
                    if (!string.IsNullOrEmpty(user.Signature) )
                    {
                        byte[] imageBytes = Convert.FromBase64String(user.Signature);

                        // Đường dẫn đến thư mục lưu hình ảnh tạm thời
                        string tempImagePath = Server.MapPath("~/App_Data/SignatureImages");
                        if (!Directory.Exists(tempImagePath))
                        {
                            Directory.CreateDirectory(tempImagePath);
                        }

                        // Tạo tên file hình ảnh duy nhất
                        string imageFileName = $"Signature_{user.Id}.png";
                        string imageFilePath = Path.Combine(tempImagePath, imageFileName);

                        // Lưu hình ảnh từ base64 xuống file ảnh tạm thời
                        using (FileStream fs = new FileStream(imageFilePath, FileMode.Create))
                        {
                            fs.Write(imageBytes, 0, imageBytes.Length);
                        }

                        // Chèn hình ảnh vào cell
                        ExcelPicture picture = worksheet.Drawings.AddPicture($"Signature_{row}", new FileInfo(imageFilePath));
                        picture.SetSize(60, 30);
                        picture.SetPosition(row + 7, 0, 13, 0); // Đặt vị trí của hình ảnh trong cell

                        // Xóa file hình ảnh tạm thời sau khi chèn vào Excel
                      
                        //System.IO.File.Delete(imageFilePath);
                    }

                    row++;
                }

                // Lưu lại file Excel
                package.Save();
            }

            // Trả về file Excel cho người dùng để tải xuống
            byte[] fileBytes = System.IO.File.ReadAllBytes(excelFilePath);
            string fileName = "UserList.xlsx";
            // return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            FileContentResult result = File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            System.IO.File.Delete(excelFilePath);
            return result;
        }
    }
}