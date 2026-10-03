// 미로를 만들고, 만든 김에 푼다.
//
// 생성은 randomized DFS(재귀 백트래킹) — 굽이가 길고 갈림길이 적은,
// 사람이 손으로 그린 것 같은 미로가 나온다.
// 풀이는 BFS — 너비 우선이라 찾은 경로가 곧 최단 경로다.
// 시드 하나로 전체가 결정되므로 같은 시드는 언제나 같은 미로다.

const WALL = '█';
const OPEN = ' ';
const PATH = '·';

/** mulberry32 — 짧고 충분히 고른 시드 PRNG. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 셀 격자를 벽 격자로 펼쳐서 판다.
 * 셀 (cx,cy) 는 벽 격자의 (2cx+1, 2cy+1) 에 대응하고,
 * 두 셀 사이의 벽은 그 중간 칸이다.
 */
function carve(cols, rows, rand) {
  const w = cols * 2 + 1;
  const h = rows * 2 + 1;
  const grid = Array.from({ length: h }, () => new Array(w).fill(WALL));

  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const stack = [[0, 0]];
  seen[0][0] = true;
  grid[1][1] = OPEN;

  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const options = [];
    if (cy > 0 && !seen[cy - 1][cx]) options.push([cx, cy - 1, 0, -1]);
    if (cx < cols - 1 && !seen[cy][cx + 1]) options.push([cx + 1, cy, 1, 0]);
    if (cy < rows - 1 && !seen[cy + 1][cx]) options.push([cx, cy + 1, 0, 1]);
    if (cx > 0 && !seen[cy][cx - 1]) options.push([cx - 1, cy, -1, 0]);

    if (!options.length) {
      stack.pop(); // 막다른 길 — 되돌아간다
      continue;
    }
    const [nx, ny, dx, dy] = options[Math.floor(rand() * options.length)];
    grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = OPEN; // 사이 벽을 튼다
    grid[ny * 2 + 1][nx * 2 + 1] = OPEN;
    seen[ny][nx] = true;
    stack.push([nx, ny]);
  }
  return grid;
}

/** BFS. 찾은 경로가 곧 최단 경로다. */
function solve(grid, start, goal) {
  const h = grid.length;
  const w = grid[0].length;
  const key = (x, y) => y * w + x;
  const prev = new Map();
  const queue = [start];
  const seen = new Set([key(...start)]);

  for (let head = 0; head < queue.length; head++) {
    const [x, y] = queue[head];
    if (x === goal[0] && y === goal[1]) {
      const path = [];
      let cur = key(x, y);
      while (cur !== undefined) {
        path.push([cur % w, Math.floor(cur / w)]);
        cur = prev.get(cur);
      }
      return path.reverse();
    }
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (grid[ny][nx] === WALL) continue;
      const k = key(nx, ny);
      if (seen.has(k)) continue;
      seen.add(k);
      prev.set(k, key(x, y));
      queue.push([nx, ny]);
    }
  }
  return null;
}

function main() {
  const seed = Number(process.argv[2] ?? 14878);
  const cols = Number(process.argv[3] ?? 36);
  const rows = Number(process.argv[4] ?? 21);
  const show = (process.argv[5] ?? 'solved').toLowerCase();

  if (!Number.isInteger(seed)) {
    console.error('seed must be an integer.');
    process.exit(1);
  }
  if (!Number.isInteger(cols) || cols < 3 || cols > 120 || !Number.isInteger(rows) || rows < 3 || rows > 120) {
    console.error('cols and rows must be integers from 3 to 120.');
    process.exit(1);
  }
  if (show !== 'solved' && show !== 'blank') {
    console.error("last argument must be 'solved' or 'blank'.");
    process.exit(1);
  }

  const grid = carve(cols, rows, rng(seed));
  const start = [1, 1];
  const goal = [cols * 2 - 1, rows * 2 - 1];
  const path = solve(grid, start, goal);

  if (show === 'solved' && path) {
    for (const [x, y] of path) grid[y][x] = PATH;
    grid[start[1]][start[0]] = 'S';
    grid[goal[1]][goal[0]] = 'E';
  }

  console.log('maze ' + cols + 'x' + rows + '  seed ' + seed + '  ' + (show === 'solved' ? 'solved' : 'unsolved'));
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('shortest path: ' + (path ? path.length + ' cells' : 'none'));
}

main();
