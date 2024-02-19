/**
 * Represents a symbol in the grammar.
 */
class Sym {
  type: string;
  data: any;

  constructor(type: string, data: unknown) {
    this.type = type;
    this.data = data;
  }

  /**
   * Checks if this symbol is equal to another.
   * @param other The symbol to compare with.
   * @returns `true` if both symbols are equal, otherwise `false`.
   */
  equals(other: Sym): boolean {
    return other.type === this.type && other.data === this.data;
  }

  /**
   * Returns a string representation of the symbol.
   * @returns The data of the symbol as a string.
   */
  toString(): string {
    return this.data.toString();
  }
}

/**
 * Creates a non-terminal symbol.
 * @param data The data associated with the symbol.
 * @returns A non-terminal symbol.
 */
function NT(data: any): Sym {
  return new Sym('NT', data);
}

/**
 * Creates a terminal symbol.
 * @param data The data associated with the symbol.
 * @returns A terminal symbol.
 */
function T(data: any): Sym {
  return new Sym('T', data);
}

/**
 * Represents a rule in the grammar.
 */
class Rule {
  name: string;
  production: Sym[];
  nullable?: boolean; // Nullable flag for symbols
  _index?: number; // Temporary property for algorithm use

  constructor(name: string, production: Sym[]) {
    this.name = name;
    this.production = production;
  }

  /**
   * Checks if this rule is equal to another rule.
   * @param other The rule to compare with.
   * @returns `true` if both rules are equal, otherwise `false`.
   */
  equals(other: Rule): boolean {
    if (other.name !== this.name) return false;
    if (other.production.length !== this.production.length) return false;

    return other.production.every((val, index) =>
      val.equals(this.production[index]),
    );
  }

  /**
   * Returns a string representation of the rule.
   * @returns The rule as a string.
   */
  toString(): string {
    return `${this.name} -> ${this.production.join('')}`;
  }

  /**
   * Returns a detailed string representation of the rule.
   * @returns The rule as a detailed string.
   */
  repr(): string {
    let out = `Rule('${reprEscape(this.name)}', [`;
    this.production.forEach((sym, i) => {
      if (i > 0) out += ', ';
      out += `${sym.type}('${reprEscape(sym.data)}')`;
    });
    out += '])';
    return out;
  }
}

/**
 * Represents the grammar of a language.
 */
class Grammar {
  rules: Rule[];
  start: string;
  nullables?: string[];
  symbolMap: {
    [key: string]: {
      rules: Rule[];
      nullable?: boolean;
      selfDeriving?: boolean;
    };
  };
  symbolsList: string[];
  selfDerivings?: string[];
  private _reverseMap?: { [key: string]: Rule[] };

  constructor(rules: Rule[], start?: string) {
    this.rules = rules;
    this.start = start || rules[0].name;
    this.symbolMap = {};
    this.symbolsList = start ? [start] : [];

    if (start) this.symbolMap[start] = { rules: [] };

    rules.forEach((rule) => {
      const sym = rule.name;
      if (!(sym in this.symbolMap)) {
        this.symbolMap[sym] = { rules: [] };
        this.symbolsList.push(sym);
      }

      rule.production.forEach((rhsSym) => {
        if (rhsSym.type == 'NT' && !(rhsSym.data in this.symbolMap)) {
          this.symbolMap[rhsSym.data] = { rules: [] };
          this.symbolsList.push(rhsSym.data);
        }
      });
      this.symbolMap[sym].rules.push(rule);
    });
  }

  /**
   * Annotates each symbol in the grammar with a `nullable` property indicating whether it can produce an empty string.
   * Additionally, updates the grammar with a `nullables` property listing all nullable symbols.
   * @returns A list of nullable symbols.
   */
  annotateNullables(): string[] | undefined {
    if (Object.prototype.hasOwnProperty.call(this, 'nullables'))
      return this.nullables; // already done, don't redo

    this.nullables = [];
    const queue: string[] = [];
    const cs: number[] = []; // count of non-terminal symbols in the RHS of a rule not yet marked nullable
    const rMap = this.getReverseMap();

    // Initialize all symbols as non-nullable
    this.symbolsList.forEach((symbol) => {
      this.symbolMap[symbol].nullable = false;
    });

    // Identify rules that are initially nullable
    this.rules.forEach((rule) => {
      let c = 0;
      let maybeNullable = true;
      rule.production.forEach((sym) => {
        if (sym.type === 'NT') {
          ++c;
        } else {
          maybeNullable = false;
        }
      });
      cs.push(maybeNullable ? c : 0);

      if (rule.production.length === 0 && !this.symbolMap[rule.name].nullable) {
        this.symbolMap[rule.name].nullable = true;
        queue.push(rule.name);
        this.nullables!.push(rule.name);
      }
    });

    // Assign a temporary _index property to each rule for direct access
    this.rules.forEach((rule, i) => {
      rule._index = i;
    });

    // Propagate nullability through the grammar
    while (queue.length > 0) {
      const cur = queue.pop()!;
      rMap[cur].forEach((affected) => {
        if (
          --cs[affected._index!] === 0 &&
          !this.symbolMap[affected.name].nullable
        ) {
          this.symbolMap[affected.name].nullable = true;
          queue.push(affected.name);
          this.nullables!.push(affected.name);
        }
      });
    }

    // Clean up temporary properties
    this.rules.forEach((rule) => {
      delete rule._index;
    });

    return this.nullables;
  }

  /**
   * Annotates each symbol in the grammar with a "selfDeriving" property indicating whether it can derive itself.
   * Additionally, updates the grammar with a "selfDerivings" property listing all self-deriving symbols.
   * @returns A list of self-deriving symbols.
   */
  annotateSelfDeriving(): string[] | undefined {
    if (Object.prototype.hasOwnProperty.call(this, 'selfDerivings'))
      return this.selfDerivings; // already done, don't redo

    this.selfDerivings = [];
    this.annotateNullables(); // Ensure nullables are annotated before proceeding

    const derives: { [key: string]: { [key: string]: boolean } } = {}; // Map of symbol derivations
    this.symbolsList.forEach((symbol) => {
      derives[symbol] = {};
    });

    // Initialize direct derivations
    this.rules.forEach((rule) => {
      const name = rule.name;
      const production = rule.production;

      // Skip productions that cannot directly derive another symbol
      if (
        production.length === 0 ||
        production.some((sym) => sym.type === 'T')
      ) {
        return;
      }

      // Handle single non-terminal productions
      if (production.length === 1) {
        derives[name][production[0].data] = true;
        return;
      }

      // Handle productions with multiple non-terminals
      const nonNullable = production.filter(
        (sym) => !this.symbolMap[sym.data].nullable,
      );
      if (nonNullable.length === 1) {
        derives[name][nonNullable[0].data] = true;
      } else if (nonNullable.length === 0) {
        production.forEach((sym) => {
          derives[name][sym.data] = true;
        });
      }
    });

    // Apply Floyd-Warshall algorithm to find all derivations
    this.symbolsList.forEach((i) => {
      this.symbolsList.forEach((j) => {
        this.symbolsList.forEach((k) => {
          if (derives[i][k] && derives[k][j]) {
            derives[i][j] = true; // If i derives k and k derives j, then i derives j
          }
        });
      });
    });

    // Annotate self-deriving symbols
    this.symbolsList.forEach((symbol) => {
      if (derives[symbol][symbol]) {
        this.symbolMap[symbol].selfDeriving = true;
        this.selfDerivings!.push(symbol);
      } else {
        this.symbolMap[symbol].selfDeriving = false;
      }
    });

    return this.selfDerivings;
  }

  /**
   * Returns a detailed string representation of the grammar.
   * @returns The grammar as a detailed string.
   */
  repr(): string {
    let out = 'Grammar([\n  ';
    this.rules.forEach((rule, i) => {
      if (i > 0) out += ',\n  ';
      out += rule.repr();
    });
    out += `\n], '${reprEscape(this.start)}')`;
    return out;
  }

  /**
   * Gets a map from symbols to a list of the rules they appear in the RHS of.
   * If a symbol appears in a RHS more than once, that rule will appear more than once in the list.
   * Caches the result in `_reverseMap` for future use.
   * @returns The reverse map of symbols to rules.
   */
  getReverseMap(): { [key: string]: Rule[] } {
    if (!Object.prototype.hasOwnProperty.call(this, '_reverseMap')) {
      this._reverseMap = {};
      this.symbolsList.forEach((symbol) => {
        this._reverseMap![symbol] = [];
      });
      this.rules.forEach((rule) => {
        rule.production.forEach((sym) => {
          if (sym.type === 'NT') {
            this._reverseMap![sym.data].push(rule);
          }
        });
      });
    }

    return this._reverseMap!;
  }
}

/**
 * Escapes special characters in a string for representation.
 * @param str The string to escape.
 * @returns The escaped string.
 */
function reprEscape(str: string): string {
  return str
    .replace(/['\\]/g, (c) => '\\' + c)
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

export { Sym, NT, T, Rule, Grammar };
