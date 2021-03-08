import passport from "passport";
import { generateMD5 } from './../utils/generateHash';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/UserModel'

passport.use(
    new LocalStrategy(async (username, password, done): Promise<void> => {
        try {
            const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec()

            if (!user) {
                return done(null, false)
            }
            if (user.password === generateMD5(password + process.env.SECRET_KEY || 'secretKEY'))
                return done(null, user)

            else {
                return done(null, false)
            }
        } catch (error) {
            done(error, false)
        }
    })
)

passport.use(
    new JWTstrategy({
        secretOrKey: process.env.SECRET_KEY || 'Password321!',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
        async (payload, done) => {
            try {
                return done(null, payload.user)
            } catch (error) {
                done(error)
            }
        })
)

passport.serializeUser((user: any, done) => {
    done(null, user?._id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: any, user: any) => {
        done(err, user);
    });
});

export { passport }