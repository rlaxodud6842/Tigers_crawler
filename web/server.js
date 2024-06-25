const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

// 로그인 페이지로 이동
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// 로그인 요청 처리
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 여기서는 예제이므로 사용자 확인 과정을 생략하고 바로 대시보드로 이동합니다.
  // 실제 사용에서는 사용자 확인 로직을 추가해야 합니다.
  req.session.username = username;
  req.session.password = password;

  res.redirect('/dashboard');
});

// 대시보드 페이지로 이동
app.get('/dashboard', (req, res) => {
  const username = req.session.username;
  const password = req.session.password;

  if (!username || !password) {
    return res.redirect('/login'); // 아이디나 비밀번호가 없으면 로그인 페이지로 리디렉션
  }

  // 예시로 선택 항목을 받아서 처리하는 코드를 추가할 수 있습니다.
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// 선택 항목 제출 처리
app.post('/submit-selection', (req, res) => {
  const { year, semester } = req.body;
  const username = req.session.username;
  const password = req.session.password;

  if (!username || !password) {
    return res.status(400).send('User not logged in');
  }

  console.log(`Selected year: ${year}, semester: ${semester}, username: ${username}`);

  // Python 스크립트 실행 예시
  const scriptPath = path.join(__dirname, '..', 'main.py');
  const args = [username, password, year, semester];

  execFile('python', [scriptPath, ...args], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return res.status(500).send('Error executing Python script');
    }
    if (stderr) {
      console.error(`Python script stderr: ${stderr}`);
      return res.status(500).send('Python script error');
    }
    console.log(`Python script stdout: ${stdout}`);
    
    res.sendStatus(200);  // 응답 본문 없이 성공 상태만 반환
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
