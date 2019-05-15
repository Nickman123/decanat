// Информация для получения данных от сервера
var data;
var student;

$("#getData_button").click(() => {
    return new Promise((resolve, reject) => {
        data = {
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
              student = data;
              console.log(student)
              student.token = student.usertoken;
              resolve();
          },
          contentType: "application/json"
        });
    }).then(() => {
        // Базовая информация
        $.ajax({
          type: "POST",
          url: "http://193.218.136.174:8080/cabinet/rest/student/get",
          data: JSON.stringify({
              text: "",
              userToken: student.token
          }),
          success: function(data){
              student = data;
              console.log(student);
          },
          contentType: "application/json",
        });
    });
});
