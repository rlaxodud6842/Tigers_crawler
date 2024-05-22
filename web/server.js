const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

// 사용자 데이터를 저장하기 위한 임시 데이터베이스 (배열 사용)
let users = [];

// 정적 파일 제공
app.use(express.static('public'));

// 회원가입 페이지 라우트
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// 회원가입 처리 라우트
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/login');
});

// 로그인 처리 라우트
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.username;
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/login');
  }
});

// 대시보드 페이지 라우트
app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.send(`<h1>Welcome ${req.session.userId}</h1><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
