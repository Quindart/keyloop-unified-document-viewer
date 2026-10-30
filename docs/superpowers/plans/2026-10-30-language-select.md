# Language Select Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the login page's native language selector with a reusable shadcn Select atom that displays the supplied flag images.

**Architecture:** Add the Radix Select dependency and a shadcn-style UI wrapper. Build `LanguageSelect` in `app/components/atoms` to own the selected language, flag rendering, i18next update, and local-storage persistence; use it from the login form.

**Tech Stack:** React 19, TypeScript, shadcn UI patterns, Radix Select, react-i18next, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-10-30-language-select-design.md`

## Global Constraints

- Use `public/icons/en.png` and `public/icons/vi.png`.
- Preserve the existing accessible language label, language names, `i18n.changeLanguage`, and local-storage persistence behavior.
- Do not change the header account menu or header language dropdown.

## Review Focus

- Initial Vietnamese selection must show the Vietnamese flag and translated label.
- Changing to English must update the flag, label, i18next language, and `workspace_language` value together.
- The trigger and options must remain keyboard-operable and expose the language label to assistive technology.
- Decorative flag images must not duplicate language names for screen readers.
- Keep the header language dropdown unchanged.

---

### Task 1: Add the shadcn Select UI wrapper

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `app/components/ui/select.tsx`

**Interfaces:**
- Produces: `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, and `SelectValue` exports backed by `@radix-ui/react-select`.

- [x] Add `@radix-ui/react-select` as a runtime dependency and create the wrapper following the existing `app/components/ui` patterns and `cn` helper.
- [x] Review wrapper exports and dependency lockfile for consistency with the existing Radix UI wrappers.

### Task 2: Create and use the reusable language atom

**Files:**
- Create: `app/components/atoms/language-select.tsx`
- Modify: `app/features/auth/login-form.tsx`

**Interfaces:**
- Consumes: Select wrapper exports from Task 1, `AppLanguage`, `LANGUAGE_STORAGE_KEY`, and the default i18next instance.
- Produces: `LanguageSelect`, a controlled shadcn Select showing the current flag and translated language name; selecting `vi` or `en` persists the value and calls `i18n.changeLanguage`.

- [x] Implement `LanguageSelect` with a screen-reader label, decorative circular flag images in the trigger and options, and `vi`/`en` values.
- [x] Replace the login form's inline native selector with `LanguageSelect` and remove imports made unused by that extraction.
- [x] Review that every language `<select>` usage has been replaced and the header dropdown is untouched.
