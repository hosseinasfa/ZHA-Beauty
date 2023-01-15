const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require ('cookie-parser');
const validator = require('express-validator');
const session = require ('express-session');
const mongoStore = require ('connect-mongo');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const passport = require('passport');




module.exports = class Application{
    constructor() {
        this.setupExpress();
        this.setConfig();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000 , () => console.log('Listening on port 3000...'));
    }

    setConfig() {

        app.use(express.static('public'));
        app.set('view engine', 'ejs');
        app.set('views', path.resolve('./resource/views'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true}));

        app.use(session({
        secret: 'ZHAsecretKey',
        resave: true,
        saveUninitialized: true,
        store
        }))


        app.get('/' , (req , res) => {
            res.json('Hello ZHA Users');
        })



    }
}