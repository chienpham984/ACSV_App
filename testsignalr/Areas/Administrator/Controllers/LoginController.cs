using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult SignIn()
        {
            if (Request.Cookies["AccessToken"] != null)
            {
                string accessToken = Request.Cookies["AccessToken"].Value;
                JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
                var claims = jwtToken.Claims;
                string stringId = claims.FirstOrDefault(c => c.Type == "FullName").ToString().Replace("FullName:", "").Trim();
                Session["TenTaiKhoan"] = stringId;
                return RedirectToAction("ThongBao", "Common");
            }
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SignIn(LoginModel user)
        {
            if (ModelState.IsValid)
            {
                string accessToken = "";
                user.PassWord = EncodePassword(user.PassWord);
                var Content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                var RequestUri = "http://localhost:4000/API/Login/LoginApp";
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
                            HttpCookie accessTokenCookie = new HttpCookie("AccessToken", accessToken);
                            accessTokenCookie.Expires = expirationTime;

                            // Thêm cookie vào response
                            Response.Cookies.Add(accessTokenCookie);

                            // Tạo một ticket với thông tin người dùng và thời gian hết hạn
                            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                                1, // Version
                                user.UserName, // Username
                                DateTime.Now, // Thời gian tạo
                                expirationTime, // Thời gian hết hạn
                                false, // Đặt lại khi chuyển sang HTTPS
                                FormsAuthentication.FormsCookiePath
                            );

                            // Mã hóa ticket thành một chuỗi
                            string encryptedTicket = FormsAuthentication.Encrypt(ticket);

                            // Tạo một cookie và thêm vào response
                            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                            cookie.Expires = expirationTime; // Thiết lập thời gian hết hạn cho cookie
                            Response.Cookies.Add(cookie);
                            JwtSecurityToken jwtToken = new JwtSecurityToken(accessToken);
                            var claims = jwtToken.Claims;
                            string stringId = claims.FirstOrDefault(c => c.Type == "FullName").ToString().Replace("FullName:", "").Trim();
                            Session["TenTaiKhoan"] = stringId;
                            return RedirectToAction("ThongBao", "Common");
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
        public ActionResult SignOut()
        {
            HttpCookie accessTokenCookie = Request.Cookies["AccessToken"];
            if (accessTokenCookie != null)
            {
                accessTokenCookie.Expires = DateTime.Now.AddDays(-1); // Đặt thời gian hết hạn về quá khứ
               Response.Cookies.Add(accessTokenCookie); // Thêm cookie với thời gian hết hạn đã được thiết lập
                Session["TenTaiKhoan"] = "";
            }
            FormsAuthentication.SignOut();
            return RedirectToAction("SignIn", "Login");
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