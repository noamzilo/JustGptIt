// UrlShorteningService.js

import apiService from './apiService';

const UrlShorteningService = {
	shorten_url: async (long_url) => {
		try {
			console.log(`UrlShorteningService: shortening URL ${long_url}`);
			const response = await apiService.post('/llm/shorten_url',
				{
					"long_url": long_url,
					"client_host_name": window.location.hostname,
				});

			if (response.status !== 200) {
				throw new Error(`URL Shortening failed: ${response.data}`);
			}
			const url_hash = response.data.url_hash;
			const short_url = window.location.hostname + '/r/' + url_hash;
			console.log(`UrlShorteningService: received short URL ${short_url}`);
			return short_url;
		} catch (error) {
			console.error(`URL Shortening error: `, error);
			throw error;
		}
	},
};

export default UrlShorteningService;
