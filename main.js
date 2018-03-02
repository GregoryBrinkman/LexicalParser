//global variables
let num = 6;
let currentLine = 1;
let currentChar = 1;
let statements = [];
let reservedWords = [ "begin", "end", "bool", "int", ";", ":=", "if", "then", "else", "fi", "while", "do", "od", "print", "or", "and", "not", "=", "<", "+", "-", "*", "/", "(", ")", "false", "true" ];

main(); //start of program
function main() {
  let text = getGrammar();
  grammarToStatements(text);
  // have a list of all statements now
  // Now we have to calculate first follow for each statement
  console.log(findStatement("Factor"));
  makeFirsts();
  makeFollows();

  //token loop
  next();
  while ( kind() != "end-of-text" ) {
    console.log(value() + ", " + kind() + ", " + position());
    next();
  }
  console.log(kind());
}

//todo
function makeFirsts() {}
function makeFollows() {}

function findStatement(stmt) {
  for(let i = 0; i < statements.length; i++) {
    if(statements[i][0] == stmt) {
      return statements[i];
    }
  }
  return 'err';
}

function grammarToStatements(text) {
  let grammarArray = text.split(/\s+/g);
  let numStatements = 0;
  let currentStatement = 0;

  for(let i = 0; i <= grammarArray.length; i++) {
    if(grammarArray[i] == '.') {
      numStatements++;
    }
  }

  for(let i = 0; i < numStatements; i++) {
    statements[i] = [];
  }

  for(let i = 0; i < grammarArray.length - 1; i++) {
    if(grammarArray[i] == '.') {
      currentStatement++;
    } else {
      statements[currentStatement].push(grammarArray[i]);
    }
  }
}

function next() {
  //reads next lexeme in input file
  return 'next';
}

function kind() {
  //returns the kind of lexeme that was read
  let kind = '';
  kind = 'kind';
  if(num <= 0) { kind = 'end-of-text'; }

  num--;
  return kind;
}

function value() {
  //returns the value of the lexeme (if it is an "ID" or "NUM")

  let value = '';

  value = 'ID';
  value = 'NUM';

  return value;

}

function position() {
  //returns the position of the lexeme that was just read
  let position = currentLine + ":" + currentChar;
  return position;
}

function getGrammar(){
  let fs = require('fs');
  let path = require('path');

  return fs.readFileSync(path.join(__dirname, '/grammar.txt')).toString();
}
