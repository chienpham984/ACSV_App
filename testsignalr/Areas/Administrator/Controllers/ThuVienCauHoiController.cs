using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using testsignalr.Filters;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    [CustomAuthorize]
    public class ThuVienCauHoiController : Controller
    {
        // GET: Administrator/ThuVienCauHoi
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Showall()
        {
            List<DanhMucChungChi> dsChungChi = new List<DanhMucChungChi>();
            using (var db = new HumanManagementEntities())
            {
                dsChungChi = db.DanhMucChungChis.OrderBy(c => c.MaChungChi).ToList();
            }
            ViewBag.TieuDeTrang = "Ngân hàng câu hỏi theo chứng chỉ";
            return View(dsChungChi);
        }

        public async Task<ActionResult> getAllQuestionByTracert(int TracertId)
        {
            List<QuestionItem> ListQuestion = new List<QuestionItem>();
            var RequestUri = "http://localhost:4000/api/ACSV_QuestionLib/Index?TracertId=" + TracertId.ToString();
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Trim());
                try
                {
                    var response = await client.GetAsync(RequestUri);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();
                        ResponseApi res = JsonConvert.DeserializeObject<ResponseApi>(responseData);
                        ListQuestion = JsonConvert.DeserializeObject<List<QuestionItem>>(res.Data.ToString());
                    }
                    else
                    {
                    }
                }
                catch
                {

                }
            }
            ViewBag.TieuDeTrang = "Ngân hàng câu hỏi theo chứng chỉ";
            if (ListQuestion.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/ThuVienCauHoi/_ListQuestionDetail.cshtml", ListQuestion);
        }

        public async Task<ActionResult> PreviewAllQuestionByTracert(int TracertId)
        {
            List<QuestionItem> ListQuestion = new List<QuestionItem>();
            var RequestUri = "http://localhost:4000/api/ACSV_QuestionLib/Index?TracertId=" + TracertId.ToString();
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Trim());
                try
                {
                    var response = await client.GetAsync(RequestUri);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();
                        ResponseApi res = JsonConvert.DeserializeObject<ResponseApi>(responseData);
                        ListQuestion = JsonConvert.DeserializeObject<List<QuestionItem>>(res.Data.ToString());
                    }
                    else
                    {
                    }
                }
                catch
                {

                }
            }
            ViewBag.TieuDeTrang = "Ngân hàng câu hỏi theo chứng chỉ";
            if (ListQuestion.Count == 0)
                return Json("Data is empty", JsonRequestBehavior.AllowGet);
            else return PartialView("~/Areas/Administrator/Views/ThuVienCauHoi/PreviewAllQuestionByTracert.cshtml", ListQuestion);
        }
        public ActionResult ThemMoiCauHoi(int TracertId)
        {
            return View();
        }
    }
}