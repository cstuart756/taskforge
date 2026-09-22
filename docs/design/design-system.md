# Design System

Consistent design decisions for TaskForge. Implemented with Tailwind CSS.

## Colour palette

| Purpose | Tailwind class | Hex | Use |
|---------|---------------|-----|-----|
| Primary | `blue-600` | #2563EB | Buttons, links, focus |
| Primary hover | `blue-700` | #1D4ED8 | Button hover |
| Background | `white` | #FFFFFF | Page background |
| Surface | `gray-50` | #F9FAFB | Cards, panels |
| Border | `gray-200` | #E5E7EB | Dividers, borders |
| Text primary | `gray-900` | #111827 | Body text |
| Text secondary | `gray-600` | #4B5563 | Secondary text |
| Success | `green-600` | #16A34A | Success states |
| Warning | `amber-600` | #D97706 | Warnings |
| Danger | `red-600` | #DC2626 | Errors, delete actions |

## Typography

| Purpose | Tailwind | Size |
|---------|----------|------|
| Page title | `text-3xl font-bold` | 30px |
| Section heading | `text-2xl font-semibold` | 24px |
| Subheading | `text-lg font-medium` | 18px |
| Body | `text-base` | 16px |
| Small / caption | `text-sm text-gray-600` | 14px |

Font family: default Tailwind sans-serif stack (system fonts).

## Spacing

Use Tailwind's default spacing scale (4px base unit):

- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

## Border radius

- Buttons and inputs: `rounded-md`
- Cards and modals: `rounded-lg`

## Shadows

- Cards: `shadow-sm`
- Modals: `shadow-lg`

## Buttons

| Style | Tailwind classes |
|-------|------------------|
| Primary | `bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700` |
| Secondary | `bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50` |
| Danger | `bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700` |
| Disabled | add `opacity-50 cursor-not-allowed` |

## Form inputs
w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none
focus:ring-2 focus:ring-blue-500 focus:border-transparent
text


## Focus states

All interactive elements must have a visible focus ring:

focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
text


## Accessibility requirements

- Colour contrast must meet WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Never use colour alone to convey meaning.
- Every form input must have a label.
- Every image must have alt text (or empty alt if decorative).
- Keyboard focus must always be visible.

## Component inventory (to be built)

- Button (primary, secondary, danger)
- Input (text, email, password)
- Textarea
- Select
- Checkbox
- Card
- Modal
- Toast / notification
- Table
- Sidebar nav item
- User menu
- Badge (status, priority)
- Empty state
- Loading spinner