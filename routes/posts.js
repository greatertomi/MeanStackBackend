const { Router } = require('express');
const multer = require('multer');

const db = require('../db/index');

const router = Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimeType];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimeType];
    cb(null, name + '-' + Date.now() + '.' + ext);
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

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


router.post('/addPost', multer({storage: storage}).single('image'), (request, response) => {
 /*const { title, content } = request.body;

  db.query('insert into posts (title, content) values (?, ?)',
    [title, content],
    (err, res) => {
      if (err) throw err;

      db.query('select * from posts',
        (err2, res2) => {
          if (err2) throw err2;

          response.status(201).send(res2);
        });
    });*/
 console.log(request.body);
});

router.put('/updatePost/:postId', (request, response) => {
  const { postId } = request.params;
  const { title, content } = request.body;

  db.query(
    'update posts set title = ?, content = ? where id = ?',
    [title, content, postId],
    (err, res) => {
      if (err) throw err;

      response.status(200).send({message: 'Post updated successfully'});
    });
  // console.log(request.body);
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
