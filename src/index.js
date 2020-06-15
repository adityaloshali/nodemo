const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('@hapi/joi');

const validation = require('./middlewares/validation');
const ValidationError = require('./errors/validation-error');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const users = []

const USER_CREATION_VALIDATION = Joi.object().keys({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/users', (req, res) => {
  return res.status(200).json(users)
})

app.post('/users', validation(USER_CREATION_VALIDATION), (req, res) => {
  const user = req.body;

  users.push(user);

  return res.status(201).json(user)
})

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'some error occured' });
})

app.listen(3000, () => {
  console.log('server running on port 3000')
})