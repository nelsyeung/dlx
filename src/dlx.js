import List from './List';

/**
 * Returns a root node that is linked to all other non-zero nodes, where data
 * is the row number.
 */
function createLinks(matrix) {
  const rows = [new List()];
  const columns = [];
  const root = rows[0].addToRow(0);

  // Add header nodes
  for (let c = 0; c < matrix[0].length; c += 1) {
    const node = rows[0].addToRow({ size: -1 });

    columns.push(new List());
    columns[c].addToColumn(node);
  }

  // Create links for only the non-zero in the matrix
  for (let r = 0; r < matrix.length; r += 1) {
    rows.push(new List());

    for (let c = 0; c < matrix[0].length; c += 1) {
      if (matrix[r][c] !== 0) {
        const node = rows[r + 1].addToRow(r + 1);
        columns[c].addToColumn(node);
      }
    }
  }

  return root;
}

/**
 * Return the column node with the smallest number of non-zero nodes.
 */
function chooseColumn(h) {
  let c = h.right;
  let s = c.data.size;

  // For each j <- R[h], R[R[h]], ..., while j =/= h
  for (let j = h.right; j !== h; j = j.right) {
    // If S[j] < s, set c <- j and s <- S[j]
    if (j.data.size < s) {
      c = j;
      s = j.data.size;
    }
  }

  return c;
}

/**
 * Removes c from the header list and removes all rows in c's own list from
 * other column lists they are in.
 */
function cover(c) {
  // Set L[R[c]] <- L[c] and R[L[c]] <- R[c]
  c.right.left = c.left;
  c.left.right = c.right;

  // For each i <- D[c], D[D[c]], ..., while i =/= c
  for (let i = c.down; i !== c; i = i.down) {
    // For each j <- R[i], R[R[i]], ..., while j =/= i
    for (let j = i.right; j !== i; j = j.right) {
      // Set U[D[j]] <- U[j], D[U[j]] <- D[j]
      j.down.up = j.up;
      j.up.down = j.down;
      // Set S[C[j]] <- S[C[j]] - 1
      j.column.data.size -= 1;
    }
  }
}

/**
 * Unremove the rows from bottom to top. It takes place in precisely the
 * reverse order of the covering operation.
 */
function uncover(c) {
  // For each i = U[c], U[U[c]], ..., while i =/= c
  for (let i = c.up; i !== c; i = i.up) {
    // For each j <- L[i], L[L[i]], ..., while j =/= i
    for (let j = i.left; j !== i; j = j.right) {
      // Set S[C[j]] <- S[C[j]] + 1
      j.column.data.size += 1;
      // Set U[D[j]] <- j, D[U[j]] <- j
      j.up.down = j.down;
      j.down.up = j.up;
    }

    // Set L[R[c]] <- c and R[L[c]] <- c
    c.right.left = c;
    c.left.right = c;
  }
}

/**
 * Main dancing links solver.
 */
export default function dlx(matrix) {
  const h = createLinks(matrix);
  const O = [];
  let solution = [];

  function search(k) {
    // If R[h] = h, store the current solution and return
    if (h.right === h) {
      solution = solution.concat(O);
      return;
    }

    // Otherwise choose a column object c
    const c = chooseColumn(h);

    // Cover column c
    cover(c);

    // For each r <- D[c], D[D[c]], ..., while r =/= c
    for (let r = c.down; r !== c; r = r.down) {
      // Set O_k <- r
      O.push(r.data);

      // For each j <- R[r], R[R[r]], ..., while j =/= r
      for (let j = r.right; j !== r; j = j.right) {
        // Cover column j
        cover(j.column);
      }

      search(k + 1);

      // For each j <- L[r], L[L[r]], ..., while j =/= r
      for (let j = r.left; j !== r; j = j.left) {
        // Uncover column j
        uncover(j.column);
      }
    }

    // Uncover column c and return
    uncover(c);
  }

  search(0);

  return solution;
}
