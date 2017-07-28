export default class Node {
  constructor(data) {
    this.data = data;
    this.column = this;
    this.down = this;
    this.left = this;
    this.right = this;
    this.up = this;
  }
}
