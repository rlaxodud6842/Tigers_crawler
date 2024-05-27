const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');
const { User } = require('./models');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashedPassword, email });
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error during registration');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = username;
      req.session.password = password;  // 이 부분은 보안상으로는 좋지 않지만, 예제의 간편함을 위해 추가
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/delete.html'));
});

app.post('/delete', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      await user.destroy();
      res.send(`User ${username} deleted successfully.`);
    } else {
      res.send(`Invalid username or password.`);
    }
  } catch (error) {
    res.status(500).send('Error during deletion');
  }
});

app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset.html'));
});

app.post('/reset', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send('No account with that email found.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    resetTokens[token] = email;
    setTimeout(() => delete resetTokens[token], 3600000); // Token expires in 1 hour

    const mailOptions = {
      to: email,
      from: 'passwordreset@yourdomain.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending email');
      }
      res.send('An e-mail has been sent to ' + email + ' with further instructions.');
    });
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).send('Error during password reset request');
  }
});

app.get('/reset/:token', (req, res) => {
  const token = req.params.token;
  if (!resetTokens[token]) {
    return res.send('Password reset token is invalid or has expired.');
  }
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

app.post('/reset/:token', async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const email = resetTokens[token];
  if (!email) {
    return res.send('Password reset token is invalid or has expired.');
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send('No account with that email found.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    delete resetTokens[token];

    res.send('Password has been reset successfully.');
  } catch (error) {
    res.status(500).send('Error during password reset');
  }
});

app.post('/submit-selection', (req, res) => {
  const { year, semester } = req.body;
  const username = req.session.username;
  const password = req.session.password;
  
  if (!username || !password) {
    return res.status(400).send('User not logged in');
  }

  console.log(`Selected year: ${year}, semester: ${semester}, username: ${username}`);

  const scriptPath = path.join(__dirname, '..', 'main.py');
  const args = [username, password, year, semester];

  execFile('python3', [scriptPath, ...args], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return res.status(500).send('Error executing Python script');
    }
    if (stderr) {
      console.error(`Python script stderr: ${stderr}`);
      return res.status(500).send('Python script error');
    }
    console.log(`Python script stdout: ${stdout}`);
    res.send(`Python script executed successfully with output: ${stdout}`);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

