var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var QuestionResult = mongoose.model('QuestionResult');
var auth = require('../auth');

router.post('/get-by-id', auth.required, function(req, res, next){
    QuestionResult.findById(req.body.id).then(function(question_result){
        if(!question_result){ return res.sendStatus(401); }
        
        return res.json({question_result: question_result.toJSON()});
    }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
    var question_result = new QuestionResult();

    question_result.question = req.body.question;
    question_result.score = req.body.score;
    question_result.answer = req.body.answer;

    question_result.save().then(function(){
        return res.json({question_result: question_result.toJSON()});
    }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
    QuestionResult.findById(req.body.id).then(function(question_result){
        if(!question_result){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.question !== 'undefined'){  
            question_result.question = req.body.question;
        }
        if(typeof req.body.score !== 'undefined'){  
            question_result.score = req.body.score;
        }
        if(typeof req.body.answer !== 'undefined'){  
            question_result.answer = req.body.answer;
        }

        return question_result.save().then(function(){
            return res.json({question_result: question_result.toJSON()});
        });
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    QuestionResult.findById(req.body.id).then(function(question_result){
        if (!question_result) { return res.sendStatus(401); }

        question_result.remove().then(function(){
            return res.sendStatus(204);
        });
    }).catch(next);
});

module.exports = router;
