import mongoose from 'mongoose';

mongoose.Promise = Promise

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/users', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

export { db, mongoose};