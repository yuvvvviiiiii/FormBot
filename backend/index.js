const express = require('express');
const env = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./routes/user')
const folderRouter = require('./routes/folderRoutes');
const fileRouter = require('./routes/fileRoutes');
const indexRouter = require('./routes/indexRouter');
const formResponseRouter = require('./routes/formResponse');

const app = express();
const port = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

app.use('/api/user', userRouter, folderRouter, fileRouter, indexRouter, formResponseRouter);

app.get('/', (req, res) => {
  return res.status(200).send('HELLO FROM FORMBOT SERVER');
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('connected to mongoDb');
  }).catch((err) => {
    console.log('error connecting to mongoDb', err);
  });
});

