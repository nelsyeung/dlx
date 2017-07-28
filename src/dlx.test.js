import dlx from './dlx';

describe('dlx', () => {
  it('should solve a matrix', () => {
    const matrix = [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ];
    expect(dlx(matrix)).toEqual([4, 1, 5]);
  });
});
