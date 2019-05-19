// Пользователь системы
var student = {
    token: ''
};

$("#getData_button").click(() => {
    return new Promise((resolve, reject) => {
        authorizeUser(resolve);
    }).then(() => {
        getInitialData();
    });
});


/**
 * Авторизация поьзователя в системе и получение токена
 */
var authorizeUser = function(resolve) {
   var data = {
        username: $("#username").val(),
        password: $("#password").val(),
        appToken: $("#token").val()
    };

    // Авторизация
    $.ajax({
      type: "POST",
      url: "http://193.218.136.174:8080/cabinet/rest/auth/login",
      data: JSON.stringify(data),
      success: function(data){
          data = JSON.parse(data);
          student.token = data.usertoken;  // Токен пользователя
          resolve()
      },
      contentType: "application/json"
    });
}

/**
 * Получение базовой информации о пользователе
 */
var getInitialData = function() {
    $.ajax({
      type: "POST",
      url: "http://193.218.136.174:8080/cabinet/rest/student/get",
      data: JSON.stringify({
          text: "",
          userToken: student.token
      }),
      success: function(data){
          console.log(student.token);
          console.log(data);
      },
      contentType: "application/json",
    });
}
