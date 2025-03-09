export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private language: string = 'zh-CN';

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && this.onResultCallback) {
        this.onResultCallback(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition?.start();
      }
    };
  }

  public setLanguage(language: string) {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  public start(callback: (text: string) => void) {
    this.onResultCallback = callback;
    this.isListening = true;
    
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }
}

export default new SpeechRecognitionService();