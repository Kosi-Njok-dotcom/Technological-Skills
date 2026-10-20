const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto= require('crypto');
const transporter = require("../config/mail");
const sendEmail = require("../utils/sendEmail")


// REGISTER USER

const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
        } = req.body || {};

        // Check all required data
        if (!fullName || !email || !password || !confirmPassword ) {
            return res.status(400).json({
                message: "Please fill all data"
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password don't match"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const category = userRole === 'Student' ? (studentCategory || 'Normal Basic Computer') : 'N/A';
        const userRole = role || 'Student';

        // Create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: "userRole",
            studentCategory: category
        });

        const emailToken = crypto.randomBytes(32).toString('hex');
        const hashToken = crypto.createHash('sha256').update(emailToken).digest('hex')
        newUser.emailverifyToken = hashToken
        newUser.emailverifyExpire = Date.now()+30*60*1000
        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            emailToken
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const verifyEmail = async(req, res) => {
    try {
        const emailToken = req.params.token
        const hashToken = crypto.createHash('sha256').update(emailToken).digest('hex')
        const user = await User.findOne({
            emailverifyToken: hashToken,
            emailverifyExpire: {$gt: Date.now()}
        });
        await newUser.save()
        const verifyLink = `${process.env.CLIENT_URL}/verify-email.html?token=${verifiicationToken}&email=${emailToken}`;
        const emailBody = `
        <h3>Welcome to Fhobs Solutions, ${fullName}!<?h3>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        `;
        const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: "Email Verification Code",
        text: `Your email verification token is:<a href="${emailToken}"</a>This token expires in 15 minutes`
        });
        await sendEmail(email, 'Verify your Fhobs Solutions Account', emailBody);

        if(!user){
            return res.status(401).json({message: "Invalid or Expire  verification token"})
        }
        user.isVerified = true
        user.emailverifyToken = undefined
        user.emailverifyExpire = undefined
        await user.save()
        res.status(200).json({
            message: "Account Verified Sucessfully! You can now log in." 
        });
    } catch (error) {
        res.status (500).json ({
            message: 'Server error' + error.message });
    }
};

// Forgotten password   
 const forgottenPassword = async(req, res) => {
        const { email } = req.body;
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({ message: 'No user with that email exists' });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordresetToken = hashToken
        user.passwordresetExpire = Date.now()+ 1*60*60*1000
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/verify-email.html?token=${verifiicationToken}&email=${emailToken}`;
        await sendEmail(
            email,
            'Password Reset Request - Fhobs Solutions',
            `<p>Click the link to reset your password: <a href="${resetLink}</a></p>`
        );
        res.status(200).json({  message: "Password reset link sent to email.",  resetToken  })
    }

    // Reset Password
    const resetPassword = async (req, res) => {
    const token = req.params.token
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordresetToken: hashToken,
         passwordresetExpire: {$gt: Date.now()}
            })
            console.log(user)
   if (!user) {
                return res.status(404).json({message: "User not Found"})
            }     

            const {password, confirmPassword} = req.body
            const hashPassword = await bcrypt.hash(password, 10)
            user.password = hashPassword
            user.passwordresetToken =undefined  
            user.passwordresetExpire = undefined
            await user.save();
            res.status(200).json({
                message: "Password updated successfully"
            })
         }
    
    // Resend Verification
    const resendVerification = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: "Account is already verified"
                });
            }
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const emailToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(emailToken).digest('hex');

            existingUser.emailverifyToken = hashedToken;
            existingUser.emailverifyExpire = Date.now()+ 30*60*1000;
            await existingUser.save();

            const verifyLink = `${process.env.CLIENT_URL}/verify-email.html?token=${verifiicationToken}&email=${emailToken}`;
            await sendEmail(
                email,
                'Resend: Verify your Fhobs Solutions Account',
                `<p>Click here to verify: <a href="${verifyLink}">${verifyLink}</a></p>`
            )

            res.status(200).json({
                message: "Verification link sent to your email",
                emailToken
            });
        } catch (error) {
            res.status(500).json({
                message: 'Server eerror'+ error.message
            });
        }
    }



// LOGIN

const login = async (req, res) => {
      const Max_login_Attempt = 5
      const lock_Time = 10*60*1000
    try {
        const {
            email,
            password
        } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        // Find user
        const existingUser = await User.findOne({ email });
      

        if (!existingUser.isVerified) {
            return res.status(401).json({
                message: "email not verified"
            });
        }
          if (existingUser.isLocked) {
            return res.status(403).json({ message: "Account is locked."});
          }
      

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordMatch) {
            existingUser.LoginAttempt +=1;
            if (existingUser.LoginAttempt >= Max_login_Attempt){
                existingUser.LockUntil = Date.now() + lock_Time
            }
                await existingUser.save()
                    return res.status(400).json({ message: "Invalid Password"})
            }

        // Create token
        const token = jwt.sign(
            {
                id: existingUser._id,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d" 
            }
        );

        res.cookie('token', token,{
httpOnly: true,
secure: false,
sameSite: "lax",
maxAge: 24*60*60*1000
});

        res.status(200).json({
            message: "Login successful",

            data: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role,
                studentCategory: existingUser.studentCategory
            },

            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//logout 
    const logout = (req, res) => {
    res.clearCookie("token", {
httpOnly: true,
secure: false,
sameSite: "lax"
});
res.status(200).json({
        message: "Logout Successfully"
});
};




// EXPORT

module.exports = {
    register,
    login,
    verifyEmail,
    logout,
    resendVerification,
    forgottenPassword,
    resetPassword
};