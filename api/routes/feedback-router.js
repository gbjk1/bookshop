const { Router } = require('express');

const router = new Router();

// Accept the feedback form
router.post('/feedbacks', (req, res) => {
    console.log(req.body);
    res.redirect('/index.html');
});

module.exports = router;