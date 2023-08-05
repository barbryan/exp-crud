const mysql = require('mysql')
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'person'
})

con.connect((err) => {
  if (err) throw err.message
  console.log('Connected');
})

module.exports = con