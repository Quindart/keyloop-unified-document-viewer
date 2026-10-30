# Language Select Design

## Intent and scope

Replace the native language `<select>` on the login screen with a reusable atom built from the shadcn Select. Show the existing English and Vietnamese flag images alongside the language names, and keep changing and persisting the selected language through i18next and `workspace_language` in local storage. The header language dropdown is out of scope because it is not a `<select>`.

## Approaches

- **Shared shadcn Select atom (chosen):** gives the language control consistent styling and supports flag images in both the selected value and options. Use this for every language `<select>`; one currently exists on the login screen.
- **Keep native select:** avoids a dependency, but native options do not render flag images consistently across browsers and do not meet the requested shadcn styling.

## Constraints and implementation calls

- The project has shadcn UI wrappers but no Select wrapper or `@radix-ui/react-select` dependency; add the dependency and a wrapper under `app/components/ui` as required by shadcn.
- Place the reusable language picker under `app/components/atoms`, using `public/icons/en.png` and `public/icons/vi.png`.
- Preserve the existing accessible language label, language names, `i18n.changeLanguage`, and local-storage persistence behavior.
- Do not change the header account menu or header language dropdown.
