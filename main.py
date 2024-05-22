from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import requests
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys

import time


# 옵션 생성
options = webdriver.ChromeOptions()
# options.add_argument("headless")
driver = webdriver.Chrome(options=options)

time.sleep(1)

URL = "https://sso.daegu.ac.kr/dgusso/ext/tigersstd/login_form.do?Return_Url=https://tigersstd.daegu.ac.kr/nxrun/ssoLogin.jsp"
driver.get(URL)

id = "ID"
passwd = "passwd"


driver.find_element(By.XPATH, '//*[@id="usr_id"]').click()
time.sleep(0.5)
driver.find_element(By.XPATH, '//*[@id="usr_id"]').send_keys(id)

driver.find_element(By.XPATH, '//*[@id="usr_pw"]').click()
time.sleep(0.5)
driver.find_element(By.XPATH, '//*[@id="usr_pw"]').send_keys(passwd)

time.sleep(0.5)
driver.find_element(By.XPATH, '//*[@id="idLoginForm"]/div[1]/div[3]/button').click()

time.sleep(5)

driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.TopFrame.form.mnTop.item1:text"]').click()
time.sleep(1)

driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.LeftFrame.form.tabMenu.tabMnu.form.grdMnLeft.body.gridrow_2.cell_2_0.celltreeitem.treeitemtext:text"]').click()
time.sleep(0.5)
driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.rdHakjum.radioitem1:icontext"]/img').click()
time.sleep(1)



for i in range(1,10):
    temp = driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.Tab01.tabpage1.form.Grid00.body.gridrow_'+ str(i) + '"]')
    print(temp.get_attribute('aria-label'))

listscroll = driver.find_element(By.CLASS_NAME, 'body')

driver.execute_script("arguments[0].scrollBy(0, 500)", listscroll)
time.sleep(5)