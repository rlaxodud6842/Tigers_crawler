from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

import time

def craw():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('window-size=5000, 5000')
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(5000, 5000)

    time.sleep(1)

    URL = "https://sso.daegu.ac.kr/dgusso/ext/tigersstd/login_form.do?Return_Url=https://tigersstd.daegu.ac.kr/nxrun/ssoLogin.jsp"
    driver.get(URL)

    id = "id"
    passwd = "passwd"


    driver.find_element(By.XPATH, '//*[@id="usr_id"]').click()
    time.sleep(1)
    driver.find_element(By.XPATH, '//*[@id="usr_id"]').send_keys(id)

    driver.find_element(By.XPATH, '//*[@id="usr_pw"]').click()
    time.sleep(1)
    driver.find_element(By.XPATH, '//*[@id="usr_pw"]').send_keys(passwd)

    time.sleep(2)
    driver.find_element(By.XPATH, '//*[@id="idLoginForm"]/div[1]/div[3]/button').click()

    time.sleep(6)

    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.TopFrame.form.mnTop.item1:text"]').click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.LeftFrame.form.tabMenu.tabMnu.form.grdMnLeft.body.gridrow_2.cell_2_0.celltreeitem.treeitemtext:text"]').click()
    time.sleep(2)
    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.rdHakjum.radioitem1:icontext"]/img').click()
    time.sleep(2)

    answer = []
    i = 0
    flag = True
    print("크롤링 시작")
    while flag:
        try:
            element = driver.find_element(By.XPATH,'//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.Tab01.tabpage1.form.Grid00.body.gridrow_' + str(i) + '"]')
            temp = element.get_attribute('aria-label')
            splited_string = temp.split(" ")
            if splited_string[2] == "균형" or splited_string[2] == "공통" or splited_string[2] == "자유":
                grade = (splited_string[0]+"년도"+splited_string[1]+"학기" + splited_string[4] + " " + splited_string[6] + " " + splited_string[7])
            else:
                grade = (splited_string[0]+"년도"+splited_string[1]+"학기" + splited_string[3] + " " + splited_string[5] + " " + splited_string[6])
            answer.append(grade)
            i = i + 1
        except NoSuchElementException:
            flag = False
    print("크롤링 종료")
    return answer