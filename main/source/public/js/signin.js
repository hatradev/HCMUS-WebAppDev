function forgotPw() {
  const email = $("#inputEmail").val();
  console.log("email:", email);
  if (email) {
    window.location.href = `http://localhost:3000/user/forgotPw?email=${email}`;
  }
}
