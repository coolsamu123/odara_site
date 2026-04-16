# Odara Community Bugs - Fix Tasks

## 🔴 Critical Bugs

### BUG-1: Feature Requests and Discussions created as "Bug" type
**File:** `components/community/PostForm.tsx`
**Symptom:** When creating a post with category "Feature Request" or "Discussion", the post appears in the "All" tab with a "Bug" badge and "open" status. The "Features" and "Discussions" tabs show "No posts yet."
**Root cause (suspected):** React closure stale-state issue. The `handleSubmit` function captures `category` from the closure at render time, but `setCategory` may be setting state asynchronously in a way that the submit handler reads a stale value. Or: the `defaultCategory` from the parent (`category || undefined`) means "New Post" from "All" or "Bugs" tab defaults to 'bug'.
**Fix ideas:**
- Option A: Add a `useRef` to store the current category, updated on every `setCategory` call, and read from ref in `handleSubmit`
- Option B: Pass category explicitly from the clicked button to `createPost` via a ref or form state at submit time
- Option C: Remove `defaultCategory` dependency — always default to 'bug' in PostForm state, regardless of active tab

---

### BUG-2: "Announcement" category missing from New Post form
**File:** `components/community/PostForm.tsx`
**Symptom:** CategoryTabs shows "Announcements" tab, but PostForm only has Bug Report / Feature Request / Discussion buttons.
**Fix:** Add `{ key: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-yellow-400' }` to CATEGORIES array. Only admins (or perhaps no one, if announcements are site-wide) should be able to post announcements — add a role check: `user?.role === 'admin'` to conditionally show this button.

---

### BUG-3: Modal doesn't close after successful post creation
**File:** `components/community/PostForm.tsx`
**Symptom:** After clicking "Create Post" and the post is successfully created, the modal stays open.
**Root cause:** The `onClose()` call after `await createPost(...)` should close it, but there may be a React state issue where `showPostForm` doesn't update. Also possible: the `onCreated()` fetch triggers a re-render that keeps the modal mounted.
**Fix:** After `createPost` succeeds, call `onClose()` immediately (before or after `onCreated()`). Ensure `onClose` does `setShowPostForm(false)` in the parent. If the modal has a fade-out animation, wait for it before unmounting.

---

## 🟡 Medium Bugs

### BUG-4: File attachment name not visible in post
**File:** `components/community/PostForm.tsx` + `components/community/PostDetail.tsx`
**Symptom:** File upload via "Add Image" works (file is sent to server), but the post preview doesn't show the filename/attachment indicator. The user can't see what file they attached.
**Fix:** After successful upload, store the image URL and display it as a visible chip/tag below the textarea showing the filename. Also show the image in PostDetail if it's a markdown image.

---

### BUG-5: Post count badges always show "0" on filter tabs
**File:** `components/community/CategoryTabs.tsx` + `components/community/CommunityStats.tsx`
**Symptom:** Filter tabs (All, Bugs, Features, Discussions, Announcements) show "0" even after posts are created.
**Fix:** Either:
- Remove the count display from CategoryTabs if counts are not implemented
- Or implement proper counts by calling the API with each category filter and displaying the totals

---

### BUG-6: "Create First Post" shows in wrong category tabs
**File:** `components/community/CommunityPage.tsx`
**Symptom:** When Features/Discussions tabs show "No posts yet. Be the first to contribute!" it shouldn't show this if the user has already created posts (even if those posts were mis-categorized as bugs).
**Fix:** After `fetchPosts`, check if posts.length === 0 and show the empty state only then. This is already the logic — it's a side-effect of BUG-1.

---

## 🟢 Minor/Low Priority

### BUG-7: Runtime.evaluate CDP returns `undefined` intermittently
**Symptom:** In CDP browser tests, many Runtime.evaluate calls returned `undefined` even when code was correct.
**Not a user-facing bug**, but worth noting: React Fiber's internal `_valueTracker` and prototype-based property descriptors make programmatic form filling harder. Document this if further automation testing is needed.

---

## Tasks Checklist

- [ ] BUG-1: Fix category not being saved when creating Feature Request / Discussion posts
- [ ] BUG-2: Add "Announcement" category button to PostForm (admin-only)
- [ ] BUG-3: Modal auto-closes after successful post creation
- [ ] BUG-4: Show file attachment name/chip after upload in PostForm
- [ ] BUG-5: Remove or implement post count badges on CategoryTabs
- [ ] BUG-6: (Will be fixed by BUG-1) Posts appear in correct category tabs
- [ ] After fixes: rebuild backend + frontend
- [ ] After fixes: commit and push
- [ ] After fixes: re-test at https://odara.rs/#/community
