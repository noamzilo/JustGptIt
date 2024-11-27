addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;

	console.log(`Incoming request URL: ${url}, Path: ${path}`);

	// Handle /r/{somehash} redirects
	if (path.startsWith('/r/')) {
		const hash = path.substring(3); // Extract "somehash" from "/r/{somehash}"
		// const backendUrl = `http://personal-website-backend-839353010571.us-central1.run.app/llm/redirect/${hash}`;
		const backendUrl = `http://localhost:8080/llm/expand_hash/${hash}`;

		try {
			console.log(`Fetching URL from backend: ${backendUrl}`);

			// Fetch the URL from the backend
			const response = await fetch(backendUrl, {
				method: 'GET',
				headers: request.headers,
			});

			if (!response.ok) {
				throw new Error(`Backend responded with status ${response.status}`);
			}

			console.log(response);

			// Assume backend returns JSON with { "long_url": "http://localhost:8787/?query=asd1" }
			const data = await response.json();
			const resolvedUrl = data.long_url;

			if (!resolvedUrl) {
				throw new Error('No URL found in backend response');
			}

			console.log(`Resolved URL from backend: ${resolvedUrl}`);

			return Response.redirect(resolvedUrl, 302);
		} catch (error) {
			console.error(`Error resolving /r/${hash}: ${error.message}`);
			return new Response(`Error resolving the redirect: ${error.message}`, {
				status: 502,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	}

	// Handle static file requests
	if (path.startsWith('/static/') || path.startsWith('/assets/')) {
		const staticUrl = `https://noamzilo.github.io/personal_website${path}`;
		try {
			const staticResponse = await fetch(staticUrl, {
				method: 'GET',
				headers: request.headers,
				redirect: 'follow',
			});

			if (!staticResponse.ok && staticResponse.status !== 404) {
				throw new Error(`Static file fetch failed with status ${staticResponse.status}`);
			}

			return staticResponse;
		} catch (error) {
			console.error(`Error fetching static file: ${error.message}`);
			return new Response(`Error fetching static file: ${error.message}`, {
				status: 502,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	}

	// Default behavior: Proxy other requests to GitHub Pages
	const githubUrl = `https://noamzilo.github.io/personal_website${path}`;
	try {
		let response = await fetch(githubUrl, {
			method: request.method,
			headers: request.headers,
			body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
			redirect: 'follow',
		});

		if (response.status === 404) {
			// Serve index.html for client-side routing
			const indexUrl = `https://noamzilo.github.io/personal_website/index.html`;
			response = await fetch(indexUrl, {
				method: 'GET',
				redirect: 'follow',
			});
		}

		// Clone and modify headers
		let newHeaders = new Headers(response.headers);
		newHeaders.set('Access-Control-Allow-Origin', '*');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	} catch (error) {
		console.error(`Error fetching GitHub Pages: ${error.message}`);
		return new Response(`Error fetching GitHub Pages: ${error.message}`, {
			status: 502,
			headers: { 'Content-Type': 'text/plain' },
		});
	}
}
