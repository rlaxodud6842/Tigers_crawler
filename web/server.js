const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const { User } = require('./models');  // ./models/index.js를 가져옴

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

// 회원가입 페이지 라우트
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// 회원가입 처리 라우트
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

// 로그인 처리 라우트
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

// 대시보드 페이지 라우트
app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// 사용자 삭제 페이지 라우트
app.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/delete.html'));
});

// 사용자 삭제 처리 라우트
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

// 비밀번호 재설정 요청 페이지 라우트
app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset.html'));
});

// 비밀번호 재설정 요청 처리 라우트
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

// 비밀번호 재설정 페이지 라우트
app.get('/reset/:token', (req, res) => {
  const token = req.params.token;
  if (!resetTokens[token]) {
    return res.send('Password reset token is invalid or has expired.');
  }
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// 비밀번호 재설정 처리 라우트
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

// 학기 선택 처리 라우트
app.post('/submit-selection', (req, res) => {
  const { year, semester } = req.body;
  // 여기에서 년도와 학기를 처리하는 로직을 추가합니다.
  console.log(`Selected year: ${year}, semester: ${semester}`);
  
  // Python 스크립트 실행
  const scriptPath = path.join(__dirname, '..', 'main.py');
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
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
