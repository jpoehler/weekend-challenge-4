var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var pg = require('pg');

var connectionString = '';

if (process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/task_db';
}

router.post('/tasks', function(req, res) {
  console.log('body: ', req.body);
pg.connect(connectionString, function(err, client, done){
  if (err) {
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
      done();
    } else {
      var start = client.query('CREATE TABLE IF NOT EXISTS tasks (' +
                              'id SERIAL NOT NULL,' +
                              'task varchar(255) NOT NULL,' +
                              'status varchar(255) NOT NULL,' +
                              'CONSTRAINT tasks_pkey PRIMARY KEY (id))');

      var task = req.body.task;
      var status = req.body.status;

      var query = client.query('INSERT INTO tasks (task, status) VALUES ($1, $2)' +
                                'RETURNING id, task, status', [task, status]);

      var result = [];

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
})


router.get('/tasks', function(req, res) {
  //console.log('body: ', req.body);
  var task = req.body.task;
  var status = 'not completed'
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('SELECT * FROM tasks ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/*', function(req, res){
var filename = req.params[0] || 'views/index.html';
res.sendFile(path.join(__dirname, '../public/', filename));

});

module.exports = router;
