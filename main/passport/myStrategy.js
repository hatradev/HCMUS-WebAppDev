const passport = require('passport');
const { Strategy } = require('passport-strategy');


module.exports = class MyStrategy extends Strategy{
    constructor(verify, options){
        super();
        this.name = 'myStrategy';
        this.verify = verify;
        this.email = (options && options.email) ? options.email : 'inputEmail';
        this.password = (options && options.password) ? options.password :'inputPassword';
        passport.strategies[this.name] = this;
    }
    
    authenticate(req, options) {
        const email = req.body[this.email];
        const pw = req.body[this.password];
        this.verify(email, pw, (err, user) => {
            if (err){
                return this.fail(err);
            }
            if (user){   
                return this.success(user, null);
            }
            this.fail('invalid auth');
        });
    }
}
