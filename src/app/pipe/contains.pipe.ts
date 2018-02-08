import {Pipe, PipeTransform} from '@angular/core';

const isArray = (value: any): boolean => Array.isArray(value);
const isFunction = (value: any): boolean => typeof value === 'function';
const isObject = (value: any): boolean => typeof value === 'object';
const isString = (value: any): boolean => typeof value === 'string';
const isUndefined = (value: any): boolean => typeof value === 'undefined';

function toArray(object: any): Array<any> {
  return isArray(object) ? object : Object.keys(object).map((key) => object[key]);
}

function createGetterFn(pathKeys: string[]): Function {
  let fn: Function = null;
  for (let i = pathKeys.length - 1; i >= 0; i--) {
    if (fn === null) {
      fn = finalFn(pathKeys[i]);
    } else {
      fn = stepFn(pathKeys[i], fn);
    }
  }
  return fn;

  function finalFn(key: string) {
    return function (scope: { [key: string]: any }, local: { [key: string]: any }) {
      if (local && local.hasOwnProperty(key)) return local[key];
      if (scope) return scope[key];
    };
  }

  function stepFn(key: string, next: Function) {
    return function (scope: { [key: string]: any }, local: { [key: string]: any }) {
      return next(scope && scope[key], local && local[key]);
    };
  }
}

function setterFn(scope: { [key: string]: any }, path: string[], value: any): any {
  let s = scope;
  let i = 0;
  for (; i < path.length - 1; i++) {
    if (isUndefined(s[path[i]]) && i < path.length - 1) {
      s[path[i]] = {};
    }
    s = s[path[i]];
  }
  s[path[i]] = value;
  return scope;
}

function Parse() {
  const cache: { [key: string]: Function } = {};

  return function (exp: any): Function {
    let fn: any = function () {};

    if (isString(exp)) {
      const cacheKey = exp.trim();
      if (cacheKey in cache) {
        return cache[cacheKey];
      }
      const pathKeys = exp.split('.');
      fn = cache[cacheKey] = createGetterFn(pathKeys);
      fn.assign = function (scope: { [key: string]: any }, value: any) {
        return setterFn(scope, pathKeys, value);
      };
    } else if (isFunction(exp)) {
      fn = function (scope: { [key: string]: any }, local: { [key: string]: any }) {
        return exp(scope, local);
      };
    }

    return fn;
  };
}

@Pipe({
  name: 'contains'
})
export class ContainsPipe implements PipeTransform {
  private $parse: Function;

  constructor() {
    this.$parse = Parse();
  }

  transform(collection: any, predicate: any): Array<any> {
    if (!isArray(collection)) {
      collection = toArray(collection);
    }

    return collection.some(
        (e: any) => isFunction(predicate) || (isString(predicate) && isObject(e)) ?
            this.$parse(predicate)(e) :
            e === predicate);
  }
}
