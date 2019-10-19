var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var auth = require('../auth');

router.post('/', auth.required, function(req, res, next){
    return res.sendStatus(204);
});

module.exports = router;
