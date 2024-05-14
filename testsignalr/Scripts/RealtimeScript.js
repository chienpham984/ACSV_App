var listFlightinfor;
var listupdate;
var nature;
var listFlightNo;
var stt;
$(document).ready(function () {
    var chat = $.connection.myHub;
    chat.client.ShowallEmployee = function () {
        getData();

    };
    $.connection.hub.start().done(function () {
        hub = $.connection.myHub;
        getData();
      
    });

    $(".Header_search-buttom-input").on("click", function () {
        showdata();
    });
    $(".Header_search-input").keypress(function (e) {
        if (e.which == 13) {
            getData();
        }
    });
    $("#keySearch").val(listFlightNo);
});
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
function gotopage(data) {
    window.location = '/Task/RedirectToPage?flightID=' + data;
}
function getData() {
    $.when(
        $.ajax({
            type: 'GET',
            url: "/Task/ShowListFlight",
            data: {},
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (data) {
                listFlightinfor = data.Data;
                listupdate = data.Listupdate;
            },
            error: function () {
                alert('Web app can not connect to server');
            }
        })).done(function () { 
            showdata();
    })
}
function showdata() {
    stt = 0;
    var table = $('.table');
    table.empty();
      
        
    listFlightNo = $('#keySearch').val();
    let myArray;
    let isok = false;
    myArray = listFlightNo.split(',');
    var newArray = listFlightinfor.filter(function (obj) {
        isok = false;
        if (myArray.length > 0) { 
        myArray.forEach(function (item) {
            if (obj.FlightNo.indexOf(item) >= 0) {
                isok = true;
                return false;
            }
        });
        }
        else
            isok = true;
        if (isok) return obj;
    });
    var row = "<tr><th class='No'>No.</th><th>FlightNo</th><th>A/D</th><th>FlightDate</th><th>SIBT</th><th>SOBT</th><th>Route</th><th>Status</th><th>Apark</th><th>Dpark</th><th>Belt</th><th>ELDT</th><th>ALDT</th><th>TOBT</th><th>TSAT</th><th>TTOT</th></tr>";
                table.append(row);
    $.each(newArray, function (index, item) {
        stt = stt + 1;
        var _id = item.FlightId.replace("_", " ");
        if (item.Status.trim() == "CNX") {
            row = "<tr class='" + _id + " CNX'><td class='No'>" + stt.toString() + " </td><td class='FlightNo'><Span class='btnFlightNo' >" + item.FlightNo + ' </Span></td><td>' + item.ArrDep + ' </td><td>' + item.FlightDate + ' </td><td>' + item.SIBT + ' </td><td>' + item.SOBT + " </td><td class = 'RouteFlight'>" + item.RouteFlight + " </td><td class='Status'>" + item.Status + " </td><td class='APARK'>" + item.Apark + " </td><td class='DPARK'>" + item.Dpark + " </td><td class='Belt'>" + item.Belt + " </td><td class='ELDT'>" + item.ELDT + " </td><td class='ALDT'>" + item.ALDT + " </td><td class='TOBT'>" + item.TOBT + " </td><td class='TSAT'>" + item.TSAT + " </td><td class='TTOT'>" + item.TTOT + ' </td></tr>';
        }
        else {
            row = "<tr class='" + _id + "'><td class='No'>" + stt.toString() + " </td><td class='FlightNo'><Span class='btnFlightNo' onclick = gotopage('" + item.FlightId +"');> " + item.FlightNo + '  </Span></td><td>' + item.ArrDep + ' </td><td>' + item.FlightDate + ' </td><td>' + item.SIBT + ' </td><td>' + item.SOBT + " </td><td class = 'RouteFlight'>" + item.RouteFlight + " </td><td class='Status'>" + item.Status + " </td><td class='APARK'>" + item.Apark + " </td><td class='DPARK'>" + item.Dpark + " </td><td class='Belt'>" + item.Belt + " </td><td class='ELDT'>" + item.ELDT + " </td><td class='ALDT'>" + item.ALDT + " </td><td class='TOBT'>" + item.TOBT + " </td><td class='TSAT'>" + item.TSAT + " </td><td class='TTOT'>" + item.TTOT + ' </td></tr>';
        }    
        table.append(row);
     });
    $.each(listupdate, function (index, item) {
        $('.table').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).removeAttr('style');
        if (item.TimeRemain == 0) {
           $('.table').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA" });
        }
        else {
            $('.table').find("tr." + item.FlightId).find("td." + item.FieldName.trim()).css({ "background-color": "#A2ECBA", "-webkit-animation": "changeColor " + item.TimeRemain.toString() + "s", "-moz-animation": "changeColor " + item.TimeRemain.toString() + "s", "animation": "changeColor " + item.TimeRemain.toString() + "s", "-ms-animation": "changeColor " + item.TimeRemain.toString() + "s", "animation-timing-function":"linear" });
        }
    });

    


}
