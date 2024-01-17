$(() => {
  $("#inputImg").fileinput({
    theme: "fa5",
    showUpload: false,
    previewFileType: "any",
  });
  $("form").submit(function (e) {
    // check use
    let regex = /[^a-zA-ZÀ-ỹ\s]/;
    $("#lNameErr").html(
      regex.test($("#inputLName").val())
        ? "Không hợp lệ! Họ chỉ bao gồm các chữ cái"
        : ""
    );
    $("#fNameErr").html(
      regex.test($("#inputFName").val())
        ? "Không hợp lệ! Tên chỉ bao gồm các chữ cái"
        : ""
    );

    regex = /\D/;
    $("#phoneNumErr").html(
      regex.test($("#inputPhoneNumber").val())
        ? "Số điện thoại không chứa kí tự khác ngoài chữ số!"
        : ""
    );
    if ($("#phoneNumErr").html() == "") {
      $("#phoneNumErr").html(
        $("#inputPhoneNumber").val().length < 7 ||
          $("#inputPhoneNumber").val().length > 11
          ? "Số điện thoại có độ dài từ 7 đến 11 số!"
          : ""
      );
    }

    if (
      $("#fNameErr").html() == "" &&
      $("#lNameErr").html() == "" &&
      $("#phoneNumErr").html() == ""
    ) {
      //console.log('gui submit');
      $("form").submit();
    } else {
      e.preventDefault();
    }
  });
});
