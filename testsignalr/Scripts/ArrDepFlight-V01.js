var timeNow;
var allowEdit = false;
$(document).ready(function () {
    var timeNow;
    var arrFlightId = $("#ArrFlightId").val();
    $(window).on('beforeunload', function () {
        hub = $.connection.myHub;
        hub.server.removeConnectionId($("#ArrFlightId").val());
        hub.server.removeConnectionId($("#DeptFlightId").val());
        e.preventDefault();
        return true;
    });

    var chat = $.connection.myHub;
    chat.client.keepAlive = function () { };

    chat.client.ConnectionOfBrowserArrival = function (ConnectionId) {
        var flightid = $('#ArrFlightId').val();
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/SaveConnectionId",
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
    chat.client.sendAIBTTOMachine = function () {
        getAIBT();
        getACGT();
    };
    chat.client.sendAOBTTOMachine = function () {
        getAOBT();
    };
    chat.client.sendARDTTOMachine = function () {
        getARDT();
    };

    chat.client.sendTOBTTOMachine = function () {
        getTOBT();
        getFlightInfor();
    };
    chat.client.sendAEGTTOMachine = function () {
        getAEGT();
        getARDT();
    };
    chat.client.sendCLSDTOMachine = function () {
        getCLSD();
    };
    chat.client.updatEIBT = function () {
        getEIBT();
    };
    chat.client.KeepConnection = function () {

    };

    $.connection.hub.start().done(function () {
        getFlightInfor();
        getAIBT();
        getACGT();
        getAOBT();
        getARDT();
        getTOBT();
        getASBT();
        getCLSD();
        getEIBT();
        getAEGT();
        getNotification();
        $("#saveflight").hide();
        hub = $.connection.myHub;
        hub.server.getin($('#ArrFlightId').val());
        hub.server.getin($('#DeptFlightId').val());
    });

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            startTime = new Date();
        } else if (document.visibilityState === 'visible') {
            endTime = new Date();
            var hiddenTime = endTime - startTime;

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

    $("#ACGT").on("click", function () {
        if (!$(this).attr('readonly')) {
            var oldvalue = $(this).val();
            if (oldvalue == 'undefined' || oldvalue.trim() == "") {
                var aibt = $('#AIBT').val();
                if (confirm('Bạn mốn lấy giờ AIBT không?')) {
                    $(this).val(aibt);
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

    $("#AIBT").on("input", function () {
        var a = $("#AIBT").val();
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

    $("#CLSD").on("click", function () {
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
                    $("#CLSD").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#CLSD").on("input", function () {
        var a = $("#CLSD").val();
        var b = $("#old_CLSD").val();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#CLSD').css("color", "tomato");
            if (colchange.indexOf(",CLSD") < 0) {
                colchange = colchange + ",CLSD";
            }
        }
        else {
            $('#CLSD').css("color", "black");
            if (colchange.indexOf(",CLSD") >= 0) {
                colchange = colchange.replace(",CLSD", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#CLSD").keypress(function (e) {
        if (e.which != 43 && e.which != 45) {
            if (e.which < 48 || e.which > 57) {
                return false;
            }
        }
    });
    $(document).on('click touchstart', '#viewHistory', function () {
        $('#HistoryModal').modal();
        var flightId = $('#DeptFlightId').val().toString().trim();
        var tbl = $('#historyContent');
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/getHistory",
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
        //var flightId = $('#DeptFlightId').val();
        //$.ajax({
        //    type: 'GET',
        //    url: "/ArrDepFlight/checkAllowEdit",
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
        url: "/ArrDepFLight/keepconnect",
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
        },
        error: function (resp) {
            location.reload();
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

    return true;
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
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('AIBT khong hop le');
                $("#AIBT").focus();
                return false;
            }
        }
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
function kiemtraCLSD() {
    //kiem tra len
    var a = $("#CLSD").val().toString().trim();
    if (a.length > 0) {
        if (a.length < 4) {
            alert('CLSD khong hop le');
            $("#CLSD").focus();
            return false;
        }
        else if (a.length == 4) {
            if (isNaN(parseInt($("#CLSD").val().toString().trim()))) {
                alert('CLSD khong hop le');
                $("#CLSD").focus();
                return false;
            } else if (parseInt($("#CLSD").val().toString().trim()) > 2400) {
                alert('CLSD khong hop le');
                $("#CLSD").focus();
                return false;
            }
        }
        else {
            if (a.substr(a.length - 1) != "+" && a.substr(a.length - 1) != "-") {
                alert('CLSD khong hop le');
                $("#CLSD").focus();
                return false;
            }
        }
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
    return true;
}

function getEIBT() {
    var flightId = $('#ArrFlightId').val().toString().trim();
    var tbl = $('#eIBT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getEIBT",
        data: {},
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            $('#eIBT').text(data.Time);
        },
        error: function () {
        }
    });

}

function getFlightInfor() {
    var flightId = $('#ArrFlightId').val().toString().trim();
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getFlightInfor",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (apiData) {
            if (apiData.Susscess == true) {
                allowEdit = true;
                $('#sIBT').text(apiData.Data.ArrTime);
                $('#flightNo').text(apiData.Data.FlightNo);
                $('#Route').text(apiData.Data.RouteFlight);
                $('#Bay').text(apiData.Data.Position + '/' + apiData.Data.Gate);
                $('#flightDate').text(apiData.Data.FlightDate);
                $('#acRegNo').text(apiData.Data.AcRegNo);
                $('#acType').text(apiData.Data.AcType);
                $('#sOBT').text(apiData.Data.DepTime);
                $('#eOBT').text(apiData.Data.EOBT);
                $('#eTTT').text(apiData.Data.ETTT);
            }
            if (apiData.allowEdit == false) {
                allowEdit = false;
                $("#AIBT").prop("disabled", true);
                $("#ACGT").prop("disabled", true);
                $("#ASBT").prop("disabled", true);
                $("#AEGT").prop("disabled", true);
                $("#CLSD").prop("disabled", true);
                $("#ARDT").prop("disabled", true);
                $("#TOBT").prop("disabled", true);
                $("#AOBT").prop("disabled", true);
            }
        },
        error: function () {
        }
    });
}

function getNotification() {
    var flightId = $('#ArrFlightId').val().toString().trim() + "_" + $('#DeptFlightId').val().toString().trim();
    var tbl = $('#Notification');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getNotification",
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

function getACGT() {
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#ACGT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getACGT",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_ACGT').val(data.Time == null ? "" : data.Time.trim());
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
function getAIBT() {
    var flightId = $('#ArrFlightId').val();
    var tbl = $('#AIBT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getAIBT",
        data: { FlightId: flightId },
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
            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
        }
    });


}
function getASBT() {
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#ASBT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getASBT",
        data: { FlightId: flightId },
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
        }
    });


}
function getAOBT() {
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#AOBT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getAOBT",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_AOBT').val(data.Time == null ? "" : data.Time.trim());
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
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#ARDT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getARDT",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_ARDT').val(data.Time == null ? "" : data.Time.trim());
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
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#TOBT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFlight/getTOBT",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_TOBT').val(data.Time == null ? "" : data.Time.trim());
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
function getAEGT() {
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#AEGT');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFLight/getAEGT",
        data: { flightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_AEGT').val(data.Time == null ? "" : data.Time.trim());
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
function getCLSD() {
    var flightId = $('#DeptFlightId').val();
    var tbl = $('#CLSD');
    $.ajax({
        type: 'GET',
        url: "/ArrDepFLight/getCLSD",
        data: { FlightId: flightId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.Time != null) {
                tbl.val(data.Time);
                $('#old_CLSD').val(data.Time == null ? "" : data.Time.trim());
                $('#CLSD').css("color", "black");
                var colchange = $('#partChange').val();
                if (colchange.indexOf(",CLSD") >= 0) {
                    colchange = colchange.replace(",CLSD", "");
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

    if (colchange.indexOf(",ARDT") >= 0 && colchange.indexOf(",AEGT") >= 0) {
        var _ARDT = $('#ARDT').val();
        var _AEGT = $('#AEGT').val();
        if (_ARDT == _AEGT) {
            colchange = colchange.replace(",AEGT", "");
            $('#partChange').val(colchange);
        }
    }

    if (colchange.indexOf(",CLSD") >= 0) {
        if (kiemtraCLSD()) {
            colchange = colchange.replace(",CLSD", "");
            $('#partChange').val(colchange);
            $.when(saveCLSD()).then(function () {
                /*  hub.server.sendACGT($('#DeptFlightId').val());*/
            });
        }
    }

    if (colchange.indexOf(",AIBT") >= 0 && colchange.indexOf(",ACGT") >= 0) {
        var _AIBT = $('#AIBT').val();
        var _ACGT = $('#ACGT').val();
        if (_AIBT == _ACGT) {
            colchange = colchange.replace(",ACGT", "");
            $('#partChange').val(colchange);
        }
    }
    if (colchange.indexOf(",ACGT") >= 0) {
        if (kiemtraACGT()) {
            colchange = colchange.replace(",ACGT", "");
            $('#partChange').val(colchange);
            $.when(saveACGT()).then(function () {
                /*  hub.server.sendACGT($('#DeptFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",AIBT") >= 0) {
        if (kiemtraAIBT()) {
            colchange = colchange.replace(",AIBT", "");
            $('#partChange').val(colchange);
            $.when(saveAIBT()).then(function () {

                /*  hub.server.sendAIBT($('#ArrFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",ASBT") >= 0) {
        if (kiemtraASBT()) {
            colchange = colchange.replace(",ASBT", "");
            $('#partChange').val(colchange);
            $.when(saveASBT()).then(function () {

                /*   hub.server.sendASBT($('#DeptFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",AOBT") >= 0) {
        if (kiemtraAOBT()) {
            colchange = colchange.replace(",AOBT", "");
            $('#partChange').val(colchange);
            $.when(saveAOBT()).then(function () {
                /*hub.server.sendAOBT($('#DeptFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",ARDT") >= 0) {
        if (kiemtraARDT()) {
            colchange = colchange.replace(",ARDT", "");
            $('#partChange').val(colchange);
            $.when(saveARDT()).then(function () {
                /* hub.server.sendARDT($('#DeptFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",TOBT") >= 0) {
        if (kiemtraTOBT()) {
            colchange = colchange.replace(",TOBT", "");
            $('#partChange').val(colchange);
            $.when(saveTOBT()).then(function () {
                /*hub.server.sendTOBT($('#DeptFlightId').val());*/
            });
        }
    }
    if (colchange.indexOf(",AEGT") >= 0) {
        if (kiemtraAEGT()) {
            colchange = colchange.replace(",AEGT", "");
            $('#partChange').val(colchange);
            $.when(saveAEGT()).then(function () {
                /*hub.server.sendAEGT($('#DeptFlightId').val());*/
            });
        }
    }
}

function saveAIBT() {
    var flightId = $('#ArrFlightId').val().toString().trim() + "_" + $('#DeptFlightId').val().toString().trim();
    var _ACGT = $('#ACGT').val();
    var _AIBT = $('#AIBT').val();
    var isOk = checkTime(_AIBT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveAIBT",
            data: { flightID: flightId, aibt: _AIBT, acgt: _AIBT },
            async: false,
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
                /*  alert('can not comunicate with server, please login in again');*/
                window.location = '/Login/Signin';
            }
        });
}
function saveACGT() {
    //var id = $('#ArrFlightId').val();
    var flightId = $('#DeptFlightId').val();
    var _ACGT = $('#ACGT').val();
    var isOk = checkTime(_ACGT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveACGT",
            data: { flightID: flightId, acgt: _ACGT },
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi ACGT sang ACDM được - " + data);
                    getACGT();
                }
                $("#saveflight").hide();
            },
            error: function () {
                /* alert('can not comunicate with server, please login in again');*/
                window.location = '/Login/Signin';
            }
        });
}
function saveASBT() {
    var id = $('#DeptFlightId').val();
    var _ASBT = $('#ASBT').val();
    var isOk = checkTime(_ASBT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveASBT",
            data: { flightID: id, asbt: _ASBT },
            async: false,
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
                /*         alert('can not comunicate with server, please login in again');*/
                window.location = '/Login/Signin';
            }
        });
}
function saveAOBT() {
    var id = $('#DeptFlightId').val();
    var _AOBT = $('#AOBT').val();
    var isOk = checkTime(_AOBT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveAOBT",
            data: { flightID: id, aobt: _AOBT },
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi AOBT sang ACDM được -  " + data);
                    getAOBT();
                }
              
                $("#saveflight").hide();
            },
            error: function () {
                /*            alert('can not comunicate with server, please login in again');*/
                window.location = '/Login/Signin';
            }
        });
}
function saveARDT() {
    var id = $('#DeptFlightId').val();
    var _ARDT = $('#ARDT').val();
    var isOk = checkTime(_ARDT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveARDT",
            data: { flightID: id, ardt: _ARDT },
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi ARDT sang ACDM được - " + data);
                    getARDT();
                }
                $("#saveflight").hide();
            },
            error: function () {
                alert('can not comunicate with server, please login in again');
                window.location = '/Login/Signin';
            }
        });
}
function saveTOBT() {
    var id = $('#DeptFlightId').val();
    var _TOBT = $('#TOBT').val();
    if (checkTOBTInput(_TOBT)) {
        $.ajax({
            type: 'GET',
            url: "/ArrDepFlight/saveTOBT",
            data: { flightID: id, tobt: _TOBT },
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi TOBT sang ACDM được - " + data);
                    getTOBT();
                }
               
                $("#saveflight").hide();
            },
            error: function () {
                alert('can not comunicate with server, please login in again');
                window.location = '/Login/Signin';
            }
        });
    }
    else {
        alert('Giá trị TOBT cần phải lớn hơn 6 phút so với giá trị TOBT trước đó');
    }
}
function saveAEGT() {
    var id = $('#DeptFlightId').val();
    var _AEGT = $('#AEGT').val();
    var isOk = checkTime(_AEGT);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFLight/saveAEGT",
            data: { flightID: id, aegt: _AEGT },
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
               if (data.trim() != "") {
                   alert("Không gửi AEGT sang ACDM được - " + data);
                    getAEGT();
                }
               
                $("#saveflight").hide();
            },
            error: function () {
                alert('can not comunicate with server, please login in again');
                window.location = '/Login/Signin';
            }
        });
}
function saveCLSD() {
    var id = $('#DeptFlightId').val();
    var _CLSD = $('#CLSD').val();
    var isOk = checkTime(_CLSD);
    if (allowEdit == true || (allowEdit == false && isOk == true))
        $.ajax({
            type: 'GET',
            url: "/ArrDepFLight/saveCLSD",
            data: { flightID: id, clsd: _CLSD },
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
function checkTOBTInput(newTOBT) {
    var oldTOBT = $("#old_TOBT").val().toString().trim();
    var newTOBT = $("#TOBT").val().toString().trim();

    oldTOBT = oldTOBT.replace("+", "");
    oldTOBT = oldTOBT.replace("-", "");
    newTOBT = newTOBT.replace("+", "");
    newTOBT = newTOBT.replace("-", "");
    var result = Math.abs(parseInt(newTOBT) - parseInt(oldTOBT));
    if (result < 6)
        return false;
    else
        return true;
}