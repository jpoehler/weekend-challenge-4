var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString = '';


if (process.env.DATABASE_URL !== undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/task_db';
}

router.post('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('INSERT INTO tasks (task) VALUES ($1) RETURNING id, task, status',
                             [req.body.task]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var start = client.query('CREATE TABLE IF NOT EXISTS tasks' +
    '(id SERIAL NOT NULL, task TEXT NOT NULL,' +
    'status boolean DEFAULT false NOT NULL,' +
    'CONSTRAINT tasks_pkey PRIMARY KEY (id))');

    var query = client.query('SELECT * FROM tasks');

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.delete('/:id', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);

    var result = [];

    query.on('end', function() {
      res.send(204);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.put('/:id', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('UPDATE tasks SET task=$1, status=$2 WHERE id=$3 RETURNING *',
           [req.body.task, req.body.status, req.params.id]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;
