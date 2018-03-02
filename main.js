let num = 6;
let currentLine = 1;
let currentChar = 1;
main();

function main() {
  let text = getGrammar();
  //Do some work here


  //token loop
  next();
  while ( kind() != "end-of-text" ) {
    console.log(value() + ", " + kind() + ", " + position());
    next();
  }
  console.log(kind());
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
