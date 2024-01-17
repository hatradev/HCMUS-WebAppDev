function forgotPw() {
  const email = $("#inputEmail").val();
  console.log("email:", email);
  if (email) {
    window.location.href = `http://127.0.0.1:3000/user/forgotPw?email=${email}`;
  }
}
