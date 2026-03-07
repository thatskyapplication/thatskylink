import { withSentry } from "@sentry/cloudflare";
import { REDIRECTS } from "./redirects.js";
import { THIS_MONTH_IN_SKY_MONTH_NAMES, THIS_MONTH_IN_SKY_REGEX } from "./utility/constants.js";

interface Env {
	SENTRY_DATA_SOURCE_NAME: string;
	CF_VERSION_METADATA: WorkerVersionMetadata;
}

export default withSentry(
	(env: Env) => ({
		dsn: env.SENTRY_DATA_SOURCE_NAME,
		release: env.CF_VERSION_METADATA.id,
		sendDefaultPii: true,
	}),
	{
		// Need env here so Sentry does not see it as unknown.
		fetch(request, _env) {
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

			const tmisMatch = THIS_MONTH_IN_SKY_REGEX.exec(pathname);

			if (tmisMatch) {
				const [, year, rawMonth] = tmisMatch;
				const month = Number(rawMonth);

				if (month >= 1 && month <= 12) {
					return Response.redirect(
						`https://www.thatskygame.com/news/this-month-in-sky-${THIS_MONTH_IN_SKY_MONTH_NAMES[month - 1]}-${year}-edition`,
						301,
					);
				}
			}

			const redirect = REDIRECTS.get(pathname.slice(1).toLowerCase());

			if (redirect) {
				return Response.redirect(redirect, 301);
			}

			return Response.redirect("https://github.com/thatskyapplication/thatskylink", 301);
		},
	} satisfies ExportedHandler<Env>,
);
