var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session)

	var content = '';

	if (req.session.username){
		content = req.session.username
	}else{
		content = 'Please Login'
	}
	

	res.render('index', { title: 'BioCloud', message: 'Hello '+content });

  // res.render('index', { title: 'Express' });
});

module.exports = router;
