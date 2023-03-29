const jwt = require("jsonwebtoken");
const userDB = require("../models/user.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userDB.getByEmailAndPassword(email, password);
  if (user) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        notif_time: user.notif_time,
        design_mode: user.design_mode,
      },
      "AphatrackLongKeyHere!!"
    ); //make the key a general constant
    res.json({ token });
  } else {
    res.json({ title: "Error", body: "Wrong credentials." });
  }
};

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;
  const userExists = await userDB.getByEmail(email);
  if (userExists) {
    res.json({ title: "Error", body: "Email already exists." });
    return;
  }
  await userDB.createNew(password, email, username);
  res
    .status(201)
    .json({ title: "Success", body: "User created successfully." });
};
exports.changeConf = async (req,res) =>{
  const { username, NotifDate, design_mode } = req.body;
  const user_id = req.params.id;
  await userDB.updateConf({username, notif_time:NotifDate, design_mode, id:user_id})
  const user = await userDB.getById(user_id);
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      notif_time: user.notif_time,
      design_mode: user.design_mode,
    },
    "AphatrackLongKeyHere!!"
  ); //make the key a general constant
  res.json({ token });
}