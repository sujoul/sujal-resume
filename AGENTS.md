<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep portfolio copy, project labels, contact email, and placeholder social URLs in `src/lib/site-content.ts` so personal details are easy to update without searching the UI.
- Keep the requested scrolling portfolio on the index route with in-page navigation because its sections form one continuous presentation.
- Store album media in the private `journey-media` bucket and expose it only through published `media_items` rows, so draft memories stay private.
- Administration happens only in the backend dashboard (user_roles, journey_entries, media_items, journey-media storage); the site ships no frontend admin UI, and the browser module only reads published content.
- Keep admin-only write access enforced by `user_roles` + RLS policies so dashboard administration stays secure; never infer admin access in client code.
- Keep the public album as a center-focused horizontal carousel while the profile designation remains a separate presentation flag; this prevents portrait toggles from hiding album media.
- Derive the browser favicon from the published profile image at runtime with a light static fallback, so dashboard portrait changes need no code deployment.
