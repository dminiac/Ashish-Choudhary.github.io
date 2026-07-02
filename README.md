# Ashish Choudhary — Portfolio

Personal portfolio website of Ashish Choudhary, Software Engineer from Mumbai.

**Live site:** https://ashish-choudhary.netlify.app/

## Tech

- Pure HTML, CSS and vanilla JavaScript — no frameworks, no build step
- Netlify Forms powers the contact form (submissions appear in the Netlify dashboard under **Forms**)
- Deployed on Netlify; every push to `main` publishes automatically

## Structure

```
index.html      Single-page site (hero, about, skills, experience, projects, testimonials, contact)
css/style.css   All styling — design tokens live in the :root block
js/main.js      Mobile nav, scroll-reveal animations, stat counters, active-section nav highlight
images/         Photos and project thumbnails
netlify.toml    Publish config + security headers
```

## Editing content

All content lives directly in `index.html`. To update:

- **Experience / education** — edit the `#experience` section
- **Projects** — duplicate a `.project-card` block in the `#projects` section
- **Skills** — add a `<span>` chip inside the relevant `.skill-card`
- **Colors / fonts** — change the CSS variables at the top of `css/style.css`

## Local preview

Open `index.html` in a browser, or run any static server:

```
npx serve .
```
