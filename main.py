import Tools.chatgpt
from tts import TTS

def main():
    tts = TTS()
    sentence = Tools.chatgpt.crawler_and_gpt()
    tts.play_sound(sentence)

if __name__ == '__main__':
    main()