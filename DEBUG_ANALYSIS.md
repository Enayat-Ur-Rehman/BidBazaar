# Isabelle/HOL Proof Debugging Analysis

## Issues Identified

### 1. **Proof Structure Problems (Primary Issue)**

The main errors stem from improper use of `subgoal` blocks in `apply` mode:

```isabelle
apply (intro conjI)
apply (simp add: ...)      ← This line may conflict with subgoal mode
subgoal                     ← This starts a new goal but isn't properly scoped
```

**Problem**: After `apply (intro conjI)`, the proof enters a state where multiple subgoals are generated. Using `subgoal` without proper focusing causes "Illegal application of proof command in 'prove' mode".

### 2. **Incomplete Tactic Justification**

Many `subgoal` blocks have tactics that don't fully close the goal:
```isabelle
subgoal
  using inv pid_out by (auto simp: inv_System_def pdom_def)
```
The `auto` tactic might not suffice; it needs:
- More lemmas
- Explicit case splitting
- Stronger reasoning about the invariant

### 3. **Missing Goal Dependency Handling**

Some goals require information derived from previous goals, but the current structure doesn't properly propagate context.

### 4. **Case Analysis Issues**

The `split: option.splits` directive may create branches that aren't fully handled by the `auto` tactic.

---

## Solutions

### Solution 1: Use Structured Proofs (Recommended)
Replace `apply`-style proofs with readable proof blocks using `have` and explicit reasoning.

### Solution 2: Fix `subgoal` Scoping
Use proper goal focusing and ensure each `subgoal` is explicitly closed.

### Solution 3: Strengthen Tactics
Replace `auto simp:` with more targeted reasoning using `simp`, `intro`, and explicit `lemma` applications.

### Solution 4: Break Down Large Proofs
Split complex invariant preservation into smaller lemmas.

---

## Error Categories

| Error Type | Cause | Fix |
|-----------|-------|-----|
| `failed to finish proof` | Tactic incomplete | Add more reasoning, use explicit case splits |
| `Illegal application...in prove mode` | Improper `subgoal` syntax | Use `show` instead of `subgoal` |
| `Inaccessible goals` | Goal focusing issue | Add explicit `·` bullets or restructure |
| `Cannot unify types` | Type/term mismatch | Check variable definitions and types |

