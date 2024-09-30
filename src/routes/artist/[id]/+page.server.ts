import type { PageServerLoad } from './$types';
import { headers } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const artistUrl = `https://musicbrainz.org/ws/2/artist/${id}?inc=url-rels&fmt=json`;
	const artistRes = await fetch(artistUrl, { headers });
	let extract: string | null = null;
	let extract_html: string | null = null;
	let wikipediaUrl: string | null = null;

	if (!artistRes.ok) {
		throw new Error(`Failed to fetch releases: ${artistRes.status} ${artistRes.statusText}`);
	}
	const artistData = await artistRes.json();
	const wikiDataUrl = artistData.relations.filter(
		(rel: { type: string }) => rel.type === 'wikidata'
	);

	if (wikiDataUrl.length) {
		const entityId = wikiDataUrl[0].url.resource.split('/').pop();
		const wikiDataRes = await fetch(
			`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=sitelinks&format=json&origin=*`
		);
		if (!wikiDataRes.ok) {
			throw new Error(`Failed to fetch wikiData: ${wikiDataRes.status} ${wikiDataRes.statusText}`);
		}
		const wikiDataData = await wikiDataRes.json();
		if (wikiDataData.entities[entityId].sitelinks.enwiki) {
			const wikiTitle = wikiDataData.entities[entityId].sitelinks.enwiki?.title;
			wikipediaUrl = `https://en.wikipedia.org/wiki/${wikiTitle}`;

			const wikipediaRes = await fetch(
				`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`
			);
			if (!wikipediaRes.ok) {
				throw new Error(
					`Failed to fetch Wikipedia data: ${wikipediaRes.status} ${wikipediaRes.statusText}`
				);
			}
			const wikipediaData = await wikipediaRes.json();
			extract = wikipediaData.extract;
			extract_html = wikipediaData.extract_html;
		}
	}

	return {
		name: artistData.name,
		id: artistData.id,
		extract,
		extract_html,
		wikipediaUrl
	};
};
