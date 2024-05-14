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
    if (OldPassWord.toString().trim().length < 6 || NewPassWord.toString().trim().length < 6 || ConfirmPassWord.toString().trim().length < 6) {
        alert('Độ dài mật khẩu phải >= 6 kí tự');
        return false;
    }
    if (NewPassWord != ConfirmPassWord) {
        alert('Mật khẩu mới không khớp với mật khẩu xác nhận');
        return false;
    }
}