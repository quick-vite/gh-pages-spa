import { Component } from "solid-js";

export const LandingPage: Component = () => <>
	<p>TODO description on how this all works.</p>
	<p>Perhaps just import the markdown.</p>
	<p><a href={`${import.meta.env.BASE_URL}path1/`}>Example 1</a></p>
	<p><a href={`${import.meta.env.BASE_URL}path2/`}>Example 2</a></p>
</>