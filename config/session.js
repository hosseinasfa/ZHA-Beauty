const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const mongoose = require ('mongoose');

module.exports = {
    secret: process.env.SESSION_SECRETKEY,
    resave: true,
    saveUninitialized: true,
    cookie : { expires : new Date(Date.now() + 1000 * 60 * 60 * 5 ) },
    store: MongoStore.create({ mongoUrl: 'mongodb://root:OLGEOtTVaTQT6EpW9YCgv06J@esme.iran.liara.ir:30472/ZHA-Beauty?authSource=admin&replicaSet=rs0&directConnection=true' })
}