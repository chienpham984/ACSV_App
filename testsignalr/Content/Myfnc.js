//click on add flight button
function SearchFlight() {
    var tbl = $('#Result');
    var myDate = $('#fltDate').val();
    var myFltNo = $('#fltNo').val();
    
    //hide btn delete
    $('#deleteflight').hide();

    if (checkDataInput() == false)
        return;
    $.ajax({
        type: 'GET',
        url: "/Task/search",
        data: { myFlightDate: myDate, myFlightNo: myFltNo },
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            if (data.toString().trim().length == 0)
            {
                tbl.empty().append("NIL");
                $('#savechange').hide();
            }
            else
            {
                tbl.empty().append(data);
                $('#savechange').show();
            }
        },
        error: function () {
            tbl.empty().append('NIL');
            $('#savechange').hide();
        }
    });

}


function SearchDeleteFlight() {
    var tbl = $('#Result');
    var myDate = $('#fltDate').val();

    //hide btn search
    $('#savechange').hide();
 
    //$('#deleteflight').show();

    $.ajax({
        type: 'GET',
        url: "/Task/searchDeleteFlight",
        data: { myFlightDate: myDate},
        contentType: 'application/html ; charset:utf-8',
        dataType: 'html',
        success: function (data) {
            if (data.toString().trim().length == 0) {
                tbl.empty().append("NIL");
                $('#deleteflight').hide();
            }
            else {
                tbl.empty().append(data);
                $('#deleteflight').show();
            }
        },
        error: function () {
            tbl.empty().append('NIL');
            $('#deleteflight').hide();
        }
    });

}

//Check data before adding flight
function checkDataInput()
{
    var myDate = $('#fltDate').val();
    var myFltNo = $('#fltNo').val();
    if (myDate.toString().trim() == "") {
        alert("You have to input Date to search first");
        $('#fltDate').focus();
        return false;
    }
    if (myFltNo.toString().trim() == "") {
        alert("You have to input Flight No first");
        $('#fltNo').focus();
        return false;
    }
    return true;
}

//Clear all data on view
function ClearAll()
{
    $('#savechange').hide();
    $('#deleteflight').hide();
    $('#Result').empty().append("NIL");
    $('#fltNo').val("");
    $('#fltNo').focus();
}

//Save selected flight to database

function AddFlight()
{
    var listID = "";
    var i = 0;
    $("table tr").each(function () {
        i++;
        if (i > 1) {
            var textval = $(this).find("td").eq(0);
            var chk = textval.find("input:checkbox");
            if (chk.is(":checked"))
            {
                var id = $(this).find("td").eq(2).find("input").val();
                listID += id.toString().trim() + '_';
            }

        }
      
    })

    //if has selected flight. call ajax
    if (listID != "")
    {
        $.ajax({
            type: 'GET',
            url: "/Task/addFlight",
            data: { ListID: listID},
            contentType: 'application/html ; charset:utf-8',
            dataType: 'html',
            success: function (data) {
                //alert(data.toString());
                ClearAll();
            },
            error: function () {
                alert("data can not save to server");
                ClearAll();
            }
        });
    }
}


function DeleteFlight() {

    if (confirm("Are you sure to delete these flights ?") == false)
        return;

    var listID = "";
    var i = 0;
    $("table tr").each(function () {
        i++;
        if (i > 1) {
            var textval = $(this).find("td").eq(0);
            var chk = textval.find("input:checkbox");
            if (chk.is(":checked")) {
                var id = $(this).find("td").eq(2).find("input").val();
                listID += id.toString().trim() + '_';
            }

        }

    })

    //if has selected flight. call ajax
    if (listID != "") {
        $.ajax({
            type: 'GET',
            url: "/Task/DeleteselectedFlight",
            data: { ListID: listID },
            contentType: 'application/html ; charset:utf-8',
            dataType: 'html',
            success: function (data) {
                alert(data.toString());
                ClearAll();
            },
            error: function () {
                alert("Có lỗi trong quá trình lưu dữ liệu");
                ClearAll();
            }
        });
    }
}

function getAllMessages() {
    var tbl = $('#Result');
    $.ajax({
        url: '/home/GetMessages',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'html'
    }).success(function (result) {
        tbl.empty().append(result);
    }).error(function () {
        tbl.empty().append('NIL');
    });
}