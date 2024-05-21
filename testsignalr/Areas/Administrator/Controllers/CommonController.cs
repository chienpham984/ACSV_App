using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class CommonController : Controller
    {
        // GET: Administrator/Common
        public ActionResult index()
        {
            return View();
        }
        public ActionResult ThongBao()
        {
            return View();
        }
    }
}