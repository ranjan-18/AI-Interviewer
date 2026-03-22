class STTService {
  async transcribe(audioFilePath) {
    // Mock STT for now
    // Integration with Whisper or Azure STT would go here
    return "This is a mock transcription of the user's voice answer.";
  }
}

module.exports = new STTService();
