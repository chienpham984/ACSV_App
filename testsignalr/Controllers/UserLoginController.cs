using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Controllers
{
    public class UserLoginController : Controller
    {
        // GET: UserLogin
        public ActionResult DangNhap(string message)
        {
            
            return View();
        }

        public ActionResult SignIn()
        {
            if (Request.Cookies["TokenKey"] != null)
            {
                string accessToken = Request.Cookies["TokenKey"].Value;
                JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
                var claims = jwtToken.Claims;
                string stringId = claims.FirstOrDefault(c => c.Type == "HoTen").ToString().Replace("HoTen:", "").Trim();
                Session["HoTen"] = stringId;
                return RedirectToAction("Index", "ThongBao");
            }
            return View();
        }
        public ActionResult SignOut()
        {
            HttpCookie accessTokenCookie = Request.Cookies["TokenKey"];
            if (accessTokenCookie != null)
            {
                accessTokenCookie.Expires = DateTime.Now.AddDays(-1); // Đặt thời gian hết hạn về quá khứ
                Response.Cookies.Add(accessTokenCookie); // Thêm cookie với thời gian hết hạn đã được thiết lập
                Session["HoTen"] = "";
            }
            //FormsAuthentication.SignOut();
            return RedirectToAction("SignIn", "UserLogin");
        }
        [HttpPost]
        public async Task<ActionResult> SignIn(LoginModel user)
        {
            if (ModelState.IsValid)
            {
                string accessToken = "";
                user.PassWord = EncodePassword(user.PassWord);
                var Content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                var RequestUri = "http://localhost:4000/API/Login/UserLogin";
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    try
                    {
                        var response = await client.PostAsync(RequestUri, Content);
                        if (response.IsSuccessStatusCode)
                        {
                            //System.Web.Security.FormsAuthentication.SetAuthCookie(user.UserName, false);
                            var responseData = await response.Content.ReadAsStringAsync();
                            apiResponse result = JsonConvert.DeserializeObject<apiResponse>(responseData);
                            accessToken = result.Data.ToString();
                            DateTime expirationTime = DateTime.Now.AddDays(1);

                            // Tạo một đối tượng cookie
                            HttpCookie accessTokenCookie = new HttpCookie("TokenKey", accessToken);
                            accessTokenCookie.Expires = expirationTime;

                            // Thêm cookie vào response
                            Response.Cookies.Add(accessTokenCookie);
                            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
                            var claims = jwtToken.Claims;
                            string stringId = claims.FirstOrDefault(c => c.Type == "HoTen").ToString().Replace("HoTen:", "").Trim();
                            Session["HoTen"] = stringId;
                            return RedirectToAction("Index", "ThongBao");
                        }
                        else
                        {
                            HttpCookie userinfor = new HttpCookie("ReadAndSign");
                            userinfor.Expires = DateTime.Now.AddDays(-1);
                            ModelState.AddModelError("UserName", "Tên tài khoản hoặc Mật khẩu không đúng.");
                            return View(user);
                        }
                    }
                    catch
                    {

                    }
                }
            }
            ModelState.AddModelError("UserName", "Tên tài khoản hoặc Mật khẩu không đúng.");
            return View(user);
        }
        public ActionResult GetPassword(string Email)
        {
            string result = "";
            string ToMail = "";
            
            string Password = "";
            using (var db = new HumanManagementEntities())
            {
                

                if (Password != "")
                {
                    ToMail = Email.Trim();
                    string smtpAddress = "smtp.gmail.com";
                    int portNumber = 587;
                    bool enableSSL = true;
                    string emailFrom = "messages@hgs.vn";
                    string password = "Hgs@2022";
                    string body = "";
                    try
                    {
                        using (System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage())
                        {
                            mail.To.Add(ToMail);
                            mail.From = new System.Net.Mail.MailAddress(emailFrom);
                            mail.Subject = "Thông tin đăng nhập [No reply]";
                            body = "<b>Kính chào Anh/ Chị, </b> <br/>";
                            body += "Hệ thống xin gửi tới Anh/ Chị thông tin tài khoản đăng nhập như sau:  <br/>";

                            body += "Email: " + Email.Trim() + "<br/>";
                            body += "Mật khẩu: " + Password.Trim() + "<br/>";
                            body += "Liên kết truy cập : <a href='http://113.190.42.178:8484/HeThong/DangNhap'> Click here</a> <br/> <br/>";

                            body += "<i>Chúc Anh/ Chị một ngày làm việc vui vẻ.</i>";
                            mail.Body = body;
                            mail.IsBodyHtml = true;
                            using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                            {
                                smtp.Credentials = new NetworkCredential(emailFrom, password);
                                smtp.EnableSsl = enableSSL;
                                smtp.Send(mail);
                            }
                            result = "Hệ thống đã gửi mật khẩu tới mail của bạn. Truy cập mail để xem thông tin";
                        }
                    }
                    catch
                    {
                        result = "Hệ thống gặp lỗi khi gửi mail";
                    }
                }
                else
                {
                    result = Email.Trim() + " không tồn tại trong hệ thống";
                }
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public string DecodePassword(string encodedText)
        {
            if (encodedText == null)
            {
                return null;
            }

            var base64EncodedBytes = System.Convert.FromBase64String(encodedText);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }


        public string EncodePassword(string data)
        {
            string encodedData = "";
            try
            {
                byte[] encData_byte = new byte[data.Length];
                encData_byte = System.Text.Encoding.UTF8.GetBytes(data);
                encodedData = Convert.ToBase64String(encData_byte);
            }
            catch (Exception)
            {
                throw;
            }

            return encodedData;
        }
    }
}