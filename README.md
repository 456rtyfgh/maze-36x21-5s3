# 36×21 미로 — 만들고, 푼다

> Seeded maze generation (randomized DFS) with a BFS shortest-path solve, in ASCII. Zero dependencies.

**2026-10-04** · daily-lab day project

## 뭐 하는 건가

생성은 randomized DFS 라 굽이가 길고 갈림길이 적은, 손으로 그린 것 같은 미로가 나온다. 풀이는 BFS 라서 찾은 경로가 곧 최단 경로다 — 증명이 알고리즘 안에 들어 있다. 시드 하나로 전체가 결정되므로 같은 시드는 언제나 같은 미로다.

## 어떻게 만들어졌나

모델을 쓸 수 없을 때 도는 오프라인 생성기가 만들었다. 파라미터는 날짜에서 결정론적으로 뽑힌다 — 36×21 · 시드 14878.

## 실행

```bash
node index.js 14878 36 21
```

## 파일

- `index.js`

---

매일 하나씩 만드는 [daily-lab](https://github.com/456rtyfgh/daily-lab)에서 자동 생성됐다.
