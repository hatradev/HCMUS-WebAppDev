$(document).ready(function () {
  // $(".nav-link").removeClass("active");
  var content = $(".admin-content");
  var item = 0;
  if (content.hasClass("admin-account")) {
    item = 1;
  }
  if (content.hasClass("admin-product")) {
    item = 2;
  }
  if (content.hasClass("admin-categories")) {
    item = 3;
  }
  if (content.hasClass("admin-order")) {
    item = 4;
  }
  $(".nav-link").addClass(function (n) {
    if (n === item) {
      return "active";
    }
    return "";
  });
});
