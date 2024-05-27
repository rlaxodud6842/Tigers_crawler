from dotenv import load_dotenv
from openai import OpenAI
import os
import Tools.crawler

# ChatGPT 상호 작용 함수
def chat_with_gpt(prompt):
    load_dotenv()
    key = os.environ.get('key')
    client = OpenAI(api_key = key)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    message = response.choices[0].message.content.strip()
    return message

def crawler_and_gpt(ID, PW, year, semester):
    user_grade = Tools.crawler.craw(ID, PW, year, semester)
    string = ""
    for grade in user_grade:
        string += grade

    print("gpt 질의중")
    return chat_with_gpt(f"It's my grade {string}. Please summarize your grades in Korean. Don't forget any information!")
