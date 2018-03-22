//global variables
let reservedWords = [ "begin", "end", "bool", "int", "if", "then", "else", "fi", "while", "do", "od", "print", "or", "and", "not", "false", "true" ];
let terminalSymbols = [ ";", "=", "<", "+", "-", "*", "/", "(", ")", ":=" ];
let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let fileChars = [];
let eof = 0;
// a lexeme is { kind: '', value: '', line: 0, character: 0 }}
let lexemes = [];
let lexemeIndex = 0;
let currentLexeme;

main(); //start of program
function main() {
  let file = '';
  if (process.argv.length === 2) {
    file = 'test.txt';
  } else {
    file = process.argv[2];
  }
  let text = getText(file);
  textToLex(text);
  makeLexemes();
  tokenLoop();
}

async function tokenLoop() {
  next();
  while ( kind() != "end-of-text" ) {
    if( kind() == "ERROR" ) { break;}
    if ( value() === kind() ) {
      console.log("<" + value() + ", " + position() + ">");
    } else {
      console.log("<" + kind() + ", " + value() + ", " + position() + ">");
    }

    await sleep(1); //just to be safe
    next();
  }
  if( kind() == "ERROR" ) {
    console.log("<" + kind() + ", " + value() + ", " + position() + ">");
  } else {
    console.log(kind());
  }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function makeLexemes() {
  // eof: num of chars
  // fileChars: array of each character from files
  let value = '';
  let line = 1;
  let character = 0;

  for (let i = 0; i < eof; i++) {
    character++;

    switch(fileChars[i]) {
      case '\n':
        if(value == '') {
          character = 0;
          line++;
          break;
        }

        addLexeme({ value: value, line: line, character: character - value.length});
        character = 0;
        line++;
        value = '';
        break;

      case ' ':
        if(value == '') {
          break;
        }
        addLexeme({ value: value, line: line, character: character - value.length});
        value = '';
        break;

      case '/':
        if(value === '/') {
          while((i < eof) && (fileChars[i] != '\n')) { i++; }
          character = 0;
          line++;
          value = '';
        } else if (value === '') {
          value = fileChars[i];
        } else {
          addLexeme({ value: value, line: line, character: character - value.length});
          value = fileChars[i];
        }
        break;

      case ':':
        if (value === '') {
          value = fileChars[i];
        } else {
          addLexeme({ value: value, line: line, character: character - value.length});
          value = fileChars[i];
        }
        break;

      default:
        if(value === '/') {
          addLexeme({ value: value, line: line, character: character - value.length});
          value = '';
        }

        if (value === ':' && fileChars[i] === '=') {
          value = value + fileChars[i];
          addLexeme({ value: value, line: line, character: character + 1 - value.length});
          value = '';
          break;
        }


        if(isTerminalSymbol(fileChars[i])) {
          if (value != '') {
            addLexeme({ value: value, line: line, character: character - value.length});
          }
          value = fileChars[i];
          addLexeme({ value: value, line: line, character: character + 1 - value.length});
          value = '';
          break;
        }

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

  if(currentLexeme.value === 'ERROR') {
    kind = 'ERROR';
  } else if(isReservedWord(currentLexeme.value)) {
    kind = currentLexeme.value;
  } else if(isTerminalSymbol(currentLexeme.value)) {
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

function isID(word) {
  if(!isLetter(word[0])) {
    return false;
  }

  for(let i = 1; i < word.length; i++) {
    if(isNumber(word[i])) {
      continue;
    } else if (isLetter(word[i])) {
      continue;
    } else if (word[i] === '_') {
      continue;
    } else {
      return false;
    }
  }
 return true;
}

function isNUM(word) {
  for(let i = 0; i < word.length; i++) {
    if(isNumber(word[i])) {
      continue;
    } else {
      return false;
    }
  }
 return true;
}

function isLetter(letter) {
  for (let i = 0; i < letters.length; i++) {
    if (letter === letters[i]) {
      return true;
    }
  }
  return false;
}

function isNumber(number) {
  for (let i = 0; i < numbers.length; i++) {
    if (number === numbers[i]) {
      return true;
    }
  }
  return false;
}

function isReservedWord(word) {
  for (let i = 0; i < reservedWords.length; i++) {
    if (reservedWords[i] == word) {
      return true;
    }
  }
  return false;
}

function isTerminalSymbol(word) {
  for (let i = 0; i < terminalSymbols.length; i++) {
    if (terminalSymbols[i] === word) {
      return true;
    }
  }
  return false;
}

function value() {
  //returns the value of the lexeme (if it is an "ID" or "NUM")
  return currentLexeme.value;
}

function position() {
  //returns the position of the lexeme that was just read
  return 'line: ' + currentLexeme.line + '; character: ' + currentLexeme.character;
}

function getText(file){
  let fs = require('fs');
  let path = require('path');

  console.log("Lexing file " + file + " in current directory\nPrinting out tokens for reference\n");

  try {
    return fs.readFileSync(path.join(__dirname, '/' + file)).toString();
  } catch(error) {
    console.log("Make sure " + file + " exists in current directory");
  }
}
