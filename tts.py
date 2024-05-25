import gtts
import playsound as ps
class TTS():
    def play_sound(self,sentence):
        print("TTS 변환중")
        """
                English(United States) en
                French(France) fr
                Korean(Korea) ko
                Spanish(Spain) es
                Spanish(UnitedStates) es
        """
        tts = gtts.gTTS(text=sentence, lang = 'ko')
        tts.save("grade_voice.mp3")
        ps.playsound("grade_voice.mp3")
