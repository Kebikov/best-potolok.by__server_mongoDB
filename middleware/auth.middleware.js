const TokenService = require('../service/token.service');
const chalk = require('chalk');

const auth = (access) => {

    return (req, res, next) => {
        if(req.method === 'OPTIONS') {
            return next(); 
        }

        try{
            console.log(chalk.red('auth'));

            const token = req.headers.authorization;
            
            if(!token) {
                console.log(chalk.bgCyanBright('!token'));
                return res.status(401).json( {error: {message: 'ACCESS_DENIED'}} );
            }

            const dataToken = TokenService.validateAccessToken(token);
            
            if(dataToken.access === access) {
                console.log(chalk.bgCyanBright('NEXT')); 
                res.user = dataToken;
                return next(); 
            }else{
                console.log(chalk.bgCyanBright('NEXT_ERROR'));
                return res.status(401).json( {error: {message: 'ACCESS_DENIED'}} ); 
            }

        }catch(error){
            return res.status(401).json( {error: {message: 'ACCESS_DENIED'}} );
        }
    }
    
}

module.exports = auth;