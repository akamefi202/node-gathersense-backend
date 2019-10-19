var mongoose = require('mongoose');
var router = require('express').Router();
var Training = mongoose.model('Training');
var auth = require('../auth');

router.get('/get-all', auth.required, function(req, res, next) {
    Training.find().then(function(trainings){
      return res.json({trainings: trainings});
    }).catch(next);
});

router.post('/get-by-id', auth.required, function(req, res, next){
  Training.findById(req.body.id).then(function(training){
      if(!training){ return res.sendStatus(401); }
      
      return res.json({training: training.toJSON()});
  }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
  var training = new Training();

  training.title = req.body.title;
  training.description = req.body.description;
  training.color = req.body.color;
  training.tags = req.body.tags;
  training.sessions = training.sessions;
  training.candidates = [];

  training.save().then(function(){
      return res.json({training: training.toJSON()});
  }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
  Training.findById(req.body.id).then(function(training){
      if(!training){ return res.sendStatus(401); }

      // only update fields that were actually passed...
      if(typeof req.body.title !== 'undefined'){  
          training.title = req.body.title;
      }
      if(typeof req.body.description !== 'undefined'){
          training.description = req.body.description;
      }
      if(typeof req.body.color !== 'undefined'){
          training.color = req.body.color;
      }
      if(typeof req.body.tags !== 'undefined'){
          training.tags = req.body.tags;
      }
      if(typeof req.body.sessions !== 'undefined'){
          training.sessions = req.body.sessions;
      }
      if(typeof req.body.candidates !== 'undefined'){
          training.candidates = req.body.candidates;
      }

      return training.save().then(function(){
          return res.json({training: training.toJSON()});
      });
  }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
  Training.findById(req.body.id).then(function(training){
    if (!training) { return res.sendStatus(401); }

    training.remove().then(function(){
        return res.sendStatus(204);
    });
  }).catch(next);
});

module.exports = router;