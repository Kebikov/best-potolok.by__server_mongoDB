const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
require('dotenv').config();


class TokenService { 

    accessSecret = process.env.ACCESS_SECRET;
    refreshSecret = process.env.REFRESH_SECRET;
    
    //. generate(генерация токенов) 
    generate(payload) {
        const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: '10s'});
        const refreshToken = jwt.sign(payload, this.refreshSecret);
        return {accessToken, refreshToken, expiresIn: 10}
    }
    //. save(сохранение токена в BD) 
    async saveTokenInDB(userId, userType, refreshToken) {
        const existsUser = await Token.findOne({user: userId});
        if(existsUser) {
            existsUser.refreshToken = refreshToken;
            return existsUser.save();
        }
        const token = await Token.create({user: userId, userType, refreshToken});
        return token;
    }	
    //. validateRefresh(проверка токена) 
    validateAccessToken(accessToken) {
        try{
            let check = jwt.verify(accessToken,  this.accessSecret);
            if(check?.id) check._id = check.id;
            return check;
        }catch(err) {
            return null; 
        }
    }
    //. validateRefresh(проверка токена) 
    validateRefreshToken(refreshToken) {
        try {
            let check = jwt.verify(refreshToken, this.refreshSecret);
            if(check?.id) check._id = check.id;
            return check;
        } catch(err) {
            return null;
        }
    }
    //. findToken(поиск токена) 
    async findToken(refreshToken) {
        try {
            return await Token.findOne({refreshToken});
        } catch(err) {
            return null;
        }
    }
}

module.exports = new TokenService();




