const express = require("express");
const mongoose = require("mongoose");

const {
    MONGOURI
} = require('./keys');

const app = express();
const PORT = 5000;

require('./models/user')

app.use(express.json());
app.use(require('./routes/auth'));

mongoose.model('User')

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

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
});