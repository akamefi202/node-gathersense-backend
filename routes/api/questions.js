var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Question = mongoose.model('Question');
var auth = require('../auth');

router.post('/get-by-id', auth.required, function(req, res, next){
    Question.findById(req.body.id).then(function(question){
        if(!question){ return res.sendStatus(401); }
        
        return res.json({question: question.toJSON()});
    }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
    var question = new Question();

    question.category = req.body.category;
    switch (question.category){
        case 0:case 1:case 2:
            question.question = req.body.question;
            question.options = req.body.options;
            question.answer = req.body.answer;
            question.feedback = req.body.feedback;
            question.tags = req.body.tags;
            break;
        case 3:
            question.title = req.body.title;
            question.text = req.body.text;
            break;
        case 4:
            question.title = req.body.title;
            question.image = req.body.image;
            break;
        case 5:
            question.title = req.body.title;
            question.video = req.body.video;
            break;
    }

    question.save().then(function(){
        return res.json({question: question.toJSON()});
    }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
    Question.findById(req.body.id).then(function(question){
        if(!question){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.category !== 'undefined'){  
            question.category = req.body.category;
        }
        if(typeof req.body.question !== 'undefined'){  
            question.question = req.body.question;
        }
        if(typeof req.body.options !== 'undefined'){  
            question.options = req.body.options;
        }
        if(typeof req.body.answer !== 'undefined'){  
            question.answer = req.body.answer;
        }
        if(typeof req.body.feedback !== 'undefined'){  
            question.feedback = req.body.feedback;
        }
        if(typeof req.body.tags !== 'undefined'){  
            question.tags = req.body.tags;
        }
        if(typeof req.body.title !== 'undefined'){  
            question.title = req.body.title;
        }
        if(typeof req.body.text !== 'undefined'){  
            question.text = req.body.text;
        }
        if(typeof req.body.image !== 'undefined'){  
            question.image = req.body.image;
        }
        if(typeof req.body.video !== 'undefined'){  
            question.video = req.body.video;
        }

        return question.save().then(function(){
            return res.json({question: question.toJSON()});
        });
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    Question.findById(req.body.id).then(function(question){
        if (!question) { return res.sendStatus(401); }

        question.remove().then(function(){
            return res.sendStatus(204);
        });
    }).catch(next);
});

module.exports = router;
