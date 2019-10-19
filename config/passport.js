var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Administrator = mongoose.model('Administrator');
var Organization = mongoose.model('Organization');
var Candidate = mongoose.model('Candidate');

passport.use('administrator', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
  Administrator.findOne({email: username}).then(function(administrator){
    if(!administrator || !administrator.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }
    return done(null, administrator);
  }).catch(done);
}));

passport.use('organization', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
  Organization.findOne({email: username}).then(function(organization){
    if(!organization || !organization.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }
    return done(null, organization);
  }).catch(done);
}));

passport.use('candidate', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
  Candidate.findOne({email: username}).then(function(candidate){
    if(!candidate || !candidate.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }
    return done(null, candidate);
  }).catch(done);
}));

