from openai import OpenAI
import Tools.crawler
# ChatGPT 상호 작용 함수
def chat_with_gpt(prompt):
    # 중요!!: 발급받은 API Key를 입력해야 함
    client = OpenAI(api_key="API_KEY")
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
    print(chat_with_gpt(f"{string}. It's my grade. Please summarize your grades in Korean for the {year} {semester}"))
    return chat_with_gpt(string + f"It's my grade. Please summarize your grades in Korean for the {year} {semester}")
