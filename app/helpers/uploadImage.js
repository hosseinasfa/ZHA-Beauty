const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const getDirImage = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    return `./public/uploads/images/${year}/${month}/${day}`;
}

const imageStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let dir = getDirImage();

        mkdirp.sync(dir);
        cb(null , dir);
 
    },
    filename : (req , file , cb) => {
        let filePath = getDirImage() + '/' + file.originalname;
        if(! fs.existsSync(filePath))
            cb(null , file.originalname);
        else 
        cb(null , Date.now() + '-' + file.originalname);
    }
})


const uploadImage = multer({
    storage : imageStorage,
    limits : {
        fileSize : 1024 * 1024 *5
    }
});


module.exports = uploadImage;