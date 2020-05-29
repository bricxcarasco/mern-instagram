const express = require('express');
const mongoose = require('mongoose');

const { MONGOURI } = require('./keys');

const app = express();
const PORT = 5000;

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
    console.log("error connection", err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
});