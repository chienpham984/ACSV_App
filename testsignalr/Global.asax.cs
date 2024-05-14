using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace testsignalr
{
    public class MvcApplication : System.Web.HttpApplication
    {
        string connString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            SqlDependency.Stop(connString);
            SqlDependency.Start(connString);
        }
        protected void Application_End()
        {
            SqlDependency.Stop(connString);
        }

        protected void Session_Start()
        {
            Session["FlightDate"] = "";
          
            //if (Request.Cookies["UserHmisInfor"] != null)
            //{
            //    Session["UserName"] = Request.Cookies["UserHmisInfor"]["TenDangNhap"];
            //    Session["PassWord"] = Request.Cookies["UserHmisInfor"]["MatKhau"];
            //}

        }
        protected void Session_End()
        {
            Session.RemoveAll();
        }
    }
}
