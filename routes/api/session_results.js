var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var SessionResult = mongoose.model('SessionResult');
var auth = require('../auth');

router.post('/get-by-id', auth.required, function(req, res, next){
    SessionResult.findById(req.body.id).then(function(session_result){
        if(!session_result){ return res.sendStatus(401); }
        
        return res.json({session_result: session_result.toJSON()});
    }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
    var session_result = new SessionResult();

    session_result.session = req.body.session;
    session_result.scores = req.body.scores;
    session_result.question_results = req.body.question_results;

    session_result.save().then(function(){
        return res.json({session_result: session_result.toJSON()});
    }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
    SessionResult.findById(req.body.id).then(function(session_result){
        if(!session_result){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.session !== 'undefined'){  
            session_result.session = req.body.session;
        }
        if(typeof req.body.scores !== 'undefined'){  
            session_result.scores = req.body.scores;
        }
        if(typeof req.body.question_results !== 'undefined'){  
            session_result.question_results = req.body.question_results;
        }

        return session_result.save().then(function(){
            return res.json({session_result: session_result.toJSON()});
        });
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    SessionResult.findById(req.body.id).then(function(session_result){
        if (!session_result) { return res.sendStatus(401); }

        session_result.remove().then(function(){
            return res.sendStatus(204);
        });
    }).catch(next);
});

module.exports = router;
