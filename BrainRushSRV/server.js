const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routers/auth.router');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/auth', authRouter);

app.listen(80, () => console.log('Server started on port 80'));