import { UserModelInterface } from './../models/UserModel';
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
        jwtFromRequest: ExtractJwt.fromHeader('token')
    },
        async (payload: {data: UserModelInterface}, done) => {
            try {
                const user = await UserModel.findById(payload.data._id).exec()
                if(!user) {
                   return done(null, false)
                } else {
                   return done(null, user)
                }
            } catch (error) {
               return done(error, false)
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