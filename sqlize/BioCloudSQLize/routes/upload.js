var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require("fs");
// var isAuthenticated = require('../isAuthenticated').ensureLocalAuthenticated;

// var username = "TEST"; // Hopefully will use session variable instead of this

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/tmp/") // This sets the directory for the folder where files will be uploaded
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // This sets the name of the file (remains the original name currently)
    }
 
});

var upload = multer({storage: storage});



router.post('/', upload.single('upload'), (req, res) => {
    console.log("stuff");
    console.log(req.body.username);
    console.log(req.file);
    fs.createReadStream(req.file.path).pipe(fs.createWriteStream("/data/users/" + req.body.token.username+"/"+req.file.filename));
    console.log("done");
    res.status(200).json("file");
    

   
    // res.redirect('/');
});

router.get('/',
function(req, res, next) {
  res.render('upload');
})

module.exports = router;