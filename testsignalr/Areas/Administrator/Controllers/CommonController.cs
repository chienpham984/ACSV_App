using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using testsignalr.Filters;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    [CustomAuthorize]
    public class CommonController : Controller
    {
        // GET: Administrator/Common
        public ActionResult index()
        {
            return View();
        }
        public ActionResult ThongBao()
        {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
            List<EmpTracertItem> temp = new List<EmpTracertItem>();
            List<DanhMucCongTy> dsCongTy = new List<DanhMucCongTy>();
            List<ChungChiItem> TongHopChungChi = new List<ChungChiItem>();
            List<OutSourceEmpTracertItem> dsOutSourceTracert = new List<OutSourceEmpTracertItem>();
            List<OutSourceEmpTracertItem> outTemp = new List<OutSourceEmpTracertItem>();
            List<EmpItem> dsEmp = new List<EmpItem>();
            List<EmpItem> empTemp = new List<EmpItem>();
            List<ContractItem> dsContract = new List<ContractItem>();
            List<ContractItem> tempContract = new List<ContractItem>();
            using (var db = new HumanManagementEntities())
            {
                dsCongTy = db.DanhMucCongTies.ToList();
                dsOutSourceTracert = db.Database.SqlQuery<OutSourceEmpTracertItem>("exec SPGetListOutSourceEmployeeTracert ").ToList();
                foreach (var item in dsCongTy)
                {
                    dsEmp = db.Database.SqlQuery<EmpItem>("exec SPGetAllEmployee '" + item.MaCongTy.Trim() + "'").ToList();
                    dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPNotificationEmployeeTracert '" + item.MaCongTy.Trim() + "',0").ToList();

                    if (dsTracert.Count > 0)
                    {
                        temp = dsTracert.Where(d => d.TinhTrang == 1).ToList();
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Chứng chỉ hết hạn";
                        sub.FieldValue = temp.Count();
                        sub.cssName = "textBoldhetHan";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoChungChi?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=1";
                        TongHopChungChi.Add(sub);
                        temp = dsTracert.Where(d => d.TinhTrang == 2).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn chứng chỉ dưới 15 ngày";
                        sub.FieldValue = temp.Count();
                        sub.cssName = "textBoldsapHetHan15";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoChungChi?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=2";
                        TongHopChungChi.Add(sub);
                        temp = dsTracert.Where(d => d.TinhTrang == 3).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn chứng chỉ từ 15 đến 30 ngày"; ;
                        sub.FieldValue = temp.Count();
                        sub.cssName = "textBoldsapHetHan30";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoChungChi?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=3";
                        TongHopChungChi.Add(sub);
                    }
                    else
                    {
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Chứng chỉ hết hạn";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn chứng chỉ dưới 15 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Chứng chỉ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn chứng chỉ từ 15 đến 30 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                    }

                    //the nhan vien
                    if (dsEmp.Count > 0)
                    {
                        empTemp = dsEmp.Where(d => d.TinhTrangTheLamViec == 1).ToList();
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Thẻ đã hết hạn";
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldhetHan";
                        TongHopChungChi.Add(sub);
                        empTemp = dsEmp.Where(d => d.TinhTrangTheLamViec == 2).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn thẻ còn lại dưới 15 ngày";
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldsapHetHan15";
                        TongHopChungChi.Add(sub);
                        empTemp = dsEmp.Where(d => d.TinhTrangTheLamViec == 3).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn thẻ còn lại từ 15 đến 30 ngày"; ;
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldsapHetHan30";
                        TongHopChungChi.Add(sub);
                    }
                    else
                    {
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Thẻ đã hết hạn";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn thẻ còn lại dưới 15 ngày";
                        sub.cssName = "";
                        sub.FieldValue = 0;
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Thẻ nhân viên";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn thẻ còn lại từ 15 đến 30 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                    }

                    //Ly lich tu phap
                    if (dsEmp.Count > 0)
                    {
                        empTemp = dsEmp.Where(d => d.TinhTrangLyLich == 1).ToList();
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Lý lịch tư pháp đã hết hạn";
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldhetHan";
                        TongHopChungChi.Add(sub);
                        empTemp = dsEmp.Where(d => d.TinhTrangLyLich == 2).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn lý lịch tư pháp còn lại dưới 15 ngày";
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldsapHetHan15";
                        TongHopChungChi.Add(sub);
                        empTemp = dsEmp.Where(d => d.TinhTrangLyLich == 3).ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn lý lịch tư pháp còn lại từ 15 đến 30 ngày"; ;
                        sub.FieldValue = empTemp.Count();
                        sub.cssName = "textBoldsapHetHan30";
                        TongHopChungChi.Add(sub);
                    }
                    else
                    {
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Lý lịch tư pháp đã hết hạn";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn lý lịch tư pháp còn lại dưới 15 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Lý lịch tư pháp";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn lý lịch tư pháp còn lại từ 15 đến 30 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                    }

                    //Hop dong
                    if (dsEmp.Count > 0)
                    {
                        tempContract = db.Database.SqlQuery<ContractItem>("exec SPNotificationEmployeeContract '" + item.MaCongTy.Trim() + "',1").ToList();
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hợp đồng lao động đã hết hạn";
                        sub.FieldValue = tempContract.Count();
                        sub.cssName = "textBoldhetHan";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoHopDong?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=1";
                        TongHopChungChi.Add(sub);
                        tempContract = db.Database.SqlQuery<ContractItem>("exec SPNotificationEmployeeContract '" + item.MaCongTy.Trim() + "',2").ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn hợp đồng lao động còn lại dưới 15 ngày";
                        sub.FieldValue = tempContract.Count();
                        sub.cssName = "textBoldsapHetHan15";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoHopDong?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=2";
                        TongHopChungChi.Add(sub);
                        tempContract = db.Database.SqlQuery<ContractItem>("exec SPNotificationEmployeeContract '" + item.MaCongTy.Trim() + "',3").ToList();
                        sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn hợp đồng lao động còn lại từ 15 đến 30 ngày"; ;
                        sub.FieldValue = tempContract.Count();
                        sub.cssName = "textBoldsapHetHan30";
                        sub.Link = "/Administrator/Common/ChiTietThongBaoHopDong?MaCongTy=" + item.MaCongTy.Trim() + "&TinhTrang=3";
                        TongHopChungChi.Add(sub);
                    }
                    else
                    {
                        var sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hợp đồng lao động đã hết hạn";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn hợp đồng lao động còn lại dưới 15 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                        sub = new ChungChiItem();
                        sub.TieuDe = "Hợp đồng lao động";
                        sub.MaCongTy = item.MaCongTy.Trim();
                        sub.FieldName = "Hạn hợp đồng lao động còn lại từ 15 đến 30 ngày";
                        sub.FieldValue = 0;
                        sub.cssName = "";
                        TongHopChungChi.Add(sub);
                    }
                }

                //chung chi dao tao nhan vien ngoai cong ty
                if (dsOutSourceTracert.Count > 0)
                {
                    outTemp = dsOutSourceTracert.Where(d => d.TinhTrang == 1).ToList();
                    var sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Chứng chỉ hết hạn";
                    sub.FieldValue = outTemp.Count();
                    sub.cssName = "textBoldhetHan";
                    TongHopChungChi.Add(sub);
                    outTemp = dsOutSourceTracert.Where(d => d.TinhTrang == 2).ToList();
                    sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Hạn chứng chỉ dưới 15 ngày";
                    sub.FieldValue = outTemp.Count();
                    sub.cssName = "textBoldsapHetHan15";
                    TongHopChungChi.Add(sub);
                    outTemp = dsOutSourceTracert.Where(d => d.TinhTrang == 3).ToList();
                    sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Hạn chứng chỉ từ 15 đến 30 ngày";
                    sub.FieldValue = outTemp.Count();
                    sub.cssName = "textBoldsapHetHan30";
                    TongHopChungChi.Add(sub);
                }
                else
                {
                    var sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Chứng chỉ hết hạn";
                    sub.FieldValue = 0;
                    TongHopChungChi.Add(sub);
                    sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Hạn chứng chỉ dưới 15 ngày";
                    sub.FieldValue = 0;
                    TongHopChungChi.Add(sub);
                    sub = new ChungChiItem();
                    sub.TieuDe = "Chứng chỉ nhân viên Ngoài";
                    sub.MaCongTy = "";
                    sub.FieldName = "Hạn chứng chỉ từ 15 đến 30 ngày";
                    sub.FieldValue = 0;
                    TongHopChungChi.Add(sub);
                }
            }
            ViewBag.dsCongTy = dsCongTy;
            ViewBag.TieuDeTrang = "Thông báo chung";
            return View(TongHopChungChi);
        }
        public ActionResult ChiTietThongBaoChungChi(string MaCongTy, int TinhTrang)
        {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
            DanhMucCongTy myComp;
            string tenCongTy = "";
            using (var db = new HumanManagementEntities())
            {
                myComp = db.DanhMucCongTies.Where(c => c.MaCongTy.Trim().Equals(MaCongTy.Trim())).FirstOrDefault();
                dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPNotificationEmployeeTracert '" + MaCongTy.Trim() + "'," + TinhTrang.ToString()).ToList();
            }
            tenCongTy = myComp == null ? "" : myComp.TenCongTy.Trim();
            ViewBag.dsTracert = dsTracert;
            if (TinhTrang == 1)
                ViewBag.TieuDeTrang = "Danh sách chứng chỉ hết hạn - " + tenCongTy;
            else if (TinhTrang == 2)
                ViewBag.TieuDeTrang = "Danh sách chứng chỉ hạn còn dưới 15 ngày - " + tenCongTy;
            else if (TinhTrang == 3)
                ViewBag.TieuDeTrang = "Danh sách chứng chỉ hạn trong khoảng từ 15 đến 30 ngày - " + tenCongTy;
            else
                ViewBag.TieuDeTrang = "";
            return View();
        }

        public ActionResult ChiTietThongBaoHopDong(string MaCongTy, int TinhTrang)
        {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            List<ContractItem> dsContract = new List<ContractItem>();
            DanhMucCongTy myComp;
            string tenCongTy = "";
            using (var db = new HumanManagementEntities())
            {
                myComp = db.DanhMucCongTies.Where(c => c.MaCongTy.Trim().Equals(MaCongTy.Trim())).FirstOrDefault();
                dsContract = db.Database.SqlQuery<ContractItem>("exec SPNotificationEmployeeContract '" + MaCongTy.Trim() + "'," + TinhTrang.ToString()).ToList();
            }
            tenCongTy = myComp == null ? "" : myComp.TenCongTy.Trim();
            ViewBag.dsContract = dsContract;
            if (TinhTrang == 1)
                ViewBag.TieuDeTrang = "Danh sách Hợp đồng hết hạn - " + tenCongTy;
            else if (TinhTrang == 2)
                ViewBag.TieuDeTrang = "Danh sách Hợp đồng hạn còn dưới 15 ngày - " + tenCongTy;
            else if (TinhTrang == 3)
                ViewBag.TieuDeTrang = "Danh sách Hợp đồng hạn trong khoảng từ 15 đến 30 ngày - " + tenCongTy;
            else
                ViewBag.TieuDeTrang = "";
            return View();
        }

        public ActionResult DoiMatKhau()
        {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            return View();
        }
        [HttpPost]
        public ActionResult DoiMatKhau(ChangePasswordModal model)
        {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            //lay ID nguoi dung
            string idNguoiDung = Session["Id"] == null ? "" : Session["Id"].ToString();
            int id = 0;
            try
            {
                id = int.Parse(idNguoiDung);
            }
            catch { }
            TaiKhoan user;
            string matkhaucu = model.OldPassword.Trim();

            if (ModelState.IsValid)
            {
                using (var db = new HumanManagementEntities())
                {
                    user = db.TaiKhoans.Where(t => t.Id == id && t.MatKhau.Trim().Equals(matkhaucu)).FirstOrDefault();
                    if (user != null)
                    {
                        user.MatKhau = model.NewPassword.Trim();
                        db.SaveChanges();
                    }
                    else
                    {
                        ModelState.AddModelError("OldPassword", "Mật khẩu cũ không đúng.");
                        return View(model);
                    }
                }
                return RedirectToAction("ChangePasswordSuccess");
            }

            // Nếu ModelState không hợp lệ, hiển thị lại form
            return View(model);
        }

        public ActionResult ChangePasswordSuccess() {
            if (Request.Cookies["AccessToken"] == null)
            {
                return RedirectToAction("SignOut", "Login");
            }
            return View();
        }

        public ActionResult ondemain()
        {
            if (Request.Cookies["AccessToken"] != null)
            {
                // Lấy giá trị của AccessToken từ cookie
                string accessToken = Request.Cookies["AccessToken"].Value;
                JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
                var claims = jwtToken.Claims;
                string ListView = claims.FirstOrDefault(c => c.Type == "ListView").ToString().Replace("ListView:", "").Trim(); // "sub" is the standard claim for subject (usually the user ID or username)
                ViewBag.ListView = ListView;
                return View();
            }
            else
                return RedirectToAction("SignOut", "Login");
        }
    }
}

