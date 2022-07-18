import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    profil: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required:true,
        enum: ['Waiting approval', 'Validated', 'Refused', 'Blocked', 'Left'],
        default: 'Waiting approval'
    },
    tryConnect: {
        try: {type: Number},
        lastTry: {type: Date}
    },
    lastConnexion: { type: Date },
}, {
    timestamps: true,
});

// method to execut before any save in database if password is modified
userSchema.pre('save', async function (next) {

    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;