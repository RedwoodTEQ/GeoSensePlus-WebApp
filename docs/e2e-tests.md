# E2E Test Cases

## Tree Component – Expansion State Persistence

**ID:** `STATE-DIRECTORY-TREE-01`  
**Title:** Tree expansion state persists when navigating away and back  
**Preconditions:**  
- Tree has expandable nodes  

**Steps:**  
1. Navigate to http://localhost:4200/state-directory
2. Expand node "Parent A"  
3. Switch to another page (e.g., Dashboard)  
4. Navigate back to the `state-directory` page  

**Expected Result:**  
- "Parent A" remains expanded  
- No unexpected reset of tree state
