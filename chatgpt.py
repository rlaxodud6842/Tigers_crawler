from openai import OpenAI
import time
import crawler
# ChatGPT 상호 작용 함수
def chat_with_gpt(prompt):
    # 중요!!: 발급받은 API Key를 입력해야 함
    client = OpenAI(api_key="GPT_API_KEY")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    message = response.choices[0].message.content.strip()
    return message


user_grade = crawler.craw()
string = ""
for grade in user_grade:
    string += grade

print("gpt 질의중")
print(chat_with_gpt(string + "These are my grades, and please organize them easily by year and semester To Korean"))
