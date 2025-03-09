export class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    // 某些浏览器需要等待voices加载
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    this.voicesLoaded = true;
  }

  public speak(text: string, lang: string, options: { rate?: number; pitch?: number; volume?: number } = {}): void {
    if (!this.voicesLoaded) {
      setTimeout(() => this.speak(text, lang, options), 100);
      return;
    }

    // 取消当前正在播放的语音
    this.synth.cancel();

    if (text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语言
    utterance.lang = lang;
    
    // 尝试找到匹配的声音
    const voice = this.voices.find(v => v.lang.includes(lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    // 设置选项
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // 播放语音
    this.synth.speak(utterance);
  }

  public stop(): void {
    this.synth.cancel();
  }

  public isPaused(): boolean {
    return this.synth.paused;
  }

  public pause(): void {
    this.synth.pause();
  }

  public resume(): void {
    this.synth.resume();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export default new SpeechSynthesisService();