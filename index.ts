const selfClosingTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

enum TokenType {
  openTag = 'openTag',
  closeTag = 'closeTag',
  selfClosingTag = 'selfClosingTag',
  comment = 'comment',
  script = 'script',
  style = 'style',
}

const matchers = {
  [TokenType.openTag]: /<([a-z][a-z0-9-]*)(?:\s+[a-z][a-z0-9-]*?(?:="[\s\S]*?")?)*\s*>/gi,
  [TokenType.closeTag]: /<\/([a-z][a-z0-9-]*)\s*>/gi,
  [TokenType.selfClosingTag]: /<([a-z][a-z0-9-]*)(?:\s+[a-z][a-z0-9-]*?(?:="[\s\S]*?")?)*\s*\/>/gi,
  [TokenType.comment]: /<!--[\s\S]*?-->/g,
  [TokenType.script]: /<script[\s\S]*?<\/script\s*?>/g,
  [TokenType.style]: /<style[\s\S]*?<\/style\s*?>/g,
};

function getNextToken(html: string, position: number) {
  let token = null;

  for (const [type, regExp] of Object.entries(matchers)) {
    regExp.lastIndex = position;
    const match = regExp.exec(html);
    if (!match) continue;

    if (token) {
      if (match.index <= token.match.index) token = { type, match };
    } else {
      token = { type, match };
    }
  }

  return token;
}

function* tokenize(html: string) {
  let position = 0;
  let token = null;

  while ((token = getNextToken(html, position))) {
    position = token.match.index + token.match[0].length;

    if (token.type === TokenType.openTag || token.type === TokenType.closeTag) {
      yield token;
    }
  }
}

export function validateHtml(inputHtml: string) {
  const stack = [];

  for (const { type, match } of tokenize(inputHtml.trim())) {
    const tagName = match[1].toLowerCase();

    if (selfClosingTags.has(tagName)) continue;

    if (type === TokenType.openTag) {
      stack.push(tagName);
    } else if (stack.length > 0 && stack[stack.length - 1] === tagName) {
      stack.pop();
    } else {
      return false;
    }
  }

  return stack.length === 0;
}
