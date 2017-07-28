import Node from './Node';

describe('Node', () => {
  describe('constructor', () => {
    it('should set data to 1, all directions to itself', () => {
      const node = new Node(1);

      expect(node.data).toBe(1);
      expect(node.column).toBe(node);
      expect(node.down).toBe(node);
      expect(node.left).toBe(node);
      expect(node.right).toBe(node);
      expect(node.up).toBe(node);
    });
  });
});
