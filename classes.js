export class Book {
  constructor(book) {
    this.name = book.name || 'book';
    this.pages = book.pages || [];
    this.pageSize = book.pageSize || 8;
  }

  get length() {
    return this.pages.length;
  }

  get unfilledPages() {
    let count = 0;

    this.pages.forEach(page => {
      if (page.count < this.pageSize) count++;
    });

    return count;
  }

  fill(groups) {
    groups.forEach(async group => {
      await this.addGroup(group);
    })
  }

  addGroup(group) {
    let newGroup = new Group(group);

    if (newGroup.count < this.pageSize) {
      this.addGroupToPage(newGroup);
    } else if (newGroup.count === this.pageSize) {
      this.addPage(newGroup);
    } else {
      let pageSpan = Math.ceil(newGroup.count / this.pageSize);
      let insertIndex = -1;

      if (this.pages.length > 0) {
        let remainder = newGroup.count % this.pageSize;

        if (remainder) {
          const nPWS = this.getNextPageWithPerfectSpace(remainder);

          if (nPWS > -1) {
            this.pages[nPWS].addGroup({ ...newGroup, count: remainder });
            newGroup.count -= remainder;
            pageSpan--;
            insertIndex = nPWS + 1;
          }
        }
      }

      for(let i = 0; i < pageSpan; i++) {
        let tempCount = Math.min(newGroup.count, this.pageSize);
        let tempGroup = new Group({ ...newGroup, count: tempCount });

        newGroup.count = newGroup.count - this.pageSize;

        this.addPage(tempGroup, insertIndex);

        if (insertIndex > -1) insertIndex++;
      }
    }
  }

  addGroupToPage(group) {
    const nPWS = this.getNextPageWithSpace(group.count);

    if (nPWS > -1) this.pages[nPWS].addGroup(group);
    else this.addPage(group);
  }

  addPage(group, index = -1) {
    const newPage = new Page({ groups: [ group ] });
    if (index === -1) {
      this.pages.push(newPage);
    } else {
      this.pages.splice(index, 0, newPage);
    }
  }

  getNextPageWithSpace(spaceReq) {
    return this.pages.findIndex(page =>
      (
        page.count + spaceReq <= this.pageSize &&
        page.count + spaceReq !== this.pageSize - 1
      )
    );
  }

  getNextPageWithPerfectSpace(spaceReq) {
    return this.pages.findIndex(page =>
      (
        page.count + spaceReq === this.pageSize
      )
    );
  }

  toStats() {
    return `${this.name}: ${this.length}pgs [${this.unfilledPages}]`;
  }

  toString() {
    const pageStrs = this.pages.map((page, i) => {
      return `=== PAGE ${i+1} [${page.count}] ===\n${page.toString()}`;
    });

    return pageStrs.join('\n');
  }
}

export class Page {
  constructor(page) {
    this.groups = page.groups || [];
  }

  get count() {
    return this.groups.reduce((count, group) => count + group.count, 0);
  }

  addGroup(group) {
    this.groups.push(new Group(group));
  }

  toString() {
    return this.groups.map(g => g.toString()).join('\n');
  }
}

export class Group {
  constructor(group) {
    this.name = group.name;
    this.count = group.count;
  }

  toString() {
    return `${this.name} [${this.count}]`;
  }
}