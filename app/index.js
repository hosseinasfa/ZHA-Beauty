const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require ('cookie-parser');
const validator = require('express-validator');
const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const passport = require('passport');




module.exports = class Application{
    constructor() {
        this.setupExpress();
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000 , () => console.log('Listening on port 3000...'));
    }


    async setMongoConnection(){
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://127.0.0.1/ZHA-Beauty');
    }

    /* express config */
    setConfig() {
        require('app/passport/passport-local');

        app.use(express.static('public'));
        app.set('view engine', 'ejs');
        app.set('views', path.resolve('./resource/views'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true}));
        app.use(validator());
        app.use(session({
        secret: 'ZHAsecretKey',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/ZHA-Beauty' })
        }));
        
        app.use(cookieParser('ZHAsecretKey'));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
    }

    setRouters() {
        app.use(require('./routes/api'));
        app.use(require('./routes/web'));
    }
}