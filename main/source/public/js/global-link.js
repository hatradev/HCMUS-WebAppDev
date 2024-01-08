function globalLink(event, href) {
  event.preventDefault();
  let currentDomain = window.location.origin;
  window.location.href = currentDomain + href;
}
