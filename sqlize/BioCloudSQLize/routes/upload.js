var express = require('express');
var router = express.Router();
const multer = require('multer');

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
    console.log(req.body);
    // username = req.body.username;
    res.status(200);
    // res.redirect('/');
});

router.get('/',
function(req, res, next) {
  res.render('upload');
})

module.exports = router;