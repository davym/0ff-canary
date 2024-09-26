import {
	PUBLIC_PLAUSIBLE_API_DOMAIN,
	PLAUSIBLE_API_KEY,
	PUBLIC_PLAUSIBLE_API_SITE_ID
} from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const releasePageViewsResponse = await fetch(
			`${PUBLIC_PLAUSIBLE_API_DOMAIN}/api/v1/stats/breakdown?site_id=${PUBLIC_PLAUSIBLE_API_SITE_ID}&property=event:page&filters=event:page==/release/*`,
			{
				headers: {
					Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
					'Content-Type': 'application/json'
				}
			}
		);

		if (!releasePageViewsResponse.ok) {
			throw new Error(`Response status: ${releasePageViewsResponse.status}`);
		}
		const releasePageViewsData = await releasePageViewsResponse.json();
		const releasePageViewPages = releasePageViewsData.results.map(
			(result: { page: string }) => result.page
		);

		const staticPages = ['/', '/about', '/settings'];

		const xml = sitemap([...staticPages, ...releasePageViewPages]);

		return new Response(xml, {
			headers: {
				'Content-Type': 'text/xml'
			}
		});
	} catch (error: any) {
		console.error(error.message);
		return new Response('Failed to fetch data', { status: 500 });
	}
};

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `
<url>
	<loc>https://canary.0ff.dev${page}</loc>
</url>
`
	)
	.join('')}
</urlset>`;
