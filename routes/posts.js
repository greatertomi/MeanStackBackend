const { Router } = require('express');

const db = require('../db/index');
const postsController = require('../controller/posts');
const extractFile = require('../middlewares/file');
const router = Router();



db.connect((err) => {
  if(err) throw err;

  console.log('MySQL is connected...');
});

router.get('/', postsController.getPosts);

router.get('/:id', postsController.getPost);

router.post('/addPost', extractFile, postsController.addPost);

router.put('/updatePost/:postId', extractFile, postsController.updatePost);

router.delete('/deletePost/:postId', postsController.deletePost);

module.exports = router;
