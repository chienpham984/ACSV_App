/*/*const { AL } = require("../assets/DataTables/pdfmake-0.1.36/pdfmake");*/
var listFlightinfor;
var listupdate;
var routeType;
var natureType;
var nature;
var listFlightNo;
var ConfigView;
var stt;
var intervalID;
var SearchString = "";
var MaxId = 0;
var startTime;
var endTime;
$(document).ready(function () {
    /*var flightDate = $("#flightDate").text();*/
    var chat = $.connection.myHub;
    chat.client.RequireLogout = function () {
        window.location = '/DocumentManagement/Logout';
    };
    chat.client.sendFlightsToMachine = function () {
        /*debouncedSendFlights();*/
      
    };

    var debouncedSendFlights = _.debounce(function () {
          
        //$.ajax({
        //    type: 'GET',
        //    url: "/DocumentManagement/GetListFlight",
        //    data: { kind: 'Update' },
        //    contentType: 'application/html ; charset:utf-8',
        //    dataType: 'json',
        //    success: function (data) {
        //        var listFieldupdate = data.Listupdate;
        //        MaxId = data.MaxId;
        //        var time = 0;
        //        $.each(listFieldupdate, function (index, item) {
        //            if (item.FieldName.trim() == "LINK") {
        //                getData();
        //            }
        //            console.log(JSON.stringify(item));
        //            if (item.Time == 0) {
        //                $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).removeAttr('style');
        //                $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).css({ "border-radius": "5px", "border": "solid 1px white", "background-color": "#A2ECBA" });
        //                $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).html(item.NewValue.trim());
        //            }
        //            else {
        //                if (item.Time - 840 > 0) {
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).removeAttr('style');
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td.No").removeAttr('style');
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA", "-webkit-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString(), "-moz-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString(), "animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString() + "s", "-ms-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString() + "s", "animation-timing-function": "linear" });
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).html(item.NewValue.trim());
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td.No").css({ "-webkit-animation": "changeColor " + (item.Time - 840).toString() + "s", "-moz-animation": "changeColor " + (item.Time - 840).toString() + "s", "animation": "changeColor " + (item.Time - 840).toString() + "s", "-ms-animation": "changeColor " + (item.Time - 840).toString() + "s", "animation-timing-function": "linear" });
        //                }
        //                else {
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).removeAttr('style');
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA", "-webkit-animation": "changeColor " + (item.Time).toString() + "s", "-moz-animation": "changeColor " + (item.Time).toString() + "s", "animation": "changeColor " + (item.Time).toString() + "s", "-ms-animation": "changeColor " + (item.Time).toString() + "s", "animation-timing-function": "linear" });
        //                    $('.tableFlightView').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).html(item.NewValue.trim());
        //                }
        //            }
        //            if (item.NewValue.trim() == "CNX") {
        //                getData();
        //                return;
        //            }

        //        });
        //    },
        //    error: function () {
        //        window.location = '/Task/Logout';
        //    }
        //});
    }, 500);
    /*chat.client.keepAlive = function () { };*/

    $.connection.hub.start().done(function () {
        hub = $.connection.myHub;
       /* hub.server.getinDay("FlightUpdate");*/
        getData();
    });
    $('.ViewConfig').click(function () {
        $('#configViewModal').modal('toggle');
        $('.listFDE input[type = checkbox]').removeAttr('checked');
        $('.listFDE input[type = checkbox]').prop('checked', false);
        $('#checkall').removeAttr('checked');
        $('#checkall').prop('checked', false);

        //split configview
        const myArray = ConfigView.split(",");
        myArray.forEach(function (item) {
            var obj = $('#' + item);
            obj.attr('checked', 'checked');
            obj.prop('checked', true);
        });

    });
    $('.menuBar').click(function () {
        $('nav').slideToggle();
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
            else {
                var chat = $.connection.myHub;
                if ($.connection.hub.state.toString() == "1") {
                    $.ajax({
                        type: 'GET',
                        url: "/Task/GetListFlight",
                        data: {},
                        contentType: 'application/html ; charset:utf-8',
                        dataType: 'json',
                        success: function (data) {
                            var _maxId = data.MaxId;
                            if (_maxId != MaxId) {
                                getData();
                            }
                        },
                        error: function () {
                            location.reload();
                        }
                    }).done(function () {

                    });
                } else {
                    location.reload();
                }
            }
        }
    });

    $('#checkall').change(function () {
        if (this.checked) {
            $('.listFDE input[type = checkbox]').attr('checked', 'checked');
            $('.listFDE input[type = checkbox]').prop('checked', true);
        } else {
            $('.listFDE input[type = checkbox]').removeAttr('checked');
            $('.listFDE input[type = checkbox]').prop('checked', false);
        }

    });
    $('.listFDE input[type = checkbox]').change(function () {
        if (this.checked) {
            $(this).attr('checked', 'checked');
            $(this).prop('checked', true);
            var allchecked = true;

            $('.listFDE input[type = checkbox]').each(function () {
                if (!this.checked) {
                    allchecked = false;
                }
            });
            if (allchecked) {
                $('#checkall').attr('checked', 'checked');
                $('#checkall').prop('checked', true);
            } else {
                $('#checkall').removeAttr('checked');
                $('#checkall').prop('checked', false);
            }
        } else {
            $(this).removeAttr('checked');
            $(this).prop('checked', false);
            $('#checkall').removeAttr('checked');
            $('#checkall').prop('checked', false);
        }

    });

    $("#userName").on("click", function () {
        hub = $.connection.myHub;
        hub.server.getoutDay("abc");
        window.location = '/Task/logout';
    });
    $(".ExportFileConfig").on("click", function () {
        window.location = '/Task/Report';
    });

    $(".Header_search-input").keypress(function (e) {
        if (e.which == 13) {
            $('.Header_search-buttom-input').click();
        }
    });

    $('#profile-image').click(function () {
        $('#profile-options').toggle();
    });
});
//window.setInterval("keepconnect()", 60000);
function keepconnect() {

    $.ajax({
        type: 'GET',
        url: "/Task/keepconnect",
        success: function (data) {
        },
        error: function (resp) {
            //cap nhat ngay 10SEP23 
            location.reload()

            //alert('Web app can not connect to server');
            //window.location = '/Login/Signin';
        }
    });
}
function getData() {
     $.when(
        $.ajax({
            type: 'GET',
            url: "/DocumentManagement/GetListFlight",
            data: {},
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            success: function (data) {
                listFlightinfor = data.Data;
                listupdate = data.ListTimeRemain;
                var status = data.Status;
                $("#loading").hide();
                if (status == false) {
                    $('#DivNotOK').text("Can not connect to host");
                    $('#DivNotOK').show();
                    var delayInMilliseconds = 10000;
                    setTimeout(function () {
                        $('#DivNotOK').hide();
                    }, delayInMilliseconds);
                }
            },
            error: function () {
                alert('Web app can not connect to server');
                window.location = '/LoginDocumenManagement/Logout'
                $("#loading").hide();
            }
        })).done(function () {
            showdata();
            $("#loading").hide();
        });
}

function showdata() {
    stt = 0;
    var colDoc = "";
    var table = $('.tableFlightView');
    table.empty();
    var dosArr = "VCS,UIH,CAH,VCA,BMV,DAD,DIN,PXU,HPH,SGN,CXR,VKG,PQC,DLI,VII,TBB,VDH,VCL,THD,HUI,HAN,TCI";
    var row = "<tr><th class='No'>No</th><th>A/D</th><th>FlightDate</th><th>FlightNo</th><th>AcRegNo</th><th>AcType</th><th>Route</th><th>Arr Time</th><th>Dep Time</th><th>Document</th></tr>";
    table.append(row);

    $.each(listFlightinfor, function (index, item) {
        stt = stt + 1;
        var _id = item.FlightID.replace("/", " ");
        if (item.StatusFlight.trim() == "CANCEL") {
            row = "<tr class='" + _id + " CNX'><td class='No'>" + stt.toString() + " </td><td class='ArrDep'>" + item.ArrDep + "</td><td class='FlightDate'>" + item.FlightDate + "</td><td class='FlightNo'><Span class='btnFlightNo' >" + item.FlightNo + " </Span></td><td class='AcRegNo'>" + item.AcRegNo + " </td><td class='AcType'>" + item.AcType + " </td><td class='Route'>" + item.RouteFlight + " </td><td class='ArrTime'>" + item.ArrTime + " </td><td class='DepTime'>" + item.DepTime + " </td><td class = 'Doc'></td></tr>";
        }
        else {
            if (item.CheckDocument == 0)
                colDoc = "btn btn-danger";
            else if (item.CheckDocument == 1)
                colDoc = "btn btn-warning";
            else
                colDoc = "btn btn-success";
            row = "<tr class='" + _id + "'><td class='No'>" + stt.toString() + " </td><td class='ArrDep'>" + item.ArrDep + "</td><td class='FlightDate'>" + item.FlightDate + "</td><td class='FlightNo'><Span class='btnFlightNo' >" + item.FlightNo + " </Span></td><td class='AcRegNo'>" + item.AcRegNo + " </td><td class='AcType'>" + item.AcType + " </td><td class='Route'>" + item.RouteFlight + " </td><td class='ArrTime'>" + item.ArrTime + " </td><td class='DepTime'>" + item.DepTime + " </td><td class = 'Doc'><input class='" + colDoc + "' style='width:10px;' onclick= OverviewDocument('" + item.FlightID.toString() + "')></td></tr>";
            /*row = "<tr class='" + _id + "'><td class='No'>" + stt.toString() + " </td><td class='FlightNo'><Span class='btnFlightNo' onclick = gotopage('" + item.FlightId + "');> " + item.FlightNo + '  </Span></td><td>' + item.ArrDep + ' </td><td>' + item.FlightDate + ' </td><td>' + item.SIBT + ' </td><td>' + item.SOBT + " </td><td class = 'EOBT'>" + item.EOBT + " </td><td class = 'RouteFlight'>" + item.RouteFlight + " </td><td class='Status'>" + item.Status + " </td><td class='APARK'>" + item.Apark + " </td><td class='DPARK'>" + item.Dpark + " </td><td class='DGATE'>" + item.Dgate + " </td><td class='BELT'>" + item.Belt + " </td><td class='ETTT'>" + item.ETTT + " </td><td class='ELDT'>" + item.ELDT + " </td><td class='ALDT'>" + item.ALDT + " </td><td class = 'EIBT'>" + item.EIBT + " </td><td class='AIBT'>" + item.AIBT + " </td><td class='ACGT'>" + item.ACGT + " </td><td class='ASBT'>" + item.ASBT + " </td><td class='AEGT'>" + item.AEGT + " </td><td class='ARDT'>" + item.ARDT + " </td><td class='TOBT'>" + item.TOBT + " </td><td class='TSAT'>" + item.TSAT + " </td><td class='TTOT'>" + item.TTOT + " </td><td class='AOBT'>" + item.AOBT + " </td><td class='ATOT'>" + item.ATOT + " </td></tr>";*/
        }
        table.append(row);
    });
    $.each(listupdate, function (index, item) {
        $('.tableFlightView').find("tr." + item.FlightID).find("td." + item.FieldName.trim()).removeAttr('style');
        if (item.TimeRemain == 0) {
            $('.tableFlightView').find("tr." + item.FlightID).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA" });
        }
        else {
            if (item.Time - 840 > 0) {
                $('.tableFlightView').find("tr." + item.FlightID).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA", "-webkit-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString(), "-moz-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString(), "animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString() + "s", "-ms-animation": "changeColor " + (item.Time).toString() + "s, " + "changeColor2p " + (item.Time - 840).toString() + "s", "animation-timing-function": "linear" });
                $('.tableFlightView').find("tr." + item.FlightID).find("td.No").css({ "-webkit-animation": "changeColor " + (item.Time - 840).toString() + "s", "-moz-animation": "changeColor " + (item.Time - 840).toString() + "s", "animation": "changeColor " + (item.Time - 840).toString() + "s", "-ms-animation": "changeColor " + (item.Time - 840).toString() + "s", "animation-timing-function": "linear" });
            }
            else {
                $('.tableFlightView').find("tr." + item.FlightID).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA", "-webkit-animation": "changeColor " + (item.Time).toString() + "s", "-moz-animation": "changeColor " + (item.Time).toString() + "s", "animation": "changeColor " + (item.Time).toString() + "s", "-ms-animation": "changeColor " + (item.Time).toString() + "s", "animation-timing-function": "linear" });
            }
        }
    });

    //var tableCells = document.querySelectorAll(".tableFlightView td");
    //tableCells.forEach(cell => {
    //    cell.addEventListener("dblclick", function (event) {
    //        event.preventDefault();
    //        // Get the text content of the cell
    //        var cellText = event.target.textContent;
    //        var ColumnName = $(this).attr("class");
    //        var trflightid = $(this).closest('tr').attr("class");
    //        var myarr = ["Status", "APARK", "DPARK", "DGATE", "BELT", "ELDT", "ALDT", "EIBT", "AIBT", "ACGT", "ASBT", "AEGT", "ARDT", "TOBT", "TSAT", "TTOT", "AOBT", "ATOT", "CLSD"];
    //        if (myarr.indexOf(ColumnName) > -1) {
    //            $(".modal-title").html("HISTORY OF " + ColumnName);
    //            $.ajax({
    //                type: 'GET',
    //                url: "/Task/getHistory",
    //                data: { flightid: trflightid, columnName: ColumnName },
    //                contentType: 'application/html ; charset:utf-8',
    //                dataType: 'json',
    //                success: function (data) {
    //                    $(".modal-title").html(data.talbeTitle);
    //                    $(".historyTable tr").remove();

    //                    var trHTML = '';
    //                    trHTML = '<tr><th>No</th><th>FlightNo</th><th>Time</th><th>TimeReceive </th><th>MGHA</th></tr>';
    //                    $.each(data.tableContent, function (i, item) {
    //                        trHTML += '<tr><td>' + (i + 1) + '</td><td>' + item.FlightNo + '</td><td>' + item.Time + '</td><td>' + item.TimeReceive + '</td><td>' + item.MGHA + '</td></tr>';
    //                    });
    //                    $('.historyTable').append(trHTML);
    //                    $('#ViewHistory').modal('toggle');
    //                },
    //                error: function () {
    //                }
    //            });
    //        } else if (ColumnName = 'MVT') {
    //            $.ajax({
    //                type: 'GET',
    //                url: "/Task/getMVTMessage",
    //                data: { flightid: trflightid},
    //                contentType: 'application/html ; charset:utf-8',
    //                dataType: 'html',
    //                success: function (data) {
    //                    $('.MessageBody').html("");
    //                    $('.MessageBody').append(data);
    //                    $('#ViewMVTMessage').modal('toggle');
    //                },
    //                error: function () {
    //                }
    //            });
    //        }

    //    });
    //});

    ////an hien cac cot
    //var colname = '';
    //$('.listFDE input[type = checkbox]').each(function () {
    //    colname = $(this).attr('id').toString();
    //    colname = colname.replace('ckb', '');

    //    if (ConfigView.indexOf(colname) < 0) {
    //        $('.' + colname).addClass("hideColumn");
    //    }
    //    else {
    //        $('.' + colname).removeClass("hideColumn");
    //    }
    //});


}
function OverviewDocument(FlightID) {
    //$("#viewDocument").html("");
    //$.getJSON("/DocumentManagement/getOverviewDocument", { FlightId: FlightID }, function (data) {
    //    alert(data);
    //    $("#viewDocument").html(data);
    //});
    var encodedValue = encodeURIComponent(FlightID);
    $.ajax({
        type: 'GET',
        url: "/DocumentManagement/getOverviewDocument",
        data: { FlightId: encodedValue },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
           
            $("#viewDocument").empty;
            $("#viewDocument").html(data);
        },
        error: function () {
        }
    });
}
//function SaveViewConfig() {
//    //lay danh sach cac FDE
//    var listFDE = '';
//    $('.listFDE input[type = checkbox]').each(function () {
//        if (this.checked) {
//            if (listFDE == '')
//                listFDE = this.id;
//            else
//                listFDE += ',' + this.id;
//        }
//    });
//    //luu vao csdl
//    $.when(
//        $.ajax({
//            type: 'GET',
//            url: "/Task/SaveViewConfig",
//            data: { ListColumn: listFDE },
//            contentType: 'application/html ; charset:utf-8',
//            dataType: 'json',
//            success: function () {

//            },
//            error: function () {
//                location.reload();
//                /* alert('Web app can not connect to server');*/
//            }
//        })).done(function () {
//            /*    showdata();*/
//        });
//    ConfigView = listFDE;
//    var colname = '';
//    $('.listFDE input[type = checkbox]').each(function () {
//        colname = $(this).attr('id').toString();
//        colname = colname.replace('ckb', '');

//        if (ConfigView.indexOf(colname) < 0) {
//            $('.' + colname).addClass("hideColumn");
//            /*$('.table tr td.' + colname).addClass('hideColumn');*/
//        }
//        else {
//            $('.' + colname).removeClass("hideColumn");
//            /*   $('.table tr td.' + colname).removeClass('hideColumn');*/
//        }
//    });
//    $('#configViewModal').modal('hide');
//}
