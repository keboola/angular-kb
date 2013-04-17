{
  var separator = ',';
}

start
  = comma

comma
  = & { return separator = ','; } sv:sv { return sv; }


sv
  = [\n\r]* first:line rest:([\n\r]+ data:line { return data; })* [\n\r]* { rest.unshift(first); return rest; }

line
  = first:field rest:(char:. & { return char == separator; } text:field { return text; })*
    & { return first !== null || rest.length; }
    { rest.unshift(first); return rest; }

field
  = '"' text:char* '"' { return text.join(''); }

char
  = '"' '"' { return '"'; }
  / [^"]