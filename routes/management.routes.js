const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/management', async (req, res) => {
    try {
        res.status(200).json({msg: 'OK'});
    }catch (error) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`}); 
    }
});

module.exports = router;