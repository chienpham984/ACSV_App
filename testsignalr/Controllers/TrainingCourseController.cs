using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using testsignalr.Filters;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Controllers
{
    public class TrainingCourseController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        //[CustomAuthorize]
        public ActionResult ShowUserCategory()
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try {
                IdNhanVien = int.Parse(stringId);
            }
            catch { 
            }
            List<KhoaHocModal> dsKhoaHoc = new List<KhoaHocModal>();
            using (var db = new HumanManagementEntities())
            {
                dsKhoaHoc = db.Database.SqlQuery<KhoaHocModal>("exec SPGetAllOpenCourseByUserId 0 ," + IdNhanVien.ToString()).ToList();
            }
            ViewBag.TieuDeTrang = "Danh sách khóa học cần tham gia";
            return View(dsKhoaHoc);

        }
        public ActionResult ShowFinishedCategory()
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            List<KhoaHocModal> dsKhoaHoc = new List<KhoaHocModal>();
            using (var db = new HumanManagementEntities())
            {
                dsKhoaHoc = db.Database.SqlQuery<KhoaHocModal>("exec SPGetAllOpenCourseByUserId 1 ," + IdNhanVien.ToString()).ToList();
            }
            ViewBag.TieuDeTrang = "Danh sách khóa học đã tham gia";
            return View(dsKhoaHoc);
        }
        public ActionResult JoinTheCourse(int CourseId, int? slideShow)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            } 
            CourseItem myCourse;
            DanhSachHocVien hocVien;
            using (var db = new HumanManagementEntities())
            {
                myCourse = db.Database.SqlQuery<CourseItem>("exec SPGetCourseDetails " + CourseId.ToString()).FirstOrDefault();
                hocVien = db.DanhSachHocViens.Where(h => h.Id_DM_KhoaHoc == CourseId && h.Id_NhanVien == IdNhanVien).FirstOrDefault();
            }
            ViewBag.slideShow = slideShow == null ? 1 : slideShow;
            bool dadoc = hocVien == null ? false : hocVien.DaDocTaiLieu == null ? false : hocVien.DaDocTaiLieu.Value;
            ViewBag.dadoc = dadoc;
            ViewBag.CourseId = CourseId;
            ViewBag.myCourse = myCourse;
            ViewBag.TieuDeTrang = "Khóa học " + myCourse.TenKhoaHoc.Trim();
            return View();
        }
        public ActionResult getListDocument(int CourserId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            List<TaiLieuKhoaHoc> dsTaiLieu = new List<TaiLieuKhoaHoc>();
            DanhSachHocVien dshocvien = new DanhSachHocVien();
            int soluongReadAndSign = 0;
            using (var db = new HumanManagementEntities())
            {
                dsTaiLieu = db.TaiLieuKhoaHocs.Where(t => t.Id_DM_KhoaHoc == CourserId).OrderBy(t => t.TenTaiLieu).ToList();
                dshocvien = db.DanhSachHocViens.Where(d => d.Id_DM_KhoaHoc == CourserId && d.Id_NhanVien == IdNhanVien).FirstOrDefault();
                soluongReadAndSign = db.ReadAndSigns.Where(r => r.Id_DM_KhoaHoc == CourserId).Count();
            }
            ViewBag.soluongReadAndSign = soluongReadAndSign;
            ViewBag.dshocvien = dshocvien;
            ViewBag.CourserId = CourserId;
            return PartialView("~/Views/TrainingCourse/_ListDocument.cshtml", dsTaiLieu);
        }
        public ActionResult checkHasData(int CourserId)
        {
            return Json(new { document = "" }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveHaveRead(int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            int soluongReadAndSign = 0;
            DanhSachHocVien dshocvien;
            using (var db = new HumanManagementEntities())
            {
                soluongReadAndSign = db.ReadAndSigns.Where(r => r.Id_DM_KhoaHoc == CourseId).Count();
                if (soluongReadAndSign == 0)
                {
                    dshocvien = db.DanhSachHocViens.Where(d => d.Id_DM_KhoaHoc == CourseId && d.Id_NhanVien == IdNhanVien && d.DaDocTaiLieu == false).FirstOrDefault();
                    if (dshocvien != null)
                    {
                        dshocvien.DaDocTaiLieu = true;
                        dshocvien.ThoiGianXacNhan = DateTime.Now;
                        db.SaveChanges();
                    }
                }
            }
            return RedirectToAction("JoinTheCourse", new { CourseId = CourseId });
        }
        public ActionResult QuickTest(int CourseId)
        {
            List<ReadAndSign> danhsachcauhoi = new List<ReadAndSign>();
            int soluongcauhoi = 0;
            using (var db = new HumanManagementEntities())
            {
                danhsachcauhoi = db.ReadAndSigns.OrderBy(q => Guid.NewGuid()).ToList();
            }
            soluongcauhoi = danhsachcauhoi.Count;
            ViewBag.soluongcauhoi = soluongcauhoi;
            ViewBag.CourseId = CourseId;
            ViewBag.TieuDeTrang = "Trắc nghiệm xác nhận đã đọc tài liệu";
            return View(danhsachcauhoi);
        }

        [HttpPost]
        public ActionResult FinishQuickTest(List<string> ListAnswer, List<string> ListQuestionId, int CourseId, string TimeStart)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            int id = 0;
            int diem = 0;
            DanhSachHocVien dshocvien;
            List<ReadAndSign> dsReadAndSign = new List<ReadAndSign>();
            using (var db = new HumanManagementEntities())
            {
                dsReadAndSign = db.ReadAndSigns.Where(r => r.Id_DM_KhoaHoc == CourseId).ToList();

                if (dsReadAndSign.Count > 0)
                {
                    foreach (var item in dsReadAndSign)
                    {
                        if (ListQuestionId.Contains(item.Id.ToString()))
                        {
                            id = ListQuestionId.IndexOf(item.Id.ToString());
                            if (id >= 0)
                            {
                                if (item.DapAn.Trim() == ListAnswer[id].Trim())
                                {
                                    diem++;
                                }
                            }
                        }
                    }
                    diem = (int)Math.Round((Math.Round((double)100 / (double)dsReadAndSign.Count, 10) * (double)diem), 10);
                    HistoryQuickTest hs = new HistoryQuickTest();
                    hs.Id_DM_KhoaHoc = CourseId;
                    hs.IdNhanVien = 1;
                    hs.ThoiGianBatDau = TimeStart;
                    hs.ThoiGianKetThuc = DateTime.Now.ToString("yyy-MM-dd HH:mm:ss");
                    hs.Diem = diem;
                    db.HistoryQuickTests.Add(hs);
                    db.SaveChanges();
                    if (diem == 100)
                    {
                        dshocvien = db.DanhSachHocViens.Where(d => d.Id_DM_KhoaHoc == CourseId && d.Id_NhanVien == IdNhanVien).FirstOrDefault();
                        if (dshocvien != null)
                        {
                            dshocvien.DaDocTaiLieu = true;
                            dshocvien.ThoiGianXacNhan = DateTime.Now;
                            db.SaveChanges();
                        }
                        return Json(new { Status = "Pass" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { Status = diem.ToString() + "/100" }, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return RedirectToAction("JoinTheCourse", new { CourseId = 2, slideShow = 2 });
                }
            }
        }

        public ActionResult getResult(int CourserId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            List<ResultItem> myCourse = new List<ResultItem>();
            DanhSachHocVien hocVien;
            bool ketthuc = false;
            using (var db = new HumanManagementEntities())
            {
                hocVien = db.DanhSachHocViens.Where(h => h.Id_DM_KhoaHoc == CourserId && h.Id_NhanVien == IdNhanVien).FirstOrDefault();
                myCourse = db.Database.SqlQuery<ResultItem>("exec SPGetExamDetail " + CourserId.ToString() + "," + IdNhanVien.ToString()).ToList();
            }
            if (hocVien == null || hocVien.DaDocTaiLieu == false)
            {
                return RedirectToAction("JoinTheCourse", new { CourseId = CourserId, slideShow = 2 });
            }
            if (myCourse.Count > 0)
            {
                if (myCourse.Where(m => m.TrangThai == true).ToList().Count > 0)
                    ketthuc = true;
            }
            ViewBag.ketthuc = ketthuc;
            ViewBag.CourseId = CourserId;
            return PartialView("~/Views/TrainingCourse/_getResult.cshtml", myCourse);
        }

        public ActionResult GoToDoExam(int CourseId, int LanThi)
        {
            LanThi lanthi;
            CourseItem myCourse;
            RequiredExamItem requiredExam = new RequiredExamItem();
            using (var db = new HumanManagementEntities())
            {
                lanthi = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourseId && l.Id == LanThi).FirstOrDefault();
                requiredExam = db.Database.SqlQuery<RequiredExamItem>("exec SPGetRequiredExam " + CourseId.ToString()).FirstOrDefault();
                myCourse = db.Database.SqlQuery<CourseItem>("exec SPGetCourseDetails " + CourseId.ToString()).FirstOrDefault();
            }
            ViewBag.myCourse = myCourse;
            ViewBag.lanthi = lanthi;
            ViewBag.TieuDeTrang = "Tham gia bài kiểm tra ";
            return View(requiredExam);

        }
        public ActionResult NopBaiThi(int CourseId, int LanThi)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            QuaTrinhThi qt;
            using (var db = new HumanManagementEntities())
            {
                qt = db.Database.SqlQuery<QuaTrinhThi>("exec SPTinhDiem " + CourseId.ToString() + " , " + IdNhanVien.ToString() + " , " + LanThi.ToString()).FirstOrDefault();
            }
            return RedirectToAction("JoinTheCourse", new { CourseId = CourseId, slideShow = 3 });

        }
       
        public ActionResult StartExam(int LanThiId, string OTP, int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            string newOTP = "";
            DateTime thoigianbatdau, thoigianketthuc;
            TimeSpan thoigianconlai;
            int kiemtraducauhoi = 0;
            DanhSachHocVien hocvien;
            QuaTrinhThi qt;
            LanThi lt;
            YeuCauThi yc;
            int phut, giay;
            phut = 0; giay = 0;
            RequiredExamItem requiredExam = new RequiredExamItem();
            List<BaiThi> dsBaiThi = new List<BaiThi>();
            using (var db = new HumanManagementEntities())
            {
                requiredExam = db.Database.SqlQuery<RequiredExamItem>("exec SPGetRequiredExam " + CourseId.ToString()).FirstOrDefault();

                if (requiredExam == null)
                {
                    TempData["ErrMessage"] = "Có lỗi trong quá trình kiểm tra điều kiện thi. Liên hệ trung tâm đào tạo";
                    return RedirectToAction("JoinTheCourse", new { CourseId = CourseId, slideShow = 2 });
                }
                string MaHinhThucThi = requiredExam.MaHinhThucThi.Trim();
                if (MaHinhThucThi != "READANDSIGN")
                {
                    kiemtraducauhoi = db.Database.SqlQuery<int>("SELECT dbo.FncKiemtraducauhoi(" + CourseId.ToString() + ")").FirstOrDefault();
                }
                if (kiemtraducauhoi == 1)
                {
                    TempData["ErrMessage"] = "Có lỗi trong quá trình tải câu hỏi về. Liên hệ trung tâm đào tạo";
                    return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                }
                if (MaHinhThucThi == "CLASS")
                {
                    if (OTP == null)
                    {
                        TempData["ErrMessage"] = "Bài thi yêu cầu kiểm tra mã OTP. Liên hệ trung tâm đào tạo để cấp mã OTP";
                        return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                    }
                    //kiem tra OTP
                    hocvien = db.DanhSachHocViens.Where(h => h.Id_DM_KhoaHoc == CourseId && h.Id_NhanVien == IdNhanVien && h.OTP.Trim() == OTP.Trim()).FirstOrDefault();
                    if (hocvien == null)
                    {
                        TempData["ErrMessage"] = "Mã OTP không khớp, Liên hệ trung tâm đào tạo cấp lại mã OTP mới";
                        return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                    }
                }
                //gọi store copy data nêu chưa có bài thi
                dsBaiThi = db.BaiThis.Where(b => b.Id_DM_KhoaHoc == CourseId && b.IdLanThi == LanThiId && b.IdNhanVien == IdNhanVien).ToList();
                if (dsBaiThi.Count == 0)
                {
                    try
                    {

                        db.Database.ExecuteSqlCommand("EXEC SPCopyQuestion @CourseId, @IdNhanVien, @idLanThi",
                        new SqlParameter("CourseId", CourseId),
                        new SqlParameter("IdNhanVien", IdNhanVien),
                        new SqlParameter("idLanThi", LanThiId));
                    }
                    catch (Exception ex)
                    {
                        TempData["ErrMessage"] = "Có lỗi trong quá trình tải bài thi, Liên hệ trung tâm đào tạo";
                        return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                    }
                }
                //thay doi OTP moi
                if (MaHinhThucThi == "CLASS")
                {
                    Random rd = new Random();
                    newOTP = Generateintrandome(6, rd);
                    hocvien = db.DanhSachHocViens.Where(h => h.Id_DM_KhoaHoc == CourseId && h.Id_NhanVien == IdNhanVien && h.OTP.Trim() == OTP.Trim()).FirstOrDefault();
                    hocvien.OTP = newOTP;
                    db.SaveChanges();
                }
                lt = db.LanThis.Where(l => l.id_DM_KhoaHoc == CourseId && l.Id == LanThiId).FirstOrDefault();
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                if (lt == null || yc == null)
                {
                    TempData["ErrMessage"] = "Không lấy được dữ liệu các lần thi trên cơ sở dữ liệu, Liên hệ trung tâm đào tạo";
                    return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                }
                thoigianbatdau = lt.thoigianthi.Value;
                thoigianketthuc = lt.thoigiankethuc.Value;

                qt = db.QuaTrinhThis.Where(q => q.Id_DM_KhoaHoc == CourseId && q.Id_lanThi == LanThiId && q.IdNhanVien == IdNhanVien).FirstOrDefault();
                if (qt == null)
                {
                    if (DateTime.Now < thoigianbatdau || DateTime.Now > thoigianketthuc)
                    {
                        TempData["ErrMessage"] = "Thời gian thi không nằm trong khoảng thời gian cho phép";
                        return RedirectToAction("GoToDoExam", new { CourseId = CourseId, LanThi = LanThiId });
                    }
                    thoigianketthuc = thoigianketthuc.AddMinutes(yc.ThoiGianThi.Value);

                    qt = new QuaTrinhThi();
                    qt.Id_DM_KhoaHoc = CourseId;
                    qt.Id_lanThi = LanThiId;
                    qt.IdNhanVien = IdNhanVien;
                    qt.BatDauLuc = DateTime.Now;
                    db.QuaTrinhThis.Add(qt);
                    db.SaveChanges();
                    phut = yc.ThoiGianThi == null ? 0 : yc.ThoiGianThi.Value;
                    giay = 0;
                }
                else
                {
                    thoigianbatdau = qt.BatDauLuc.Value;
                    thoigianketthuc = thoigianbatdau.AddMinutes(yc.ThoiGianThi.Value);
                    thoigianconlai = thoigianketthuc - DateTime.Now;
                    phut = thoigianconlai.Minutes + thoigianconlai.Hours * 60;
                    giay = thoigianconlai.Seconds;

                    if (phut < 0)
                    {
                        qt = db.Database.SqlQuery<QuaTrinhThi>("exec SPTinhDiem " + CourseId.ToString() + " , " + IdNhanVien.ToString() + " , " + LanThiId.ToString()).FirstOrDefault();
                        return RedirectToAction("JoinTheCourse", new { CourseId = CourseId, slideShow = 3 });
                    }
                }

            }
            ViewBag.phut = phut;
            ViewBag.giay = giay;
            ViewBag.ExamTimes = LanThiId;
            ViewBag.CourseId = CourseId;
            @ViewBag.tieude = "bai thi test";
            return View();
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

        public ActionResult getTimeFromServer(int ExamTimes, int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            QuaTrinhThi myqt;
            int phut, giay;
            phut = 0; giay = 0;
            YeuCauThi yc;
            LanThi lt;
            DateTime thoigianbatdau, thoigianketthuc;
            TimeSpan thoigianconlai;
            using (var db = new HumanManagementEntities())
            {
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                lt = db.LanThis.Where(l => l.Id == ExamTimes && l.id_DM_KhoaHoc == CourseId).FirstOrDefault();
                myqt = db.QuaTrinhThis.Where(q => q.Id_DM_KhoaHoc == CourseId && q.Id_lanThi == ExamTimes && q.IdNhanVien == IdNhanVien).FirstOrDefault();
            }
            if (yc == null || lt == null)
            {
                phut = -1;
                giay = -1;
            }

            if (myqt != null && myqt.BatDauLuc == null)
            {
                phut = yc.ThoiGianThi.Value;
                giay = 0;
            }
            else if (myqt.BatDauLuc != null && myqt.KetThucLuc == null)
            {
                thoigianbatdau = myqt.BatDauLuc.Value;
                thoigianketthuc = thoigianbatdau.AddMinutes(yc.ThoiGianThi.Value);
                if (DateTime.Now > thoigianketthuc)
                {
                    phut = 0;
                    giay = 0;
                }
                else
                {
                    thoigianconlai = thoigianketthuc - DateTime.Now;
                    phut = thoigianconlai.Minutes + thoigianconlai.Hours * 60;
                    giay = thoigianconlai.Seconds;
                }

            }

            return Json(phut.ToString() + "_" + giay.ToString(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult getMapQuestion(int ExamTimes, int CourseId)
        {
            int IdNhanVien = 1;
            List<ExamItem> ListData = new List<ExamItem>();
            using (var db = new HumanManagementEntities())
            {
                ListData = db.Database.SqlQuery<ExamItem>("EXEC SPGetExam " + CourseId.ToString() + "," + IdNhanVien.ToString() + "," + ExamTimes.ToString()).ToList();
            }

            return PartialView("~/Views/TrainingCourse/_ShowMapQuestion.cshtml", ListData);
        }
        public ActionResult getListQuestion(int ExamTimes, int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            List<ExamItem> ListData = new List<ExamItem>();
            using (var db = new HumanManagementEntities())
            {
                ListData = db.Database.SqlQuery<ExamItem>("EXEC SPGetExam " + CourseId.ToString() + "," + IdNhanVien.ToString() + "," + ExamTimes.ToString()).ToList();
            }

            return PartialView("~/Views/TrainingCourse/_ShowListQuestion.cshtml", ListData);
        }

        public ActionResult saveAnswer(int QuestionId, string cautraloi, int ExamTimes, int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            QuaTrinhThi myqt;
            YeuCauThi yc;
            LanThi lt;
            DateTime thoigianbatdau, thoigianketthuc;
            BaiThi bt;
            bool chophepluu = false;
            using (var db = new HumanManagementEntities())
            {
                yc = db.YeuCauThis.Where(y => y.Id_DM_KhoaHoc == CourseId).FirstOrDefault();
                lt = db.LanThis.Where(l => l.Id == ExamTimes && l.id_DM_KhoaHoc == CourseId).FirstOrDefault();
                myqt = db.QuaTrinhThis.Where(q => q.Id_DM_KhoaHoc == CourseId && q.Id_lanThi == ExamTimes && q.IdNhanVien == IdNhanVien).FirstOrDefault();
            }

            if (myqt != null && myqt.BatDauLuc == null)
            {
                chophepluu = true;
            }
            else if (myqt.BatDauLuc != null && myqt.KetThucLuc == null)
            {
                thoigianbatdau = myqt.BatDauLuc.Value;
                thoigianketthuc = thoigianbatdau.AddMinutes(yc.ThoiGianThi.Value);
                if (DateTime.Now <= thoigianketthuc)
                {
                    chophepluu = true;
                }

            }
            if (chophepluu)
            {
                using (var db = new HumanManagementEntities())
                {
                    using (var tran = db.Database.BeginTransaction())
                    {
                        try
                        {
                            bt = db.BaiThis.Where(b => b.Id_DM_KhoaHoc == CourseId && b.IdLanThi == ExamTimes && b.IdNhanVien == IdNhanVien && b.Id == QuestionId).FirstOrDefault();
                            if (bt != null)
                            {
                                bt.DapAn = cautraloi.Trim();
                            }
                            db.SaveChangesAsync().Wait();
                            tran.Commit();
                            return Json("ok", JsonRequestBehavior.AllowGet);
                        }
                        catch
                        {
                            tran.Rollback();
                        }
                    }
                }
            }
            return Json("not ok", JsonRequestBehavior.AllowGet);
        }
        public ActionResult FinishExam(int ExamTimes, int CourseId)
        {
            if (Request.Cookies["TokenKey"] == null)
            {
                return RedirectToAction("SignOut", "UserLogin");
            }
            string accessToken = Request.Cookies["TokenKey"].Value;
            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
            var claims = jwtToken.Claims;
            string stringId = claims.FirstOrDefault(c => c.Type == "Id").ToString().Replace("Id:", "").Trim();

            int IdNhanVien = 0;
            try
            {
                IdNhanVien = int.Parse(stringId);
            }
            catch
            {
            }
            QuaTrinhThi qt;
            using (var db = new HumanManagementEntities())
            { 
                qt = db.Database.SqlQuery<QuaTrinhThi>("exec SPTinhDiem " + CourseId.ToString() + " , " + IdNhanVien.ToString() + " , " + ExamTimes.ToString()).FirstOrDefault();
            }
            return RedirectToAction("JoinTheCourse", new { CourseId = CourseId, slideShow = 3 });
        }
    }
}