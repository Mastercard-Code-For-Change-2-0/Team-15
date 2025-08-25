const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;  // <-- match frontend (username)
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name: username, email, password: hashedPassword, role }); // save as name
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ 
      token, 
      user: { name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

// Login


exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("Login input:", { email, role }); // Do not log password for security

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Validate role
    if (role && user.role.toLowerCase() !== role.toLowerCase().trim()) {
      return res.status(400).json({ message: 'Invalid credentials (role mismatch)' });
    }

    // 3. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 5. Send response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};
