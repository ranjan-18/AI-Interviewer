const pdfParse = require('pdf-parse');

class ResumeParser {
  async parsePdf(fileBuffer) {
    try {
      const data = await pdfParse(fileBuffer);
      return data.text;
    } catch (error) {
      console.error(`Error reading PDF: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ResumeParser();
