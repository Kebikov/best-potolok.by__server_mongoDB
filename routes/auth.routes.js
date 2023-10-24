const express = require('express');
const router = express.Router({mergeParams: true});
const bcrypt = require('bcryptjs');
const chalk = require('chalk');

const Admin = require('../models/Admin');

const TokenService = require('../service/token.service');


//= вход по логину и паролю 
router.post('/login-admin', async (req, res) => {
    try {

        const {email, password} = req.body;

        if(email && password) {

            const admin = await Admin.findOne({email});
            if(!admin) return res.status(400).send({ error: { message: 'EMAIL_NOT_FOUND' } });

            const isPasswordEqual = await bcrypt.compare(password, admin.password); 
            if(!isPasswordEqual) return res.status(400).send({ error: { message: 'INVALID_PASSWORD' } });
            
            const tokens = TokenService.generate({_id: admin._id, access: 'Admin'});
            
            await TokenService.saveTokenInDB(admin._id, 'Admin', tokens.refreshToken);
            
            return res.status(200).send({...tokens, userId: admin._id, access: 'Admin'});

        } else {
            return res.status(400).send({ error: { message: 'NOT_ALL_DATA_SENT' } });
        }

    }catch (error) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});


//= обновление токена 
router.patch('/refresh-token-check', async (req, res) => {
    try {
        const body = req.body;
        // body = {
        //     refreshToken: 'some_token',
        //     id: 'user_id'
        // }

        const isMatch = TokenService.validateRefreshToken(body.refreshToken);

        if(isMatch && isMatch._id === body.id) {
            const tokens = TokenService.generate({_id: body.id, access: 'Admin'});
            await TokenService.saveTokenInDB(body.id, 'Admin', tokens.refreshToken);
            console.log(chalk.bgCyanBright('TOKEN_UPDATE'));
            return res.status(200).send({...tokens, expiresIn: tokens.expiresIn + '', userId: body.id, access: 'Admin'});
        } else {
            console.log(chalk.bgCyanBright('NOT_TOKEN_UPDATE'));
            return res.status(400).json( {error: {message: 'REFRESH_TOKEN_IS_BED'}} );
        }

    }catch (error) { 
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});



module.exports = router;