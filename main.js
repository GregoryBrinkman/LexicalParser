//global variables
let fileChars = [];
let wordBuff = [];
let eof = 0;
let lexemes = [];
// a lexeme is { kind: '', value: '', position: { line: 0, Character: 0 }}
let lexemeIndex = 0;
let currentLexeme;
let reservedWords = [ "begin", "end", "bool", "int", ";", ":=", "if", "then", "else", "fi", "while", "do", "od", "print", "or", "and", "not", "=", "<", "+", "-", "*", "/", "(", ")", "false", "true" ];
let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let underscore = "_";

main(); //start of program
function main() {
  let text = getText();
  textToLex(text);
  makeLexemes();

 //token loop
  tokenLoop();
}

async function tokenLoop() {
  next();
  while ( kind() != "end-of-text" ) {
    console.log("<" + value() + ", " + kind() + ", " + position() + ">");
    await sleep(1); //just to be safe
    next();
  }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function makeLexemes() {
  // eof: num of chars
  // fileChars: array of each character from files
  //
  // Now i want to get a word in the wordBuff
  // and check it against reservedWords
  let kind = '';
  let value = '';
  let line = 1;
  let character = 0;

  for (let i = 0; i < eof; i++) {
    character++;

    switch(fileChars[i]) {
      case '\n':
        addLexeme({ kind: kind, value: value, line: line, character: character - value.length});
        character = 0;
        line++;
        value = '';
        break;
      case ' ':
        addLexeme({ kind: kind, value: value, line: line, character: character - value.length});
        value = '';
        break;
      default:
        value = value + fileChars[i];
        break;
    }
  }
}

function addLexeme(obj) { lexemes.push(obj); }

function textToLex(text) {
  for (let i = 0; i < text.length; i++) {
    fileChars.push(text[i]);
  }
  eof = text.length;
}

function next() {
  currentLexeme = lexemes[lexemeIndex++];
}

function kind() {
  //returns the kind of lexeme that was read
  if(lexemeIndex > lexemes.length) {
    return 'end-of-text';
  }

  let kind = '';

  if(isInReservedWords(currentLexeme.value)) {
    kind = currentLexeme.value;
  } else if(isID(currentLexeme.value)) {
    kind = 'ID';
  } else if(isNUM(currentLexeme.value)) {
    kind = 'NUM';
  } else {
    kind = 'ERROR';
  }
  return kind;
}

function isID(word) { return true; }
function isNUM(word) { return true; }

function isInReservedWords(word) {
  for (let i = 0; i < reservedWords.length; i++) {
    if (reservedWords[i] == word) {
      return true;
    }
  }
  return false;
}

function value() {
  //returns the value of the lexeme (if it is an "ID" or "NUM")
  let value = '';
  value = currentLexeme.value;

  return value;
}

function position() {
  //returns the position of the lexeme that was just read
  return 'line: ' + currentLexeme.line + '; character: ' + currentLexeme.character;
}

function getText(){
  let fs = require('fs');
  let path = require('path');

  let file = 'test.txt';
  console.log("Lexing file test.txt in current directory");
  console.log("Printing out tokens for reference");


  try {
    return fs.readFileSync(path.join(__dirname, '/' + file)).toString();
  } catch(error) {
    console.log("Make sure " + file + " exists in current directory");
  }
}
