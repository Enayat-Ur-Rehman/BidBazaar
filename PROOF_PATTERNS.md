# Isabelle Proof Patterns - Quick Reference

## Pattern 1: Proving Conjunctions

### ✗ WRONG
```isabelle
apply (intro conjI)
subgoal by (simp add: ...)
subgoal by (simp add: ...)
done
```

### ✓ CORRECT
```isabelle
proof (intro conjI)
  · show "goal1" by (simp add: ...)
  · show "goal2" by (simp add: ...)
qed
```

---

## Pattern 2: Universal Quantification Over Domain

### ✗ WRONG
```isabelle
by (auto simp: inv_System_def pdom_def)
```

### ✓ CORRECT
```isabelle
proof (intro ballI)
  fix pid'
  assume "pid' ∈ pdom (sys_pumps s(pid ↦ _))"
  thus "case sys_pumps s(pid ↦ _) pid' of ... ⇒ ..."
  proof (cases "pid' = pid")
    case True
      simp only [True, fun_upd_same]
      exact initVol_nn
    next
    case False
      simp only [False, fun_upd_apply]
      have "pid' ∈ pdom (sys_pumps s)" by (auto simp: pdom_def)
      from inv_System_totalAdmin[OF inv] this
      show ?thesis by simp
  qed
qed
```

---

## Pattern 3: Case Analysis on Option Types

### ✗ WRONG
```isabelle
by (auto simp: split: option.splits)
```

### ✓ CORRECT
```isabelle
proof (cases "sys_pumps s pid")
  case None
    simp  (* Usually contradicts precondition *)
  next
  case (Some pu)
    have lu : "sys_pumps s pid = Some pu" by (simp add: this)
    show ?thesis by (simp add: lu ...)
qed
```

---

## Pattern 4: Function Updates (f(k ↦ v))

### Setup
```isabelle
(* You have: sys_pumps s(pid ↦ newPump) *)
(* Need to prove: ∀x ∈ pdom f. P(f x) *)
```

### ✓ CORRECT
```isabelle
proof (cases "x = pid")
  case True
    (* x = pid: f(pid ↦ v) pid = v *)
    simp only [True, fun_upd_same]
    exact (desired_property_for_v)
  next
  case False
    (* x ≠ pid: f(pid ↦ v) x = f x *)
    simp only [False, fun_upd_apply]
    have "x ∈ pdom (sys_pumps s)" 
      using False and_assumption by simp
    exact (inv_property_on_old_domain x)
qed
```

---

## Pattern 5: Breaking Down Large Invariants

### Setup
```isabelle
definition big_inv := "part1 ∧ part2 ∧ part3"
```

### Decomposition Lemmas
```isabelle
lemma big_inv_1 : "big_inv x ⟹ part1 x" by (simp add: big_inv_def)
lemma big_inv_2 : "big_inv x ⟹ part2 x" by (simp add: big_inv_def)
lemma big_inv_3 : "big_inv x ⟹ part3 x" by (simp add: big_inv_def)
```

### Usage in Main Proof
```isabelle
lemma operation_preserves_inv : "big_inv s ⟹ big_inv (op s)"
proof (intro conjI)
  show "part1 (op s)" 
    using big_inv_1[OF assumption] by ...
  show "part2 (op s)" 
    using big_inv_2[OF assumption] by ...
  show "part3 (op s)" 
    using big_inv_3[OF assumption] by ...
qed
```

---

## Pattern 6: Structured Proof with Let Bindings

### ✓ CORRECT
```isabelle
proof (unfold operation_def, simp add: Let_def, intro conjI)
  show "goal1" 
    using assumption by simp
  
  show "goal2"
  proof (intro ballI)
    fix x
    assume "x ∈ domain"
    thus "property x"
    proof (cases ...)
      case Case1 by ...
      next case Case2 by ...
    qed
  qed
  
  show "goal3" by simp
qed
```

---

## Pattern 7: Using `have` for Intermediate Facts

### ✓ GOOD PRACTICE
```isabelle
proof -
  have fact1 : "A = B" by (...)
  have fact2 : "B ≠ C" using fact1 by (...)
  have fact3 : "D ∧ E" by (...)
  
  from fact1 fact2 fact3
  show ?thesis by (simp add: ...)
qed
```

---

## Pattern 8: Leveraging Preconditions

### Setup
```isabelle
definition pre_Op := "condition1 ∧ condition2 ∧ condition3"

lemma Op_preserves_inv : "pre_Op s ⟹ inv_System s ⟹ inv_System (Op s)"
proof -
  assume pre : "pre_Op s"
  assume inv : "inv_System s"
  
  (* Extract precondition facts *)
  from pre obtain c1 c2 c3 
    by (simp add: pre_Op_def)
  
  show ?thesis
  proof (...)
    (* Now use c1, c2, c3 throughout *)
  qed
qed
```

---

## Tactical Cheatsheet

| Tactic | Purpose | Example |
|--------|---------|---------|
| `by (simp add: lemmas)` | Simple simplification | `by (simp add: inv_def pdom_def)` |
| `by (auto simp: ...)` | Automated reasoning | `by (auto simp: split: option.splits)` |
| `by (cases x)` | Case splitting | `by (cases "x = y")` |
| `by (intro ballI)` | Introduce universal | `proof (intro ballI) fix x` |
| `by (intro conjI)` | Split conjunction | `proof (intro conjI) · show g1 · show g2` |
| `by linarith` | Linear arithmetic | `by linarith` |
| `by omega` | Integer arithmetic | `by omega` |
| `using lemma by ...` | Apply lemma first | `using inv_fact[OF inv] by simp` |

---

## Debugging Steps

1. **Isolate the failing goal**
   ```isabelle
   proof (intro conjI)
     · show "goal1" by sorry
     · show "goal2" by (actual proof)
   qed
   ```
   Move `sorry` between goals to find which one fails.

2. **Print the goal**
   - Hover over error location in Isabelle IDE
   - View "Goals" panel to see exact goal state

3. **Test simpler versions**
   ```isabelle
   lemma simple : "A ∧ B ⟹ A" by simp
   ```
   Build up from simple lemmas.

4. **Add lemmas incrementally**
   ```isabelle
   by (simp add: lemma1)           (* Try with one lemma *)
   by (simp add: lemma1 lemma2)    (* Add another *)
   by (simp add: lemma1 lemma2 lemma3)  (* And another *)
   ```

5. **Use `have` for intermediate steps**
   ```isabelle
   have step1 : "A" by (...)
   have step2 : "B" using step1 by (...)
   show ?thesis using step2 by (...)
   ```

---

## Common Mistakes to Avoid

1. ✗ **Mixing proof modes**
   ```isabelle
   proof -           (* start structured *)
   apply (simp)      (* trying to use tactic mode *)
   ```

2. ✗ **Orphaned subgoal**
   ```isabelle
   apply (intro conjI)
   subgoal by simp   (* Missing proper scope/structure *)
   done
   ```

3. ✗ **Forgotten qed**
   ```isabelle
   proof (intro ballI)
     fix x
     show ?thesis by simp
   (* Missing qed here! *)
   ```

4. ✗ **Wrong goal reference**
   ```isabelle
   using inv by simp  (* inv might be wrong variable *)
   ```

5. ✗ **Incomplete case analysis**
   ```isabelle
   proof (cases x)
     case A by simp
     (* Missing case B! *)
   ```

