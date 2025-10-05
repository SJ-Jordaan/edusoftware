export interface BoolNode {
  op: string;
  left?: BoolNode | string;
  right?: BoolNode | string;
}

export type GateType = 'and' | 'or' | 'not' | 'xor' | 'input' | 'output';
export interface Gate {
  id: string;
  position: { x: number; y: number };
  gateType: GateType;
  inputs?: string[];
  output?: string; // ID of gate to which piece leads
  label?: string;
}

export const parseBooleanExpr = (expr: (string | BoolNode)[]) => {
  expr = expr
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim(); // Remove surrounding whitespace
      }
      return item; // Keep BoolNode as is
    })
    .filter((item) => {
      if (typeof item === 'string') {
        return item !== ''; // Remove empty strings (pure whitespace)
      }
      return true; // Keep BoolNode
    });

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

export const infixToPostfix = (expr: string[]): string => {
  const node = parseBooleanExpr(expr);

  if (typeof node === 'string') return node;
  return nodeToPostFix(node);
};

function nodeToPostFix(node: BoolNode): string {
  const binOps = ['&', '.', '·', '^', '⊕', '|', '+'];
  const notOps = ['!', '¬'];

  if (binOps.includes(node.op)) {
    if (!node.left) throw 'Missing left operator';
    if (!node.right) throw 'Missing right operator';
    const leftOp =
      typeof node.left === 'string' ? node.left : nodeToPostFix(node.left);
    const rightOp =
      typeof node.right === 'string' ? node.right : nodeToPostFix(node.right);
    return `${leftOp}${rightOp}${node.op}`;
  }
  if (notOps.includes(node.op)) {
    if (!node.right) throw 'Missing right operator';

    const rightOp =
      typeof node.right === 'string' ? node.right : nodeToPostFix(node.right);
    return `${rightOp}${node.op}`;
  }

  throw 'Failed to convert boolean expression';
}

const expressionMap: Record<GateType, string> = {
  and: '&',
  or: '|',
  xor: '^',
  not: '!',
  input: 'token',
  output: '',
};

export const generateBooleanExpression = (pieces: Gate[]) => {
  const outputGate = pieces.find((gate) => gate.gateType === 'output');

  if (!outputGate) return '';

  return convertToExpression(outputGate, 'postfix', pieces).join('');
};

function convertToExpression(
  currentGate: Gate,
  notation: 'postfix' | 'infix',
  pieces: Gate[],
): string[] {
  if ((currentGate.inputs?.length ?? 1) > 2) {
    return [];
  }

  if (
    currentGate.gateType !== 'input' &&
    (!currentGate.inputs || currentGate.inputs.length === 0)
  ) {
    return [];
  }

  if (currentGate.inputs?.length === 2) {
    const leftGate = pieces.find(
      (gate) => gate.id === currentGate.inputs?.at(0),
    );
    const rightGate = pieces.find(
      (gate) => gate.id === currentGate.inputs?.at(1),
    );

    if (!leftGate || !rightGate) return [];

    if (notation === 'infix')
      return [
        '(',
        ...convertToExpression(leftGate, notation, pieces),
        expressionMap[currentGate.gateType],
        ...convertToExpression(rightGate, notation, pieces),
        ')',
      ];
    else
      return [
        ...convertToExpression(leftGate, notation, pieces),
        ...convertToExpression(rightGate, notation, pieces),
        expressionMap[currentGate.gateType],
      ];
  }

  if (currentGate.gateType === 'output' || currentGate.gateType === 'not') {
    const nextGate = pieces.find(
      (gate) => gate.id === currentGate.inputs?.at(0),
    );

    if (!nextGate) return [];

    if (notation === 'infix')
      return [
        '(',
        expressionMap[currentGate.gateType],
        ...convertToExpression(nextGate, notation, pieces),
        ')',
      ];
    else
      return [
        ...convertToExpression(nextGate, notation, pieces),
        expressionMap[currentGate.gateType],
      ];
  }

  if (currentGate.gateType === 'input') {
    return [currentGate.label ?? '?'];
  }

  return [];
}

export const generateTruthTable = (expr: string) => {
  let inputGates: string[] = [];
  for (const char of expr.split('')) {
    if (/^[a-zA-Z]$/.test(char)) inputGates.push(char);
  }

  inputGates = Array.from(new Set(inputGates)).sort((a, b) =>
    a.localeCompare(b),
  );

  const numInputs = inputGates.length;
  const numTruth = 1 << numInputs;

  let truthTable = '';

  for (let i = 0; i < numTruth; i++) {
    const inputMap: Record<string, boolean> = {};

    for (let j = 0; j < numInputs; j++) {
      const label = inputGates[j]!;
      inputMap[label] = !!(i & (1 << (numInputs - j - 1)));
    }
    const answer = testInput(expr, inputMap);
    truthTable += answer ? '1' : '0';
  }

  return truthTable;
};

const testInput = (
  booleanExpression: string,
  boolMap: Record<string, boolean>,
) => {
  const operationStack: boolean[] = [];
  const isLetter = /^[a-zA-Z]$/.test(booleanExpression[0]);

  if (!isLetter) return;

  for (let i = 0; i < booleanExpression.length; i++) {
    const char = booleanExpression[i];
    if (/^[a-zA-Z]$/.test(char)) {
      operationStack.push(boolMap[char]);
    } else {
      if (char === expressionMap.and) {
        const right = operationStack.pop();
        const left = operationStack.pop();
        if (right === undefined || left === undefined) return;
        operationStack.push(left && right);
      } else if (char === expressionMap.or) {
        const right = operationStack.pop();
        const left = operationStack.pop();
        if (right === undefined || left === undefined) return;
        operationStack.push(left || right);
      } else if (char === expressionMap.xor) {
        const right = operationStack.pop();
        const left = operationStack.pop();
        if (right === undefined || left === undefined) return;
        operationStack.push(left !== right);
      } else if (char === expressionMap.not) {
        const val = operationStack.pop();
        if (val === undefined) return;
        operationStack.push(!val);
      }
    }
  }

  if (operationStack.length === 1) return operationStack[0];
};
