import { A } from "@solidjs/router";
import { Component } from "solid-js";

export const LandingPage: Component = () => <>
	<p>TODO description on how this all works.</p>
	<p>Perhaps just import the markdown.</p>
	{/* The default html link tags don't work very well, keep in mind this now works as a path */}
	<p><a href="./example/1/">Example 1</a></p>
	<p><A href="/example/2/">Example 2</A></p>
</>