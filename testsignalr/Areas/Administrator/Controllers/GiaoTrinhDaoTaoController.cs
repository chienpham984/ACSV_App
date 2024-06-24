using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using testsignalr.Models.ModelData;
using testsignalr.Models.ModelView;
using Aspose.Cells;
using Aspose.Words;

namespace testsignalr.Areas.Administrator.Controllers
{
    public class GiaoTrinhDaoTaoController : Controller
    {
        // GET: Administrator/GiaoTrinhDaoTao
        public ActionResult ShowDoc(int? ParentId)
        {
            List<SiteMenu> dsSiteMenu = new List<SiteMenu>();
            List<GiaoTrinhDaoTao> dsGiaoTrinh = new List<GiaoTrinhDaoTao>();
            string result = "";
            if (ParentId == null)
                ParentId = 0;

            // lấy danh sách sitemenu
            using (var db = new HumanManagementEntities())
            {
                dsSiteMenu = db.SiteMenus.Where(s => s.ParentId == ParentId).OrderBy(s => s.MenuName.Trim()).ToList();
                dsGiaoTrinh = db.GiaoTrinhDaoTaos.Where(g => g.MenuId == ParentId && g.TrangThai == true).OrderBy(g => g.NgayBanHanh).ToList();
            }
            getPath(ParentId == null ? 0 : ParentId.Value, ref result);
            ViewBag.DuongDan = result;
            ViewBag.dsGiaoTrinh = dsGiaoTrinh;
            ViewBag.MenuID = ParentId;
            return View(dsSiteMenu);
        }
        public void getPath(int id, ref string result)
        {
            SiteMenu sm;
            try
            {
                using (var db = new HumanManagementEntities())
                {
                    sm = db.SiteMenus.Where(s => s.Id == id).FirstOrDefault();
                    if (sm != null)
                    {
                        result = sm.MenuName + "/" + result;
                        getPath(sm.ParentId.Value, ref result);
                    }
                    else {
                        if (result == "")
                            result = "ROUTE";
                        else
                            result = result = "ROUTE/" + result;
                    }
                }
                
            }
            catch (Exception ex)
            {
                result = "";
            }
        }
        public ActionResult checkCategoryExisted(int ParentMenuID, string MenuName)
        {
            string giatri = "";

            SiteMenu myobj;
            using (var db = new HumanManagementEntities())
            {
                myobj = db.SiteMenus.Where(s => s.ParentId == ParentMenuID && s.MenuName.ToUpper().Trim().Equals(MenuName.ToUpper().Trim())).FirstOrDefault();
            }
            if (myobj != null)
                giatri = "Exists";
            var mydata = new { giatri = giatri };
            return Json(mydata, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveNewCategory(string MenuName, int ParentId)
        {
            SiteMenu mySite = new SiteMenu();
            mySite.MenuName = MenuName.Trim();
            mySite.ParentId = ParentId;
            using (var db = new HumanManagementEntities())
            {
                db.SiteMenus.Add(mySite);
                db.SaveChanges();
            }
            return RedirectToAction("ShowDoc", new { ParentId= ParentId });
        }

        [HttpPost]
        public ActionResult SaveNewDocument(GiaoTrinhDaoTao myObj, HttpPostedFileBase fileUpload)
        {
            string path = "~/Content/Doc/GiaoTrinhDaoTao/" + myObj.MenuId.ToString();
            if (!System.IO.Directory.Exists(Server.MapPath(path)))
            {
                System.IO.Directory.CreateDirectory(Server.MapPath(path));
            }
            path = "~/Content/Doc/GiaoTrinhDaoTao/" + myObj.MenuId.ToString() + "/" + fileUpload.FileName;
            string extension = Path.GetExtension(fileUpload.FileName);
            //1. luu file len server
            System.Threading.Tasks.Task t = new System.Threading.Tasks.Task(() =>
            {
                fileUpload.SaveAs(Server.MapPath(path));
            }
                 );
            t.Start();
            t.Wait();
            myObj.NgayTao = DateTime.Now;
            myObj.UserId = 1;
            myObj.Path = path.Replace("~","");
            myObj.TrangThai = true;
            myObj.FileType = extension.Replace(".","").ToUpper();
            using (var db = new HumanManagementEntities())
            {
                db.GiaoTrinhDaoTaos.Add(myObj);
                db.SaveChanges();
            }
            return RedirectToAction("ShowDoc", new { ParentId = myObj.MenuId });
        }

        public ActionResult DisplayFilePdf(string officeFilePath)
        {
            return File(officeFilePath, "application/pdf");
        }
        public ActionResult DisplayPowerPointToPdf(string officeFilePath)
        {
            return File(officeFilePath, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        }
        public ActionResult DisplayPictureToPdf(string officeFilePath)
        {
            return File(officeFilePath, "image/jpeg");
        }
        public ActionResult DisplayPdf(string officeFilePath)
        {
            // Convert Office file to PDF
            byte[] pdfBytes = null;
            try
            {
                pdfBytes = ConvertToPdf(officeFilePath);
            }
            catch
            {
                return null;
            }
            // Return the PDF as a FileStreamResult
            return new FileStreamResult(new MemoryStream(pdfBytes), "application/pdf");
        }
        private byte[] ConvertToPdf(string officeFilePath)
        {
            var doc = new Aspose.Words.Document(officeFilePath);

            using (var pdfStream = new MemoryStream())
            {
                doc.Save(pdfStream, Aspose.Words.SaveFormat.Pdf);

                return pdfStream.ToArray();
            }
        }
        public ActionResult DisplayExcelPdf(string officeFilePath)
        {
            byte[] pdfBytes = null;
            try
            {
                pdfBytes = ConvertExcelToPdf(officeFilePath);
            }
            catch
            {
                return null;
            }
            // Return the PDF as a FileStreamResult
            return new FileStreamResult(new MemoryStream(pdfBytes), "application/pdf");
        }
        private byte[] ConvertExcelToPdf(string officeFilePath)
        {
            var workbook = new Workbook(officeFilePath);

            // Create a memory stream to store the PDF
            using (var pdfStream = new MemoryStream())
            {
                // Save Excel as PDF to the memory stream
                workbook.Save(pdfStream, Aspose.Cells.SaveFormat.Pdf);

                // Convert memory stream to byte array
                return pdfStream.ToArray();
            }
        }

        public ActionResult OpenFile(int fileId)
        {
            //lay thong tin file
            GiaoTrinhDaoTao doc;
            using (var db = new HumanManagementEntities())
            {
                doc = db.GiaoTrinhDaoTaos.Where(d => d.Id == fileId).FirstOrDefault();
            }
            if (doc == null)
                return Json("File không tồn tại", JsonRequestBehavior.AllowGet);


            string filePath = doc.Path.Trim();

            string fileExtension = doc.FileType.ToLower().Trim();
            string fileName = doc.TenTaiLieu.Trim();
            switch (fileExtension)
            {
                case "txt":
                    {
                        ViewBag.fileName = fileName;
                        string textContent = System.IO.File.ReadAllText(Server.MapPath("~" + filePath));
                        Response.ContentType = "text/plain";
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/ViewTxtFile.cshtml", textContent);
                    }
                case "doc":
                case "docx":
                    {
                        ViewBag.fileName = fileName;
                        ViewBag.path = Server.MapPath("~" + filePath);
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/viewOfficeFile.cshtml");
                    }
                case "xls":
                case "xlsx":
                    {
                        ViewBag.fileName = fileName;
                        ViewBag.path = Server.MapPath("~" + filePath);
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/ViewExcelFile.cshtml");
                    }
                case "ppt":
                case "pptx":
                    {
                        ViewBag.fileName = fileName;
                        ViewBag.path = Server.MapPath("~" + filePath);
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/ViewPowerPointlFile.cshtml");
                    }
                case "jpeg":
                case "jpg":
                case "png":
                case "gif":
                    {
                        ViewBag.fileName = fileName;
                        ViewBag.path = Server.MapPath("~" + filePath);
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/ViewPictureFile.cshtml");
                    }
                case "pdf":
                    {
                        ViewBag.fileName = fileName;
                        ViewBag.path = Server.MapPath("~" + filePath);
                        return PartialView("~/Areas/Administrator/Views/GiaoTrinhDaoTao/ViewPdfFile.cshtml");
                    }
                default:
                    return Json("File không mở trực tiếp trên trình duyệt, tải xuống để xem", JsonRequestBehavior.AllowGet);
            }
        }
    }


}