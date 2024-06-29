from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

import time

def craw(ID, PW, year, semester):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('window-size=5000, 5000')
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(5000, 5000)

    time.sleep(1)

    URL = "https://sso.daegu.ac.kr/dgusso/ext/tigersstd/login_form.do?Return_Url=https://tigersstd.daegu.ac.kr/nxrun/ssoLogin.jsp"
    driver.get(URL)

    id = ID
    passwd = PW

    print("로그인 시작")
    driver.find_element(By.XPATH, '//*[@id="usr_id"]').click()
    time.sleep(1)
    driver.find_element(By.XPATH, '//*[@id="usr_id"]').send_keys(id)

    driver.find_element(By.XPATH, '//*[@id="usr_pw"]').click()
    time.sleep(1)
    driver.find_element(By.XPATH, '//*[@id="usr_pw"]').send_keys(passwd)

    time.sleep(2)
    driver.find_element(By.XPATH, '//*[@id="idLoginForm"]/div[1]/div[3]/button').click()

    time.sleep(10)

    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.TopFrame.form.mnTop.item1:text"]').click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.LeftFrame.form.tabMenu.tabMnu.form.grdMnLeft.body.gridrow_2.cell_2_0.celltreeitem.treeitemtext:text"]').click()
    time.sleep(2)
    driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.rdHakjum.radioitem1:icontext"]/img').click()
    time.sleep(2)
    print("로그인 종료")

    answer = []
    i = 0
    flag = True
    print("크롤링 시작")
    while flag:
        try:
            element = driver.find_element(By.XPATH, '//*[@id="Mainframe.VFrameSet.HFrameSet.innerVFrameSet.innerHFrameSet.innerVFrameSet2.WorkFrame.0001300.form.Tab01.tabpage1.form.Grid00.body.gridrow_' + str(i) + '"]')
            temp = element.get_attribute('aria-label')
            splited_string = temp.split(" ")
            if splited_string[2] == "균형" or splited_string[2] == "공통" or splited_string[2] == "자유":
                grade = (splited_string[0] + "년도 " + splited_string[1] + "학기 " + splited_string[4] + " " + splited_string[6] + " " + splited_string[7])
            else:
                grade = (splited_string[0] + "년도 " + splited_string[1] + "학기 " + splited_string[3] + " " + splited_string[5] + " " + splited_string[6])
            answer.append(grade)
            i = i + 1
        except NoSuchElementException:
            flag = False
            
    if year == "all":
        return answer
    else:
        selection = str(year)+"년도 "+str(semester) + "학기"
        answer = filter_strings(answer,selection)
        title = ""
        mystr = ""
        for item in answer:
            #'2023년도 2학기 빅컨셉+ 90 A'로 되어있기에 분리함.
            contents = item.split(" ")
            if (len(title) <= 0):
                title = contents[0] +" " + contents[1] + "의 성적을 안내드리겠습니다." 
            
            subject = contents[2] #과목
            point = contents[3] #점수
            grade = contents[4] #등급
            
            mystr += subject + "는" + point + "점을 맞았고" + grade + "의 등급을 받았습니다."
        new_answer = title + mystr 

    print("크롤링 종료")
    return new_answer

def filter_strings(arr,selection):
    return [s for s in arr if f"{selection}" in s]