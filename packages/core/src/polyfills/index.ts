const globalObj: any = typeof window !== 'undefined' ? window : global;

// Polyfill the necessary types if they are not already defined
if (!globalObj.NT) globalObj.NT = {};
if (!globalObj.T) globalObj.T = {};
if (!globalObj.Rule) globalObj.Rule = {};
if (!globalObj.Grammar) globalObj.Grammar = {};
