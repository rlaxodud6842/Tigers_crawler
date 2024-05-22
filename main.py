from selenium import webdriver
import time
from selenium.webdriver.common.by import By

# 옵션 생성
options = webdriver.ChromeOptions()
# options.add_argument("headless")
driver = webdriver.Chrome(options=options)

time.sleep(1)

URL = "https://sso.daegu.ac.kr/dgusso/ext/tigersstd/login_form.do?Return_Url=https://tigersstd.daegu.ac.kr/nxrun/ssoLogin.jsp"
driver.get(URL)

id = "your Student ID"
passwd = "your passwd"


driver.find_element(By.XPATH, '//*[@id="usr_id"]').click()
time.sleep(1)
driver.find_element(By.XPATH, '//*[@id="usr_id"]').send_keys(id)

driver.find_element(By.XPATH, '//*[@id="usr_pw"]').click()
time.sleep(1)
driver.find_element(By.XPATH, '//*[@id="usr_pw"]').send_keys(passwd)

time.sleep(1)
driver.find_element(By.XPATH, '//*[@id="idLoginForm"]/div[1]/div[3]/button').click()

time.sleep(10)