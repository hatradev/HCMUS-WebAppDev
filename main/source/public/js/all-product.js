const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function linkSort(href) {
  var currentLink = window.location.href;
  var current_arr = currentLink.split("?");
  var currentDomain = window.location.origin;

  if (currentLink.includes("search") || currentLink.includes("category")) {
    if (currentLink.includes("sort")) {
      var split_arr = currentLink.split("&");
      window.location.href = currentDomain + href + "&" + split_arr[2];
    } else {
      window.location.href = currentDomain + href + "&" + current_arr[1];
    }
  } else {
    window.location.href = currentDomain + href;
  }
}
