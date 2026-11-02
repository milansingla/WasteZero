const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEMO_ROLES = {
  volunteer: { name: 'Demo Volunteer', email: 'demo-volunteer@wastezero.local' },
  ngo: { name: 'Demo NGO Partner', email: 'demo-ngo@wastezero.local' },
  admin: { name: 'Demo Administrator', email: 'demo-admin@wastezero.local' },
};

const demoLogin = async (req, res) => {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_DEMO_LOGIN !== 'true') {
    return res.status(404).json({ message: 'Demo access is not enabled' });
  }

  const demo = DEMO_ROLES[req.body?.role];
  if (!demo) {
    return res.status(400).json({ message: 'Choose a valid demo role' });
  }

  try {
    let user = await User.findOne({ email: demo.email });
    if (user && (user.role !== req.body.role || user.name !== demo.name)) {
      return res.status(409).json({ message: 'The reserved demo account is unavailable' });
    }

    if (!user) {
      const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      user = await User.create({
        name: demo.name,
        email: demo.email,
        password,
        role: req.body.role,
        location: req.body.role === 'ngo' ? 'Banur, Punjab' : 'Rajpura, Punjab',
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: 'This demo account is suspended' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 60 * 1000,
      path: '/',
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('[DEMO LOGIN ERROR]', error.message);
    return res.status(500).json({ message: 'Could not start the demo session' });
  }
};

module.exports = { demoLogin };
