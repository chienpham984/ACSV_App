$(document).ready(function () {
    localStorage.clear();
    var chat = $.connection.myHub;
    chat.client.NotifyStatusChange = function () {
        
    };
    $.connection.hub.start().done(function () {
        
    });
    //if (navigator.userAgent.match(/Android/i)) {
    //    window.scrollTo(0, 1);
    //}

    $('#username').change(function () {
        var password = $(this).val().trim();
        if (!validatePassword(password)) {
            $('.Emailderror').html("UserName must be at least 5 characters");
        }
        else {
            $('.Emailderror').html("");
        }
    });

    $('#password').change(function () {
        var password = $(this).val().trim();
        if (!validatePassword(password)) {
            $('.Pwderror').html("Password must be at least 5 characters");
        }
        else {
            $('.Pwderror').html("");
        }
    });
});
function validatePassword(inputPassword) {
    return inputPassword.length > 4;
}
function checkinput()
{
    var result = false;
    var password = $('#password').val().trim();
    var userName = $('#username').val().trim();
    if (validatePassword(password) == true && validatePassword(userName) == true)
    {
        result = true;
    }
    return result;
}

function sendPasswordToMail() {
    var username = $('#username').val();
    if (username.trim() == "") {
        alert('Input userName first');
        $('#username').focus;
        return false;
    }
    else {
        if (confirm('Are you sure to send password to your Email?') == false) {
            return;
        }
        $.ajax({
            type: 'GET',
            url: "/Login/sendPasswordToEmail",
            data: { username: username },
            success: function (data) {

                if (data.toString().trim() == "1") {
                    alert('Password has been sent to your email');
                }
                else {
                    alert('Your email is not exists. contact IT HGS 0898551316');
                }
            },
            error: function () {
                alert('login fail');
            }
        });
        $('#LoginModal').modal('toggle');
        //
    }
}
function sendPasswordToMail() {

}