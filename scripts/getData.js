// Пользователь системы
var student = {
    token: ''
};

$(".form-signin").submit(function(event) {
    event.preventDefault();  // Отмена перезагрузки страницы

    // Вход в систему
    login().then(() => {
        $(".errorMessage").css("display", "none");  // Скрываем сообщение об ошибке
        goToPersonalPage();  // Переход в личный кабинет
        getAllData();  // Получение данных
    }).catch((errorMessage) => {
        $(".errorMessage").css("display", "block");  // Показываем сообщение об ошибке
        console.log(errorMessage);
    });

});


/**
 * Переход в личный кабинет
 */
var goToPersonalPage = function() {
    $(".auth-page").remove();  // Скрываем блок авторизации
    $(".personal-page").addClass('personal-page-active');  // Показываем личный кабинет
}


/**
 * Вход в систему
 * @return {object} Промис
 */
var login = function() {
    return new Promise((resolve, reject) => {
        authorizeUser(resolve, reject);
    });
};

/**
 * Получение всех данных от сервера после авторизации
 */
var getAllData = function() {
    getInitialData(); // Получение базовых данных
}

/**
 * Авторизация поьзователя в системе и получение токена
 * @param {function} Функция для промиса
 */
var authorizeUser = function(resolve, reject) {
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

          // Проверка на успешную авторизацию
          if (data.status == 'success')
              resolve();
          else reject(data.msg);  // При ошибке отправляем сведения о ней
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
      success: function(data){;
          data = JSON.parse(data);
          collectInitialData(data.student);
      },
      contentType: "application/json",
    });
}

/**
 * Сбор базовых данных и их вывод
 * @param {object} data Базовые данные
 */
var collectInitialData = function(data) {
    let fullName = data.surname + " " + data.name + " " + data.patronymic;  // Полное имя
    $("#full-name").append(fullName);

    $("#birthday").append(data.birthday);

    // Закончил в 2:21 и отправился спать (устал уже!)
}
