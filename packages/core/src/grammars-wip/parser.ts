import { assert } from './assert';
import { Grammar, NT, Rule, Sym, T } from './types';

export enum ParseEnums {
  DISTINCT = 'DISTINCT',
  SIMILAR = 'SIMILAR',
  IDENTICAL = 'IDENTICAL',
  PRODUCEONE = 'PRODUCEONE',
  PRODUCETWO = 'PRODUCETWO',
  PRODUCEALL = 'PRODUCEALL',
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export class State {
  constructor(
    public rule: Rule,
    public index: number,
    public predecessor: number,
    public backPointers: State[] | null[] = [],
  ) {
    assert(
      this.index === this.backPointers.length,
      'Index must equal the length of backPointers',
    );
  }

  done(): boolean {
    return this.index === this.rule.production.length;
  }

  compare(other: State): ParseEnums {
    if (
      this.rule === other.rule &&
      this.index === other.index &&
      this.predecessor === other.predecessor
    ) {
      return arraysEqual(this.backPointers, other.backPointers)
        ? ParseEnums.IDENTICAL
        : ParseEnums.SIMILAR;
    } else {
      return ParseEnums.DISTINCT;
    }
  }

  next(): Sym | undefined {
    return this.rule.production[this.index];
  }

  toString(): string {
    return `(${this.rule.name} -> ${this.rule.production.slice(0, this.index).join('')}*${this.rule.production.slice(this.index).join('')}, ${this.predecessor.toString()})`;
  }
}

export class Parser {
  private grammar: Grammar;
  private produceCount: ParseEnums;

  constructor(grammar: Grammar) {
    this.grammar = grammar;
    this.produceCount = ParseEnums.PRODUCETWO; // Default produce count
  }

  parse(
    str: string,
    produceCount: ParseEnums = ParseEnums.PRODUCETWO,
  ): State[] {
    if (typeof str !== 'string')
      throw new Error(`Can't parse non-string object ${typeof str}`);
    this.produceCount = produceCount; // Allow dynamic adjustment of produce count

    const chart: State[][] = Array.from({ length: str.length + 1 }, () => []);

    const seen = (state: State, strPos: number): boolean => {
      let count = 0;
      for (const existingState of chart[strPos]) {
        const equality = state.compare(existingState);
        if (
          equality === ParseEnums.IDENTICAL ||
          (equality === ParseEnums.SIMILAR &&
            this.produceCount === ParseEnums.PRODUCEONE)
        ) {
          return true;
        }
        if (
          equality === ParseEnums.SIMILAR &&
          this.produceCount === ParseEnums.PRODUCETWO &&
          ++count > 1
        ) {
          return true;
        }
      }
      return false;
    };

    const addState = (newState: State, strPos: number): void => {
      if (!seen(newState, strPos)) {
        chart[strPos].push(newState);
      }
    };

    const scanner = (state: State, strPos: number): void => {
      if (state.next()?.equals(T(str[strPos]))) {
        const newBackPointers = state.backPointers.slice();
        newBackPointers.push(null); // Terminals do not need back pointers
        const advanced = new State(
          state.rule,
          state.index + 1,
          state.predecessor,
          newBackPointers,
        );
        addState(advanced, strPos + 1);
      }
    };

    const predictor = (state: State, strPos: number): void => {
      const sym = state.next();
      if (sym && sym.type === 'NT') {
        this.grammar.symbolMap[sym.data].rules.forEach((rule) => {
          const advanced = new State(rule, 0, strPos, []);
          addState(advanced, strPos);
        });
      }
    };

    const completer = (state: State, strPos: number): void => {
      chart[state.predecessor].forEach((prevState) => {
        if (
          !prevState.done() &&
          prevState.next()?.equals(NT(state.rule.name))
        ) {
          const newBackPointers = prevState.backPointers.slice();
          newBackPointers.push(state); // Just completed `state`
          const advanced = new State(
            prevState.rule,
            prevState.index + 1,
            prevState.predecessor,
            newBackPointers,
          );
          addState(advanced, strPos);
        }
      });
    };

    // Initial setup with start symbol
    const startRule = new Rule('GAMMA', [NT(this.grammar.start)]);
    addState(new State(startRule, 0, 0, []), 0);

    // Main parsing loop
    for (let strPos = 0; strPos <= str.length; strPos++) {
      for (const state of chart[strPos]) {
        if (!state.done()) {
          scanner(state, strPos);
          predictor(state, strPos);
        } else {
          completer(state, strPos);
        }
      }
    }

    // Extracting parses
    const parses: State[] = [];
    chart[str.length].forEach((state) => {
      if (state.rule.name === 'GAMMA' && state.done()) {
        parses.push(state);
      }
    });

    this.produceCount = ParseEnums.PRODUCETWO; // Reset to default
    return parses;
  }
}
