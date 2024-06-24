using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Controllers
{
    public class ThongBaoController : Controller
    {
        // GET: ThongBao
        public ActionResult Index()
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
            int solonghethan = 0;
            EmpItem dsEmp = new EmpItem();
            List<EmpTracertItem> dsTracert = new List<EmpTracertItem>();
            using (var db = new HumanManagementEntities())
            {
                dsEmp = db.Database.SqlQuery<EmpItem>("exec SPFileUserDetail '" + IdNhanVien.ToString() + "'").FirstOrDefault();
                dsTracert = db.Database.SqlQuery<EmpTracertItem>("exec SPNotificationForUser " + IdNhanVien.ToString() + " ,0").ToList();
            }
            solonghethan = dsTracert.Where(d => d.TinhTrang < 4).Count();
            ViewBag.solonghethan = solonghethan;
            ViewBag.dsEmp = dsEmp;
            ViewBag.TieuDeTrang = "Màn hình thông báo";
            return View(dsTracert);
        }
        public ActionResult ChuKyNhanVien()
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
            ChuKy user;
            using (var db = new HumanManagementEntities())
            {
                user = db.ChuKies.Where(u => u.IdNhanVien == IdNhanVien).FirstOrDefault();
            }
           
            ViewBag.ChuKy = user == null ? "" : user.Signature == null ? "" : "data:image/png;base64," + user.Signature.ToString();
            return View();
        }

        public ActionResult CreateSignature()
        {
            return View();
        }
        [HttpPost]
        public ActionResult SaveSignatureOnWeb(string signatureData)
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
            ChuKy ck;
            string base64Data = signatureData.Replace("data:image/png;base64,", "");
            using (var db = new HumanManagementEntities())
            {
                ck = db.ChuKies.Where(u => u.IdNhanVien == IdNhanVien).FirstOrDefault();
                if (ck != null)
                {
                    ck.Signature = base64Data;
                    try
                    {
                        db.SaveChanges();
                    }
                    catch (Exception ex) { }
                }
                else {
                    ck = new ChuKy();
                    ck.IdNhanVien = IdNhanVien;
                    ck.Signature = base64Data;
                    try
                    {
                        db.ChuKies.Add(ck);
                        db.SaveChanges();
                    }
                    catch (Exception ex) { }
                }
            }
            return RedirectToAction("ChuKyNhanVien");
        }

        [HttpPost]
        public async Task<ActionResult> SaveFromFileSignature(HttpPostedFileBase fileUpload)
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
            string fileName = "";
            string path = "";
            string extension = "";
            if (fileUpload != null && fileUpload.ContentLength > 0)
            {
                if (!System.IO.Directory.Exists(Server.MapPath("~/Content/Signatures/" + IdNhanVien.ToString())))
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Signatures/" + IdNhanVien.ToString()));
                }
                // Lưu hình ảnh vào thư mục trên server
                fileName = Path.GetFileName(fileUpload.FileName);
                path = "~/Content/Signatures/" + IdNhanVien.ToString() + "/" + fileName.Trim();
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
                        path = "~/Content/Signatures/" + IdNhanVien.ToString() + "/" + fileName.Trim();
                        count++;
                    }
                }
                try
                {
                    await System.Threading.Tasks.Task.Run(() => fileUpload.SaveAs(Server.MapPath(path)));
                    byte[] signatureBytes = System.IO.File.ReadAllBytes(Server.MapPath(path));
                    string base64String = Convert.ToBase64String(signatureBytes);
                    base64String= base64String.Replace("data:image/png;base64,", "");
                    using (var db = new HumanManagementEntities())
                    {
                       ChuKy ck = db.ChuKies.Where(u => u.IdNhanVien == IdNhanVien).FirstOrDefault();
                        if (ck != null)
                        {
                            ck.Signature = base64String;
                            try
                            {
                                db.SaveChanges();
                            }
                            catch (Exception ex) { }
                        }
                        else
                        {
                            ck = new ChuKy();
                            ck.IdNhanVien = IdNhanVien;
                            ck.Signature = base64String;
                            try
                            {
                                db.ChuKies.Add(ck);
                                db.SaveChanges();
                            }
                            catch (Exception ex) { }
                        }
                    }
                    return RedirectToAction("ChuKyNhanVien");
                }
                catch { }


                return RedirectToAction("GenerateWordDocument", "Word");
            }
            else
            {
                // Xử lý khi không có hình ảnh được tải lên
                return RedirectToAction("Error");
            }
        }
    }

}