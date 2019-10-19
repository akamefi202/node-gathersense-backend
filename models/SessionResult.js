var mongoose = require('mongoose');

var SessionResultSchema = new mongoose.Schema({
    scores: [Number],
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    question_results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionResult' }]
}, {timestamps: true});

SessionResultSchema.methods.toJSON = function(){
    return {
        id: this._id,
        scores: this.scores,
        session: this.session,
        question_results: this.question_results
    };
};

mongoose.model('SessionResult', SessionResultSchema);
