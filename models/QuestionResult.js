var mongoose = require('mongoose');

var QuestionResultSchema = new mongoose.Schema({
    score: Number,
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answer: [Number]
}, {timestamps: true});

QuestionResultSchema.methods.toJSON = function(){
    return {
        id: this._id,
        score: this.score,
        question: this.question,
        answer: this.answer
    };
};

mongoose.model('QuestionResult', QuestionResultSchema);
