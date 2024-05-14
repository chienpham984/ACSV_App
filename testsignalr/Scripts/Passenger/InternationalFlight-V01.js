var timeNow;
$(document).ready(function () {
    var flightId = $("#flightId").val();
    $(window).on('beforeunload', function () {
        hub = $.connection.myHub;
        hub.server.removeConnectionId($('#flightId').val());
        e.preventDefault();
        return true;
    });

    var chat = $.connection.myHub;

    chat.client.ConnectionOfBrowserArrival = function (ConnectionId) {
        var flightid = $('#flightId').val();
        $.ajax({
            type: 'GET',
            url: "/International/SaveConnectionId",
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
    chat.client.keepAlive = function () { };
    chat.client.updatNotification = function () {
        getNotification();
    };
    chat.client.sendASBTTOMachine = function () {
        getASBT();
    };
    
    chat.client.KeepConnection = function () {
    };

    $.connection.hub.start().done(function () {
        hub = $.connection.myHub;
        hub.server.getin($('#flightId').val());
        getFlightInfor();
        getASBT();
        getNotification();
        $("#saveflight").hide();
    });

    $.connection.hub.disconnected(function () {
        location.reload();
    });

    $("#ASBT").on("click", function () {
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
                    $("#ASBT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#ASBT").on("input", function () {
        var a = $("#ASBT").val();
        var b = $("#old_ASBT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ASBT').css("color", "tomato");
            if (colchange.indexOf(",ASBT") < 0) {
                colchange = colchange + ",ASBT";
            }
        }
        else {
            $('#ASBT').css("color", "black");
            if (colchange.indexOf(",ASBT") >= 0) {
                colchange = colchange.replace(",ASBT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ASBT").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
    });

    $(document).on('click touchstart', '#viewHistory', function () {
        $('#HistoryModal').modal();
        var flightId = $('#flightId').val();
        var tbl = $('#historyContent');
        $.ajax({
            type: 'GET',
            url: "/International/getHistory",
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

    $(document).off('click touchstart', '#saveflight').on('click touchstart', '#saveflight', function (event) {
        event.preventDefault();
        $(this).prop('disabled', true);
        //var flightId = $('#flightId').val();
        //$.ajax({
        //    type: 'GET',
        //    url: "/International/checkAllowEdit",
        //    data: { flightId: flightId },
        //    contentType: 'application/html ; charset:utf-8',
        //    dataType: 'json',
        //    success: function (data) {
        //        if (data.allowEdit == false) {
        //            alert("You don't have permission to edit.Contact your manager");
        //        }
        //        else {
        //            SaveData();
        //        }
        //    },
        //    error: function () {
        //    }
        //});
        SaveData();
        $(this).prop('disabled', false);

    });
});
window.setInterval("keepconnect()", 60000);
function keepconnect() {
    $.ajax({
        type: 'GET',
        url: "/International/keepconnect",
        success: function (data) {
        },
        error: function (resp) {
            location.reload();
        }
    });
}
function kiemtraASBT() {
    //kiem tra len
   
    var a = $("#ASBT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('ASBT khong hop le');
            $("#ASBT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#ASBT").val().toString().trim()))) {
                alert('ASBT khong hop le');
                $("#ASBT").focus();
                return false;
            } else if (parseInt($("#ASBT").val().toString().trim()) > 2400) {
                alert('ASBT khong hop le');
                $("#ASBT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('ASBT khong hop le');
                $("#ASBT").focus();
                return false;
            }
        }
    }
    return true;
}
function getFlightInfor() {
    var flightId = $('#flightId').val().toString().trim();
    $.ajax({
        type: 'GET',
        url: "/International/getFlightInfor",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (apiData) {
            if (apiData.Susscess == true) {
                $('#flightNo').text(apiData.Data.FlightNo);
                $('#Route').text(apiData.Data.RouteFlight);
                $('#Bay').text(apiData.Data.Position);
                $('#flightDate').text(apiData.Data.FlightDate);
                $('#acRegNo').text(apiData.Data.AcRegNo);
                $('#acType').text(apiData.Data.AcType);
                $('#sOBT').text(apiData.Data.DepTime);
                $('#eOBT').text(apiData.Data.EOBT);
                $('#eTTT').text(apiData.Data.ETTT);
            }
            if (apiData.allowEdit == false) {
                $("#ASBT").prop("disabled", true);
            }
        },
        error: function () {
            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
        }
    });
}

function getNotification() {
    var flightId = $('#flightId').val();
    var tbl = $('#Notification');
    var flightId = $('#flightId').val();
    $.ajax({
        type: 'GET',
        url: "/International/getNotification",
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
            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
        }
    });
}
function getASBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#ASBT');
    $.ajax({
        type: 'GET',
        url: "/International/getASBT",
        data: { FlightId: flightId},
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_ASBT').val(data.Time == null ? "" : data.Time.trim());
                $('#ASBT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",ASBT") >= 0) {
                    colchange = colchange.replace(",ASBT", "");
                }
                $('#partChange').val(colchange);
            }
            else {
                tbl.empty();
            }
        },
        error: function () {
            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
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
    var hub = $.connection.myHub;
    if (colchange.indexOf("ASBT") >= 0) {
        if (kiemtraASBT()) {
            $.when(saveASBT()).then(function () {
                colchange = colchange.replace(",ASBT", "");
                $('#partChange').val(colchange);
                /*  hub.server.sendASBT($('#flightId').val());*/
            });
        }
    }
}
function saveASBT() {
    var id = $('#flightId').val();
    var _ASBT = $('#ASBT').val();
    var isOk = checkTime(_ASBT);
    if (isOk)
        $.ajax({
            type: 'GET',
            url: "/International/saveASBT",
            async: false,
            data: { flightID: id, asbt: _ASBT },
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi ASBT sang ACDM được - " + data);
                    getASBT();
                }
                $("#saveflight").hide();
            },
            error: function () {
                /*     alert('can not comunicate with server, please login in again');*/
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