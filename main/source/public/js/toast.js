document.addEventListener('DOMContentLoaded', function () {
    var err = "{{err}}";

    if (err === "not-enough-money") {
        displayToast("Thông báo", "Số dư tài khoản không đủ!");
    } else if (err === "wrong-password") {
        displayToast("Error", "Xác thực thanh toán thất bại!");
    } else if (err === "none-err") {
        displayToast("Thông báo", "Thanh toán thành công!");
    }

    function displayToast(header, message) {
        var toastHTML = '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">\
                <div class="toast-header">\
                    <strong class="me-auto">' + header + '</strong>\
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>\
                </div>\
                <div class="toast-body">' + message + '</div>\
            </div>';
        document.getElementById('toast-container').insertAdjacentHTML('beforeend', toastHTML);
        var toastElList = [].slice.call(document.querySelectorAll('.toast'));
        var toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl).show();
        });
    }

});
