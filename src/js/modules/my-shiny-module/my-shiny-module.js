import $ from 'jquery';

export function sum(a, b) {
  if ($) {
    return a + b;
  }
  return a + b;
}

console.log('my shiny module is running');
export const FOO = 'bar';
