using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class LoginModel
    {
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Tên đăng nhập")]
        public string UserName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string PassWord { get; set; }
    }
}