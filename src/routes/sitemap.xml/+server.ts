import { PLAUSIBLE_API_KEY } from '$env/static/private';
import { PUBLIC_PLAUSIBLE_API_DOMAIN, PUBLIC_PLAUSIBLE_API_SITE_ID } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const today = new Date().toISOString().split('T')[0];
	let allResults: string[] = [];
	let currentPage = 1;
	let hasMoreResults = true;

	while (hasMoreResults) {
		try {
			const plausiblePageViewsResponse = await fetch(
				`${PUBLIC_PLAUSIBLE_API_DOMAIN}/api/v1/stats/breakdown?site_id=${PUBLIC_PLAUSIBLE_API_SITE_ID}&period=custom&date=2024-01-01,${today}&property=event:page&filters=event:page==/release/*|/artist/*&page=${currentPage}`,
				{
					headers: {
						Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
						'Content-Type': 'application/json'
					}
				}
			);

			if (!plausiblePageViewsResponse.ok) {
				throw new Error(`Response status: ${plausiblePageViewsResponse.status}`);
			}
			const plausiblePageViewsData = await plausiblePageViewsResponse.json();
			const plausiblePageViewPages = plausiblePageViewsData.results.map(
				(result: { page: string }) => result.page
			);

			allResults = allResults.concat(plausiblePageViewPages);

			if (plausiblePageViewPages.length < 100) {
				hasMoreResults = false;
			} else {
				currentPage++;
			}
		} catch (error: any) {
			console.error(error.message);
			return new Response('Failed to fetch data', { status: 500 });
		}
	}
	const staticPages = ['/', '/about', '/settings'];
	const xml = sitemap([...staticPages, ...allResults]);

	return new Response(xml, {
		headers: {
			'Content-Type': 'text/xml'
		}
	});
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
