function kiemtraMatKhau() {
    var OldPassWord = $('#OldPassWord').val();
    var NewPassWord = $('#NewPassWord').val();
    var ConfirmPassWord = $('#ConfirmPassWord').val();

    if (OldPassWord.toString().trim() == '') {
        alert('Mật khẩu cũ không được để trống');
        $('#OldPassWord').focus();
        return false;
    }
    if (NewPassWord.toString().trim() == '') {
        alert('Mật khẩu mới không được để trống');
        $('#NewPassWord').focus();
        return false;
    }
    if (ConfirmPassWord.toString().trim() == '') {
        alert('Mật khẩu xác nhận không được để trống');
        $('#ConfirmPassWord').focus();
        return false;
    }
    if (OldPassWord.toString().trim().length <= 6 || NewPassWord.toString().trim().length <= 6 || ConfirmPassWord.toString().trim().length <= 6) {
        alert('Độ dài mật khẩu phải > 6 kí tự');
        return false;
    }
    if (NewPassWord != ConfirmPassWord) {
        alert('Mật khẩu mới không khớp với mật khẩu xác nhận');
        return false;
    }
    //lấy mật khẩu cũ
        $.ajax({
            type: 'GET',
            url: "/Task/getUserInformation",
            data: {},
            async: false,
            contentType: 'application/html ; charset:utf-8',
            dataType: 'json',
            success: function (Data) {
                alert(Data.PassWord.trim() + " | " + OldPassWord.toString().trim());
                if (Data != null && Data.PassWord.trim() != OldPassWord.toString().trim()) {
                    alert('Mật khẩu cũ không đúng');
                    return false;
                }
            },
            error: function () {

            }
        });
    //luu mat khau
    $.ajax({
        type: 'GET',
        url: "/Task/SavePassWord",
        data: { OldPassWord: OldPassWord, NewPassWord: NewPassWord},
        async: false,
        contentType: 'application/html ; charset:utf-8',
        dataType: 'json ',
        success: function (Data) {
            if (Data.Message == "Save Success") {
                alert('Lưu mật khẩu thành công');
            }
            else {
                alert('Lưu mật khẩu không thành công');
            }
        },
        error: function () {

        }
    });
}