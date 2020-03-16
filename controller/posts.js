const db = require('../db/index');

exports.getPosts = (request, response) => {
  const {pagesize, page} = request.query;

  const pageSize = +pagesize;
  const currentPage = +page;

  if(pageSize && currentPage) {
    db.query('select * from posts limit ?, ?',
      [pageSize*(currentPage - 1), pageSize],
      (err, res) => {
        if (err) console.log(err);

        if(res) {
          response.status(200).send(res);
        }
      });
  }
  else {
    db.query('select * from posts',
      (err, res) => {
        if (err) console.log(err);

        if(res) {
          response.status(200).send(res);
        }
      });
  }
  // console.log(request.query);
};

exports.getPost = (request, response) => {
  const { id } = request.params;

  db.query('select * from posts where id = ?',
    [id],
    (err, res) => {
      if (err) throw err;

      response.status(200).send(res[0]);
    });
};

exports.addPost = (request, response) => {
  const { title, content } = request.body;
  const url = request.protocol + '://' + request.get('host');
  const imagePath = url + '/public/images/' + request.file.filename;

  db.query('insert into posts (title, content, imagePath) values (?, ?, ?)',
    [title, content, imagePath],
    (err, res) => {
      if (err) throw err;

      db.query('select * from posts',
        (err2, res2) => {
          if (err2) throw err2;

          response.status(201).send(res2);
        });
    });
};

exports.updatePost = (request, response) => {
  const { postId } = request.params;
  const { title, content } = request.body;
  console.log(request.file);

  db.query(
    'update posts set title = ?, content = ? where id = ?',
    [title, content, postId],
    (err, res) => {
      if (err) throw err;

      response.status(200).send({message: 'Post updated successfully'});
    });
  // console.log(request.body);
};

exports.deletePost =  (request, response) => {
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
};

