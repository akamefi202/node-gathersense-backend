var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var AdministratorSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9 ]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  hash: String, 
  salt: String
}, {timestamps: true});

AdministratorSchema.plugin(uniqueValidator, {message: 'is already taken.'});

AdministratorSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

AdministratorSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AdministratorSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    name: this.name,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

AdministratorSchema.methods.toAuthJSON = function(){
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
  };
};

AdministratorSchema.methods.toJSON = function(){
  return {
    id: this._id,
    name: this.name,
    email: this.email,
  };
};

mongoose.model('Administrator', AdministratorSchema);
