$(document).ready(function () {
    alert('hi');
    var chat = $.connection.myHub;
    chat.client.updatNotification = function () {
        getNotification();
    };
    chat.client.sendACGTTOMachine = function () {
        getACGT();
        getFlightInfor();
    };
    chat.client.sendASBTTOMachine = function () {
        getASBT();
    };
    chat.client.sendAOBTTOMachine = function () {
        getAOBT();
    };
    chat.client.sendARDTTOMachine = function () {
        getARDT();
    };
    chat.client.updateTurnAroundTime = function () {
        getETTT();
    };
    chat.client.sendTOBTTOMachine = function () {
        getTOBT();
        getFlightInfor();
    };
    chat.client.sendAEGTTOMachine = function () {
        getAEGT();
    };


    $.connection.hub.start().done(function () {
        hub = $.connection.myHub;
        hub.server.getin($('#flightId').val());
        checkconnect();
        getFlightInfor();
        getETTT();
        getACGT();
        getAOBT();
        getARDT();
        getTOBT();
        getASBT();
        getAEGT();
        getNotification();
        $("#saveflight").hide();
    });

    $("#ACGT").on("click", function () {
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
                    $("#ACGT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#ACGT").on("input", function () {
        var a = $("#ACGT").val();
        var b = $("#old_ACGT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ACGT').css("color", "tomato");
            if (colchange.indexOf(",ACGT") < 0) {
                colchange = colchange + ",ACGT";
            }
        }
        else {
            $('#ACGT').css("color", "black");
            if (colchange.indexOf(",ACGT") >= 0) {
                colchange = colchange.replace(",ACGT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ACGT").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
    });

    $("#TOBT").on("click", function () {
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
                    $("#TOBT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#TOBT").on("input", function () {
        var a = $("#TOBT").val();
        var b = $("#old_TOBT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#TOBT').css("color", "tomato");
            if (colchange.indexOf(",TOBT") < 0) {
                colchange = colchange + ",TOBT";
            }
        }
        else {
            $('#TOBT').css("color", "black");
            if (colchange.indexOf(",TOBT") >= 0) {
                colchange = colchange.replace(",TOBT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#TOBT").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
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

    $("#AOBT").on("click", function () {
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
                    $("#AOBT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#AOBT").on("input", function () {
        var a = $("#AOBT").val();
        var b = $("#old_AOBT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#AOBT').css("color", "tomato");
            if (colchange.indexOf(",AOBT") < 0) {
                colchange = colchange + ",AOBT";
            }
        }
        else {
            $('#AOBT').css("color", "black");
            if (colchange.indexOf(",AOBT") >= 0) {
                colchange = colchange.replace(",AOBT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#AOBT").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
    });


    $("#ARDT").on("click", function () {
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
                    $("#ARDT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#ARDT").on("input", function () {
        var a = $("#ARDT").val();
        var b = $("#old_ARDT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ARDT').css("color", "tomato");
            if (colchange.indexOf(",ARDT") < 0) {
                colchange = colchange + ",ARDT";
            }
        }
        else {
            $('#ARDT').css("color", "black");
            if (colchange.indexOf(",ARDT") >= 0) {
                colchange = colchange.replace(",ARDT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ARDT").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
    });

    $("#AEGT").on("click", function () {
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
                    $("#AEGT").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#AEGT").on("input", function () {
        var a = $("#AEGT").val();
        var b = $("#old_AEGT").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#AEGT').css("color", "tomato");
            if (colchange.indexOf(",AEGT") < 0) {
                colchange = colchange + ",AEGT";
            }
        }
        else {
            $('#AEGT').css("color", "black");
            if (colchange.indexOf(",AEGT") >= 0) {
                colchange = colchange.replace(",AEGT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#AEGT").keypress(function (e) {
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
            url: "/DepFlight/getHistory",
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

    $(document).off('click touchstart', '#saveflight').on('click touchstart', '#saveflight', function () {

        $(this).prop('disabled', true);
        SaveData();
        $(this).prop('disabled', false);

    });
});

window.setInterval("checkconnect()", 60000);
function checkconnect() {

    $.ajax({
        type: 'GET',
        url: "/DepFlight/checkconnect",
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

function kiemtraACGT() {
    //kiem tra len
    var a = $("#ACGT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('ACGT khong hop le');
            $("#ACGT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#ACGT").val().toString().trim()))) {
                alert('ACGT khong hop le');
                $("#ACGT").focus();
                return false;
            } else if (parseInt($("#ACGT").val().toString().trim()) > 2400) {
                alert('ACGT khong hop le');
                $("#ACGT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('ACGT khong hop le');
                $("#ACGT").focus();
                return false;
            }
        }
    }
    else {
        alert('ACGT khong hop le');
        $("#ACGT").focus();
        return false;
    }
    return true;
}
function kiemtraTOBT() {
    //kiem tra len
    var a = $("#TOBT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('TOBT khong hop le');
            $("#TOBT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#TOBT").val().toString().trim()))) {
                alert('TOBT khong hop le');
                $("#TOBT").focus();
                return false;
            } else if (parseInt($("#TOBT").val().toString().trim()) > 2400) {
                alert('TOBT khong hop le');
                $("#TOBT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('TOBT khong hop le');
                $("#TOBT").focus();
                return false;
            }
        }
    }
    else {
        alert('TOBT khong hop le');
        $("#TOBT").focus();
        return false;
    }
    return true;
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
    else {
        alert('ASBT khong hop le');
        $("#ASBT").focus();
        return false;
    }
    return true;
}
function kiemtraAOBT() {
    //kiem tra len
    var a = $("#AOBT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('AOBT khong hop le');
            $("#AOBT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#AOBT").val().toString().trim()))) {
                alert('AOBT khong hop le');
                $("#AOBT").focus();
                return false;
            } else if (parseInt($("#AOBT").val().toString().trim()) > 2400) {
                alert('AOBT khong hop le');
                $("#AOBT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('AOBT khong hop le');
                $("#AOBT").focus();
                return false;
            }
        }
    }
    else {
        alert('AOBT khong hop le');
        $("#AOBT").focus();
        return false;
    }
    return true;
}
function kiemtraARDT() {
    //kiem tra len
    var a = $("#ARDT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('ARDT khong hop le');
            $("#ARDT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#ARDT").val().toString().trim()))) {
                alert('ARDT khong hop le');
                $("#ARDT").focus();
                return false;
            } else if (parseInt($("#ARDT").val().toString().trim()) > 2400) {
                alert('ARDT khong hop le');
                $("#ARDT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('ARDT khong hop le');
                $("#ARDT").focus();
                return false;
            }
        }
    }
    else {
        alert('ARDT khong hop le');
        $("#ARDT").focus();
        return false;
    }
    return true;
}
function kiemtraAEGT() {
    //kiem tra len
    var a = $("#AEGT").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('AEGT khong hop le');
            $("#AEGT").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#AEGT").val().toString().trim()))) {
                alert('AEGT khong hop le');
                $("#AEGT").focus();
                return false;
            } else if (parseInt($("#AEGT").val().toString().trim()) > 2400) {
                alert('AEGT khong hop le');
                $("#AEGT").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('AEGT khong hop le');
                $("#AEGT").focus();
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
        url: "/DepFlight/getFlightInfor",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            $('#flightNo').text(json.FlightNo);
            $('#Route').text(json.RouteFlight);
            $('#Bay').text(json.Position);
            $('#flightDate').text(json.FlightDate);
            $('#acRegNo').text(json.AcRegNo);
            $('#acType').text(json.AcType);
            $('#sOBT').text(json.DepTime);
            $('#eOBT').text(json.EOBT);
            $('#eTTT').text(json.ETTT);
        },
        error: function () {
            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
        }
    });
}

function getETTT() {
    var flightId = $('#flightId').val();
    var tbl = $('#Notification');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getETTT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            if (data != null) {
                var json = $.parseJSON(data);
                $('#eTTT').text(json.Time);
            }
            else {
                $('#eTTT').text(0);
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
        url: "/DepFlight/getNotification",
        data: { flightId: flightId },
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

function getACGT() {
    var flightId = $('#flightId').val();
    var tbl = $('#ACGT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getACGT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_ACGT').val(json.Time == null ? "" : json.Time.trim());
                $('#ACGT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",ACGT") >= 0) {
                    colchange = colchange.replace(",ACGT", "");
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
function getASBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#ASBT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getASBT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_ASBT').val(json.Time == null ? "" : json.Time.trim());
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
function getAEGT() {
    var flightId = $('#flightId').val();
    var tbl = $('#AEGT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getAEGT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_AEGT').val(json.Time == null ? "" : json.Time.trim());
                $('#AEGT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",AEGT") >= 0) {
                    colchange = colchange.replace(",AEGT", "");
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
function getAOBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#AOBT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getAOBT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_AOBT').val(json.Time == null ? "" : json.Time.trim());
                $('#AOBT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",AOBT") >= 0) {
                    colchange = colchange.replace(",AOBT", "");
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
function getARDT() {
    var flightId = $('#flightId').val();
    var tbl = $('#ARDT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getARDT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_ARDT').val(json.Time == null ? "" : json.Time.trim());
                $('#ARDT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",ARDT") >= 0) {
                    colchange = colchange.replace(",ARDT", "");
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
function getTOBT() {
    var flightId = $('#flightId').val();
    var tbl = $('#TOBT');
    $.ajax({
        type: 'GET',
        url: "/DepFlight/getTOBT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            var json = $.parseJSON(data);
            if (json.Time != null) {
                tbl.val(json.Time);
                $('#old_TOBT').val(json.Time == null ? "" : json.Time.trim());
                $('#TOBT').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",TOBT") >= 0) {
                    colchange = colchange.replace(",TOBT", "");
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

    var colchange = $('#partChange').val();
    var hub = $.connection.myHub;
    if (colchange.indexOf(",ACGT") >= 0) {
        if (kiemtraACGT()) {
            $.when(saveACGT()).then(function () {
                colchange = colchange.replace(",ACGT", "");
                $('#partChange').val(colchange);
                hub.server.sendACGT($('#flightId').val());
            });
        }
    }
    if (colchange.indexOf(",ASBT") >= 0) {
        if (kiemtraASBT()) {
            $.when(saveASBT()).then(function () {
                colchange = colchange.replace(",ASBT", "");
                $('#partChange').val(colchange);
                hub.server.sendASBT($('#flightId').val());
            });
        }
    }
    if (colchange.indexOf(",AOBT") >= 0) {
        if (kiemtraAOBT()) {
            $.when(saveAOBT()).then(function () {
                colchange = colchange.replace(",AOBT", "");
                $('#partChange').val(colchange);
                hub.server.sendAOBT($('#flightId').val());
            });
        }
    }
    if (colchange.indexOf(",ARDT") >= 0) {
        if (kiemtraARDT()) {
            $.when(saveARDT()).then(function () {
                colchange = colchange.replace(",ARDT", "");
                $('#partChange').val(colchange);
                hub.server.sendARDT($('#flightId').val());
            });
        }
    }

    if (kiemtraTOBT()) {
        $.when(saveTOBT()).then(function () {
            colchange = colchange.replace(",TOBT", "");
            $('#partChange').val(colchange);
            hub.server.sendTOBT($('#flightId').val());
        });
    }
}
if (colchange.indexOf(",AEGT") >= 0) {
    if (kiemtraAEGT()) {
        $.when(saveAEGT()).then(function () {
            colchange = colchange.replace(",AEGT", "");
            $('#partChange').val(colchange);
            hub.server.sendAEGT($('#flightId').val());
        });
    }
}


function saveACGT() {
    var id = $('#flightId').val();
    var _ACGT = $('#ACGT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveACGT",
        data: { flightID: id, acgt: _ACGT },
        async: false,
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveASBT() {
    var id = $('#flightId').val();
    var _ASBT = $('#ASBT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveASBT",
        async: false,
        data: { flightID: id, asbt: _ASBT },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveAOBT() {
    var id = $('#flightId').val();
    var _AOBT = $('#AOBT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveAOBT",
        data: { flightID: id, aobt: _AOBT },
        async: false,
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveARDT() {
    var id = $('#flightId').val();
    var _ARDT = $('#ARDT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveARDT",
        async: false,
        data: { flightID: id, ardt: _ARDT },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveTOBT() {
    var id = $('#flightId').val();
    var _TOBT = $('#TOBT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveTOBT",
        async: false,
        data: { flightID: id, tobt: _TOBT },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveAEGT() {
    var id = $('#flightId').val();
    var _AEGT = $('#AEGT').val();
    $.ajax({
        type: 'GET',
        url: "/DepFlight/saveAEGT",
        async: false,
        data: { flightID: id, aegt: _AEGT },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}

