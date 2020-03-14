const { Router } = require('express');

const db = require('../db/index');

const router = Router();

db.connect((err) => {
  if(err) throw err;

  console.log('MySQL is connected...');
});

router.get('/', (request, response) => {
  db.query('select * from posts',
    (err, res) => {
    if (err) console.log(err);

    if(res) {
      response.status(200).send(res);
    }
  });
});

router.post('/addPost', (request, response) => {
  const { title, content } = request.body;

  db.query('insert into posts (title, content) values (?, ?)',
    [title, content],
    (err, res) => {
      if (err) throw err;

      db.query('select * from posts',
        (err2, res2) => {
          if (err2) throw err2;

          response.status(200).send(res2);
        });
    });
});

router.delete('/deletePost/:postId', (request, response) => {
  const { postId } = request.params;

  db.query('delete from posts where id = ?',
    [postId],
    (err, res) => {
      if (err) throw err;

      db.query('select * from posts',
        (err2, res2) => {
          if (err2) throw err2;

          response.status(200).send(res2);
        });
    });
});

module.exports = router;
