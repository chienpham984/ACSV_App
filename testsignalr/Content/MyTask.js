$(document).ready(function () {
    var chat = $.connection.myHub;
    chat.client.NotifyStatusChange = function () {
        getAllMessages();
    };
    $.connection.hub.start().done(function () {
        getAllMessages();
        $('#btnSubmit').click(function () {
            getAllMessages();
        });
    });
   
});

function gotoReport() {
    window.location = '/Task/Report';
}
window.setInterval("checkconnect()", 60000);
function checkconnect() {

    $.ajax({
        type: 'GET',
        url: "/Task/checkconnect",
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
        },
        error: function (resp) {
            alert('Web app can not connect to server');
            window.location = '/Login/Signin';
        }
    });
}

function getAllMessages() {
    var myDate = $('#fltDate').val();
    var tbl = $('#noidung');
    var hub = $.connection.myHub;

    //lam moi lai du lieu
    $.ajax({
        type: 'GET',
        url: "/Task/getListJob",
        data: { myFlightDate: myDate },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                tbl.empty().append("NIL");
            }
            else {
                tbl.empty().append(result.trim());
                scrollToTop();
            }
        },
        error: function () {
            alert('Web app can not connect to server');
            window.location = '/Login/Signin';
        }
    }).done(function () {

        var hub = $.connection.myHub;
        if ($('#ListID').val().toString().trim().length != 0) {
            var array = $('#ListID').val().split(",");
            $.each(array, function (i) {
                hub.server.getin(array[i]);
            });
        }
    });
}

function scrollToTop() {

    //lay gio hien taij
    var aDate = new Date($.now());
    var h = aDate.getHours();
    if (h > 2) h = h - 2;
    else h = 0;
    var m = aDate.getMinutes();
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    var time = h.toString() + m.toString();
    var giohientai = parseInt(time);

    var giobay = '';
    var flightTime = 0;
    //duyet danh sach cbay
    $(".subLine").each(function () {
        giobay = '';
        var _times = $(this).find(".times").val();
        const myArray = _times.split("/")
        giobay = myArray[0];
        if (giobay.trim() == "____") {
            giobay = myArray[1];
        }
        flightTime = parseInt(giobay);
        if (flightTime >= giohientai) {

            $('html,body').animate({
                scrollTop: $(this).offset().top
            }, 1000);
            return false;
        }
    });
}

function AddFlight() {
    var myDate = $('#fltDate').val();
    var myFltNo = $('#fltNo').val();

    $.ajax({
        type: 'GET',
        url: "/Task/AddFlight",
        data: { flightNo: myFltNo, flightDate: myDate },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            getAllMessages();
        },
        error: function () {
            alert('Web app can not connect to server');
            window.location = '/Login/Signin';
        }
    });
}

function DeleteFlight() {
    var myDate = $('#fltDate').val();
    var myFltNo = $('#fltNo').val();

    $.ajax({
        type: 'GET',
        url: "/Task/RemoveFlight",
        data: { flightNo: myFltNo, flightDate: myDate },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            getAllMessages();
        },
        error: function () {
            alert('Web app can not connect to server');
            window.location = '/Login/Signin';
        }
    });
}


//$(document).ready(function () {
//    $('#savechange').hide();
//    $('#deleteflight').hide();
//    var chat = $.connection.myHub;
//    chat.client.broadcastmessage = function () {
//        getAllMessages();
//    };
//    $.connection.hub.start().done(function () {
//        getAllMessages();
//        $('#btnSubmit').click(function () {
//            getAllMessages();
//        });
//    });
//});
//window.setInterval("checkconnect()", 60000);
//function checkconnect() {

//    $.ajax({
//        type: 'GET',
//        url: "/Task/checkconnect",
//        success: function (data) {
//        },
//        error: function (resp) {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    });
//}

//function getAllMessages() {
//    var myDate = $('#fltDate').val();
//    var tbl = $('#noidung');
//    var hub = $.connection.myHub;

//    //xoa groupname cu
//    if ($('#ListID').length > 0) {
//        hub.server.getout($('#ListID').val());
//    }

//    //lam moi lai du lieu
//    $.ajax({
//        type: 'GET',
//        url: "/Task/getListJob",
//        data: { myFlightDate: myDate },
//        contentType: 'application/html ; charset:utf-8',
//        dataType: 'html',
//        success: function (result) {
//            if (result.toString().trim().length == 0) {
//                tbl.empty().append("NIL");
//            }
//            else {
//                tbl.empty().append(result.trim());
//            }
//        },
//        error: function () {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    }).done(function () {
//        //tao group moi
//        var hub = $.connection.myHub;
//        if ($('#ListID').val().toString().trim().length != 0) {
//            var array = $('#ListID').val().split(",");
//            $.each(array, function (i) {
//                hub.server.getin(array[i]);
//            });
//        }
//    });
//}

//function SearchFlight() {
//    var tbl = $('#Result');
//    var myDate = $('#fltDate').val();
//    var myFltNo = $('#fltNo').val();
//    //hide btn delete
//    $('#deleteflight').hide();

//    if (checkDataInput() == false)
//        return;
//    $.ajax({
//        type: 'GET',
//        url: "/Task/search",
//        data: { myFlightDate: myDate, myFlightNo: myFltNo },
//        contentType: 'application/html ; charset:utf-8',
//        dataType: 'html',
//        success: function (data) {
//            if (data.toString().trim().length == 0) {
//                tbl.empty().append("NIL");
//                $('#savechange').hide();
//            }
//            else {
//                tbl.empty().append(data);
//                $('#savechange').show();
//            }
//        },
//        error: function () {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    });

//}

//function checkDataInput() {
//    var myDate = $('#fltDate').val();
//    var myFltNo = $('#fltNo').val();
//    if (myDate.toString().trim() == "") {
//        alert("You have to input Date to search first");
//        $('#fltDate').focus();
//        return false;
//    }
//    if (myFltNo.toString().trim() == "") {
//        alert("You have to input Flight No first");
//        $('#fltNo').focus();
//        return false;
//    }
//    return true;
//}

//$(document).on('click touchstart', '.flightno', function () {
//    //xoa groupname cu
//    if ($('#ListID').length > 0) {
//        var hub = $.connection.myHub;
//        hub.server.getout($('#ListID').val());
//    }
//});

//$(document).on('keypress', '#fltNo', function () {
//    //xoa groupname cu
//    var mess = $('#fltNo').val().toString();
//    if (e.keyCode == 13 && mess.trim().length > 0) {
//        SearchFlight();
//    }
//});


//function SearchDeleteFlight() {
//    var tbl = $('#Result');
//    var myDate = $('#fltDate').val();

//    //hide btn search
//    $('#savechange').hide();

//    //$('#deleteflight').show();

//    $.ajax({
//        type: 'GET',
//        url: "/Task/searchDeleteFlight",
//        data: { myFlightDate: myDate },
//        contentType: 'application/html ; charset:utf-8',
//        dataType: 'html',
//        success: function (data) {
//            if (data.toString().trim().length == 0) {
//                tbl.empty().append("NIL");
//                $('#deleteflight').hide();
//            }
//            else {
//                tbl.empty().append(data);
//                $('#deleteflight').show();
//            }
//        },
//        error: function () {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    });

//}

//function ClearAll() {
//    $('#savechange').hide();
//    $('#deleteflight').hide();
//    $('#Result').empty().append("NIL");
//    $('#fltNo').val("");
//    $('#fltNo').focus();
//}

//function AddFlight() {
//    var listID = "";
//    var i = 0;
//    $("table tr").each(function () {
//        i++;
//        if (i > 1) {
//            var textval = $(this).find("td").eq(0);
//            var chk = textval.find("input:checkbox");
//            if (chk.is(":checked")) {
//                var id = $(this).find("td").eq(1).find("input").val();
//                listID += id.toString().trim() + '_';
//            }
//        }
//    })

//    //if has selected flight. call ajax
//    if (listID != "") {
//        $.ajax({
//            type: 'GET',
//            url: "/Task/addFlight",
//            data: { ListID: listID },
//            contentType: 'application/html ; charset:utf-8',
//            dataType: 'html',
//            success: function (data) {
//                ClearAll();
//                getAllMessages();
//            },
//            error: function () {
//                alert('Web app can not connect to server');
//                window.location = '/Login/Signin';
//            }
//        });
//    }
//    $('.btn-modify').click();
//}

//function DeleteFlight() {
//    if (checkDataInput() == false)
//        return;
//    //kiem tra co ton tai chuyen bay do khong
//    var myDate = $('#fltDate').val();
//    var myFltNo = $('#fltNo').val();
//    var flightno = "";
//    $.ajax({
//        type: 'GET',
//        url: "/Task/checkFlightNo",
//        data: { myFlightDate: myDate, FlightNo: myFltNo },
//        async: false,
//        contentType: 'application/html ; charset:utf-8',
//        dataType: 'html',

//        success: function (data) {
//            if (data.toString().trim().length > 0) {
//                flightno = "OK";
//            }
//        },
//        error: function () {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    });
//    if (flightno == "") {
//        alert('Flight not match');
//        return;
//    }

//    if (confirm("Are you sure to delete " + myFltNo + " ?") == false)
//        return;
//    $.ajax({
//        type: 'GET',
//        url: "/Task/DeleteselectedFlight",
//        data: { myFlightDate: myDate, FlightNo: myFltNo },
//        contentType: 'application/html ; charset:utf-8',
//        dataType: 'html',
//        success: function (data) {
//            ClearAll();
//            getAllMessages();
//        },
//        error: function () {
//            alert('Web app can not connect to server');
//            window.location = '/Login/Signin';
//        }
//    });
//}