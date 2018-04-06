let statements = [];

function parse(lexemes) {

  let grammar = getGrammar();
  manipulateGrammar(grammar);
  console.log(lexemes);
  console.log(statements)
}

function getGrammar(){
  let fs = require('fs');
  let path = require('path');

  return fs.readFileSync(path.join(__dirname, '/grammar.txt')).toString();
}

function manipulateGrammar(text) {
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

exports.parse = parse;
