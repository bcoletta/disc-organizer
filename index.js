import fs from 'node:fs';
import DATA from './groups.json' with { type: 'json' };
import { Book, Group } from './classes.js';

const PAGE_SIZE = 8;

let GROUPS = DATA.groups.map(g => new Group(g));
let BEST_BOOK = null;

const fillBook = (groups, name) => {
  let book = new Book({ pageSize: PAGE_SIZE, name });
  book.fill(groups);

  // console.log(book.toStats());

  if (
    !BEST_BOOK ||
    (book.length <= BEST_BOOK.length && book.unfilledPages < BEST_BOOK.unfilledPages)
  ) {
    BEST_BOOK = new Book({ ...book });
  }
}

const shuffle = (groups) => {
  let currentIndex = groups.length;

  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [groups[currentIndex], groups[randomIndex]] = [groups[randomIndex], groups[currentIndex]];
  }
}

fillBook(GROUPS, 'unsorted');

fillBook(GROUPS.sort((a,b) => a.count > b.count ? -1 : 1), 'hi-to-lo');

fillBook(GROUPS.sort((a,b) => a.count < b.count ? -1 : 1), 'lo-to-hi');

for (let i = 0; i < 1000; i++) {
  const tempGroups = [ ...GROUPS ];

  shuffle(tempGroups);
  fillBook(tempGroups, `shuffle ${i+1}`);
}

console.log('==== BEST BOOK ====');
console.log(BEST_BOOK.toStats());
console.log('===================');

fs.writeFileSync('./output.txt', BEST_BOOK.toString());