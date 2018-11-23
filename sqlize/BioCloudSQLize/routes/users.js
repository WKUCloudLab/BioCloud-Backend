var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const usersController = require('../../controllers/usersController');
var isAuthenticated = require('../isAuthenticated').ensureLocalAuthenticated;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  let username = req.body.username
  //user info here
  let response = await usersController.getUserByUsername(username);

  if(response == null){
    res.status(404).json({
      'username': null,
      'message': 'failed to find user by username'
    })
  }
  // res.send('respond with a resource');
});


router.get('/checkToken', async function(req, res, next){
  var loginToken = req.headers.authentication || req.body.Token || req.headers.Bearer;
  var decoded = jwt.verify(loginToken, 'BioCloud');
  return res.json({'status':true, 'message':'USER_IS_AUTHENTICATED'});
})

router.get('/getFiles', async function(req, res, next) {
  
  let username = req.body.username

  let response = await usersController.getAllFiles(username);
  res.status(200).json({
    'response':response,
    'message':'Successfully retrieved all files for user' + username
  });
});






module.exports = router;
