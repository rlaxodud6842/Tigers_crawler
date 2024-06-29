const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

// 로그인 페이지로 이동
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 로그인 요청 처리
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 사용자 확인 로직 생략
  req.session.username = username;
  req.session.password = password;

  res.redirect('/dashboard');
});

// 대시보드 페이지로 이동
app.get('/dashboard', (req, res) => {
  const username = req.session.username;
  const password = req.session.password;

  if (!username || !password) {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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

  // main.py 파일 경로를 올바르게 지정
  const scriptPath = path.join(__dirname, '..', 'main.py');
  const outputPath = path.join(__dirname, 'public', 'grade_voice.mp3');
  const args = [username, password, year, semester, outputPath];

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

    res.json({ audioPath: '/grade_voice.mp3' }); // 생성된 음성 파일의 경로를 반환
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on https://0.0.0.0:${PORT}`);
});

