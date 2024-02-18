import { Rule } from './types';

export type BackPointer = {
  rule: Rule;
  backPointers: (BackPointer | null)[];
};

/**
 * Represents a node in the abstract syntax tree (AST).
 */
export interface AstNode {
  type: string | Rule;
  children?: AstNode[];
  value?: any;
}

/**
 * Prints an abstract syntax tree (AST) from a parse result.
 * @param parse The parse result to be converted into an AST.
 * @param collapseUnitProductions Indicates whether unit productions should be collapsed. Defaults to false.
 * @param discardImplicitTerminals Indicates whether implicit terminals should be discarded if a production contains both terminals and non-terminals.
 * @param ruleRenamingFunction Optional function to rename rules for the AST node types.
 * @returns The root node of the generated AST.
 */
export function astPrinter(
  parse: BackPointer,
  collapseUnitProductions: boolean = false,
  discardImplicitTerminals: boolean = false,
  ruleRenamingFunction?: (rule: Rule) => string,
): AstNode {
  const rename = typeof ruleRenamingFunction === 'function';

  function backPointerToSubtree(bp: BackPointer): AstNode {
    if (collapseUnitProductions && bp.backPointers.length === 1) {
      const child = bp.backPointers[0];
      if (child === null) {
        return {
          type: 'Terminal',
          value: bp.rule.production[0].data,
        };
      } else {
        return backPointerToSubtree(child);
      }
    }
    const tree: AstNode = {
      type: rename ? ruleRenamingFunction!(bp.rule) : bp.rule,
      children: [],
    };
    const keepTerminals = !(
      discardImplicitTerminals && bp.backPointers.some((c) => c !== null)
    );
    for (let i = 0; i < bp.backPointers.length; ++i) {
      const current = bp.backPointers[i];
      if (current === null) {
        if (keepTerminals) {
          tree.children.push({
            type: 'Terminal',
            value: bp.rule.production[i].data,
          });
        }
      } else {
        tree.children.push(backPointerToSubtree(current));
      }
    }
    return tree;
  }

  return backPointerToSubtree(parse);
}
