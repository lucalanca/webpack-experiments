import $ from 'jquery';

export const SELECTOR = '.js-my-shiny-module';

export function loadIfNeeded() {
  if ($(SELECTOR)) {
    console.log('I found selector');
  } else {
    console.log('I didnt find selector');
  }
}
