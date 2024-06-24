using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace testsignalr.Models.ModelView
{
    public class QuestionItem
    {
        public int questionId { get; set; }
        public int idChungChi { get; set; }
        public string cauHoi { get; set; }
        public string duongDan { get; set; }
        public string tenMucDo { get; set; }
        public List<AnswerItem> dapAns { get; set; }
    }
    public class AnswerItem
    {
        public int answerId { get; set; }
        public int idCauHoi { get; set; }
        public string traLoi { get; set; }
        public string duongDan { get; set; }
        public bool dapAnDung { get; set; }

    }
}
