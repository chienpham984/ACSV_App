window.setInterval("checktimeout()", 10000);
function checkconnect() {
    var myId = $('#username').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/checkconnection",
        data: { username: myId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
        },
        error: function () {
            alert('Web app can not connect to server');
            window.location = '/Login/Signin';
        }
    });
}
$(document).ready(function () {
    //screen.orientation.unlock();
    $('#partChange').val("");
    var notifications = $.connection.myHub;

    //notifications.client.getBoardingInf = function () {
    //    getboardinginfor();
    //};
    notifications.client.getMVTInf = function () {
        getacturetime();
    };
    notifications.client.getTimeOfMTTT = function () {
        getMinimumTurnaround();
    };

    notifications.client.getBaggageHandling = function () {
        getbaggageHandling();
    };


    notifications.client.getZoneInf = function () {
        getzone();
    };
    notifications.client.getBagInf = function () {
        getBagageInfor();
    };
    notifications.client.getPassengerInf = function () {
        getPassengerInfor();
    };
    notifications.client.checkMessageChange = function () {
        getlistchatMessages();
    };
    notifications.client.getSPForGS = function () {
        getSPGS();
    };
    notifications.client.getSPForHK = function () {
        getSPHK();
    };

    notifications.client.checkFlightStatusinf = function () {
        getFlightStatus();
    };

    notifications.client.getCargoFlight = function () {
        getcargo();
    };
    $.connection.hub.start().done(function () {
        var hub = $.connection.myHub;
        hub.server.getin($('#flightid').val());
        hub.server.getin('_' + $('#flightid').val().toString());
        getFlightStatus();
        getBagageInfor();
        getPassengerInfor();
        getcargo();
        getacturetime();
        getbaggageHandling();
        getzone();
        getlistchatMessages();
        //getboardinginfor();
        getMinimumTurnaround();
        getSPGS();
        getSPHK();
        $("#saveflight").hide();
    }).fail(function (e) {
        alert("Web app can not connect to server");
        window.location = '/Login/Signin';
    });


    $(document).on('click touchstart', '#close_reply', function () {
        $('#reply').hide();
        $("#Reply_id").val(0);
    });

    $(document).on('click touchstart', '#btnexpand', function () {
        $('#ReadMessage').modal();
        $("#ReadMessage").draggable({
            handle: ".modal-header"
        });
    });
    $(document).on('click touchstart', '#btnReply', function () {
        var myparents = $(this).parents('.msg_cotainer_send');
        var a = myparents.find('input');
        $("#Reply_id").val(a.val());
        //lay ten nguoi va noi dung message
        var b = myparents.find(".usernameright");
        var c = myparents.find(".messagecontent");
        $(".usernamereplyBox").html(b.html());
        $("#messagecontentBox").html(c.html());


        $('#reply').show();
    });

    $(document).on('click touchstart', '.attackimg', function () {
        $("#fileUpload").trigger("click");
    });

    $(document).on('click touchstart', '.msg_cotainer_send', function () {
        $(this).find(".checkread").each(function () {
            $(this).show();
        });


    });
    //$("#lg").keyup(function (event) {
    //    if (event.keyCode == 13) {
    //        savemessagetoserver();
    //    }
    //});

    $(document).on('click touchstart', '#btnBack', function () {
        var hub = $.connection.myHub;
        var id = $('#flightid').val();
        hub.server.getout($('#flightid').val());
        hub.server.getout('_' + $('#flightid').val().toString());
    });

    $(document).on('change', '#fileUpload', function () {
        var mystring = $("#fileUpload").val();
        if (mystring.toString().length > 0) {
            if (window.FormData !== undefined) {

                var fileUpload = $("#fileUpload").get(0);
                var files = fileUpload.files;

                // Create FormData object
                var fileData = new FormData();
                var id = $('#flightid').val();
                // Looping over all files and add it to FormData object
                for (var i = 0; i < files.length; i++) {
                    fileData.append(files[i].name, files[i]);
                }
                fileData.append("flightID", id);
                var replyid;
                try {
                    replyid = $('#Reply_id').val();
                }
                catch (err) {
                    replyid = 0;
                }
                // Adding one more key to FormData object
                fileData.append('ReplyId', replyid);
                $.ajax({
                    url: '/DiscussFlight/SaveMessageFile',
                    type: "post",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data: fileData,
                    success: function (result) {
                        var hub = $.connection.myHub;
                        hub.server.saveMessage('_' + $('#flightid').val());
                    },
                    error: function (err) {
                        alert(err.statusText);
                    }
                });
            } else {
                alert("FormData is not supported.");
            }

        }
        else {
            alert('Upload error');
        }
        $("#fileUpload").val('');
    });

    $('#lg').on("keypress", function (e) {
        var mess = $('#lg').val().toString();
        if (e.keyCode == 13 && mess.trim().length > 0) {
            savemessagetoserver();
        }
    });

    $("#ADL").on("input", function () {
        var a = isNaN(parseInt($("#ADL").val())) ? 0 : parseInt($("#ADL").val());
        var b = isNaN(parseInt($("#old_ADL").val())) ? 0 : parseInt($("#old_ADL").val());
        var colchange = $('#partChange').val();

        if (a != b) {
            $('#ADL').css("color", "tomato");
            if (colchange.indexOf(",PassengerInfor_ADL") < 0) {
                colchange = colchange + ",PassengerInfor_ADL";
            }
        }
        else {
            $('#ADL').css("color", "black");
            if (colchange.indexOf(",PassengerInfor_ADL") >= 0) {
                colchange = colchange.replace(",PassengerInfor_ADL", "");
            }
        }
        $('#partChange').val(colchange);
        //tinhtoan();
        checkbutton();
    });
    $("#ADL").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#paxC").on("input", function () {
        var a = $("#paxC").val().toString().trim();
        var b = $("#old_paxC").val().toString().trim();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#paxC').css("color", "tomato");
            if (colchange.indexOf(",PassengerInfor_paxC") < 0) {
                colchange = colchange + ",PassengerInfor_paxC";
            }
        }
        else {
            $('#paxC').css("color", "black");
            if (colchange.indexOf(",PassengerInfor_paxC") >= 0) {
                colchange = colchange.replace(",PassengerInfor_paxC", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#paxY").on("input", function () {
        //tinhtoan();
        var a = $("#paxY").val().toString().trim();
        var b = $("#old_paxY").val().toString().trim();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#paxY').css("color", "tomato");
            if (colchange.indexOf(",PassengerInfor_paxY") < 0) {
                colchange = colchange + ",PassengerInfor_paxY";
            }
        }
        else {
            $('#paxY').css("color", "black");
            if (colchange.indexOf(",PassengerInfor_paxY") >= 0) {
                colchange = colchange.replace(",PassengerInfor_paxY", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#CHD").on("input", function () {
        var a = isNaN(parseInt($("#CHD").val())) ? 0 : parseInt($("#CHD").val());
        var b = isNaN(parseInt($("#old_CHD").val())) ? 0 : parseInt($("#old_CHD").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#CHD').css("color", "tomato");
            if (colchange.indexOf(",PassengerInfor_CHD") < 0) {
                colchange = colchange + ",PassengerInfor_CHD";
            }
        }
        else {
            $('#CHD').css("color", "black");
            if (colchange.indexOf(",PassengerInfor_CHD") >= 0) {
                colchange = colchange.replace(",PassengerInfor_CHD", "");
            }
        }
        $('#partChange').val(colchange);
        //tinhtoan();
        checkbutton();
    });
    $("#CHD").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#INF").on("input", function () {
        var a = isNaN(parseInt($("#INF").val())) ? 0 : parseInt($("#INF").val());
        var b = isNaN(parseInt($("#old_INF").val())) ? 0 : parseInt($("#old_INF").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#INF').css("color", "tomato");
            if (colchange.indexOf(",PassengerInfor_INF") < 0) {
                colchange = colchange + ",PassengerInfor_INF";
            }
        }
        else {
            $('#INF').css("color", "black");
            if (colchange.indexOf(",PassengerInfor_INF") >= 0) {
                colchange = colchange.replace(",PassengerInfor_INF", "");
            }
        }
        $('#partChange').val(colchange);
        //tinhtoan();
        checkbutton();
    });
    $("#INF").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#ZoneOA").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#ZoneOA").val())) ? 0 : parseInt($("#ZoneOA").val());
        var b = isNaN(parseInt($("#old_ZoneOA").val())) ? 0 : parseInt($("#old_ZoneOA").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ZoneOA').css("color", "tomato");
            if (colchange.indexOf(",zone_ZoneOA") < 0) {
                colchange = colchange + ",zone_ZoneOA";
            }
        }
        else {
            $('#ZoneOA').css("color", "black");
            if (colchange.indexOf(",zone_ZoneOA") >= 0) {
                colchange = colchange.replace(",zone_ZoneOA", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ZoneOA").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#ZoneOB").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#ZoneOB").val())) ? 0 : parseInt($("#ZoneOB").val());
        var b = isNaN(parseInt($("#old_ZoneOB").val())) ? 0 : parseInt($("#old_ZoneOB").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ZoneOB').css("color", "tomato");
            if (colchange.indexOf(",zone_ZoneOB") < 0) {
                colchange = colchange + ",zone_ZoneOB";
            }
        }
        else {
            $('#ZoneOB').css("color", "black");
            if (colchange.indexOf(",zone_ZoneOB") >= 0) {
                colchange = colchange.replace(",zone_ZoneOB", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ZoneOB").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#ZoneOC").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#ZoneOC").val())) ? 0 : parseInt($("#ZoneOC").val());
        var b = isNaN(parseInt($("#old_ZoneOC").val())) ? 0 : parseInt($("#old_ZoneOC").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ZoneOC').css("color", "tomato");
            if (colchange.indexOf(",zone_ZoneOC") < 0) {
                colchange = colchange + ",zone_ZoneOC";
            }
        }
        else {
            $('#ZoneOC').css("color", "black");
            if (colchange.indexOf(",zone_ZoneOC") >= 0) {
                colchange = colchange.replace(",zone_ZoneOC", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ZoneOC").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#ZoneOD").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#ZoneOD").val())) ? 0 : parseInt($("#ZoneOD").val());
        var b = isNaN(parseInt($("#old_ZoneOD").val())) ? 0 : parseInt($("#old_ZoneOD").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ZoneOD').css("color", "tomato");
            if (colchange.indexOf(",zone_ZoneOD") < 0) {
                colchange = colchange + ",zone_ZoneOD";
            }
        }
        else {
            $('#ZoneOD').css("color", "black");
            if (colchange.indexOf(",zone_ZoneOD") >= 0) {
                colchange = colchange.replace(",zone_ZoneOD", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ZoneOD").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#BagPcs").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#BagPcs").val())) ? 0 : parseInt($("#BagPcs").val());
        var b = isNaN(parseInt($("#old_BagPcs").val())) ? 0 : parseInt($("#old_BagPcs").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#BagPcs').css("color", "tomato");
            if (colchange.indexOf(",BagageInfor_BagPcs") < 0) {
                colchange = colchange + ",BagageInfor_BagPcs";
            }
        }
        else {
            $('#BagPcs').css("color", "black");
            if (colchange.indexOf(",BagageInfor_BagPcs") >= 0) {
                colchange = colchange.replace(",BagageInfor_BagPcs", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#BagPcs").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#BagWei").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#BagWei").val())) ? 0 : parseInt($("#BagWei").val());
        var b = isNaN(parseInt($("#old_BagWei").val())) ? 0 : parseInt($("#old_BagWei").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#BagWei').css("color", "tomato");
            if (colchange.indexOf(",BagageInfor_BagWei") < 0) {
                colchange = colchange + ",BagageInfor_BagWei";
            }
        }
        else {
            $('#BagWei').css("color", "black");
            if (colchange.indexOf(",BagageInfor_BagWei") >= 0) {
                colchange = colchange.replace(",BagageInfor_BagWei", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#BagWei").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#fstBag").on("click", function () {
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
                    $("#fstBag").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#fstBag").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#fstBag").val())) ? 0 : parseInt($("#fstBag").val());
        var b = isNaN(parseInt($("#old_fstBag").val())) ? 0 : parseInt($("#old_fstBag").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#fstBag').css("color", "tomato");
            if (colchange.indexOf(",Baggageramp_fstBag") < 0) {
                colchange = colchange + ",Baggageramp_fstBag";
            }
        }
        else {
            $('#fstBag').css("color", "black");
            if (colchange.indexOf(",Baggageramp_fstBag") >= 0) {
                colchange = colchange.replace(",Baggageramp_fstBag", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#fstBag").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#lstBagGS").on("click", function () {
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
                    $("#lstBagGS").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#lstBagGS").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#lstBagGS").val())) ? 0 : parseInt($("#lstBagGS").val());
        var b = isNaN(parseInt($("#old_lstBagGS").val())) ? 0 : parseInt($("#old_lstBagGS").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#lstBagGS').css("color", "tomato");
            if (colchange.indexOf(",Baggageramp_lstBagGS") < 0) {
                colchange = colchange + ",Baggageramp_lstBagGS";
            }
        }
        else {
            $('#lstBagGS').css("color", "black");
            if (colchange.indexOf(",Baggageramp_lstBagGS") >= 0) {
                colchange = colchange.replace(",Baggageramp_lstBagGS", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#lstBagGS").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#fstBagGS").on("click", function () {
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
                $("#fstBagGS").trigger("input");
            } else {
                $(this).focus();
            }
        }
    });
    $("#fstBagGS").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#fstBagGS").val())) ? 0 : parseInt($("#fstBagGS").val());
        var b = isNaN(parseInt($("#old_fstBagGS").val())) ? 0 : parseInt($("#old_fstBagGS").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#fstBagGS').css("color", "tomato");
            if (colchange.indexOf(",Baggageramp_fstBagGS") < 0) {
                colchange = colchange + ",Baggageramp_fstBagGS";
            }
        }
        else {
            $('#fstBagGS').css("color", "black");
            if (colchange.indexOf(",Baggageramp_fstBagGS") >= 0) {
                colchange = colchange.replace(",Baggageramp_fstBagGS", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#fstBagGS").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#lstBag").on("click", function () {
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
                $("#lstBag").trigger("input");
            } else {
                $(this).focus();
            }
        }
    });
    $("#lstBag").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#lstBag").val())) ? 0 : parseInt($("#lstBag").val());
        var b = isNaN(parseInt($("#old_lstBag").val())) ? 0 : parseInt($("#old_lstBag").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#lstBag').css("color", "tomato");
            if (colchange.indexOf(",Baggageramp_lstBag") < 0) {
                colchange = colchange + ",Baggageramp_lstBag";
            }
        }
        else {
            $('#lstBag').css("color", "black");
            if (colchange.indexOf(",Baggageramp_lstBag") >= 0) {
                colchange = colchange.replace(",Baggageramp_lstBag", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#lstBag").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#CargoPcs").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#CargoPcs").val())) ? 0 : parseInt($("#CargoPcs").val());
        var b = isNaN(parseInt($("#old_CargoPcs").val())) ? 0 : parseInt($("#old_CargoPcs").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#CargoPcs').css("color", "tomato");
            if (colchange.indexOf(",cargo_CargoPcs") < 0) {
                colchange = colchange + ",cargo_CargoPcs";
            }
        }
        else {
            $('#CargoPcs').css("color", "black");
            if (colchange.indexOf(",cargo_CargoPcs") >= 0) {
                colchange = colchange.replace(",cargo_CargoPcs", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#CargoPcs").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#CargoWei").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#CargoWei").val())) ? 0 : parseInt($("#CargoWei").val());
        var b = isNaN(parseInt($("#old_CargoWei").val())) ? 0 : parseInt($("#old_CargoWei").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#CargoWei').css("color", "tomato");
            if (colchange.indexOf(",cargo_CargoWei") < 0) {
                colchange = colchange + ",cargo_CargoWei";
            }
        }
        else {
            $('#CargoWei').css("color", "black");
            if (colchange.indexOf(",cargo_CargoWei") >= 0) {
                colchange = colchange.replace(",cargo_CargoWei", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#CargoWei").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#Mail").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#Mail").val())) ? 0 : parseInt($("#Mail").val());
        var b = isNaN(parseInt($("#old_Mail").val())) ? 0 : parseInt($("#old_Mail").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#Mail').css("color", "tomato");
            if (colchange.indexOf(",cargo_Mail") < 0) {
                colchange = colchange + ",cargo_Mail";
            }
        }
        else {
            $('#Mail').css("color", "black");
            if (colchange.indexOf(",cargo_Mail") >= 0) {
                colchange = colchange.replace(",cargo_Mail", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#Mail").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("#ActureTime").on("click", function () {
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
                    $("#ActureTime").trigger("input");
                } else {
                    $(this).focus();
                }
            }
        }
    });
    $("#ActureTime").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#ActureTime").val())) ? 0 : parseInt($("#ActureTime").val());
        var b = isNaN(parseInt($("#old_ActureTime").val())) ? 0 : parseInt($("#old_ActureTime").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#ActureTime').css("color", "tomato");
            if (colchange.indexOf(",acturetime_Time") < 0) {
                colchange = colchange + ",acturetime_Time";
            }
        }
        else {
            $('#ActureTime').css("color", "black");
            if (colchange.indexOf(",acturetime_Time") >= 0) {
                colchange = colchange.replace(",acturetime_Time", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#ActureTime").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#reason").on("input", function () {
        //tinhtoan();
        var a = $("#reason").val().toString().trim();
        var b = $("#old_reason").val().toString().trim();
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#reason').css("color", "tomato");
            if (colchange.indexOf(",acturetime_reason") < 0) {
                colchange = colchange + ",acturetime_reason";
            }
        }
        else {
            $('#reason').css("color", "black");
            if (colchange.indexOf(",acturetime_reason") >= 0) {
                colchange = colchange.replace(",acturetime_reason", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });

    //$("#bdt").on("click", function () {
    //    if (!$(this).attr('readonly')) {
    //        var oldvalue = $(this).val();
    //        if (oldvalue == 'undefined' || oldvalue.trim() == "") {
    //            var aDate = new Date($.now());
    //            var h = aDate.getHours();
    //            var m = aDate.getMinutes();
    //            if (h < 10) h = '0' + h;
    //            if (m < 10) m = '0' + m;
    //            var time = h.toString() + m.toString();
    //            if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
    //                $(this).val(time);
    //                $("#bdt").trigger("input");
    //            } else {
    //                $(this).focus();
    //            }
    //        }
    //    }
    //});
    //$("#bdt").on("input", function () {
    //    //tinhtoan();
    //    var a = isNaN(parseInt($("#bdt").val())) ? 0 : parseInt($("#bdt").val());
    //    var b = isNaN(parseInt($("#old_bdt").val())) ? 0 : parseInt($("#old_bdt").val());
    //    var colchange = $('#partChange').val();
    //    if (a != b) {
    //        $('#bdt').css("color", "tomato");
    //        if (colchange.indexOf(",boardinginfor_bdt") < 0) {
    //            colchange = colchange + ",boardinginfor_bdt";
    //        }
    //    }
    //    else {
    //        $('#bdt').css("color", "black");
    //        if (colchange.indexOf(",boardinginfor_bdt") >= 0) {
    //            colchange = colchange.replace(",boardinginfor_bdt", "");
    //        }
    //    }
    //    $('#partChange').val(colchange);
    //    checkbutton();
    //});
    //$("#bdt").keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //        return false;
    //    }
    //});

    //$("#fht").on("click", function () {
    //    if (!$(this).attr('readonly')) {
    //        var oldvalue = $(this).val();
    //        if (oldvalue == 'undefined' || oldvalue.trim() == "") {
    //            var aDate = new Date($.now());
    //            var h = aDate.getHours();
    //            var m = aDate.getMinutes();
    //            if (h < 10) h = '0' + h;
    //            if (m < 10) m = '0' + m;
    //            var time = h.toString() + m.toString();
    //            if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
    //                $(this).val(time);
    //                $("#fht").trigger("input");
    //            } else {
    //                $(this).focus();
    //            }
    //        }
    //    }
    //});
    //$("#fht").on("input", function () {
    //    //tinhtoan();
    //    var a = isNaN(parseInt($("#fht").val())) ? 0 : parseInt($("#fht").val());
    //    var b = isNaN(parseInt($("#old_fht").val())) ? 0 : parseInt($("#old_fht").val());
    //    var colchange = $('#partChange').val();
    //    if (a != b) {
    //        $('#fht').css("color", "tomato");
    //        if (colchange.indexOf(",boardinginfor_fht") < 0) {
    //            colchange = colchange + ",boardinginfor_fht";
    //        }
    //    }
    //    else {
    //        $('#fht').css("color", "black");
    //        if (colchange.indexOf(",boardinginfor_fht") >= 0) {
    //            colchange = colchange.replace(",boardinginfor_fht", "");
    //        }
    //    }
    //    $('#partChange').val(colchange);
    //    checkbutton();
    //});
    //$("#fht").keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //        return false;
    //    }
    //});
    //$("#FPBD").on("click", function () {
    //    if (!$(this).attr('readonly')) {
    //        var oldvalue = $(this).val();
    //        if (oldvalue == 'undefined' || oldvalue.trim() == "") {
    //            var aDate = new Date($.now());
    //            var h = aDate.getHours();
    //            var m = aDate.getMinutes();
    //            if (h < 10) h = '0' + h;
    //            if (m < 10) m = '0' + m;
    //            var time = h.toString() + m.toString();
    //            if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
    //                $(this).val(time);
    //                $("#FPBD").trigger("input");
    //            } else {
    //                $(this).focus();
    //            }
    //        }
    //    }
    //});
    //$("#FPBD").on("input", function () {
    //    //tinhtoan();
    //    var a = isNaN(parseInt($("#FPBD").val())) ? 0 : parseInt($("#FPBD").val());
    //    var b = isNaN(parseInt($("#old_FPBD").val())) ? 0 : parseInt($("#old_FPBD").val());
    //    var colchange = $('#partChange').val();
    //    if (a != b) {
    //        $('#FPBD').css("color", "tomato");
    //        if (colchange.indexOf(",boardinginfor_FPBD") < 0) {
    //            colchange = colchange + ",boardinginfor_FPBD";
    //        }
    //    }
    //    else {
    //        $('#FPBD').css("color", "black");
    //        if (colchange.indexOf(",boardinginfor_FPBD") >= 0) {
    //            colchange = colchange.replace(",boardinginfor_FPBD", "");
    //        }
    //    }
    //    $('#partChange').val(colchange);
    //    checkbutton();
    //});
    //$("#FPBD").keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //        return false;
    //    }
    //});

    //$("#LPBD").on("click", function () {
    //    if (!$(this).attr('readonly')) {
    //        var oldvalue = $(this).val();
    //        if (oldvalue == 'undefined' || oldvalue.trim() == "") {
    //            var aDate = new Date($.now());
    //            var h = aDate.getHours();
    //            var m = aDate.getMinutes();
    //            if (h < 10) h = '0' + h;
    //            if (m < 10) m = '0' + m;
    //            var time = h.toString() + m.toString();
    //            if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
    //                $(this).val(time);
    //                $("#LPBD").trigger("input");
    //            } else {
    //                $(this).focus();
    //            }
    //        }
    //    }
    //});
    //$("#LPBD").on("input", function () {
    //    //tinhtoan();
    //    var a = isNaN(parseInt($("#LPBD").val())) ? 0 : parseInt($("#LPBD").val());
    //    var b = isNaN(parseInt($("#old_LPBD").val())) ? 0 : parseInt($("#old_LPBD").val());
    //    var colchange = $('#partChange').val();
    //    if (a != b) {
    //        $('#LPBD').css("color", "tomato");
    //        if (colchange.indexOf(",boardinginfor_LPBD") < 0) {
    //            colchange = colchange + ",boardinginfor_LPBD";
    //        }
    //    }
    //    else {
    //        $('#LPBD').css("color", "black");
    //        if (colchange.indexOf(",boardinginfor_LPBD") >= 0) {
    //            colchange = colchange.replace(",boardinginfor_LPBD", "");
    //        }
    //    }
    //    $('#partChange').val(colchange);
    //    checkbutton();
    //});

    //$("#MTTT").on("click", function () {
    //    if (!$(this).attr('readonly')) {
    //        var oldvalue = $(this).val();
    //        if (oldvalue == 'undefined' || oldvalue.trim() == "") {
    //            var aDate = new Date($.now());
    //            var h = aDate.getHours();
    //            var m = aDate.getMinutes();
    //            if (h < 10) h = '0' + h;
    //            if (m < 10) m = '0' + m;
    //            var time = h.toString() + m.toString();
    //            if (confirm('Bạn mốn lấy giờ hiện tại ' + time + ' không?')) {
    //                $(this).val(time);
    //                $("#MTTT").trigger("input");
    //            } else {
    //                $(this).focus();
    //            }
    //        }
    //    }
    //});
    $("#MTTT").on("input", function () {
        //tinhtoan();
        var a = isNaN(parseInt($("#MTTT").val())) ? 0 : parseInt($("#MTTT").val());
        var b = isNaN(parseInt($("#old_MTTT").val())) ? 0 : parseInt($("#old_MTTT").val());
        var colchange = $('#partChange').val();
        if (a != b) {
            $('#MTTT').css("color", "tomato");
            if (colchange.indexOf(",MTTT") < 0) {
                colchange = colchange + ",MTTT";
            }
        }
        else {
            $('#MTTT').css("color", "black");
            if (colchange.indexOf(",MTTT") >= 0) {
                colchange = colchange.replace(",MTTT", "");
            }
        }
        $('#partChange').val(colchange);
        checkbutton();
    });
    $("#MTTT").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#CargoWei").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $("#LPBD").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
});


//View bag infor
function getBagageInfor() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getBagInfor", { flightID: myId }, function (result) {
        if (result != null) {
            $('#BagPcs').val(result.Bag_Pcs == null ? 0 : result.Bag_Pcs);
            $('#BagWei').val(result.Bag_Wei == null ? 0 : result.Bag_Wei);

            $('#old_BagPcs').val(result.Bag_Pcs == null ? 0 : result.Bag_Pcs);
            $('#old_BagWei').val(result.Bag_Wei == null ? 0 : result.Bag_Wei);
        }
        else {
            $('#BagPcs').val(0);
            $('#BagWei').val(0);

            $('#old_BagPcs').val(0);
            $('#old_BagWei').val(0);
        }
        $('#BagPcs').css("color", "black");
        $('#BagWei').css("color", "black");
        var colchange = $('#partChange').val();
        colchange = colchange.replace(",BagageInfor_BagPcs", "");
        colchange = colchange.replace(",BagageInfor_BagWei", "");
        $('#partChange').val(colchange);
    });
}
//View passenger infor
function getPassengerInfor() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getPaxInfor", { flightID: myId }, function (data) {
        if (data != null) {
            $('#paxC').val(data.Booking == null ? "0C / 0Y" : data.Booking);
            $('#paxY').val(data.checkin == null ? "0C / 0Y" : data.checkin);
            $('#ADL').val(data.ADL == null ? 0 : data.ADL);
            $('#CHD').val(data.CHD == null ? 0 : data.CHD);
            $('#INF').val(data.INF == null ? 0 : data.INF);

            $('#old_paxC').val(data.Booking == null ? "0C / 0Y" : data.Booking);
            $('#old_paxY').val(data.checkin == null ? "0C / 0Y" : data.checkin);
            $('#old_ADL').val(data.ADL == null ? 0 : data.ADL);
            $('#old_CHD').val(data.CHD == null ? 0 : data.CHD);
            $('#old_INF').val(data.INF == null ? 0 : data.INF);

            //tinhtoan();
        } else {
            $('#paxC').val("0C / 0Y");
            $('#paxY').val("0C / 0Y");
            $('#ADL').val(0);
            $('#CHD').val(0);
            $('#INF').val(0);

            $('#old_paxC').val("0C / 0Y");
            $('#old_paxY').val("0C / 0Y");
            $('#old_ADL').val(0);
            $('#old_CHD').val(0);
            $('#old_INF').val(0);
        }
        $('#paxC').css("color", "black");
        $('#paxY').css("color", "black");
        $('#ADL').css("color", "black");
        $('#CHD').css("color", "black");
        $('#INF').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",PassengerInfor_ADL", "");
        colchange = colchange.replace(",PassengerInfor_CHD", "");
        colchange = colchange.replace(",PassengerInfor_INF", "");
        colchange = colchange.replace(",PassengerInfor_paxC", "");
        colchange = colchange.replace(",PassengerInfor_paxY", "");
        $('#partChange').val(colchange);
    });
}
//View cargo infor
function getcargo() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getCargoInfor", { flightID: myId }, function (result) {
        if (result != null) {
            $('#CargoPcs').val(result.Cargo_Pcs == null ? 0 : result.Cargo_Pcs);
            $('#CargoWei').val(result.Cargo_Wei == null ? 0 : result.Cargo_Wei);
            $('#Mail').val(result.Mail == null ? 0 : result.Mail);

            $('#old_CargoPcs').val(result.Cargo_Pcs == null ? 0 : result.Cargo_Pcs);
            $('#old_CargoWei').val(result.Cargo_Wei == null ? 0 : result.Cargo_Wei);
            $('#old_Mail').val(result.Mail == null ? 0 : result.Mail);
        }
        else {
            $('#CargoPcs').val(0);
            $('#CargoWei').val(0);
            $('#Mail').val(0);

            $('#old_CargoPcs').val(0);
            $('#old_CargoWei').val(0);
            $('#old_Mail').val(0);
        }
        $('#CargoPcs').css("color", "black");
        $('#CargoWei').css("color", "black");
        $('#Mail').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",cargo_CargoPcs", "");
        colchange = colchange.replace(",cargo_CargoWei", "");
        colchange = colchange.replace(",cargo_Mail", "");
        $('#partChange').val(colchange);
    });
}

//get minimum turn around
function getMinimumTurnaround() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getMinimumTurnAround", { flightID: myId}, function (result) {
        //if (result != null) {
        //    $('#MTTT').val(result.Time == null ? "" : result.Time);
        //    $('#old_MTTT').val(result.Time == null ? "" : result.Time);
        //}
        //else {
        //    $('#MTTT').html("");
        //    $('#old_MTTT').html("");
        //}
        //$('#MTTT').css("color", "black");

        //var colchange = $('#partChange').val();
        //colchange = colchange.replace(",MTTT", "");
        //$('#partChange').val(colchange);
        if (result.message == "ok")
        {
            $('#MTTT').val(result.Time == null ? "" : result.Time);
            $('#old_MTTT').val(result.Time == null ? "" : result.Time);
            $('#MTTT').css("color", "black");
            var colchange = $('#partChange').val();
            colchange = colchange.replace(",MTTT", "");
            $('#partChange').val(colchange);
        }
        else if (result.message == "Exists") {
            $('#MTTT').val(result.Time == null ? "" : result.Time);
            $('#old_MTTT').val("");
            $('#MTTT').css("color", "tomato");
            var colchange = $('#partChange').val();
            if (colchange.indexOf(",MTTT") < 0) {
                colchange = colchange + ",MTTT";
            }
            $('#partChange').val(colchange);
            $("#saveflight").show();
        }
        else {
            $('#MTTT').val("");
            $('#old_MTTT').val("");
            $('#MTTT').css("color", "black");
            var colchange = $('#partChange').val();
            colchange = colchange.replace(",MTTT", "");
            $('#partChange').val(colchange);
        }
    });
}

//View ATA/ATD


function getacturetime() {
    var myId = $('#flightid').val();
    var arrdep = $('#arrdep').val();
    $.getJSON("/DiscussFlight/getActureTime", { flightID: myId, ArrDep: arrdep }, function (result) {
        if (result != null) {
            if (ad == "A") {
                $('#ATA').html(result.Time == null ? 0 : result.Time);
            }
            {
                $('#ATD').html(result.Time == null ? 0 : result.Time);
            }
            $('#ActureTime').val(result.Time == null ? "" : result.Time);
            $('#reason').val(result.Remark);


            $('#old_ActureTime').val(result.Time == null ? "" : result.Time);
            $('#old_reason').val(result.Remark);
        }
        else {
            $('#ATA').html("");
            $('#ATD').html("");
            $('#ActureTime').val("");
            $('#reason').val("");

            $('#old_ActureTime').val("");
            $('#old_reason').val("");
        }
        $('#ActureTime').css("color", "black");
        $('#reason').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",acturetime_Time", "");
        colchange = colchange.replace(", acturetime_reason", "");
        $('#partChange').val(colchange);
        //getSmischeck();
    });
}
function getbaggageHandling() {
    var myId = $('#flightid').val();
    var ad = $('#arrdep').val();
    $.getJSON("/DiscussFlight/getBaggageHandling", { flightID: myId }, function (result) {
        if (result != null) {
            $('#fstBag').val(result.FirstBag == null ? "" : result.FirstBag);
            $('#lstBag').val(result.LastBag == null ? "" : result.LastBag);

            $('#old_fstBag').val(result.FirstBag == null ? "" : result.FirstBag);
            $('#old_lstBag').val(result.LastBag == null ? "" : result.LastBag);

            $('#fstBagGS').val(result.FirstBag_gs == null ? "" : result.FirstBag_gs);
            $('#lstBagGS').val(result.LastBag_gs == null ? "" : result.LastBag_gs);

            $('#old_lstBagGS').val(result.FirstBag_gs == null ? "" : result.FirstBag_gs);
            $('#old_lstBagGS').val(result.LastBag_gs == null ? "" : result.LastBag_gs);
        }
        else {
            $('#fstBag').val("");
            $('#lstBag').val("");

            $('#old_fstBag').val("");
            $('#old_lstBag').val("");

            $('#fstBagGS').val("");
            $('#lstBagGS').val("");

            $('#old_lstBagGS').val("");
            $('#old_fstBagGS').val("");
        }
        $('#fstBag').css("color", "black");
        $('#lstBag').css("color", "black");
        $('#fstBagGS').css("color", "black");
        $('#lstBagGS').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",BaggageHandling_fstBag", "");
        colchange = colchange.replace(",BaggageHandling_lstBag", "");
        colchange = colchange.replace(",Baggageramp_fstBagGS", "");
        colchange = colchange.replace(",Baggageramp_lstBagGS", "");
        $('#partChange').val(colchange);
        getSmischeck();
    });
}
//View Zone
function getzone() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getzoneinfor", { flightID: myId }, function (result) {
        if (result != null) {
            $('#ZoneOA').val(result.OA == null ? 0 : result.OA);
            $('#ZoneOB').val(result.OB == null ? 0 : result.OB);
            $('#ZoneOC').val(result.OC == null ? 0 : result.OC);
            $('#ZoneOD').val(result.OD == null ? 0 : result.OD);

            $('#old_ZoneOA').val(result.OA == null ? 0 : result.OA);
            $('#old_ZoneOB').val(result.OB == null ? 0 : result.OB);
            $('#old_ZoneOC').val(result.OC == null ? 0 : result.OC);
            $('#old_ZoneOD').val(result.OD == null ? 0 : result.OD);
        }
        else {
            $('#ZoneOA').val(0);
            $('#ZoneOB').val(0);
            $('#ZoneOC').val(0);
            $('#ZoneOD').val(0);

            $('#old_ZoneOA').val(0);
            $('#old_ZoneOB').val(0);
            $('#old_ZoneOC').val(0);
            $('#old_ZoneOD').val(0);
        }

        $('#ZoneOA').css("color", "black");
        $('#ZoneOB').css("color", "black");
        $('#ZoneOC').css("color", "black");
        $('#ZoneOD').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",zone_ZoneOA", "");
        colchange = colchange.replace(",zone_ZoneOB", "");
        colchange = colchange.replace(",zone_ZoneOC", "");
        colchange = colchange.replace(",zone_ZoneOD", "");
        $('#partChange').val(colchange);
    });
}
function getboardinginfor() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/getBoardingInfor", { flightID: myId }, function (result) {
        if (result != null) {
            $('#bdt').val(result.BDT == null ? 0 : result.BDT);
            $('#fht').val(result.FHT == null ? 0 : result.FHT);
            $('#FPBD').val(result.FPBD == null ? 0 : result.FPBD);
            $('#LPBD').val(result.LPBD == null ? 0 : result.LPBD);

            $('#old_bdt').val(result.BDT == null ? 0 : result.BDT);
            $('#old_fht').val(result.FHT == null ? 0 : result.FHT);
            $('#old_FPBD').val(result.FPBD == null ? 0 : result.FPBD);
            $('#old_LPBD').val(result.LPBD == null ? 0 : result.LPBD);
        }
        else {
            $('#bdt').val(0);
            $('#fht').val(0);
            $('#aobt').val(0);

            $('#old_bdt').val(0);
            $('#old_fht').val(0);
            $('#old_FPBD').val(0);
            $('#old_LPBD').val(0);
        }

        $('#bdt').css("color", "black");
        $('#fht').css("color", "black");
        $('#FPBD').css("color", "black");
        $('#LPBD').css("color", "black");

        var colchange = $('#partChange').val();
        colchange = colchange.replace(",boardinginfor_bdt", "");
        colchange = colchange.replace(", boardinginfor_fht", "");
        colchange = colchange.replace(",boardinginfor_FPBD", "");
        colchange = colchange.replace(",boardinginfor_LPBD", "");
        $('#partChange').val(colchange);
    });
}
function getSPGS() {
    //#SpecialServicesGS
    var id = $('#flightid').val();
    $.getJSON("/DiscussFlight/getSpecialServicesGSInf", { flightID: id }, function (data) {
        if (data != null) {
            $('#SpecialServicesGS').html(data.ServiesName.trim() + '      - Remark: ' + data.Note.trim());
        }
        else {
            $('#SpecialServicesGS').html('');
        }
    }
    );
}
function getSPHK() {
    //#SpecialServicesGS
    var id = $('#flightid').val();
    $.getJSON("/DiscussFlight/getSpecialServicesHKInf", { flightID: id }, function (data) {
        if (data != null) {
            $('#SpecialServicesHK').html(data.ServiesName.trim() + '      - Remark: ' + data.Note.trim());
        }
        else {
            $('#SpecialServicesHK').html('');
        }
    }
    );
}
function getlistchatMessages() {
    var myId = $('#flightid').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/getchatmessage",
        data: { flightID: myId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                $(".ChatView").empty().append("");
            }
            else {

                $(".ChatView").empty().append(result);
            }
        },
        error: function () {
            $(".ChatView").empty().append('');
        },
        complete: function () {
            //callRingtone();
            Divscrollbottom();
        }
    });

    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/getnumberchatmessage",
        data: { flightID: myId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (ketqua) {
            $('#numberchat').html(ketqua);
        }
    });


}
function Divscrollbottom() {
    var objDiv = $('.msg_card_body');
    objDiv.animate({ scrollTop: 10000 }, 0);
    //objDiv.scrollTop(objDiv.height() +1000);
}
function callRingtone() {
    var audio = new Audio('/audio/tinnhan.mp3');
    audio.play();
}
function getFlightStatus() {
    var myId = $('#flightid').val();
    var isclose = false;
    var owner = "";
    var ArrDep = "";
    var MaBoPhan = "";
    var person = "";
    var time = "";
    $.getJSON("/DiscussFlight/checkstatusflight", { flightID: myId }, function (result) {
        if (result != null) {

            if (result.Status == true) {
                $(".passenger").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                if (result.owner == "another") {
                    $('#fltStatus').attr('class', 'fltstatusOpen1');
                    $('#statusContent').html(result.Person + ' closed at ' + result.Time);
                }
                else {
                    $('#fltStatus').attr('class', 'fltstatusOpen');
                    $('#statusContent').html('You closed at ' + result.Time + ' , click here to open again');
                }
            }
            else if (result.Status == false && ((result.MaBoPhan == "GS" && result.ArrDep == "D"))) {
                $(".passenger").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", false);
                    $(this).css("background-color", "white");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });

            }
            else if (result.Status == false && ((result.MaBoPhan == "GS" && result.ArrDep == "A"))) {
                $(".passenger").each(function () {
                    $(this).prop("readonly", false);
                    $(this).css("background-color", "white");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", false);
                    $(this).css("background-color", "white");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $('#ZoneOA').css("background-color", "#DCDCDC");

                $('#ZoneOB').css("background-color", "#DCDCDC");
                $('#ZoneOC').css("background-color", "#DCDCDC");
                $('#ZoneOD').css("background-color", "#DCDCDC");
                $('#paxC').css("background-color", "#DCDCDC");
                $('#paxY').css("background-color", "#DCDCDC");
                $('#fltStatus').attr('class', 'fltstatusClose');
                $('#statusContent').html('Close flight now');
                $('#ZoneOA').prop("readonly", true);
                $('#ZoneOB').prop("readonly", true);
                $('#ZoneOC').prop("readonly", true);
                $('#ZoneOD').prop("readonly", true);
                $('#paxC').prop("readonly", true);
                $('#paxY').prop("readonly", true);
                //$('#bdt').prop("readonly", true);
                //$('#bdt').css("background-color", "#DCDCDC");
            }
            else if (result.Status == false && ((result.MaBoPhan == "HK" && result.ArrDep == "D"))) {
                $(".passenger").each(function () {
                    $(this).prop("readonly", false);
                    $(this).css("background-color", "white");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $('#fltStatus').attr('class', 'fltstatusClose');
                $('#statusContent').html('Close flight now');
            }
            else if (result.Status == false && ((result.MaBoPhan == "HK" && result.ArrDep == "A"))) {
                $(".passenger").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
            }
            else if (result.MaBoPhan == "HL") {
                $(".passenger").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", false);
                    $(this).css("background-color", "white");
                });
                $('#fltStatus').attr('class', 'fltstatusClose1');
            }
            else {
                $(".passenger").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".ramp").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
                $(".PVHL").each(function () {
                    $(this).prop("readonly", true);
                    $(this).css("background-color", "#DCDCDC");
                });
            }
        }
    });
}
function openFrame() {
    $('.ChatView').show();
    Divscrollbottom();
    document.getElementById("linkchat1").style.display = "none";
}
$(document).on('click', '.send_btn', function () {
    $(this).prop('disabled', true);
    savemessagetoserver();
    $(this).prop('disabled', false);
});
function savemessagetoserver() {
    var mess = $('#lg').val().toString();
    var id = $('#flightid').val();
    var replyid;
    try {
        replyid = $('#Reply_id').val();
    }
    catch (err) {
        replyid = 0;
    }
    if (mess.trim().length > 0) {
        $.ajax({
            url: '/DiscussFlight/sendMessage',
            data: { message: mess, flightID: id, ReplyId: replyid },
            success: function (resp) {
                $('#lg').val('');
                $('#lg').focus();
                var hub = $.connection.myHub;
                hub.server.saveMessage('_' + $('#flightid').val());
            }
        });
    }
}
$(document).on('click touchstart', '#imgFuntion', function () {
    $('#linkchat1').show();
    $('.ChatView').hide();
});
$(document).on('click touchstart', '#saveflight', function () {
    $(this).prop('disabled', true);
    GSSave();
    $(this).prop('disabled', false);
});
function GSSave() {
    var colchange = $('#partChange').val();
    var hub = $.connection.myHub;

    if (colchange.indexOf(",acturetime") >= 0) {
        $.when(saveMVT()).then(function () {
            hub.server.saveacturetime($('#flightid').val());
        });

    }
    if (colchange.indexOf(",MTTT") >= 0) {
        $.when(saveMTTT()).then(function () {
            hub.server.saveMinimuTurnAround($('#flightid').val());
        });

    }
    if (colchange.indexOf(",Baggageramp") >= 0) {
        $.when(saveBaggageHandling()).then(function () {
            hub.server.saveBaggage($('#flightid').val());
        });

    }

    if (colchange.indexOf(",cargo") >= 0) {
        $.when(saveCargoInfor()).then(function () {
            hub.server.savecargo($('#flightid').val());
            hub.server.sendNonification($('#flightid').val());
        });

    }

    //if (colchange.indexOf(",boardinginfor") >= 0) {
    //    $.when(saveBoardingInf()).then(function () {
    //        hub.server.saveboardinginfor($('#flightid').val());
    //    });

    //}

    if (colchange.indexOf(",PassengerInfor") >= 0) {
        $.when(savePaxInfor()).then(function () {
            hub.server.savePaxInfor($('#flightid').val());
            hub.server.sendNonification($('#flightid').val());
        });

    }

    if (colchange.indexOf(",BagageInfor") >= 0) {
        $.when(saveBaginfor()).then(function () {
            hub.server.saveBagInfor($('#flightid').val());
            hub.server.sendNonification($('#flightid').val());
        });
    }

    if (colchange.indexOf(",zone") >= 0) {
        $.when(saveZoneInfor()).then(function () {
            hub.server.saveZoneInfor($('#flightid').val());
            hub.server.sendNonification($('#flightid').val());
        });
    }
    alert('Save success');
}
function ModalViewAllStaff() {
    $('#ViewListstaff').modal();
    getAllMessages();
    $("#EditSpecialServicesGS").draggable({
        handle: ".modal-header"
    });
}

function ModalViewhistory() {
    $('#modalViewhistory').modal();
    gethistory();
    $("#EditSpecialServicesGS").draggable({
        handle: ".modal-header"
    });
}
function ModalViewTimeTurnAround() {
    $('#ListTimeTurnAround').modal();
    var myId = $('#flightid').val();
    var tbl = $('#modalContent');
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/getListMinimumTurnAround",
        data: { flightID: myId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                tbl.empty().append("NIL");
            }
            else {
                tbl.empty().append(result);
            }
        },
        error: function () {
            alert("Web app can not connect to server");
            window.location = '/Exam/Login';
        }
    });
}
function getSmischeck() {
    var myId = $('#flightid').val();
    $.getJSON("/DiscussFlight/checkSendToSMIS", { flightID: myId }, function (result) {
        if (result.MSG != '') {
            $('#SMIS_MSG').html(result.MSG);
            alert(result.MSG);
        }
    });
}
function closeflight() {
    var abc = confirm("Bạn chắc chắn muốn thay đổi trạng thái chuyến bay?");
    if (abc == false) {
        return;
    }
    var myId = $('#flightid').val();
    var isclose = false;
    var owner = "";
    var ArrDep = "";
    var MaBoPhan = "";
    var person = "";
    var time = "";
    $.getJSON("/DiscussFlight/checkstatusflight", { flightID: myId }, function (result) {
        if (result != null) {
            if (result.strErr != "") {
                alert(result.strErr)
            }
            else {
                if ((result.MaBoPhan == 'GS' && result.ArrDep == 'A') || (result.MaBoPhan == 'HK' && result.ArrDep == 'D')) {
                    if (isclose == true && result.owner != "mine") {
                        alert('you can not open flight. Contact ' + person);
                    }
                    else if (result.Status == true && result.owner == "mine") {
                        $.getJSON("/DiscussFlight/OpenStatus", { flightID: myId }, function (result) {
                        }).done(function (html) {
                            var hub = $.connection.myHub;
                            hub.server.sendNonification($('#flightid').val());
                            hub.server.saveStatus($('#flightid').val());
                        });;

                    }
                    else if (result.Status == false) {
                        $.getJSON("/DiscussFlight/closeStatus", { flightID: myId }, function (result) {
                        }).done(function (html) {
                            var hub = $.connection.myHub;
                            hub.server.sendNonification($('#flightid').val());
                            hub.server.saveStatus($('#flightid').val());
                        });;
                    }
                }
                else {
                    alert('you can not open flight. Contact ' + person);
                }
            }
        }
    });
}

function savePaxInfor() {
    var adl = isNaN(parseInt($("#ADL").val())) ? 0 : parseInt($("#ADL").val());
    var chd = isNaN(parseInt($("#CHD").val())) ? 0 : parseInt($("#CHD").val());
    var inf = isNaN(parseInt($("#INF").val())) ? 0 : parseInt($("#INF").val());
    var cpax = $("#paxC").val().toString().trim() == "" ? "0C / 0Y" : $("#paxC").val().toString().trim();
    var ypax = $("#paxY").val().toString().trim() == "" ? "0C / 0Y" : $("#paxY").val().toString().trim();
    var id = $('#flightid').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/savePax",
        data: { flightID: id, Adl: adl, Chd: chd, Inf: inf, C: cpax, Y: ypax },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveMVT() {

    var reason = $('#reason').val().toString();
    var actureTime = isNaN($('#ActureTime').val()) ? "" : $('#ActureTime').val().toString();
    if (actureTime.length == 1) actureTime = "000" + actureTime;
    else if (actureTime.length == 2) actureTime = "00" + actureTime;
    else if (actureTime.length == 3) actureTime = "0" + actureTime;
    else if (actureTime.length > 4) {
        alert('Time not valid');
        return;
    }
    var id = $('#flightid').val();

    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveMVTTime",
        data: { flightID: id, MVT: actureTime, Note: reason },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}



function saveMTTT() {

    var _mttt = $('#MTTT').val().toString();
    if (_mttt.length == 1) _mttt = "000" + _mttt;
    else if (_mttt.length == 2) _mttt = "00" + _mttt;
    else if (_mttt.length == 3) _mttt = "0" + _mttt;
    else if (_mttt.length > 4) {
        alert('Time not valid');
        return;
    }
    var id = $('#flightid').val();

    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveMTTTime",
        data: { flightID: id, MTTT: _mttt},
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveBaggageHandling() {

    var firstBag = isNaN($('#fstBag').val()) ? "" : $('#fstBag').val();
    var lastBag = isNaN($('#lstBag').val()) ? "" : $('#lstBag').val();
    //var firstBaggs = isNaN($('#fstBagGS').val()) ? "" : $('#fstBagGS').val();
    //var lastBaggs = isNaN($('#lstBagGS').val()) ? "" : $('#lstBagGS').val();
    var firstBaggs = "";
    var lastBaggs = "";
    var id = $('#flightid').val();

    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveBaggageHandling",
        data: { flightID: id, firstbag: firstBag, lastbag: lastBag, firstBag_gs: firstBaggs, lastBag_gs: lastBaggs },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveCargoInfor() {
    var id = $('#flightid').val();
    var cargopcs = isNaN(parseInt($("#CargoPcs").val())) ? 0 : parseInt($("#CargoPcs").val());
    var cargowei = isNaN(parseInt($("#CargoWei").val())) ? 0 : parseInt($("#CargoWei").val());
    var mail = isNaN(parseInt($("#Mail").val())) ? 0 : parseInt($("#Mail").val());
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveCargo",
        data: { flightID: id, Cargopcs: cargopcs, Cargowei: cargowei, Mail: mail },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveBoardingInf() {
    var _bdt = isNaN($('#bdt').val()) ? "" : $('#bdt').val().toString();
    var _fht = isNaN($('#fht').val()) ? "" : $('#fht').val().toString();
    var _LPBD = isNaN($('#LPBD').val()) ? "" : $('#LPBD').val().toString();
    var _FPBD = isNaN($('#FPBD').val()) ? "" : $('#FPBD').val().toString();

    if (_bdt.length == 1) _bdt = "000" + _bdt;
    else if (_bdt.length == 2) _bdt = "00" + _bdt;
    else if (_bdt.length == 3) _bdt = "0" + _bdt;
    else if (_bdt.length > 4) {
        alert('SBD not valid');
        return;
    }
    if (_fht.length == 1) _fht = "000" + _fht;
    else if (_fht.length == 2) _fht = "00" + _fht;
    else if (_fht.length == 3) _fht = "0" + _fht;
    else if (_fht.length > 4) {
        alert('FHT not valid');
        return;
    }
    if (_LPBD.length == 1) _LPBD = "000" + _LPBD;
    else if (_LPBD.length == 2) _LPBD = "00" + _LPBD;
    else if (_LPBD.length == 3) _LPBD = "0" + _LPBD;
    else if (_LPBD.length > 4) {
        alert('LPBD not valid');
        return;
    }
    if (_FPBD.length == 1) _FPBD = "000" + _FPBD
    else if (_FPBD.length == 2) _FPBD = "00" + _FPBD;
    else if (_FPBD.length == 3) _FPBD = "0" + _FPBD;
    else if (_FPBD.length > 4) {
        alert('FPBD not valid');
        return;
    }

    var id = $('#flightid').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveBoardingInf",
        data: { flightID: id, BDT: _bdt, FHT: _fht, FPBD: _FPBD, LPBD: _LPBD },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveBaginfor() {
    var bagpcs = isNaN(parseInt($("#BagPcs").val())) ? 0 : parseInt($("#BagPcs").val());
    var bagwei = isNaN(parseInt($("#BagWei").val())) ? 0 : parseInt($("#BagWei").val());
    var id = $('#flightid').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/savebag",
        data: { flightID: id, Bagpcs: bagpcs, Bagwei: bagwei },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveZoneInfor() {
    var oA = isNaN(parseInt($("#ZoneOA").val())) ? 0 : parseInt($("#ZoneOA").val());
    var oB = isNaN(parseInt($("#ZoneOB").val())) ? 0 : parseInt($("#ZoneOB").val());
    var oC = isNaN(parseInt($("#ZoneOC").val())) ? 0 : parseInt($("#ZoneOC").val());
    var oD = isNaN(parseInt($("#ZoneOD").val())) ? 0 : parseInt($("#ZoneOD").val());

    var id = $('#flightid').val();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveZone",
        data: { flightID: id, Oa: oA, Ob: oB, Oc: oC, Od: oD },
        success: function () {
            $("#saveflight").hide();
        },
        error: function () {
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function checkbutton() {
    var a = isNaN(parseInt($("#ZoneOA").val())) ? 0 : parseInt($("#ZoneOA").val());
    var b = isNaN(parseInt($("#ZoneOB").val())) ? 0 : parseInt($("#ZoneOB").val());
    var c = isNaN(parseInt($("#ZoneOC").val())) ? 0 : parseInt($("#ZoneOC").val());
    var d = isNaN(parseInt($("#ZoneOD").val())) ? 0 : parseInt($("#ZoneOD").val());
    var e = isNaN(parseInt($("#paxC").val())) ? 0 : parseInt($("#paxC").val());
    var f = isNaN(parseInt($("#paxY").val())) ? 0 : parseInt($("#paxY").val());
    var g = isNaN(parseInt($("#ADL").val())) ? 0 : parseInt($("#ADL").val());
    var h = isNaN(parseInt($("#CHD").val())) ? 0 : parseInt($("#CHD").val());
    var i = isNaN(parseInt($("#INF").val())) ? 0 : parseInt($("#INF").val());
    var j = isNaN(parseInt($("#BagPcs").val())) ? 0 : parseInt($("#BagPcs").val());
    var k = isNaN(parseInt($("#BagWei").val())) ? 0 : parseInt($("#BagWei").val());
    var l = isNaN(parseInt($("#CargoPcs").val())) ? 0 : parseInt($("#CargoPcs").val());
    var m = isNaN(parseInt($("#CargoWei").val())) ? 0 : parseInt($("#CargoWei").val());
    var n = isNaN(parseInt($("#Mail").val())) ? 0 : parseInt($("#Mail").val());
    var o = isNaN(parseInt($("#ActureTime").val())) ? 0 : parseInt($("#ActureTime").val());
    var p = $("#reason").val().toString().trim();
    var x = isNaN(parseInt($("#fstBag").val())) ? 0 : parseInt($("#fstBag").val());
    var s = isNaN(parseInt($("#lstBag").val())) ? 0 : parseInt($("#lstBag").val());
    var y = isNaN(parseInt($("#lstBagGS").val())) ? 0 : parseInt($("#lstBagGS").val());
    var z = isNaN(parseInt($("#fstBagGS").val())) ? 0 : parseInt($("#fstBagGS").val());
    var _mttt = isNaN(parseInt($("#MTTT").val())) ? 0 : parseInt($("#MTTT").val());
    //var _bdt = isNaN(parseInt($("#bdt").val())) ? 0 : parseInt($("#bdt").val());
    //var _fht = isNaN(parseInt($("#fht").val())) ? 0 : parseInt($("#fht").val());
    //var _FPBD = isNaN(parseInt($("#FPBD").val())) ? 0 : parseInt($("#FPBD").val());
    //var _LPBD = isNaN(parseInt($("#LPBD").val())) ? 0 : parseInt($("#LPBD").val());

    var a_ = isNaN(parseInt($("#old_ZoneOA").val())) ? 0 : parseInt($("#old_ZoneOA").val());
    var b_ = isNaN(parseInt($("#old_ZoneOB").val())) ? 0 : parseInt($("#old_ZoneOB").val());
    var c_ = isNaN(parseInt($("#old_ZoneOC").val())) ? 0 : parseInt($("#old_ZoneOC").val());
    var d_ = isNaN(parseInt($("#old_ZoneOD").val())) ? 0 : parseInt($("#old_ZoneOD").val());
    var e_ = isNaN(parseInt($("#old_paxC").val())) ? 0 : parseInt($("#old_paxC").val());
    var f_ = isNaN(parseInt($("#old_paxY").val())) ? 0 : parseInt($("#old_paxY").val());
    var g_ = isNaN(parseInt($("#old_ADL").val())) ? 0 : parseInt($("#old_ADL").val());
    var h_ = isNaN(parseInt($("#old_CHD").val())) ? 0 : parseInt($("#old_CHD").val());
    var i_ = isNaN(parseInt($("#old_INF").val())) ? 0 : parseInt($("#old_INF").val());
    var j_ = isNaN(parseInt($("#old_BagPcs").val())) ? 0 : parseInt($("#old_BagPcs").val());
    var k_ = isNaN(parseInt($("#old_BagWei").val())) ? 0 : parseInt($("#old_BagWei").val());
    var l_ = isNaN(parseInt($("#old_CargoPcs").val())) ? 0 : parseInt($("#old_CargoPcs").val());
    var m_ = isNaN(parseInt($("#old_CargoWei").val())) ? 0 : parseInt($("#old_CargoWei").val());
    var n_ = isNaN(parseInt($("#old_Mail").val())) ? 0 : parseInt($("#old_Mail").val());
    var o_ = isNaN(parseInt($("#old_ActureTime").val())) ? 0 : parseInt($("#old_ActureTime").val());
    var p_ = $("#old_reason").val().toString().trim();
    var x_ = isNaN(parseInt($("#old_fstBag").val())) ? 0 : parseInt($("#old_fstBag").val());
    var s_ = isNaN(parseInt($("#old_lstBag").val())) ? 0 : parseInt($("#old_lstBag").val());
    var y_ = isNaN(parseInt($("#old_lstBagGS").val())) ? 0 : parseInt($("#old_lstBagGS").val());
    var z_ = isNaN(parseInt($("#old_fstBagGS").val())) ? 0 : parseInt($("#old_fstBagGS").val());
    var mttt_ = isNaN(parseInt($("#old_MTTT").val())) ? 0 : parseInt($("#old_MTTT").val());
    //var bdt_ = isNaN(parseInt($("#old_bdt").val())) ? 0 : parseInt($("#old_bdt").val());
    //var fht_ = isNaN(parseInt($("#old_fht").val())) ? 0 : parseInt($("#old_fht").val());
    //var FPBD_ = isNaN(parseInt($("#old_FPBD").val())) ? 0 : parseInt($("#old_FPBD").val());
    //var LPBD_ = isNaN(parseInt($("#old_LPBD").val())) ? 0 : parseInt($("#old_LPBD").val());

    if (a != a_ || b != b_ || c != c_ || d != d_ || e != e_ || f != f_ || g != g_ || h != h_ || i != i_ || j != j_ || k != k_ || l != l_ || m != m_ || n != n_ || o != o_ || p != p_ || x != x_ || s != s_ || y != y_ || z != z_ || mttt_ != _mttt) {
        $("#saveflight").show();
    }
    else {
        $("#saveflight").hide();
    }
}
//View staff profile 
$(document).on('click touchstart', '.user_img_msg', function () {
    var currentID = $(this).attr('id');
    viewProfile(currentID);
});

$(document).on('click touchstart', '#btnTimeTurnAround', function () {
    var a = isNaN(parseInt($(this).html())) ? 0 : parseInt($(this).html());
    $("#MTTT").val(a);
    //var a = isNaN(parseInt($("#MTTT").val())) ? 0 : parseInt($("#MTTT").val());
    var b = isNaN(parseInt($("#old_MTTT").val())) ? 0 : parseInt($("#old_MTTT").val());
    var colchange = $('#partChange').val();
    if (a != b) {
        $('#MTTT').css("color", "tomato");
        if (colchange.indexOf(",MTTT") < 0) {
            colchange = colchange + ",MTTT";
        }
    }
    else {
        $('#MTTT').css("color", "black");
        if (colchange.indexOf(",MTTT") >= 0) {
            colchange = colchange.replace(",MTTT", "");
        }
    }
    $('#partChange').val(colchange);
    checkbutton();
});
function viewProfile(username) {
    $('#ViewProfileStaff').modal();
    var tbl = $('#Profile');
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/getStaffProfile",
        data: { username: username },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                tbl.empty().append("NIL");
            }
            else {
                tbl.empty().append(result);
                //return false;
            }
        },
        error: function () {
            alert("Web app can not connect to server");
            window.location = '/Login/Signin';
        }
    });
}
$(document).on('click touchstart', '#viewstaff', function () {
    ModalViewAllStaff();
});
$(document).on('click touchstart', '#viewHistory', function () {
    ModalViewhistory();
});
$(document).on('click touchstart', '#closeflight', function () {
    closeflight();
});
$(document).on('click touchstart', '#btnSpecialServicesHK', function () {
    addNewServicesHK();
});
$(document).on('click touchstart', '#btnSpecialServicesGS', function () {
    addNewServicesGS();
});
//View all staff
$(document).on('click touchstart', '#moreInfo', function () {
    ModalViewTimeTurnAround();
});

function closeimagemodal() {
    var modal = document.getElementById("myModalimg");
    modal.style.display = "none";

}
function openimg(path) {
    var model = parent.$('#myModalimg');
    model.modal();
    var modalImg = parent.$('#img01');
    modalImg.attr('src', path);
}


function getAllMessages() {
    var myId = $('#flightid').val();
    var tbl = $('#liststaff');
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/getAllStaff",
        data: { flightID: myId },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (result) {
            if (result.toString().trim().length == 0) {
                tbl.empty().append("NIL");
            }
            else {
                tbl.empty().append(result);
                //return false;
            }
        },
        error: function () {
            alert("Web app can not connect to server");
            window.location = '/Login/Signin';
        }
    });
}
function gethistory() {
    var myId = $('#flightid').val();
    var tbl = $('#viewhistory');
    $.getJSON("/DiscussFlight/getHistory", { flightID: myId }, function (data) {
        if (data.Content.toString().trim().length == 0) {
            tbl.empty().append("NIL");
            $('#HistoryTitle').html(data.Title.toString());
        }
        else {
            var resaa = data.Content.split(";");
            var myhtml = "<OL>";
            for (i = 0; i < resaa.length; i++) {
                if (resaa[i] != '') {
                    myhtml += "<LI> " + resaa[i] + "</LI>";
                }
            }
            myhtml += "</OL>";
            tbl.empty().append(myhtml);
            $('#HistoryTitle').html(data.Title);
        }
    });
}
function getValue() {
    var line, subline;
    var j, k;
    var adl = "";
    var hasPax = "0";
    var hasBag = "0";
    var hasCga = "0";
    var hasmail = "0";
    var start = "false"
    var chd = "";
    var inf = "";
    var bagspc = "";
    var bagswt = "";
    var cgaspc = "";
    var cgawt = "";
    var mail = "";
    var strErr = "";
    var myarray;
    var des = $('#destination').val();
    var lines = $('#txtMessage').val().split('\n');
    for (var i = 0; i < lines.length; i++) {
        line = lines[i].toString();
        //ADL, CHD, INF
        if (line.indexOf("-" + des + ".") >= 0 && hasPax == "0") {
            subline = "";
            j = line.indexOf("-" + des + ".") + 5;
            while (j < line.length && (!isNaN(line[j]) || line[j] == "/")) {
                subline += line[j];
                j++;
            }
            myarray = subline.split("/");
            if (myarray.length == 3) {
                adl = myarray[0].toString().trim();
                chd = myarray[1].toString().trim();
                inf = myarray[2].toString().trim();
                hasPax = "1";
                continue;
            }
            else if (subline.split("/").length == 4) {
                adl = (parseInt(myarray[0].toString().trim()) + parseInt(myarray[1].toString().trim())).toString();
                chd = myarray[2].toString().trim();
                inf = myarray[3].toString().trim();
                hasPax = "1";
                continue;
            }
        }

        //Bag
        if (line.indexOf("SI") >= 0) {
            start = "true";
        }
        if (line.indexOf(" B") >= 0 && hasBag == "0" && start == "true") {
            subline = "";
            j = line.indexOf(" B") + 2;
            while (j < line.length && (!isNaN(line[j]) || line[j] == "/") && line[j] != " ") {
                subline += line[j];
                j++;
            }
            myarray = subline.split("/");
            if (myarray.length == 2) {
                bagspc = myarray[0].toString().trim();
                bagswt = myarray[1].toString().trim();
                hasBag = "1";
            }
            else {
                bagspc = subline.trim();
                bagswt = 0;
                hasBag = "1";
            }

        }


        //Cargo
        if (line.indexOf(" C") >= 0 && hasCga == "0" && start == "true") {
            subline = "";
            j = line.indexOf(" C") + 2;
            while (j < line.length && (!isNaN(line[j]) || line[j] == "/") && line[j] != " ") {
                subline += line[j];
                j++;
            }

            myarray = subline.split("/");

            if (myarray.length == 2) {
                cgaspc = myarray[0].toString().trim();
                cgawt = myarray[1].toString().trim();
                hasCga = "1";
            }
            else {
                cgaspc = subline.trim();
                cgawt = 0;
                hasCga = "1";
            }
        }

        //Mail
        if (line.indexOf(" M") >= 0 && hasmail == "0" && start == "true") {
            subline = "";
            j = line.indexOf(" M") + 2;
            while (j < line.length && !isNaN(line[j]) && line[j] != " ") {
                subline += line[j];
                j++;
            }
            if (subline.length > 0) {
                mail = subline.trim();
                hasmail = "1";
            }

        }
    }

    if (hasPax != 0) {
        if (!isNaN(adl)) {
            $('#ADL').val(adl);
            $("#ADL").trigger("input");
        }
        else {
            strErr += "ADL, ";
        }

        if (!isNaN(chd)) {
            $('#CHD').val(chd);
            $("#CHD").trigger("input");
        }
        else {
            strErr += "CHD, ";
        }

        if (!isNaN(inf)) {
            $('#INF').val(inf);
            $("#INF").trigger("input");
        }
        else {
            strErr += "INF, ";
        }

        if (hasBag == 1) {
            if (!isNaN(bagspc)) {
                $('#BagPcs').val(bagspc);
                $("#BagPcs").trigger("input");
            }
            else {
                strErr += "Bag pcs, ";
            }


            if (!isNaN(bagswt)) {
                $('#BagWei').val(bagswt);
                $("#BagWei").trigger("input");
            }
            else {
                strErr += "Bag wt, ";
            }

        }

        if (hasCga == 1) {
            if (!isNaN(cgaspc)) {
                $('#CargoPcs').val(cgaspc);
                $("#CargoPcs").trigger("input");
            }
            else {
                strErr += "Cargo pcs, ";
            }

            if (!isNaN(cgawt)) {
                $('#CargoWei').val(cgawt);
                $("#CargoWei").trigger("input");
            }
            else {
                strErr += "Cargo wt, ";
            }

        }


        if (hasmail == 1) {
            if (!isNaN(mail)) {
                $('#Mail').val(mail);
                $("#Mail").trigger("input");
            }
            else {
                strErr += "Com/mail, ";
            }
        }
        if (strErr.trim() != "") {
            strErr = "Kiểm tra lại thông tin " + strErr;
            alert(strErr);
        }
        else {
            checkbutton();
            $('#ReadMessage').modal('toggle');
        }
    }
    else {
        alert("Kiểm tra lại điện văn");
    }
}
function addNewServicesHK() {
    $('#EditSpecialServicesHK').modal();
    var id = $('#flightid').val();
    $.getJSON("/DiscussFlight/getSpecialServicesHKInf", { flightID: id }, function (data) {
        if (data != null) {
            $('#notehk').val(data.Note.trim());
            var resaa = data.ServiesName.split(",");
            for (i = 0; i < resaa.length; i++) {
                $("input[id=" + resaa[i] + "]").prop('checked', true);
            }
        }
    });
    $("#EditSpecialServicesHK").draggable({
        handle: ".modal-header"
    });
}
function addNewServicesGS() {
    var id = $('#flightid').val();
    $('#EditSpecialServicesGS').modal();

    $.getJSON("/DiscussFlight/getSpecialServicesGSInf", { flightID: id }, function (data) {
        if (data != null) {
            $('#noteGS').val(data.Note.trim());
            var resaa = data.ServiesName.split(",");
            for (i = 0; i < resaa.length; i++) {
                $("input[id=" + resaa[i] + "]").prop('checked', true);
            }
        }
    });
    $("#EditSpecialServicesGS").draggable({
        handle: ".modal-header"
    });
}
function saveSpecialHK() {
    var abcd = "VIP,WCHR,UM,DEPO,CIP,INAD,SEC,FRAG,OtherPax";
    var resaa = abcd.split(',');
    var listsp = "";
    for (i = 0; i < resaa.length; i++) {
        if ($("input[id=" + resaa[i] + "]:checked").length > 0) {
            if (listsp == "")
                listsp = resaa[i];
            else
                listsp += "," + resaa[i];
        }
    }
    var id = $('#flightid').val();
    var note = $('#notehk').val().toString();
    $.ajax({
        type: 'GET',
        url: "/DiscussFlight/saveSpecialServicesHK",
        data: { id: id, listSs: listsp, note: note },
        success: function (Mdata) {
            var hub = $.connection.myHub;
            hub.server.savegetSPHK($('#flightid').val());

            $('#EditSpecialServicesHK').modal('hide');
            if (Mdata == "Error")
                alert("Error while save data");
        },
        error: function () {
            $('#EditSpecialServicesHK').modal('hide');
            alert('can not comunicate with server, please login in again');
            window.location = '/Login/Signin';
        }
    });
}
function saveSpecialGS() {

    var abcd = "AVI,PER,VAL,OtherGS";
    var resaa = abcd.split(',');
    var listsp = "";
    for (i = 0; i < resaa.length; i++) {
        if ($("input[id=" + resaa[i] + "]:checked").length > 0) {
            if (listsp == "")
                listsp = resaa[i];
            else
                listsp += "," + resaa[i];
        }
    }
    var id = $('#flightid').val();
    var note = $('#noteGS').val().toString();
    $.getJSON("/DiscussFlight/saveSpecialServicesGS", { id: id, listSs: listsp, note: note }, function (Mdata) {
        var hub = $.connection.myHub;
        hub.server.saveSPGS($('#flightid').val());
        $('#EditSpecialServicesGS').modal('hide');
        if (Mdata == "Error")
            alert("Error while save data");
    });

}
