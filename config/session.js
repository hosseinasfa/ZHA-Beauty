const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const mongoose = require ('mongoose');

module.exports = {
    secret: process.env.SESSION_SECRETKEY,
    resave: true,
    saveUninitialized: true,
    cookie : { expires : new Date(Date.now() + 1000 * 60 * 60 * 5 ) },
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/ZHA-Beauty' })
}