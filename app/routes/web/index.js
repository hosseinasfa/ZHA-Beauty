const express = require('express');
const router = express.Router();
const i18n = require('i18n');


// Middleware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const errorHandler = require('app/http/middleware/errorHandler');

router.use((req , res , next) => {
    try {
        let lang = req.signedCookies.lang;
        if(i18n.getLocales().includes(lang))
            req.setLocale(lang);
        else 
            req.setLocale(i18n.getLocale());
        next();
    } catch (err) {
        next(err);
    }
})

router.get('/lang/:lang' , (req , res) => {
    let lang = req.params.lang;
    if(i18n.getLocales().includes(lang))
        res.cookie('lang' , lang , { maxAge : 1000 * 60 * 60 * 24 * 90 , signed : true })
    res.redirect(req.header('Referer') || '/');
})


// Admin Router
const adminRouter = require('./admin');
router.use('/admin' , redirectIfNotAdmin.handle , adminRouter); // add routes in admin.js to router

// Home Router
const homeRouter = require('./home');
router.use('/' , homeRouter); // add routes in home.js to router




// Auth Router
const authRouter = require('app/routes/web/auth');
router.use('/auth' , redirectIfAuthenticated.handle , authRouter); // add routes in home.js to router

//handle Errors
router.all('*' , errorHandler.error404)
router.use(errorHandler.handler)




module.exports = router;