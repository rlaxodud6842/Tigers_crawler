import openai
from openai import OpenAI
import time
import os
from crawler import craw


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



user_input = craw()
for i in range(0, len(user_input)):
    response = chat_with_gpt(user_input[i] + "성적 데이터를 정리해서 보여줘")
    print("ChatGPT: " + response)
    time.sleep(0.1)