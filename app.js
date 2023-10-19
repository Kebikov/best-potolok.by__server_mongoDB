const express =require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();
console.log(chalk.bgBlue.bold(' START '));

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/api', routes);   


async function start() {
    try{
        await mongoose.set('strictQuery', false)
                .connect( process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true} )
                .then(() => console.log(chalk.bgGreen('Connected to MongoDB! +')))
                .catch((err) => console.log('Error mongoose connected >>> ', err)); 

        app.listen(process.env.PORT, (err) => {
            err ? console.log(chalk.bgRed('Error listen port >>> ', err)) : console.log(chalk.bgGreen.bold(`Server started on port ${process.env.PORT}...`));
        });

    }catch(err) {
        console.log('Error >>> ', err);
        process.exit(1);
    }
}

start(); 
