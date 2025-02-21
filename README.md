# Vite config `gh-pages-spa`  

[![JSR](https://jsr.io/badges/@quick-vite/gh-pages-spa)](https://jsr.io/@quick-vite/gh-pages-spa)

A quick setup for hosting a SPA on [GitHub pages](https://pages.github.com/) using [Vite](https://pages.github.com/).
You can see a working example, from the [`~/example` folder](https://github.com/quick-vite/gh-pages-spa/tree/main/example), here: <https://quick-vite.github.io/gh-pages-spa/>.

## What is it?

Adding static SPA's to GitHub Pages requires some additional setup.  
To make the setup for that faster, you can use this library.

## How to use it?

Install the package using your favorite package manager from the JSR repository.  
Replace your regular vite config, or create one, with the following code:

```ts
// ~/vite.config.mts

import packageJson from './package.json' with { type: 'json' };
import { gitHubSpaConfig } from "@quick-vite/gh-pages-spa/config";

export default gitHubSpaConfig(packageJson, {
    // Add your regular vite config here
})
```

This provides you with a pre-configured vite SPA, the config strips out some options that have to be set the way we expect.  

Next, make sure you set your github-pages url in the package.json of your project.  
This is both necessary for publishing to GitHub Pages, and we use it for the vite base path.

```yaml
{
  "name": "@quick-vite/gh-pages-spa-example",
  "version": "0.0.0",
  "private": true,
  "description": "Example of @quick-vite/gh-pages-spa",
  "main": "index.html",
  # Add the url of your github-pages here.
  # Similar to when you publish form the cli
  "homepage": "https://quick-vite.github.io/gh-pages-spa/",
  # ... removed for brevity 
}
```

And that's it, now you can run vite like normal and deploy it to GitHub Pages.  

## Using routers

Because the script this library inserts into the head to fix the GitHub url redirect, you need to filter out this route.  
To do so, we provide you with a function.  

```ts
import { replaceGitHubPagesUrl } from '@quick-vite/gh-pages-spa'

const example = "https://quick-vite.github.io/?/gh-pages-spa/path1/"
const fixedPath = replaceGitHubPagesUrl(example)

console.log(fixedPath) //: "https://quick-vite.github.io/gh-pages-spa/path1/"
```

### SolidJs

Currently, this library has only been tested on the solid-js router.  
Because the browser appends the history using the default history api, intercepting links with this router breaks.  
We will fix this in the future: <https://github.com/quick-vite/gh-pages-spa/issues/4>.
For now, you should disable `explicitLinks` in addition to using the `replaceGitHubPagesUrl` as route filter.  
**NOTE!** This issue is not always visible, it depends on whether you use routing information in context.  

```tsx
/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { replaceGitHubPagesUrl } from '@quick-vite/gh-pages-spa'
import { AppRoot } from './app'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/404'
import { Example1, Example2 } from './pages/example'

// The solid navigation fails on the homepage
// So we turn on explicitLinks and use normal anchors
render(() =>
    <Router base={import.meta.env.routeBase} explicitLinks={true} transformUrl={replaceGitHubPagesUrl} root={AppRoot}>
        <Route path="/path1/" component={Example1} />
        <Route path="/path2/" component={Example2} />
        <Route path="/" component={LandingPage} />
        <Route path="*404" component={NotFoundPage} />
    </Router>,
    document.getElementById('root')!
)
```

## Versioning

To keep things simple, the version of `@quick-vite/gh-pages-spa` is aligned with Vite.

So the `@quick-vite/gh-pages-spa@6^` version is compatible with `vite@6^`.

| Major | Minor | Patch
| :--   | :--   | :--
| Vite Version | Breaking change | Minor + Patch
