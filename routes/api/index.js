var router = require('express').Router();

router.use('/administrators', require('./administrators'));
router.use('/organizations', require('./organizations'));
router.use('/candidates', require('./candidates'));
router.use('/trainings', require('./trainings'));
router.use('/sessions', require('./sessions'));
router.use('/questions', require('./questions'));
router.use('/training-results', require('./training_results'));
router.use('/session-results', require('./session_results'));
router.use('/question-results', require('./question_results'));
router.use('/support', require('./support'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;