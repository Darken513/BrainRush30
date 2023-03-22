const jwt = require('jsonwebtoken');
const userDB = require('../services/user.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userDB.getByEmailAndPassword(email, password);
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email }, 'BrainRush30LongKeyHere!!'); //make the key a general constant
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await userDB.getByEmail(email);
  if (userExists) {
    return res.status(409).json({ message: 'Email already exists.' });
  }
  await userDB.createNew(password, email);
  res.status(201).json({ message: 'User created successfully.' });
};