const TokenService = require('../service/token.service');
const chalk = require('chalk');

const auth = (access) => {

    return (req, res, next) => {
        if(req.method === 'OPTIONS') {
            return next(); 
        }

        try{
            console.log(chalk.red('auth'));//: log 

            const token = req.headers.authorization;

            if(!token) {
                return res.status(401).json( {error: {message: 'ACCESS_DENIED_NOT_TOKEN'}} ); 
            }

            const dataToken = TokenService.validateAccessToken(token);

            if(dataToken && dataToken.access === access) {
                res.user = dataToken;
                return next(); 
            }else{
                return res.status(401).json( {error: {message: 'ACCESS_DENIED'}} ); 
            }
            
        }catch(error){
            return res.status(401).json( {error: {message: 'ACCESS_DENIED_CATCH'}} );
        }
    }
    
}

module.exports = auth;