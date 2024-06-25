import Tools.crawler
from tts import TTS
import argparse


def main(username, password, year, semester):
    tts = TTS()
    sentence = Tools.crawler.craw(username, password, year, semester)
    tts.play_sound(sentence)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument('username', type=str, help='아이디')
    parser.add_argument('password', type=str, help='비밀번호')
    parser.add_argument('year', type=str, help='년도')
    parser.add_argument('semester', type=str, help='학기')
    args = parser.parse_args()

    main(args.username, args.password, args.year, args.semester)
