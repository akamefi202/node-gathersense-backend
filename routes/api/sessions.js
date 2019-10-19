var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Session = mongoose.model('Session');
var auth = require('../auth');

router.post('/get-by-id', auth.required, function(req, res, next){
    Session.findById(req.body.id).then(function(session){
        if(!session){ return res.sendStatus(401); }
        
        return res.json({session: session.toJSON()});
    }).catch(next);
});

router.post('/create', auth.required, function(req, res, next){
    var session = new Session();

    session.title = req.body.title;
    session.description = req.body.description;
    session.tags = req.body.tags;
    session.questions = req.body.questions;

    session.save().then(function(){
        return res.json({session: session.toJSON()});
    }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
    Session.findById(req.body.id).then(function(session){
        if(!session){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.title !== 'undefined'){  
            session.title = req.body.title;
        }
        if(typeof req.body.description !== 'undefined'){  
            session.description = req.body.description;
        }
        if(typeof req.body.tags !== 'undefined'){  
            session.tags = req.body.tags;
        }
        if(typeof req.body.questions !== 'undefined'){  
            session.questions = req.body.questions;
        }

        return session.save().then(function(){
            return res.json({session: session.toJSON()});
        });
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    Session.findById(req.body.id).then(function(session){
        if (!session) { return res.sendStatus(401); }

        session.remove().then(function(){
            return res.sendStatus(204);
        });
    }).catch(next);
});

module.exports = router;
