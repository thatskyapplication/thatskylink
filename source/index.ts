import { REDIRECTS } from "./redirects.js";

export default {
	fetch(request) {
		if (!(request.method === "GET" || request.method === "HEAD")) {
			return new Response(null, { status: 405 });
		}

		const url = new URL(request.url);
		const pathname = url.pathname;

		if (pathname.startsWith("/profiles/")) {
			const userId = pathname.slice(10);

			if (userId) {
				return Response.redirect(`https://thatskyapplication.com/sky-profiles/${userId}`, 301);
			}
		}

		const redirect = REDIRECTS.get(url.pathname.slice(1).toLowerCase());

		if (redirect) {
			return Response.redirect(redirect, 301);
		}

		return Response.redirect("https://github.com/thatskyapplication/thatskylink", 301);
	},
} satisfies ExportedHandler;
