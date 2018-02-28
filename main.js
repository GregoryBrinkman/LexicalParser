let text = getGrammar();
console.log(text);









function getGrammar(){
  let fs = require('fs');
  let path = require('path');

  return fs.readFileSync(path.join(__dirname, '/grammar.txt')).toString();
}

function next() {
  //reads next lexeme in input file
  return 'next';
}

function kind() {
  //returns the knid of lexeme that was read
  return 'kind';
}

function value() {
  //returns the value of the lexeme (if it is an "ID" or "NUM")
  return 'value';
}

function position() {
  //returns the position of the lexeme that was just read
  return 'position';
}

