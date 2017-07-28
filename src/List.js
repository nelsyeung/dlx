import Node from './Node';

export default class List {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(node, prev, next) {
    if (this.head && this.tail) {
      this.tail[next] = node;
    } else {
      this.head = node;
      this.tail = node;
    }

    node[prev] = this.tail;
    this.tail = node;
    this.tail[next] = this.head;
    this.head[prev] = this.tail;

    return node;
  }

  addToRow(data) {
    return this.add(new Node(data), 'left', 'right');
  }

  addToColumn(node) {
    this.add(node, 'down', 'up');
    node.column = this.head;
    node.column.data.size += 1;
  }
}
