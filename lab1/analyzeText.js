const fs = require("fs");

const frankoFilePath = "./texts/franko/franko.txt";
const restFilePath = "./texts/rest/rest.txt";
const terrariaFilePath = "./texts/terraria/terraria.txt";
const extensions = [".7z", ".bz2", ".gz", ".xz", ".zip"];

const regex = new RegExp(/[а-яієїґ]/gi);

const analyzeFile = function (filePath, fileName) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const fileSize = fs.statSync(filePath).size;
  const charsLength = fileContent.match(regex).length;
  const lettersObj = countLettersFrequency(fileContent, charsLength);
  const entropy = countEntropy(lettersObj);
  const archiveSizes = countArchiveSizes(filePath);

  showAnalysisResult(fileName, fileSize, charsLength, lettersObj, entropy, archiveSizes);
}

const countLettersFrequency = function (text, textLength) {
  const lettersObj = text.match(regex).reduce((accum, letter) => {
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

const countArchiveSizes = function (filePath) {
  return extensions.reduce((accum, ext) => {
    accum[ext] = fs.statSync(filePath + ext).size;
    return accum;
  }, {})
}

const showAnalysisResult = function (name, size, charsLength, lettersObj, entropy, archiveSizes) {
  const amountOfInfo = entropy * charsLength / 8;
  let comparison = size > amountOfInfo ? "more than" : size < amountOfInfo ? "less than" : "equal to";

  console.log(`FileName: ${name}`);
  console.log(`Entropy in bits: ${entropy.toFixed(5)}`);
  console.log(`Amount of information in bits ${(amountOfInfo * 8).toFixed(5)}`);
  console.log(`Amount of information in bytes ${(amountOfInfo).toFixed(5)}`);
  console.log(`File size: ${size} bytes`);
  console.log(`File size is ${comparison} amount of information`);

  for (let [key, val] of Object.entries(archiveSizes)) {
    comparison = val > amountOfInfo ? "more than" : val < amountOfInfo ? "less than" : "equal to";
    console.log(`Archive ${key} size: ${val}`);
    console.log(`Archive ${key} size is ${comparison} amount of information`);
  }

  console.log(`Number and frequency of letter appearance`);
  console.table(lettersObj);
}


analyzeFile(frankoFilePath, "franko");
analyzeFile(restFilePath, "rest");
analyzeFile(terrariaFilePath, "terraria");