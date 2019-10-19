var mongoose = require('mongoose');

var TrainingSchema = new mongoose.Schema({
  title: {type: String, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9 ]+$/, 'is invalid'], index: true},
  color: String,
  description: String,
  tags: String,
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }]
}, {timestamps: true});

TrainingSchema.methods.addCandidate = function(id){
  if (this.candidates.indexOf(id) === -1){
    this.candidates.push(id);
  }
  return this.save();
}

TrainingSchema.methods.removeCandidate = function(id){
  this.candidates.remove(id);
  return this.save();
}

TrainingSchema.methods.toJSON = function(){
    return {
      id: this._id,
      title: this.title,
      color: this.color,
      description: this.description,
      tags: this.tags,
      sessions: this.sessions,
      candidates: this.candidates
    };
  };

mongoose.model('Training', TrainingSchema);
