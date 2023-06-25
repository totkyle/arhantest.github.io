import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Edge, PinnedRepo } from '../../../util/types';

async function getPinnedRepos(username: string): Promise<PinnedRepo[]> {
	const query = `
    query {
      repositoryOwner(login: "${username}") {
        ... on User {
          pinnedItems(first: 6, types: REPOSITORY) {
            edges {
              node {
                ... on Repository {
                  name: nameWithOwner
                  owner: owner {
                    avatarUrl
                    login
                  }
                  stars: stargazerCount
                  forks: forkCount
                  url
                  description
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_SECRET_API_KEY}`
			},
			body: JSON.stringify({ query })
		});

		if (!response.ok) {
			throw new Error(`GraphQL request failed with status ${response.status}`);
		}

		const json = await response.json();
		const pinnedRepos: PinnedRepo[] = json.data.repositoryOwner.pinnedItems.edges.map(
			(edge: Edge) => edge.node
		);
		return pinnedRepos;
	} catch (error) {
		console.error('GraphQL request error:', error);
		throw new Error('Failed to fetch pinned repositories!');
	}
}


export const GET: RequestHandler = async (event) => {
	const repos = await getPinnedRepos('xafn');
	event.setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=60' });
	return json(repos);
};
