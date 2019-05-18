// Information from server
let data;
let student;
let studentSemesters;

$("#getData_button").click(() => {
    return new Promise((resolve, reject) => {
        data = {
            username: $("#username").val(),
            password: $("#password").val(),
            appToken: $("#token").val()
        };

        // Authorization
        $.ajax({
            type: "POST",
            url: "http://193.218.136.174:8080/cabinet/rest/auth/login",
            data: JSON.stringify(data),
            success: (data) => {
                student = JSON.parse('{"obj":[' + data + ']}'); 
                student.userToken = student.obj[0].usertoken;
                resolve();
            },
            contentType: "application/json"
        });
    }).then(() => {
        const { userToken } = student;
        // Main information
        $.ajax({
            type: "POST",
            url: "http://193.218.136.174:8080/cabinet/rest/student/get",
            data: JSON.stringify({
                text: '',
                userToken: userToken
            }),
            /*success: (data) => {
                console.log(data);
            },*/
            contentType: "application/json",
        });

        // Get current student's list of semesters
        if (userToken) {
            $.ajax({
                type: 'POST',
                url: 'http://193.218.136.174:8080/cabinet/rest/student/semesters',
                data: JSON.stringify({ text: '', userToken: userToken }
                ),
                // Get inside function when error "Wrong token". How to fix?
                success: (data) => {
                    studentSemesters = JSON.parse('{"obj":[' + data + ']}')
                            .obj[0].studentSemesters
                            .map(( { semesterName, groupname } ) => (
                                { semesterName: semesterName, groupname: groupname }
                                ));
                    console.log(studentSemesters);
                },
                contentType: 'application/json'
            });
        }
    });
});
