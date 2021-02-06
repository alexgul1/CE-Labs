class CustomBase64 {
  static #keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  static encode = function (charsBuffer) {
    let encodedText = "";

    for(let i = 0; i < charsBuffer.length; i += 3) {
      const buffer = (charsBuffer[i] << 16) | (charsBuffer[i + 1] << 8) | charsBuffer[i + 2];

      const charsArr = [
        (buffer & 0x00FC_0000) >> 18,
        (buffer & 0x0003_F000) >> 12,
        (buffer & 0x0FC0) >> 6,
        (buffer & 0x003F)
      ];

      encodedText += charsArr.reduce((accum, code) => accum + CustomBase64.#keyStr[code], "");
    }

    switch (charsBuffer.length % 3) {
      case 1: {
        encodedText += "==";
        break;
      }
      case 2: {
        encodedText += "=";
        break;
      }
    }

    return encodedText;
  }
}

module.exports = CustomBase64;
