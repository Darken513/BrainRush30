const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

//todo make this into an sql table or something
const users = [];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ uid: user.uid }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.signup = (req, res) => {
  const { email, password } = req.body;
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'Email already exists.' });
  }
  const uid = uuidv4();
  users.push({ uid, email, password });
  res.status(201).json({ message: 'User created successfully.' });
};