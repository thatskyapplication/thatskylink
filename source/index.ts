import { REDIRECTS } from "./redirects.js";

export default {
	fetch(request) {
		if (request.method !== "GET") {
			return new Response("Method not allowed.", { status: 405 });
		}

		const url = new URL(request.url);
		const redirect = REDIRECTS.get(url.pathname.slice(1).toLowerCase());

		if (redirect) {
			return Response.redirect(redirect, 301);
		}

		return Response.redirect("https://github.com/thatskyapplication/thatskylink", 301);
	},
} satisfies ExportedHandler;
