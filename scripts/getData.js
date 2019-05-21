// Пользователь системы
var student = {
    token: "",
};


$(".form-signin").submit(function(event) {
  event.preventDefault(); // Отмена перезагрузки страницы

  // Вход в систему
  login()
    .then(() => {
      $(".errorMessage").css("display", "none"); // Скрываем сообщение об ошибке
      goToPersonalPage(); // Переход в личный кабинет
      getAllData(); // Получение данных
    })
    .catch(errorMessage => {
      $(".errorMessage").css("display", "block"); // Показываем сообщение об ошибке
      console.log(errorMessage);
    });
});

/**
 * Переход в личный кабинет
 */
var goToPersonalPage = function() {
    $(".auth-page").remove(); // Скрываем блок авторизации
    $(".personal-page").addClass("personal-page-active"); // Показываем личный кабинет
    $("body").css("backgroundColor", "#007bff");
};

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
    getStudentsGroup(); // Получение списка группы
    getSemesters().then((studentSemesters) => getRecordBook(studentSemesters));  // Получение семестров
};

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
    success: function(data) {
      data = JSON.parse(data);
      student.token = data.usertoken; // Токен пользователя

      // Проверка на успешную авторизацию
      if (data.status == "success") resolve();
      else reject(data.msg); // При ошибке отправляем сведения о ней
    },
    contentType: "application/json"
  });
};

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
    success: function(data) {
        data = JSON.parse(data);
        collectInitialData(data.student);
    },
    contentType: "application/json"
  });
};

/**
 * Получение списка одногруппников студента
 */
var getStudentsGroup = function() {
  $.ajax({
    type: "POST",
    url: "http://193.218.136.174:8080/cabinet/rest/student/classmates",
    data: JSON.stringify({
      text: "",
      userToken: student.token
    }),
    success: data => {
      classmates = JSON.parse(data);
      collectInitialData(classmates);
    },
    contentType: "application/json"
  });
};

/**
 * Получение пройденных семестров
 */
var getSemesters = function() {
    return new Promise((resolve, reject) => {
       $.ajax({
            type: 'POST',
            url: 'http://193.218.136.174:8080/cabinet/rest/student/semesters',
            data: JSON.stringify({ text: '', userToken: student.token }
            ),
            success: (data) => {
                studentSemesters = JSON.parse('{"obj":[' + data + ']}')
                        .obj[0].studentSemesters
                        .map(( { semesterName, groupname, idLGS } ) => (
                            { semesterName: semesterName, groupname: groupname, id: idLGS }
                            ));
                resolve(studentSemesters);
            },
            contentType: 'application/json'
        });
    });
};

/**
 * Сбор базовых данных и их вывод
 * @param {object} data Базовые данные
 */
var collectInitialData = function(data) {
  if (data.hasOwnProperty("students")) {
    data.students.map((classmate, index) => {
      $(".classmates-block").append(
        `<span>${index + 1}. ${classmate.surname} ${classmate.name}  ${
          classmate.patronymic
        }</span>`
      );
    });
  } else if (data.hasOwnProperty("birthday")) {
    let fullName = data.surname + " " + data.name + " " + data.patronymic; // Полное имя

    $("#full-name").append(fullName);
    $("#birthday").append(data.birthday);
    $("#email").append(data.email);
    $("#institute").append(data.institute);
    $("#groupname").append(data.groupname);
    $("#recordbook").append(data.recordbook);
    $("#groupLeader").append(data.groupLeader ? "Да":"Нет");

  } else if (data.hasOwnProperty("rating")) {
      let ratings = data.rating.ratings;
      let semesterName = data.semesterName;
      let semesterDropdown = "<div class='personal-block__text dropdown-content closed'>\
                            <span class='personal-block__field'>" + semesterName +" семестр</span> <i class='fas fa-chevron-down'></i>\
                            <div class='personal-block__text dropdown-more'>";
      let table = "\
                <table>\
                    <thead>\
                      <tr>\
                        <th>Название предмета</th>\
                        <th>Кол-во часов</th>\
                        <th>Оценка</th>\
                        <th>Преподаватель</th>\
                      </tr>\
                    </thead>\
                    <tbody>"
        for (let i = 0; i < ratings.length; i++) {
            table += "<tr><td>" + ratings[i].subjectName + "</td><td>" + ratings[i].hoursCount + "</td><td>";
            if (ratings[i].isExam && ratings[i].examrating != 0) {
                table += ratings[i].examrating + "</td><td>" + ratings[i].examTutor + "</td></tr>";
            }
            else if (ratings[i].passrating == 1){
                table += "Зачтено</td><td>" + ratings[i].passTutor + "</td></tr>";
            }
            else if (ratings[i].passrating > 1){
                table += ratings[i].passrating + "</td><td>" + ratings[i].passTutor + "</td></tr>";
            }
            else {
                table += "-</td><td>" + ratings[i].passTutor + "</td></tr>";
            }

        }
      table += "</tbody></table>";
      semesterDropdown += table + "</div>\</div>";
      $("#record-book").append(semesterDropdown);
  }

};


var semesterNumber = 0;
/**
 * Получение зачетной книжки студента
 * @param {object} studentSemesters Список семестров студента
 */
var getRecordBook = function(studentSemesters) {
    if (semesterNumber < studentSemesters.length) {
        getOneRecordBookRequest(studentSemesters).then((recordBook) => collectInitialData(recordBook));
    }
};

/**
 * Получение оценок за один семестр
 * @param {object} studentSemesters Список семестров студента
 * @return {object} Промис
 */
var getOneRecordBookRequest = function(studentSemesters) {
    return new Promise(function(resolve, reject) {
        let semesterId = studentSemesters[semesterNumber].id; // Getting ID
        let semesterName = studentSemesters[semesterNumber].semesterName;
        semesterNumber += 1;
       $.ajax({
        type: 'POST',
        url: 'http://193.218.136.174:8080/cabinet/rest/student/rating',
        data: JSON.stringify({semester: semesterId, userToken: student.token}),
        success: function(data) {
            rating = JSON.parse(data);
            let recordBook = {
                rating : rating,
                semesterName: semesterName
            };
            getRecordBook(studentSemesters);
            resolve(recordBook);  // Возвращаем оценки
        },
        contentType: 'application/json'
        });
    });
};

