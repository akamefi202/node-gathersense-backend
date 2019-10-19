var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Candidate = mongoose.model('Candidate');
var auth = require('../auth');

router.get('/get-all', auth.required, function(req, res, next) {
    Candidate.find().then(function(candidates){
      return res.json({candidates: candidates});
    }).catch(next);
});

router.post('/get-by-id', auth.required, function(req, res, next){
  Candidate.findById(req.body.id).then(function(candidate){
      if(!candidate){ return res.sendStatus(401);}
  
      return res.json({candidate: candidate.toJSON()});
  }).catch(next);
});

router.post('/login', function(req, res, next){
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('candidate', {session: false}, function(err, candidate, info){
    if(err){ return next(err); }
    
    if(candidate){
        candidate.token = candidate.generateJWT();
      return res.json({candidate: candidate.toAuthJSON()});
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
  Candidate.findById(req.payload.id).then(function(candidate){
    if (!candidate) { return res.sendStatus(401); }

    candidate.token = "";
    candidate.save().then(function(){
      return res.sendStatus(204);
    });
  }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
  var candidate = new Candidate();

  candidate.name = req.body.name;
  candidate.email = req.body.email;
  candidate.photo = req.body.photo;
  candidate.department = req.body.department;
  candidate.occupation = req.body.occupation;
  candidate.trainings = req.body.trainings;
  candidate.training_results = [];
  candidate.setPassword(req.body.password);
  
  candidate.save().then(function(){
      Organization.findById(req.payload.id).then(function(organization){
          organization.addCandidate(candidate.id);
      });
      candidate.trainings.forEach((training_id, index) => 
          Training.findById(training_id).then(function(training){
              training.addCandidate(candidate.id);
          })
      );
      return res.json({candidate: candidate.toJSON()});
  }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
  Candidate.findById(req.body.id).then(function(candidate){
      if(!candidate){ return res.sendStatus(401); }

      // only update fields that were actually passed...
      if(typeof req.body.name !== 'undefined'){  
          candidate.name = req.body.name;
      }
      if(typeof req.body.email !== 'undefined'){
          candidate.email = req.body.email;
      }
      if(typeof req.body.department !== 'undefined'){
          candidate.department = req.body.department;
      }
      if(typeof req.body.occupation !== 'undefined'){
          candidate.occupation = req.body.occupation;
      }
      if(typeof req.body.photo !== 'undefined'){
          candidate.photo = req.body.photo;
      }
      if(typeof req.body.trainings !== 'undefined'){
          candidate.trainings = req.body.trainings;
      }
      if(typeof req.body.training_results !== 'undefined'){
          candidate.training_results = req.body.training_results;
      }
      if(typeof req.body.password !== 'undefined'){
          candidate.setPassword(req.body.password);
      }

      return candidate.save().then(function(){
          return res.json({candidate: candidate.toJSON()});
      });
  }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
  Candidate.findById(req.body.id).then(function(candidate){
      if (!candidate) { return res.sendStatus(401); }

      Organization.findById(req.payload.id).then(function(organization){
          organization.removeCandidate(candidate.id);
      });
      candidate.trainings.forEach((training_id, index) => 
          Training.findById(training_id).then(function(training){
              training.removeCandidate(candidate.id);
          })
      );

      candidate.remove().then(function(){
          return res.sendStatus(204);
      });
  }).catch(next);
});

module.exports = router;