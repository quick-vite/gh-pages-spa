import { A } from "@solidjs/router";
import { Component } from "solid-js";
import { routeBase } from '@quick-vite/gh-pages-spa/solidjs'

export const LandingPage: Component = () => <>
	<p>TODO description on how this all works.</p>
	<p>Perhaps just import the markdown.</p>
	<p><a href={`${routeBase}/example/1/`}>Example 1</a></p>
	<p><A href="/example/2/">Example 2</A></p>
</>