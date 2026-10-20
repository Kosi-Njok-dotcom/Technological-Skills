const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
    type: String, 
    required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true 
    },
    role: { 
        type: String,
        enum: ['student','tutor', 'admin'],
        default: 'student'
    },
    studentCtegory: {
        type: String,
        enum: [ 'IOTS', 'IT', 'Normal Basic Computer', 'N/A' ],
        default: 'N/A'
    },
    LoginAttempt: {
        type: Number,
        default: 0
    },
    LockUntil: {
        type: Date
    },

     emailverifyToken: {
        type: String
     },
     
     emailverifyExpire: {
        type: Date
     },
     isVerified: {
        type: Boolean,
        default: false
     },
     verificationToken: {
        type: String
     },
     verificationTokenExpires: {
        type: Date
     },
     passwordresetToken: {
        type: String
     },
     passwordresetExpire: {
        type: Date
     }
}, 

{
    timestamps: true
 });

userSchema.methods.islocked = function(){
    return !!(this.LockUntil && this.LockUntil>Date.now());
}

module.exports = mongoose.model('User', userSchema);