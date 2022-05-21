require('dotenv').config({ path: './.env' })
var express = require('express');
const cors = require('cors');

var app = express();

const port = process.env.PORT || 3000;
app.use(cors()); 


app.use(express.json({limit: '50mb'}));

const userRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');
const groupRoute = require('./routes/groupRoute');
app.use('/group', groupRoute);
app.use('/task', taskRoute);
app.use('/user', userRoute);


app.listen(port, () =>  { console.log(`App listening on port ${port}!`); });