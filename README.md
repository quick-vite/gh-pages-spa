# Vite config `gh-pages-spa`  

<!-- [![JSR](https://jsr.io/badges/@quick-vite/gh-pages-spa)](https://jsr.io/@quick-vite/gh-pages-spa)  -->
[![NPM](https://img.shields.io/npm/v/%40quick-vite%2Fgh-pages-spa)](https://www.npmjs.com/package/@quick-vite/gh-pages-spa)

A quick setup for hosting a SPA on [GitHub pages](https://pages.github.com/) using [Vite](https://pages.github.com/).  
You can see a working example, from the [`~/example` folder](https://github.com/quick-vite/gh-pages-spa/tree/main/example), here: <https://quick-vite.github.io/gh-pages-spa/>.

## What is it?

Adding static SPA's to GitHub Pages requires some additional setup.  
To make the setup for that faster, you can use this library.

_This project is based on: <https://github.com/rafgraph/spa-github-pages>_

## How to use it?

Install the package using your favorite package manager from the JSR repository.  
Replace your regular vite config, or create one, with our config.

### Base requirements

Make sure you set your GitHub Pages url in the package.json of your project.  
This is both necessary for publishing to GitHub Pages, and we use it for the route and Vite base path.

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

> [!IMPORTANT]  
> The `"homepage"` supports two modes, `gh-pages` and regular URL.  
>
> If you host on `gh-pages` you will have stricter validation, you'll need to match
> `https://{account}.github.io/{repo}/` any other URL is not accepted.  
>
> With any other domain, you can have as many path segments as you like, keep in mind the `/?/` hack
> will be inserted after the path you specify in the package json.  
> See [`./src/github-pages-config/__tests__/parse-base.test.ts`](./src/github-pages-config/__tests__/parse-base.test.ts) for detailed scenarios.  

### Vanilla routing

Make sure your Vite config at least has this configuration:

```ts
// ~/vite.config.mts

import { gitHubSpaConfig, injectGitHubPagesRedirect } from "@quick-vite/gh-pages-spa/config";
import packageJson from './package.json' with { type: 'json' }

export default gitHubSpaConfig(packageJson, {
    plugins: [
        injectGitHubPagesRedirect(),
    ],
    build: {
        target: 'esnext'
    }
})
```

The `gitHubSpaConfig` adds a 404 page that encodes the URL that was attempted and redirects.  
To handle this redirect we need to configure some additional routing, this is done by adding the `injectGitHubPagesRedirect` plugin.  
Together, this provides you with a pre-configured vite SPA, the config strips out some options that have to be set the way we expect.  

The library comes with some utilities:

```ts
import { routeBase, replaceGitHubPagesUrl } from '@quick-vite/gh-pages-spa/vanilla'

// Because the script this library inserts into the head to fix the GitHub url redirect, you might need to filter out this route. This can be useful to render content before the redirect happens. 
const example = "https://quick-vite.github.io/?/gh-pages-spa/path1/"
const fixedPath = replaceGitHubPagesUrl(example)

console.log(fixedPath) //: "https://quick-vite.github.io/gh-pages-spa/path1/"

// If you need to know the route-base of you GitHub Pages app, you can access this through the `routeBase` getter
console.log(routeBase()) //: "/gh-pages-spa"
```

And that's it, now you can run vite like normal and [deploy it to GitHub Pages](#deploying).  

### SolidJs Routing

Make sure your Vite config at least has this configuration:

```ts
// ~/vite.config.mts

import { gitHubSpaConfig } from "@quick-vite/gh-pages-spa/config";
import solid from 'vite-plugin-solid'

import packageJson from './package.json' with { type: 'json' }

export default gitHubSpaConfig(packageJson, {
    plugins: [solid()]
})
```

This provides you with a pre-configured vite SPA, a basic solid-js SPA.  
This adds a 404 page that encodes the URL that was attempted and redirects.  
To handle this redirect we need to configure some additional routing:

```tsx
/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { routeBase, PagesReRouter } from '@quick-vite/gh-pages-spa/solidjs'

import { AppRoot } from './app'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/404'
import { Example } from './pages/example'

render(() =>
    <Router base={routeBase()} root={AppRoot}>
        <PagesReRouter>
            <Route path="/example/:id/" component={Example} />
            <Route path="/" component={LandingPage} />
            <Route path="*404" component={NotFoundPage} />
        </PagesReRouter>
    </Router>,
    document.getElementById('root')!
)
```

The `routeBase` is extracted from your `package.json`.  
The `<PagesReRouter>` component is a custom route that handles the encoded urls for you.

And that's it, now you can run vite like normal and [deploy it to GitHub Pages](#deploying).  

#### SolidJs Dynamic routes

If you want to load pages dynamically, this library offers a utility.

To dynamically load a page you can use solid's `lazy`.  
However, in the case you don't have default exports, you can use `namedLazy` instead.  
This can be used like this:  

```ts
// Defining a dynamic route component
const ExamplePage = namedLazy(() => import("./pages/example").then(m => m.Example));
// Using the route remains the same
<Route path="/example/:id/" component={ExamplePage} />
```

The usefulness of this can be debated, but, it offers a way of consistent exports without having to write the wrappers yourself.  
Additionally it offers a way to have multiple page exports in one file.

#### SolidJs Chunking

In he case you want split of the parts of `solidjs`, `@solidjs/router`, and this library itself into it's own chunk.  
You can simply use `solidVendorChunks` in the `vite.config` and you will get that for free.

```ts
import { solidVendorChunks } from "@quick-vite/gh-pages-spa/solidjs/vite";
import solid from 'vite-plugin-solid'

import packageJson from './package.json' with { type: 'json' }

export default gitHubSpaConfig(packageJson, {
 plugins: [
  // 
 ],
 build: {
  rollupOptions: {
   output: {
    manualChunks: solidVendorChunks,
   }
  },
  // target: 'esnext',
  // sourcemap: 'inline'
 }
})
```

## Deploying

To deploy to GitHub Pages you'll need to add a pipeline using [`actions/deploy-pages@v4`](https://github.com/actions/deploy-pages).  
You can use [our example pipeline](https://github.com/quick-vite/gh-pages-spa/blob/main/.github/workflows/publish-pages.yml) as reference.  

Alternatively, you can deploy it using the [`gh-pages` npm package](https://www.npmjs.com/package/gh-pages).  
Just don't forget to add the `--nojekyll` flag.

## SEO

If you need your App to be SEO friendly you'll need to provide search engines with a sitemap that's preloaded with the transformed URLs and a robots.txt that points to that sitemap.

We provide you with a vite plugin to help you with that.
Simply, import the `seo` plugin and configure it with the relative paths you need to be indexed.

```ts
import { gitHubSpaConfig, seo } from "@quick-vite/gh-pages-spa/config";

import packageJson from './package.json' with { type: 'json' }

export default gitHubSpaConfig(packageJson, {
    plugins: [
        /* solid() / injectGitHubPagesRedirect() */ 
        seo(
            packageJson,
            '/',
            '/example/1/',
            '/example/2/',
            '/one/two?a=b&c=d#qwe'
        )
    ]
})
```

The above configuration will generate a `sitemap.txt` like so: (the domain and subpath are an example)

```txt
https://quick-vite.github.io/gh-pages-spa/?/
https://quick-vite.github.io/gh-pages-spa/?/example/1/
https://quick-vite.github.io/gh-pages-spa/?/example/2/
https://quick-vite.github.io/gh-pages-spa/?/one/two&a=b~and~c=d#qwe
```

Additionally, a `robots.txt` will be added with a reference to this sitemap.  
If you define a `robots.txt` in your `./src/public/` folder, it will be appended with the reference.  

## Versioning

To keep things simple, the version of `@quick-vite/gh-pages-spa` is aligned with Vite.

So the `@quick-vite/gh-pages-spa@6^` version is compatible with `vite@6^`.

| Major | Minor | Patch
| :--   | :--   | :--
| Vite Version | Breaking change | Minor + Patch
