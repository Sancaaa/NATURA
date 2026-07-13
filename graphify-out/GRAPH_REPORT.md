# Graph Report - .  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 306 nodes · 597 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ef57386`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- classroom.ts
- cn
- compilerOptions
- devDependencies
- createClient
- page.tsx
- Button.tsx
- dependencies
- classroom.ts
- quizzes.ts
- page.tsx
- manifest.json
- middleware.ts
- layout.tsx
- route.ts
- next.config.mjs
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 31 edges
2. `cn()` - 18 edges
3. `Card()` - 16 edges
4. `compilerOptions` - 16 edges
5. `Badge()` - 14 edges
6. `Button()` - 12 edges
7. `PageHeader()` - 10 edges
8. `requireRole()` - 9 edges
9. `getCurrentProfile` - 8 edges
10. `buttonClass()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `getCurrentProfile`  [EXTRACTED]
  app/(admin)/admin/page.tsx → lib/auth.ts
- `AdminLayout()` --calls--> `requireRole()`  [EXTRACTED]
  app/(admin)/layout.tsx → lib/auth.ts
- `StudentLayout()` --calls--> `requireRole()`  [EXTRACTED]
  app/(student)/layout.tsx → lib/auth.ts
- `Detail()` --calls--> `buttonClass()`  [EXTRACTED]
  app/(student)/pindai/[id]/page.tsx → components/ui/Button.tsx
- `Profil()` --calls--> `getCurrentProfile`  [EXTRACTED]
  app/(student)/profil/page.tsx → lib/auth.ts

## Import Cycles
- None detected.

## Communities (20 total, 5 thin omitted)

### Community 0 - "classroom.ts"
Cohesion: 0.09
Nodes (29): Beranda(), KuisList(), Dashboard(), KelasDetail(), KelasList(), SiswaDetail(), BarChart(), Badge() (+21 more)

### Community 1 - "cn"
Cohesion: 0.11
Nodes (20): AdminLayout(), Home(), StudentLayout(), Profil(), Msg, suggestions, Tutor(), TeacherLayout() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, postcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/three (+17 more)

### Community 4 - "createClient"
Cohesion: 0.18
Nodes (14): AdminPage(), roleLabel, GET(), DeleteUserButton(), RoleSelect(), deleteUser(), requireAdmin(), updateUserRole() (+6 more)

### Community 5 - "page.tsx"
Cohesion: 0.14
Nodes (13): Read(), Detail(), ModelViewer, PageHeader(), getLibraryItem(), library, LibraryItem, getPlant() (+5 more)

### Community 6 - "Button.tsx"
Cohesion: 0.18
Nodes (16): BankSoal(), DeleteQuizButton(), QuizDraftEditor(), Button(), buttonClass(), Size, Variant, deleteQuiz() (+8 more)

### Community 7 - "dependencies"
Cohesion: 0.10
Nodes (21): clsx, lucide-react, next, dependencies, clsx, lucide-react, next, react (+13 more)

### Community 8 - "classroom.ts"
Cohesion: 0.18
Nodes (12): JoinClassForm(), AssignmentForm(), CreateClassForm(), DeleteAssignmentButton(), ActionState, createAssignment(), createClass(), deleteAssignment() (+4 more)

### Community 9 - "quizzes.ts"
Cohesion: 0.16
Nodes (13): Page(), Page(), QuizRunner(), EditQuizForm(), saveQuizResult(), Question, Quiz, quizzes (+5 more)

### Community 11 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 12 - "middleware.ts"
Cohesion: 0.60
Nodes (3): updateSession(), config, middleware()

## Knowledge Gaps
- **87 isolated node(s):** `roleLabel`, `ModelViewer`, `Msg`, `suggestions`, `metadata` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `classroom.ts`, `cn`, `Button.tsx`, `classroom.ts`, `quizzes.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `classroom.ts`, `quizzes.ts`, `Button.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Card()` connect `classroom.ts` to `cn`, `createClient`, `page.tsx`, `Button.tsx`, `classroom.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `roleLabel`, `ModelViewer`, `Msg` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `classroom.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08788159111933395 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10984848484848485 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._