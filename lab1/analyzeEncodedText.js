const fs = require('fs');
const CustomBase64 = require('./base64');

const frankoFilePath = "./texts/franko/franko.txt";
const restFilePath = "./texts/rest/rest.txt";
const terrariaFilePath = "./texts/terraria/terraria.txt";
const extension = ".bz2";

const countLettersFrequency = function (text, textLength) {
  const lettersObj = text.split('').reduce((accum, letter) => {
    accum[letter.toLowerCase()] = (accum[letter.toLowerCase()] + 1 || 1);
    return accum;
  }, {})

  for (let key of Object.keys(lettersObj)) {
    const val = lettersObj[key];
    lettersObj[key] = {
      repeats: val,
      frequency: +(val / textLength).toFixed(5)
    };
  }

  return lettersObj;
}

const countEntropy = function (lettersObj) {
  let entropy = 0;
  for (let {frequency} of Object.values(lettersObj)) {
    entropy += frequency * Math.log2(1 / frequency)
  }

  return entropy
}

const analyzeEncodedText = function (filePath) {
  const fileContent = fs.readFileSync(filePath);
  const encodedText = CustomBase64.encode(fileContent);
  const charsLength = encodedText.length
  const lettersObj = countLettersFrequency(encodedText, charsLength);
  const entropy = countEntropy(lettersObj);

  console.log(`\nAmount of information in bytes ${(entropy * charsLength / 8).toFixed(5)}`);
  console.log("Custom encoded text:");
  console.log(encodedText);

  return encodedText;
}

const init = function () {
  let encoded;
  console.log("Encoded text");
  encoded = analyzeEncodedText(frankoFilePath);
  console.log("Decoded Text:");
  console.log(Buffer.from(encoded, "base64").toString('utf8'));

  encoded = analyzeEncodedText(restFilePath);
  console.log("Decoded Text:");
  console.log(Buffer.from(encoded, "base64").toString('utf8'));

  encoded = analyzeEncodedText(terrariaFilePath);
  console.log("\nDecoded Text:");
  console.log(Buffer.from(encoded, "base64").toString('utf8'));

  console.log("\nEncoded archive files");
  analyzeEncodedText(frankoFilePath + extension);
  analyzeEncodedText(restFilePath + extension);
  analyzeEncodedText(terrariaFilePath + extension);
}

init()