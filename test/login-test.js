const axios = require("axios");

const login = (email, password) => {
  return axios
    .post("http://localhost:3000/api/auth/login", {
      email: email,
      password: password,
    })
    .then((response) => {
      return response;
    });
};

const email = "qasya@gmail.com";
const password = "qasya@gmail.com";

login(email, password).then((response) => {
  console.log("Login successful:", response.data);
});

module.exports = login;
