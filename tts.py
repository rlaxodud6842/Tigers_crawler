import gtts

class TTS:
    def save_sound(self, sentence, output_path):
        print("TTS 변환중")
        """
        English(United States) en
        French(France) fr
        Korean(Korea) ko
        Spanish(Spain) es
        Spanish(UnitedStates) es
        """
        tts = gtts.gTTS(text=sentence, lang='ko')
        tts.save(output_path)

