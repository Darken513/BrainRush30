const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routers/auth.router');
const db_utils = require('./services/database')

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/auth', authRouter);

async function init(){
  db_utils.initDataBase();
}

init();
app.listen(80, () => console.log('Server started on port 80'));