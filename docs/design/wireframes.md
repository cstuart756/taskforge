# Wireframes

Low-fidelity layouts for TaskForge. Use these as structural guides, not
final design. Actual styling is applied during development with Tailwind.

---

## 1. Landing page (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]  Features  Pricing  About        [Log in]  [Get started]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   TaskForge                                                      │
│   Simple task management for small teams.                        │
│                                                                  │
│   [Get started free]    [See pricing]                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Screenshot / illustration of dashboard]                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│   Features                                                       │
│   ┌────────┐  ┌────────┐  ┌────────┐                            │
│   │ Create │  │ Assign │  │ Track  │                            │
│   │ tasks  │  │ tasks  │  │progress│                            │
│   └────────┘  └────────┘  └────────┘                            │
├──────────────────────────────────────────────────────────────────┤
│   Footer: Privacy · Terms · Contact · © TaskForge                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Registration (`/register`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                  Create your account                             │
│                                                                  │
│                  Name      [__________________]                  │
│                  Email     [__________________]                  │
│                  Password  [__________________]                  │
│                                                                  │
│                  [ Create account ]                              │
│                                                                  │
│                  Already have an account? Log in                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Login (`/login`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                  Welcome back                                    │
│                                                                  │
│                  Email     [__________________]                  │
│                  Password  [__________________]                  │
│                                                                  │
│                  [ Log in ]                                      │
│                                                                  │
│                  Forgot password?                                │
│                  Don't have an account? Register                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Dashboard — empty state (`/app`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                     [User menu ▼]         │
├──────────┬───────────────────────────────────────────────────────┤
│ Sidebar  │  Dashboard                                            │
│          │                                                       │
│ ● Dash   │  You have no tasks yet.                               │
│ ○ Tasks  │                                                       │
│ ○ Team   │  [ + Create your first task ]                         │
│ ○ Bill   │                                                       │
│ ○ Sett   │                                                       │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 5. Dashboard — with tasks (`/app`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                     [User menu ▼]         │
├──────────┬───────────────────────────────────────────────────────┤
│ Sidebar  │  Dashboard                          [ + New task ]    │
│          │                                                       │
│ ● Dash   │  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│ ○ Tasks  │  │ Open    │  │ In prog │  │ Done    │               │
│ ○ Team   │  │   12    │  │    3    │  │   47    │               │
│ ○ Bill   │  └─────────┘  └─────────┘  └─────────┘               │
│ ○ Sett   │                                                       │
│          │  Recent tasks                                         │
│          │  ┌─────────────────────────────────────────────────┐   │
│          │  │ ☐ Fix login bug          due today   High      │   │
│          │  │ ☐ Write docs             due Fri     Normal    │   │
│          │  │ ☑ Deploy to staging      done        Normal    │   │
│          │  └─────────────────────────────────────────────────┘   │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 6. Task list (`/app/tasks`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                     [User menu ▼]         │
├──────────┬───────────────────────────────────────────────────────┤
│ Sidebar  │  Tasks                              [ + New task ]    │
│          │                                                       │
│          │  Search [___________]  Status [All ▼]  Assignee [▼]   │
│          │                                                       │
│          │  ┌───────────────────────────────────────────────┐    │
│          │  │ Title              Status    Due    Priority   │    │
│          │  ├───────────────────────────────────────────────┤    │
│          │  │ Fix login bug      Open      today  High       │    │
│          │  │ Write docs         Open      Fri    Normal     │    │
│          │  │ Deploy to staging  Done      —      Normal     │    │
│          │  └───────────────────────────────────────────────┘    │
│          │                                                       │
│          │  [ 1 ] [ 2 ] [ 3 ]  ...                               │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 7. Task detail (`/app/tasks/[id]`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                     [User menu ▼]         │
├──────────┬───────────────────────────────────────────────────────┤
│ Sidebar  │  ← Back to tasks                                      │
│          │                                                       │
│          │  Fix login bug                    Status: Open        │
│          │                                                       │
│          │  Description                                          │
│          │  Users on Safari cannot log in...                     │
│          │                                                       │
│          │  Assigned to:  Stuart Carey                           │
│          │  Due:          Today                                  │
│          │  Priority:     High                                   │
│          │  Created:      22 Sep 2026                            │
│          │                                                       │
│          │  [ Mark complete ]   [ Edit ]   [ Delete ]            │
│          │                                                       │
│          │  Comments                                             │
│          │  ┌─────────────────────────────────────────────┐      │
│          │  │ Stuart: I'll look at this today.            │      │
│          │  └─────────────────────────────────────────────┘      │
│          │  [ Write a comment... ]                               │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 8. Task creation (`/app/tasks/new`)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                                     [User menu ▼]         │
├──────────┬───────────────────────────────────────────────────────┤
│ Sidebar  │  New task                                             │
│          │                                                       │
│          │  Title *        [_____________________________]        │
│          │                                                       │
│          │  Description    [                             ]        │
│          │                 [                             ]        │
│          │                                                       │
│          │  Due date       [  dd / mm / yyyy  ]                  │
│          │  Priority       [ Normal ▼ ]                          │
│          │  Assignee       [ Unassigned ▼ ]                      │
│          │                                                       │
│          │  [ Save ]   [ Cancel ]                                │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 9. Mobile layout (all pages)

```
┌──────────────────────┐
│ [☰]  TaskForge  [▼]  │
├──────────────────────┤
│                      │
│   Main content       │
│   stacks vertically  │
│                      │
│   [ Primary action ] │
│                      │
│                      │
│                      │
└──────────────────────┘
```

Sidebar collapses into a hamburger menu. Tables become cards or scrollable.
