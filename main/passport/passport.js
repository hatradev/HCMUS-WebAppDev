const passport = require('passport');
const bcrypt = require('bcrypt');
const MyStrategy = require('./myStrategy');
const User = require("../models/account.model");

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    const acc = await User.findOne({_id: id });
    if (acc){
        return done(null, acc);
    }
    done('invalid');
});

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new MyStrategy(async (email, pw, done) => {
        try{
            const user = await User.findOne({ email: email });
            const rs = await bcrypt.compare(pw, user.password);
            if (rs){
                return done(null, user);
            }
            done('invalid auth', null);
        }
        catch (err){
            done(err);
        }
    }))
}