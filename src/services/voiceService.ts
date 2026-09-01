import { LanguageCode } from '../types';

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening = false;
  public isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      }
    }
  }

  private loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const v = this.synth.getVoices();
    if (v && v.length > 0) {
      this.voices = v;
    }
    return this.voices;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.synth) {
      const freshVoices = this.synth.getVoices();
      if (freshVoices && freshVoices.length > 0) {
        this.voices = freshVoices;
      }
    }
    return this.voices;
  }

  // Play realistic Dual-Tone Multi-Frequency (DTMF) dial pad tone
  public playDtmfTone(key: string, durationMs: number = 180) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Standard DTMF Frequency matrix
      const dtmfFreqs: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };

      const freqs = dtmfFreqs[key] || [440, 880];
      const now = this.audioCtx.currentTime;
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
      gainNode.connect(this.audioCtx.destination);

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationMs / 1000);
      osc2.stop(now + durationMs / 1000);
    } catch (e) {
      console.warn('DTMF audio error:', e);
    }
  }

  // Play pleasant acoustic chime when voice prompt starts
  public playChime(success = true) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      gainNode.connect(this.audioCtx.destination);

      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(success ? 587.33 : 329.63, now); // D5 or E4
      osc.frequency.exponentialRampToValueAtTime(success ? 880.0 : 220.0, now + 0.3); // A5 or A3
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Speak out text in the specified language (hi, mr, en).
   * Robust matching ensures Hindi/Marathi Devanagari text is spoken using authentic Indian voices.
   */
  public speak(text: string, lang: LanguageCode = 'hi', onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      onEnd?.();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {
      // Ignore
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.getAvailableVoices();

    let matchedVoice: SpeechSynthesisVoice | undefined;
    let actualLangTag = 'hi-IN';

    if (lang === 'hi') {
      actualLangTag = 'hi-IN';
      // 1. Look for native Hindi voices (Google हिन्दी, Microsoft Kalpana/Hemant/Madhur/Swara, etc.)
      matchedVoice = voices.find(v => 
        v.lang === 'hi-IN' || 
        v.lang === 'hi_IN' || 
        v.lang.startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('madhur') ||
        v.name.toLowerCase().includes('swara')
      );
    } else if (lang === 'mr') {
      actualLangTag = 'mr-IN';
      // 1. Look for native Marathi voice
      matchedVoice = voices.find(v => 
        v.lang === 'mr-IN' || 
        v.lang === 'mr_IN' || 
        v.lang.startsWith('mr') || 
        v.name.toLowerCase().includes('marathi') ||
        v.name.includes('मराठी')
      );
      // 2. If no Marathi voice installed on this OS, fallback to Hindi voice (Devanagari pronunciation is identical and natural)
      if (!matchedVoice) {
        matchedVoice = voices.find(v => 
          v.lang === 'hi-IN' || 
          v.lang === 'hi_IN' || 
          v.lang.startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') || 
          v.name.includes('हिन्दी') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('hemant')
        );
        if (matchedVoice) {
          actualLangTag = 'hi-IN'; // Feed to Hindi synthesizer engine for accurate Devanagari reading
        }
      }
    } else {
      // English
      actualLangTag = 'en-IN';
      matchedVoice = voices.find(v => 
        v.lang === 'en-IN' || 
        v.lang === 'en_IN' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('neerja')
      );
      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang.startsWith('en'));
      }
    }

    utterance.lang = actualLangTag;
    utterance.rate = lang === 'hi' || lang === 'mr' ? 0.90 : 0.95; // Clear natural cadence
    utterance.pitch = 1.0;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    this.isSpeaking = true;
    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };
    utterance.onerror = (e) => {
      console.warn('TTS utterance error:', e);
      this.isSpeaking = false;
      onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Failed to speak utterance:', err);
      this.isSpeaking = false;
      onEnd?.();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignore
      }
      this.isSpeaking = false;
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  /**
   * Listen to voice input with Web Speech API and user-friendly error translation.
   */
  public listen(
    lang: LanguageCode = 'hi',
    onResult: (transcript: string) => void,
    onError?: (friendlyError: string, rawCode?: string) => void,
    onStatusChange?: (listening: boolean) => void
  ) {
    if (!this.recognition) {
      const msg = lang === 'hi'
        ? 'इस ब्राउज़र में लाइव स्पीच पहचान उपलब्ध नहीं है। कृपया नीचे दिए गए उदाहरणों पर टैप करें या लिखकर भेजें।'
        : lang === 'mr'
        ? 'या ब्राउझरमध्ये थेट भाषण ओळख उपलब्ध नाही. कृपया खालील उदाहरणावर टॅप करा किंवा लिहा.'
        : 'Live speech recognition is not available in this browser. Please use the quick prompts or type below.';
      onError?.(msg, 'not-supported');
      return;
    }

    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
      
      this.recognition.onstart = () => {
        this.isListening = true;
        onStatusChange?.(true);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        onStatusChange?.(false);
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onStatusChange?.(false);
        const raw = event.error || 'unknown';

        let friendly = '';
        if (raw === 'network') {
          friendly = lang === 'hi'
            ? 'क्लाउड वॉइस सर्विस इस ब्राउज़र फ़्रेम में सीमित है। कृपया नीचे दिए गए उदाहरणों पर टैप करें या लिखकर भेजें।'
            : lang === 'mr'
            ? 'क्लाउड व्हॉइस सर्व्हिस या ब्राउझर फ्रेममध्ये मर्यादित आहे. कृपया खालील उदाहरणावर टॅप करा किंवा लिहून पाठवा.'
            : 'Cloud speech recognition is restricted in this browser frame. Please tap a sample prompt below or type your query.';
        } else if (raw === 'not-allowed' || raw === 'service-not-allowed') {
          friendly = lang === 'hi'
            ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक की अनुमति दें या नीचे दिए गए विकल्पों का उपयोग करें।'
            : lang === 'mr'
            ? 'मायक्रोफोन परवानगी नाकारली. कृपया ब्राउझरमध्ये मायक्रोफोन चालू करा.'
            : 'Microphone permission denied. Please allow microphone access or choose a prompt below.';
        } else if (raw === 'no-speech') {
          friendly = lang === 'hi'
            ? 'कोई आवाज़ नहीं सुनाई दी। कृपया दोबारा बोलें या नीचे दिए गए विकल्पों में से चुनें।'
            : lang === 'mr'
            ? 'कोणताही आवाज ऐकू आला नाही. कृपया पुन्हा बोला किंवा खालील पर्याय निवडा.'
            : 'No voice detected. Please try speaking again or select a sample prompt.';
        } else {
          friendly = lang === 'hi'
            ? `वॉइस इनपुट: ${raw}। कृपया नीचे दिए गए उदाहरणों पर क्लिक करें या लिखकर भेजें।`
            : lang === 'mr'
            ? `व्हॉइस इनपुट त्रुटी: ${raw}. कृपया खालील पर्याय निवडा.`
            : `Voice error (${raw}). Please use the sample prompts below or type your message.`;
        }

        onError?.(friendly, raw);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStatusChange?.(false);
      };

      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onStatusChange?.(false);
      const friendly = lang === 'hi'
        ? 'वॉइस इनपुट शुरू नहीं हो सका। कृपया नीचे दिए गए उदाहरणों का उपयोग करें।'
        : lang === 'mr'
        ? 'व्हॉइस इनपुट सुरू करता आले नाही. कृपया खालील पर्याय वापरा.'
        : 'Could not start voice recognition. Please use the quick prompts below.';
      onError?.(friendly, 'exception');
    }
  }
}

export const voiceService = new VoiceService();


