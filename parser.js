let lexeme_index = 0;
let statements = [];
let lexemes;

function parse(lexs) {
  lexemes = lexs;
  expression(['end-of-text']);
  console.log('is valid? TRUE');
}

function expression(follow) {
  booleanExpression(follow);
}

function booleanExpression(follow) {
  let newFollow = follow;
  newFollow.push('or');

  booleanTerm(newFollow);

  while (currentSymbol === 'or') {
    nextSymbol();
    booleanTerm(newFollow);
  }
  expected(newFollow);
}

function booleanTerm(follow) {
  let newFollow = follow;
  newFollow.push('and');

  booleanFactor(newFollow);
  while (currentSymbol === 'and') {
    nextSymbol();
    booleanFactor(newFollow);
  }
  expected(newFollow);
}

function booleanFactor(follow) {
  if (currentSymbol() === 'not') { nextSymbol(); }
  let newFollow = follow;
  newFollow.push('=');
  newFollow.push('<');

  arithmeticExpression(newFollow);
  if (currentSymbol() === '=' || currentSymbol() === '<') {
    nextSymbol();
    arithmeticExpression(newFollow);
  }
}

function arithmeticExpression(follow) {
  let newFollow = follow;
  newFollow.push('+');
  newFollow.push('-');

  term(newFollow);
  while (currentSymbol() === '+' || currentSymbol() === '-') {
    nextSymbol();
    term(newFollow);
  }
  expected(newFollow);
}

function term(follow) {
  let newFollow = follow;
  newFollow.push('*');
  newFollow.push('/');

  factor(newFollow);
  while (currentSymbol() === '*' || currentSymbol() === '/') {
    nextSymbol();
    factor(newFollow);
  }
  expected(newFollow);
}

function factor(follow) {
  if (currentSymbol() === 'true' || currentSymbol() === 'false' || currentSymbol() === 'NUM') {
    literal(follow);
  } else if (currentSymbol() === 'ID') {
    nextSymbol();
  } else if (currentSymbol() === '(') {
    nextSymbol();
    expression([')']);
    accept(')');
  } else {
    expected(['true', 'false', 'NUM', 'ID', '(']);
  }
}

function literal(follow) {
  if (currentSymbol() === 'true' || currentSymbol() === 'false' || currentSymbol() === 'NUM') {
    if (currentSymbol() === 'NUM') {
     nextSymbol();
    } else {
      booleanLiteral(follow);
    }
  } else {
    console.log("ERROR: literal error");
  }
}

function booleanLiteral(follow) {
  if (currentSymbol() === 'true' || currentSymbol() === 'false') {
    nextSymbol();
  } else {
    console.log("ERROR: boolean literal error");
  }

}

function accept(symbol) {
  if (currentSymbol() === symbol) {
    nextSymbol();
  } else {
    expected([ symbol ]);
  }
}

function expected(symbols) {
  if(symbols.indexOf(currentSymbol()) === -1) {
    console.log("ERROR on line " +lexemes[lexeme_index].line + ", character " + lexemes[lexeme_index].character + ": seeing " + currentSymbol() + ", expected " + symbols);
    console.log('is valid? FALSE');
    process.exit();
  }
}

function nextSymbol() {
  lexeme_index++;
}

function currentSymbol() {
  return lexemes[lexeme_index].kind;
}

exports.parse = parse;
