var mongoose = require('mongoose');

var TrainingResultSchema = new mongoose.Schema({
    scores: [Number],
    training: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
    session_results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionResult' }]
}, {timestamps: true});

TrainingResultSchema.methods.toJSON = function(){
    return {
        id: this._id,
        scores: this.scores,
        trainig: this.trainig,
        session_results: this.session_resultss
    };
};

mongoose.model('TrainingResult', TrainingResultSchema);
