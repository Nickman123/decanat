// Информация для получения данных от сервера
var data;
var student;

$("#getData_button").click(() => {
    data = {
        username: $("#username").val(),
        password: $("#password").val(),
        appToken: $("#token").val()
    };

    console.log("Send data");
    console.log(data.username);

    $.ajax({
      type: "POST",
      url: "http://193.218.136.174:8080/cabinet/rest/auth/login",
      data: JSON.stringify(data),
      success: function(data){
          student = data;
          console.log(student);
      },

      error: function(error){
            console.log(error);
      }

    });
});
