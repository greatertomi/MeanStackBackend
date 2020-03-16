const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
  );
  res.header('Access-Control-Expose-Headers', 'x-access-token');
  next();
});

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/posts', require('./routes/posts'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
