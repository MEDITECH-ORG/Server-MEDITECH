const express = require('express');
const router = express.Router();

const { login } = require('../controllers/login.js');
const { emailvalidation, resetpassword } = require('../controllers/resetpassword.js');
const { verifyemail, registeruserP, registeruserM } = require('../controllers/register.js');
const { getuser, userdatap, modifyuserdatap } = require('../controllers/dashboard.js');
const { savelocalbackup, uploadbackupdb, getrecords, getfile} = require('../controllers/database.js'); 

router.post('/login', login);
router.post('/reset/emailvalidation', emailvalidation);
router.post('/reset/password', resetpassword);
router.post('/register/verifyemail', verifyemail);
router.post('/register/registeruserP', registeruserP);
router.post('/register/registeruserM', registeruserM);
router.post('/dashboard/user=1/getuser', getuser);
router.post('/dashboard/user=1/userdata', userdatap);
router.post('/dashboard/user=1/modify', modifyuserdatap);
router.post('/dashboard/user=0/backup/perform', savelocalbackup);     
router.post('/dashboard/user=0/backup/upload', uploadbackupdb);   
router.get('/dashboard/user=0/backup/getrecords', getrecords);  
router.get('/dashboard/user=0/backup/download/:id', getfile);

module.exports = router;
