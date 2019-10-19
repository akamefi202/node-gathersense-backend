var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
  title: {type: String, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9 ]+$/, 'is invalid'], index: true},
  description: String,
  tags: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, {timestamps: true});

SessionSchema.methods.toJSON = function(){
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      tags: this.tags,
      questions: this.questions
    };
  };

mongoose.model('Session', SessionSchema);
