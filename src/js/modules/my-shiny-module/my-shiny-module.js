import $ from 'jquery';

export function sum(a, b) {
  if ($) {
    return a + b;
  }
  return a + b;
}
console.log('my shiny module loaded');

export const FOO = 'bar';
