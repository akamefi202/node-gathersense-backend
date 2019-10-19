var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var OrganizationSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9 ]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  photo: String,
  description: String,
  hash: String,
  salt: String,
  trainings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }]
}, {timestamps: true});

OrganizationSchema.plugin(uniqueValidator, {message: 'is already taken.'});

OrganizationSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

OrganizationSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

OrganizationSchema.methods.generateJWT = function() {
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

OrganizationSchema.methods.addCandidate = function(id){
  if (this.candidates.indexOf(id) === -1){
    this.candidates.push(id);
  }
  return this.save();
}

OrganizationSchema.methods.removeCandidate = function(id){
  this.candidates.remove(id);
  return this.save();
}

OrganizationSchema.methods.addTraining = function(id){
  if (this.trainings.indexOf(id) === -1){
    this.trainings.push(id);
  }
  return this.save();
}

OrganizationSchema.methods.removeTraining = function(id){
  this.trainings.remove(id);
  return this.save();
}

OrganizationSchema.methods.toAuthJSON = function(){
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    photo: this.photo,
    description: this.description,
    trainings: this.trainings,
    candidates: this.candidates,
    token: this.generateJWT(),
  };
};

OrganizationSchema.methods.toJSON = function(){
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    photo: this.photo,
    description: this.description,
    trainings: this.trainings,
    candidates: this.candidates
  };
};

mongoose.model('Organization', OrganizationSchema);
