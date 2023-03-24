const jwt = require('jsonwebtoken');
const userDB = require('../services/user.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userDB.getByEmailAndPassword(email, password);
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email }, 'AphatrackLongKeyHere!!'); //make the key a general constant
    res.json({ token });
  } else {
    res.json({ title: 'Error', body: 'Wrong credentials.' });
  }
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await userDB.getByEmail(email);
  if (userExists) {
    res.json({ title: 'Error', body: 'Email already exists.' });
    return;
  }
  await userDB.createNew(password, email);
  res.status(201).json({ title: 'Success', body: 'User created successfully.' });
};