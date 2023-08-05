var express = require('express');
var router = express.Router();
const con = require('../lib/db')

/* GET person listing. */
router.get('/', (req, res, next) => {
  con.query('SELECT * FROM info', (err, result) => {
    if (err) {
      console.log(err.message);
      res.render('person', { data: '' })
    } else {
      res.render('person', { data: result })
    }
  })
});

/* display add person page */
router.get('/add', (req, res, next) => {
  res.render('person/add', {
    name: '',
    age: '',
    gender: ''
  })
})

/* add new person */
router.post('/add', (req, res, next) => {
  let name = req.body.name
  let age = req.body.age
  let gender = req.body.gender
  let errors = false
  if(name.length === 0 || age.length === 0 || gender.length === 0) {
    errors = true;

    // set flash message
    console.log("Please enter name and author");
    // render to add.ejs with flash message
    res.render('person/add', {
        name: name,
        age: age,
        gender: gender
    })
  }
  if (!errors) {
    var form_data = {
      name: name,
      age: age,
      gender: gender
    }
    con.query('INSERT INTO info SET ?', form_data, (err, result) => {
      if (err) {
        console.log('error '+ err.message)
        res.render('person/add', {
            name: form_data.name,
            age: form_data.age,
            gender: form_data.gender
        })
      } else {
          console.log('Book successfully added');
          res.redirect('/person');
      }
    })
  }
})

/* display edit book page */
router.get('/edit/(:id)', (req, res, next) => {
  let id = req.params.id

  con.query(`SELECT * FROM info WHERE id=${id}`, (err, result, fields) => {
    if (err) throw err.message
    if (result.length <=0) {
      console.log('Book not found with id = ' + id);
      res.redirect('/person')
    } else {
      res.render('person/edit', {
        id: result[0].id,
        name: result[0].name,
        age: result[0].age,
        gender: result[0].gender
      })
    }
  })
})

/* update person */
router.post('/update/:id', (req, res, next) => {
  let id = req.params.id
  let name = req.body.name
  let age = req.body.age
  let gender = req.body.gender
  let errors = false
  if(name.length === 0 || age.length === 0 || gender.length === 0) {
    errors = true; 
    
    console.log("Please enter name and author");
    res.render('person/edit', {
      id: id,
      name: name,
      age: age,
      gender: gender
    })
  }
  if (!errors) {
    var form_data = {
      id: id,
      name: name,
      age: age,
      gender: gender
    }
    con.query(`UPDATE info SET ? WHERE id=${id}`, form_data, (err, result) => {
      if (err) {
        console.log('error '+ err.message)
        res.render('person/edit', {
            id: form_data.id,
            name: form_data.name,
            age: form_data.age,
            gender: form_data.gender
        })
      } else {
          console.log('Book successfully edited');
          res.redirect('/person');
      }
    })
  }
})

/* delete person */
router.get('/delete/(:id)', (req, res, next) => {
  let id = req.params.id
  con.query(`DELETE FROM info WHERE id=${id}`, (err, result) => {
    if (err) console.log(err.message);
    else console.log('Book successfully deleted! ID = ' + id);
    res.redirect('/person')
  })
})

module.exports = router;
