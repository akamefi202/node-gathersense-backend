var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Administrator = mongoose.model('Administrator');
var auth = require('../auth');

router.get('/get-all', auth.required, function(req, res, next) {
  Administrator.find().then(function(administrators){
    return res.json({administrators: administrators});
  }).catch(next);
});

router.post('/login', function(req, res, next){
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('administrator', {session: false}, function(err, administrator, info){
    if(err){ return next(err); }
    
    if(administrator){
      administrator.token = administrator.generateJWT();
      return res.json({administrator: administrator.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/create', function(req, res, next){
  var administrator = new Administrator();

  administrator.name = req.body.name;
  administrator.email = req.body.email;
  administrator.setPassword(req.body.password);

  administrator.save().then(function(){
    return res.json({administrator: administrator.toJSON()});
  }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
  Administrator.findById(req.body.id).then(function(administrator){
    if(!administrator){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.name !== 'undefined'){  
      administrator.name = req.body.name;
    }
    if(typeof req.body.email !== 'undefined'){
      administrator.email = req.body.email;
    }
    if(typeof req.body.password !== 'undefined'){
      administrator.setPassword(req.body.password);
    }

    return administrator.save().then(function(){
      return res.json({administrator: administrator.toJSON()});
    });
  }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
  Administrator.findById(req.body.id).then(function(administrator){
    if (!administrator) { return res.sendStatus(401); }

    administrator.remove().then(function(){
      return res.sendStatus(204);
    });
  }).catch(next);
});

router.post('/logout', auth.required, function(req, res, next){
  Administrator.findById(req.payload.id).then(function(administrator){
    if (!administrator) { return res.sendStatus(401); }

    administrator.token = "";
    administrator.save().then(function(){
      return res.sendStatus(204);
    });
  }).catch(next);
});

module.exports = router;
