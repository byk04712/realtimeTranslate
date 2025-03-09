class SpeechSynthesisService {
  synth;
  voices = [];
  voicesLoaded = false;
  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    if (speechSynthesis.onvoiceschanged !== void 0) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  loadVoices() {
    this.voices = this.synth.getVoices();
    this.voicesLoaded = true;
  }
  speak(text, lang, options = {}) {
    if (!this.voicesLoaded) {
      setTimeout(() => this.speak(text, lang, options), 100);
      return;
    }
    this.synth.cancel();
    if (text.trim() === "")
      return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = this.voices.find((v) => v.lang.includes(lang.split("-")[0]));
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    this.synth.speak(utterance);
  }
  stop() {
    this.synth.cancel();
  }
  isPaused() {
    return this.synth.paused;
  }
  pause() {
    this.synth.pause();
  }
  resume() {
    this.synth.resume();
  }
  getVoices() {
    return this.voices;
  }
  isSupported() {
    return "speechSynthesis" in window;
  }
}
const SpeechSynthesisService$1 = new SpeechSynthesisService();
export {
  SpeechSynthesisService$1 as S
};
