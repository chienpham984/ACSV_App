var timeNow;
var allowEdit = false;
$(document).ready(function () {
    $(window).on('beforeunload', function () {
        hub = $.connection.myHub;
        hub.server.removeConnectionId($('#flightId').val());
        e.preventDefault();
        return true;
    });
    var chat = $.connection.myHub;
    chat.client.keepAlive = function () { };
    chat.client.ConnectionOfBrowserArrival = function (ConnectionId) {
        var flightid = $('#flightId').val();
        $.ajax({
            type: 'GET',
            url: "/ArrFlight/SaveConnectionId",
            data: { ConnectionId: ConnectionId, flightid: flightid },
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
            },
            error: function () {
            }
        }).done(function () {
        });

    };

    chat.client.updatEIBT = function () {
        getEIBT();
    };
    chat.client.updatNotification = function () {
        getNotification();
    };
    chat.client.sendAIBTTOMachine = function () {
        getAIBT();
    };
    chat.client.RequireLogout = function () {
        window.location = '/ArrFlight/Logout';
    };
    $.connection.hub.start().done(function () {
        hub = $.connection.myHub;
        hub.server.getin($('#flightId').val());
        getAIBT();
        getFlightInfor();
        getEIBT();
        getNotification();
        $("#saveflight").hide();
    });
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            startTime = new Date();
        } else if (document.visibilityState === 'visible') {
            endTime = new Date();
            var hiddenTime = endTime - startTime;
            // Do something with the hiddenTime value
            if (hiddenTime > 1000000) {
                location.reload();
            }
        }
    });

    $("#AIBT").on("click", function () {
        if (!$(this).attr('readonly')) {
            var oldvalue = $(this).val();
            if (oldvalue == 'undefined' || oldvalue.trim() == "") {
                var aDate = new Date($.now());
                var h = aDate.getHours();
                var m = aDate.getMinutes();
                if (h < 10) h = '0' + h;
                if (m < 10) m = '0' + m;
                var time = h.toString() + m.toString();
                if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
                    $(this).val(time);
                    $("#AIBT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#AIBT").on("input", function () {
        var a =  $("#AIBT").val();
        var b = $("#old_AIBT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#AIBT').css("color", "tomato");
            if (colchange.indexOf(",AIBT") < 0) {
                colchange = colchange + ",AIBT";
            }
        }
        else {
            $('#AIBT').css("color", "black");
            if (colchange.indexOf(",AIBT") >= 0) {
                colchange = colchange.replace(",AIBT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#AIBT").keypress(function (e) {
        if (e.which != 43 && e.which != 45 )
        {
            if (e.which < 48 || e.which > 57)
            {
                return false;
            }
        }
    });
    $(document).off('click touchstart', '#saveflight').on('click touchstart', '#saveflight', function (event) {
        event.preventDefault();
        //if (kiemtraAIBT() == true) {
        //    $(this).prop('disabled', true);
        //    var flightId = $('#flightId').val();
        //    $.ajax({
        //        type: 'GET',
        //        url: "/ArrFlight/checkAllowEdit",
        //        data: { flightId: flightId },
        //        contentType: 'application/html ; charset:utf-8',
        //        dataType: 'json',
        //        success: function (data) {
        //            if (data.allowEdit == false) {
        //                alert("You don't have permission to edit.Contact your manager");
        //            }
        //            else {
        //                SaveData();
        //            }
        //        },
        //        error: function () {
        //        }
        //    });
            SaveData();
            $(this).prop('disabled', false);
       /* }*/
    });

    $(document).on('click touchstart', '#viewHistory', function () {
        $('#HistoryModal').modal();
        var flightId = $('#flightId').val();
        var tbl = $('#historyContent');
        $.ajax({
            type: 'GET',
            url: "/ArrFlight/getHistory",
            data: { flightid: flightId },
            contentType: 'application/html ; charset:utf-8',
            dataType: 'html',
            success: function (data) {
                tbl.html(data)
            },
            error: function () {
            }
        });
    });
});

window.setInterval("keepconnect()", 60000);
function keepconnect() {
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/keepconnect",
        success: function (data) {
        },
        error: function (resp) {
            location.reload();
        }
    });
}
function kiemtraAIBT() {
    //kiem tra len
    var a = $("#AIBT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('AIBT khong hop le');
            $("#AIBT").focus();
            return false;
        }
        else if (a.length == 4) {
             if (isNaN(parseInt($("#AIBT").val().toString().trim()))) {
                alert('AIBT khong hop le');
                $("#AIBT").focus();
                return false;
            } else if (parseInt($("#AIBT").val().toString().trim()) > 2400) {
                alert('AIBT khong hop le');
                $("#AIBT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-")
            {
                alert('AIBT khong hop le');
                $("#AIBT").focus();
                return false;
            }
        }
    }
    
    return true;
}

function getFlightInfor() {
    var flightId = $('#flightId').val();
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/getFlightInfor",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (apiData) {
            if (apiData.Susscess == true) {
                allowEdit = true;
                $('#flightNo').text(apiData.Data.FlightNo);
                $('#Route').text(apiData.Data.RouteFlight);
                $('#Bay').text(apiData.Data.Position);
                $('#flightDate').text(apiData.Data.FlightDate);
                $('#acRegNo').text(apiData.Data.AcRegNo);
                $('#acType').text(apiData.Data.AcType);
                $('#sIBT').text(apiData.Data.ArrTime);
            }
            if (apiData.allowEdit == false) {
                allowEdit = false;
                $("#AIBT").prop("disabled", true);
            }
        },
        error: function () {
        }
    });
}
function getEIBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#EIBT');
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/getEIBT",
        data: { flightId: flightId},
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            $('#EIBT').text(data.Time);
        },
        error: function () {
        }
    });

}

function getNotification() {
    var flightId = $('#flightId').val();
     var tbl = $('#Notification');
    var flightId = $('#flightId').val();
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/getNotification",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result != null) {
                tbl.empty().append(result);
            }
            else {
                tbl.empty().append('');
            }
        },
        error: function () {
        }
    });
}

function getAIBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#AIBT');
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/getAIBT",
        data: { FlightId: flightId},
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_AIBT').val(data.Time == null ? "" : data.Time.trim());
                $('#AIBT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",AIBT") >= 0) {
                    colchange = colchange.replace(",AIBT", "");
                }
                $('#partChange').val(colchange);
            }
            else {
                tbl.empty();
            }
        },
        error: function () {
        }
    });

    
}

function checkbutton() {
    var colchange = $('#partChange').val();

    if (colchange.trim() != '') {
        $("#saveflight").show();
    }
    else {
        $("#saveflight").hide();
    }
}


function SaveData() {
    getCurrentTime();
    var colchange = $('#partChange').val();
    if (colchange.indexOf(",AIBT") >= 0) {
        $.when(saveAIBT()).then(function () {
        });
    }
 
}

function saveAIBT()
{
    var id = $('#flightId').val();
    var aibt = $('#AIBT').val().toString().trim();
    var isOk = checkTime(aibt);
    if (allowEdit == true || (allowEdit == false && isOk == true))
    $.ajax({
        type: 'GET',
        url: "/ArrFlight/saveAIBT",
        async: false,
        data: { flightID: id, aibt: aibt },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
           if (data.trim() != "") {
               alert("Không gửi AIBT sang ACDM được - " + data);
                getAIBT();
            }
           
            $("#saveflight").hide();
        },
        error: function () {
           /* alert('can not comunicate with server, please login in again');*/
            window.location = '/Login/Signin';
        }
    });
}
function getCurrentTime() {
    $.ajax({
        type: 'GET',
        url: "/Task/GetCurrentTime",
        data: {},
        async: false,
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            timeNow = data.currentTime;
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function checkTime(str) {

    var str = str.replace("-", "");
    str = str.replace("+", "");
    if (str.trim() != "") {
        var num = parseInt(str);
        var serverTime = parseInt(timeNow);
        if (isNaN(num)) {
            alert(str + " Time must be numberic characters");
            return false;
        } else {
            if ((str <= serverTime) || (str > serverTime && serverTime < 400 && str > 2200))
                return true;
            else {
                alert(str + " is not allowed to enter before current time");
                return false;
            }
        }
    }
    else {
        return true;
    }
}