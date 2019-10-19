var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var TrainingResult = mongoose.model('TrainingResult');
var auth = require('../auth');

router.post('/get-by-id', auth.required, function(req, res, next){
    TrainingResult.findById(req.body.id).then(function(training_result){
        if(!training_result){ return res.sendStatus(401); }
        
        return res.json({training_result: training_result.toJSON()});
    }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
    var training_result = new TrainingResult();

    training_result.training = req.body.training;
    training_result.scores = req.body.scores;
    training_result.session_results = req.body.session_results;

    training_result.save().then(function(){
        return res.json({training_result: training_result.toJSON()});
    }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
    TrainingResult.findById(req.body.id).then(function(training_result){
        if(!training_result){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.training !== 'undefined'){  
            training_result.training = req.body.training;
        }
        if(typeof req.body.scores !== 'undefined'){  
            training_result.scores = req.body.scores;
        }
        if(typeof req.body.session_results !== 'undefined'){  
            training_result.session_results = req.body.session_results;
        }

        return training_result.save().then(function(){
            return res.json({training_result: training_result.toJSON()});
        });
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    TrainingResult.findById(req.body.id).then(function(training_result){
        if (!training_result) { return res.sendStatus(401); }

        training_result.remove().then(function(){
            return res.sendStatus(204);
        });
    }).catch(next);
});

module.exports = router;
