export interface BoolNode {
  op: string;
  left?: BoolNode | string;
  right?: BoolNode | string;
}

export const parseBooleanExpr = (expr: (string | BoolNode)[]) => {
  if (expr.length === 0) throw 'Expression must be not be empty';
  // Bracket evaluation
  const brackStack: number[] = [];
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === '(') {
      brackStack.push(i);
      continue;
    }
    if (char === ')') {
      const startIndex = brackStack.pop();
      if (startIndex === undefined) throw 'Non matching closing parenthesis';
      const innerExpr = expr.slice(startIndex + 1, i);
      const node = exprToNode(innerExpr);
      const leftExpr = expr.slice(0, startIndex);
      const rightExpr = expr.slice(i + 1);
      expr = [...leftExpr, node, ...rightExpr];
      i = startIndex;
    }
  }

  if (expr.length === 1) return expr[0];
  else {
    const finalNode = exprToNode(expr);
    return finalNode;
  }
};

function exprToNode(expr: (string | BoolNode)[]): BoolNode {
  // Not
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === '!' || char === '¬') {
      const rightChar = expr[i + 1];
      if (!isBoolNode(rightChar) && !/^[a-zA-Z]$/.test(rightChar))
        throw `'${char}' operator being applied to incorrect operand`;
      const node = {
        op: '!',
        right: expr[i + 1],
      };
      const leftExpr = expr.slice(0, i);
      const rightExpr = expr.slice(i + 2);
      expr = [...leftExpr, node, ...rightExpr];
    }
  }

  const precedence = [
    ['&', '.', '·'],
    ['^', '⊕'],
    ['|', '+'],
  ];

  for (const binaryOps of precedence) {
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      if (typeof char === 'string' && binaryOps.includes(char)) {
        const leftChar = expr[i - 1];
        if (!isBoolNode(leftChar) && !/^[a-zA-Z]$/.test(leftChar))
          throw `'${char}' operator being applied to incorrect left operand`;

        const rightChar = expr[i + 1];
        if (!isBoolNode(rightChar) && !/^[a-zA-Z]$/.test(rightChar))
          throw `'${char}' operator being applied to incorrect right operand`;

        const node = {
          op: binaryOps[0],
          left: expr[i - 1],
          right: expr[i + 1],
        };
        const leftExpr = expr.slice(0, i - 1);
        const rightExpr = expr.slice(i + 2);
        expr = [...leftExpr, node, ...rightExpr];
        i--;
      }
    }
  }

  if (expr.length === 1) return expr[0] as BoolNode;

  throw 'Failed to parse boolean expression';
}

function isBoolNode(obj: string | BoolNode): obj is BoolNode {
  return typeof obj === 'object' && obj !== null && typeof obj.op === 'string';
}
