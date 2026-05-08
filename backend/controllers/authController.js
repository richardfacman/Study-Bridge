const crypto = require('crypto');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');
const { generateToken, generateRefreshToken } = require('../utils/tokenUtils');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(usersFile))) {
  fs.mkdirSync(path.dirname(usersFile), { recursive: true });
}

// Read users from file
const readUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  return [];
};

// Write users to file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required'
      });
    }

    // If database not connected, use JSON file
    if (mongoose.connection.readyState !== 1) {
      const users = readUsers();
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      };

      users.push(newUser);
      writeUsers(users);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (offline mode).',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            isEmailVerified: false
          },
          token: 'offline-token',
          refreshToken: 'offline-refresh-token'
        }
      });
    }

    try {
      // Check if user exists with timeout
      const existingUser = await User.findOne({ email })
        .maxTimeMS(5000)
        .limit(1)
        .lean();
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    } catch (dbErr) {
      console.warn('Database check error:', dbErr.message);
      // Fallback to JSON file
      const users = readUsers();
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Create user with timeout protection
    let user;
    try {
      user = await Promise.race([
        User.create({
          email,
          password,
          firstName,
          lastName,
          authProvider: 'local'
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User creation timeout')), 8000)
        )
      ]);
    } catch (createErr) {
      console.warn('Database error:', createErr.message);
      // Fallback to JSON file
      const users = readUsers();
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      };
      users.push(newUser);
      writeUsers(users);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (offline mode).',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            isEmailVerified: false
          },
          token: 'offline-token',
          refreshToken: 'offline-refresh-token'
        }
      });
    }

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    
    try {
      await Promise.race([
        user.save({ validateBeforeSave: false }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Save timeout')), 5000)
        )
      ]);
    } catch (saveErr) {
      console.warn('Save timeout, but user created:', saveErr.message);
    }

    // Send verification email (non-blocking)
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    sendEmail({
      to: user.email,
      subject: 'Email Verification - StudyBridge',
      template: 'emailVerification',
      data: {
        userName: user.firstName,
        verificationUrl
      }
    }).catch(err => console.warn('Email sending failed:', err.message));

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists with timeout protection
    let user;
    try {
      user = await Promise.race([
        User.findOne({ email })
          .maxTimeMS(5000)
          .select('+password +twoFactorSecret')
          .lean(false),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 6000)
        )
      ]);
    } catch (queryErr) {
      console.error('Login query error:', queryErr.message);
      return res.status(504).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again.'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      try {
        await user.incLoginAttempts();
      } catch (updateErr) {
        console.warn('Failed to update login attempts:', updateErr.message);
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended',
        reason: user.suspensionReason
      });
    }

    // Reset login attempts (non-blocking)
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.save({ validateBeforeSave: false }).catch(err => 
        console.warn('Failed to reset login attempts:', err.message)
      );
    }

    // Update last login (non-blocking)
    user.lastLogin = Date.now();
    user.save({ validateBeforeSave: false }).catch(err => 
      console.warn('Failed to update last login:', err.message)
    );

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user._id, temp2FA: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.status(200).json({
        success: true,
        require2FA: true,
        tempToken,
        message: 'Please enter your 2FA code'
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePicture: user.profilePicture
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    }).maxTimeMS(10000);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).maxTimeMS(10000);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Email Verification - StudyBridge',
      template: 'emailVerification',
      data: {
        userName: user.firstName,
        verificationUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).maxTimeMS(10000);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - StudyBridge',
      template: 'passwordReset',
      data: {
        userName: user.firstName,
        resetUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() }
    }).maxTimeMS(10000);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable 2FA
// @route   POST /api/auth/2fa/enable
// @access  Private
exports.enable2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).maxTimeMS(10000).select('+twoFactorSecret');

    if (user.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${process.env.TWO_FACTOR_APP_NAME} (${user.email})`
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret (not enabled yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify and activate 2FA
// @route   POST /api/auth/2fa/verify
// @access  Private
exports.verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).maxTimeMS(10000).select('+twoFactorSecret');

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please enable 2FA first'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    user.isTwoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
exports.disable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).maxTimeMS(10000).select('+twoFactorSecret');

    if (!user.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }

    // Verify token before disabling
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).maxTimeMS(10000);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // In a production app, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).maxTimeMS(10000);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).maxTimeMS(10000).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// OAuth handlers
exports.googleAuth = (req, res, next) => {
  // This will be handled by passport
};

exports.googleAuthCallback = async (req, res, next) => {
  try {
    const token = generateToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
  }
};

exports.facebookAuth = (req, res, next) => {
  // This will be handled by passport
};

exports.facebookAuthCallback = async (req, res, next) => {
  try {
    const token = generateToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
  }
};

exports.linkedinAuth = (req, res, next) => {
  // This will be handled by passport
};

exports.linkedinAuthCallback = async (req, res, next) => {
  try {
    const token = generateToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
  }
};