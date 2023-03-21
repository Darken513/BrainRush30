const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'testuser@gmail.com', password: 'password1' },
  { id: 2, username: 'testuser2@gmail.com', password: 'password2' },
];

// Authentication endpoint 
// todo : move into a router/controller architecture
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.listen(80, () => console.log('Server started on port 80'));