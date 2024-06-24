var m// Phút
var s // Giây
var CourseId;
function start() {
    if (s === -1) {
        m -= 1;
        s = 59;
    }

    if (m < 0) {
        clearTimeout(timeout);
        var c = confirm("Het gio");
        var _Examtimes = $('#Times').val();
        var courseId = $('#CourseId').val();
        window.location.href = "/TrainingCourse/FinishExam?ExamTimes=" + _Examtimes.toString() + "&CourseId=" + courseId.toString();
        return false;
    }
    if (m <= 3) {
        $('#time').css("font-size", "22px");
    }
    else if (m <= 2) {
        $('#time').css("font-size", "30px");
    }
    else if (m <= 1) {
        $('#time').css("font-size", "36px");
    }

    $('#phut').html(m.toString());
    $('#giay').html(s.toString());

    /*BƯỚC 1: GIẢM PHÚT XUỐNG 1 GIÂY VÀ GỌI LẠI SAU 1 GIÂY */
    timeout = setTimeout(function () {
        s--;
        start();
    }, 1000);
}

$(document).ready(function () {
    function preventBack() { window.history.back(); }
    setTimeout("preventBack()", 0);
    window.onunload = function () { null };
    getdata();
    m = $("#phut").html(); // Phút
    s = $("#giay").html();
    start();
});
function signout() {
    var _email = $('#email').val();
    alert('Tài khoản ' + _email.toString() + ' được truy cập từ thiết bị khác');
    var _Examtimes = $('#Times').val();
    window.location.href = "/TrainingCourse/FinishExam?ExamTimes=" + _Examtimes.toString();
}
window.setInterval("gettimes()", 60000);

function gettimes() {
    var examtime = $('#Times').val();
    var courseId = $('#CourseId').val();
  
    $.ajax({
        type: 'GET',
        data: { ExamTimes: examtime, CourseId: courseId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        url: "/TrainingCourse/getTimeFromServer",
        success: function (data) {
            var result = data.toString().trim().substring(1, data.toString().trim().length - 1);
            var array = result.split("_");
            var phut = parseInt(array[0].trim());
            var giay = parseInt(array[1].trim());
            if (phut < 0 || giay<0) {
                window.location.href = "/Exam/FinishExam";
            }
            else {
                clearTimeout(timeout);
                m = phut;
                s = giay
                if (m >= 0 && s >= 0) {
                    m = phut;
                    s = giay
                    $('#phut').html(array[0].trim());
                    $('#giay').html(array[1].trim());
                    start();
                }
            }

        },
        error: function (resp) {
            alert('Web app can not connect to server');
            window.location = '/Exam/Login';
        }
    });
}
function getdata() {
    var examtime = $('#Times').val();
    var courseId = $('#CourseId').val();
    
    $.ajax({
        type: 'GET',
        url: "/TrainingCourse/getMapQuestion",
        data: { ExamTimes: examtime, CourseId: courseId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                $(".map").empty().append("");
            }
            else {
                $(".map").empty().append(result);
            }
            $.ajax({
                type: 'GET',
                url: "/TrainingCourse/getListQuestion",
                data: { ExamTimes: examtime, CourseId: courseId},
                contentType: 'application/html ; charset:utf-8',
                dataType: 'html',
                success: function (result) {
                    if (result.toString().trim().length == 0) {
                        $(".dethi").empty().append("");
                    }
                    else {

                        $(".dethi").empty().append(result);
                    }
                },
                error: function () {
                    alert('Có lỗi trong quá trình tải dữ liệu. Liên hệ IT');
                    $(".dethi").empty().append('');
                },
                complete: function () {
                    $(".traloi tr").click(function (event) {
                        var a = $('.traloi tr').index(this);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".danhsachdethi tr:eq(" + a + ")").offset().top - 100
                        }, 100);
                    });
                    $(".radioButton").on("click", function () {
                        var currentID = $(this).attr('id');
                        var QuestionId = $(this).attr('name');
                        $.ajax({
                            type: 'GET',
                            url: "/TrainingCourse/saveAnswer",
                            data: { QuestionId: QuestionId, cautraloi: currentID, ExamTimes: examtime, CourseId: courseId },
                            success: function (data) {
                                if (data.trim() != "ok")
                                    alert("Lưu thất bại");
                            },
                            error: function () {
                                alert("Lưu thất bại");
                            }
                        });
                        var currentPos = $(this).parents('TR').index();
                        if (currentID == "A") {
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("background-color", "white");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("color", "black");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.a').css("background-color", "green");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.a').css("color", "white");
                        }
                        else if (currentID == "B") {
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("background-color", "white");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("color", "black");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.b').css("background-color", "green");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.b').css("color", "white");
                        }
                        else if (currentID == "C") {
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("background-color", "white");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("color", "black");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.c').css("background-color", "green");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.c').css("color", "white");
                        }
                        else if (currentID == "D") {
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("background-color", "white");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("color", "black");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.d').css("background-color", "green");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.d').css("color", "white");
                        }
                        else if (currentID == "E") {
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("background-color", "white");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.button').css("color", "black");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.e').css("background-color", "green");
                            $('.traloi tr:eq(' + currentPos + ') .aaaa').find('.e').css("color", "white");
                        }
                        $('.traloi tr td').removeClass("selected");
                        $('.traloi tr:eq(' + currentPos + ') td').addClass("selected");
                    });

                }
            });



        },
        error: function () {
            alert('Có lỗi trong quá trình tải dữ liệu. Liên hệ IT HGS');
          /*  $(".map").empty().append('');*/
        },
        complete: function () {
        }
    });

    



}
function finishExam() {
    var ketqua = false;
    var vitri = 0;
    var danhsach = "Ban chua tra loi ";
    var questionId = 0;
    var answer = "";
    if (m >= 0) {
        $(".danhsachdethi tr td").each(function () {
            vitri = $(this).find(".stt").html();
            ketqua = false;
            $(this).find('.radioButton').each(function () {
                if ($(this).is(":checked")) {
                    ketqua = true;
                }
            });
            if (ketqua == false) {
                danhsach = danhsach + vitri + ", ";
            }
        });
        if (danhsach != "Ban chua tra loi ") {
            var c = confirm(danhsach);
            return false;
        }
    }
    return true;
    //truong hop da lam het cac cau hoi thi luu vao;
    //duyet tung td. va luu vao db
    //danhsach = "";
    //$(".danhsachdethi tr td").each(function () {

    //    $(this).find('.custom-control-input').each(function () {
    //        if ($(this).is(":checked")) {
    //            questionId = $(this).attr('name');
    //            answer = $(this).attr('id');
    //            danhsach = danhsach + "," + questionId.toString() + "_" + answer;
    //        }
    //    });
    //});
    //if (danhsach != "") {
    //    $.ajax({
    //        type: 'GET',
    //        url: "/Exam/LuuBaiThi",
    //        data: { listAnswer: danhsach },
    //        contentType: 'application/html ; charset:utf-8',
    //        dataType: 'html',
    //        success: function (result) {
    //            //window.location = '/Exam/getStarted?ID_DM_khoaHoc=' + result;
    //            return true;
    //        },
    //        error: function () {
    //            var c = confirm("co loi trong qua trinh luu, lien he IT");
    //            return false;
    //        },
    //        complete: function () {
    //            return true;
    //        }
    //    });
    //}


}
