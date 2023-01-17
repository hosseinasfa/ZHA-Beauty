const database = require('./database');
const session = require('./session');
const layout = require('./layout');

module.exports = {
    database,
    session,
    layout,
    port : process.env.APPLICATION_PORT,
    cookie_secretKey : process.env.COOKIE_SECRETKEY
}