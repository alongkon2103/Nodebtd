const mysql = require('mysql');
let connection = mysql.createConnection({
    host: "localhost",
    user : 'root',
    password : '',
    database : 'nodejs'
})

connection.connect((error) => {
    if(!!error) {
        console.log("error",error)
    } else {
        console.log("connect Success !")
    }
})
module.exports = connection