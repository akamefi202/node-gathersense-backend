var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var Organization = mongoose.model('Organization');
var auth = require('../auth');
var functions = require('../function');
var multer = require('multer');
var multiparty = require('multiparty');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images/organ/');
  },
  filename: function(req, file, cb){
    cb(null, functions.getImagePath(req.body.email) + ".png")
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});


router.get('/get-all', auth.required, function(req, res, next) {
  Organization.find().then(function(organizations){
    return res.json({organizations: organizations});
  }).catch(next);
});

router.post('/login', function(req, res, next){
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('organization', {session: false}, function(err, organization, info){
    if(err){ return next(err); }
    
    if(organization){
        organization.token = organization.generateJWT();
      return res.json({organization: organization.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/forgot', function(req, res, next){
    var dotenv = require('dotenv');
    dotenv.config();
    var sendgrid   = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
    var email      = new sendgrid.Email();
    
    email.setFrom(process.env.SENDGRID_FROM);
    email.addTo(req.body.email);
    email.addHeader('X-Sent-Using', 'SendGrid-API');
    email.addHeader('X-Transport', 'web');
    email.setSubject('GatherSense: Reset Password');
    email.setText('');

    var fs = require('fs');
    var stringTemplate = fs.readFileSync('e:/email.html', {encoding:'utf-8'});
    console.log(stringTemplate);
    email.setHtml(stringTemplate);
    
    sendgrid.send(email, function(err, json) {
      if (err) { return console.error(err); }
      console.log(json);
    });
    return res.sendStatus(204);
});

router.post('/reset', auth.required, function(req, res, next){
  return res.sendStatus(204);
});

router.post('/logout', auth.required, function(req, res, next){
  Organization.findById(req.payload.id).then(function(organization){
    if (!organization) { return res.sendStatus(401); }

    organization.token = "";
    organization.save().then(function(){
      return res.sendStatus(204);
    });
  }).catch(next);
});

router.post('/create', auth.required, upload.single('image'), function(req, res, next){
  var organization = new Organization();
  organization.name = req.body.name;
  organization.email = req.body.email;
  organization.description = req.body.description;
  organization.setPassword(req.body.password);
  organization.trainings = [];
  organization.candidates = [];

  organization.photo = "http://localhost:3000/images/organ/" + req.file.filename;

  organization.save().then(function(){
    return res.json({organization: organization.toJSON()});
  }).catch(next);
});

router.put('/update', auth.required, upload.single('image'), function(req, res, next){
  Organization.findById(req.body.id).then(function(organization){
    if(!organization){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.name !== 'undefined'){  
      organization.name = req.body.name;
    }
    if(typeof req.body.email !== 'undefined'){
      organization.email = req.body.email;
    }
    if(typeof req.body.description !== 'undefined'){
      organization.description = req.body.description;
    }
    if(typeof req.body.password !== 'undefined'){
      organization.setPassword(req.body.password);
    }
    // if(typeof req.body.trainings !== 'undefined'){
    //   organization.trainings = req.body.trainings;
    // }
    // if(typeof req.body.candidates !== 'undefined'){
    //   organization.candidates = req.body.candidates;
    // }
    if (typeof req.file !== 'undefined'){
      organization.photo = "http://localhost:3000/images/organ/" + req.file.filename;
    }

    return organization.save().then(function(){
      return res.json({organization: organization.toJSON()});
    });
  }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
  Organization.findById(req.body.id).then(function(organization){
    if (!organization) { return res.sendStatus(401); }

    organization.remove().then(function(){
      return res.sendStatus(204);
    });
  }).catch(next);
});

module.exports = router;