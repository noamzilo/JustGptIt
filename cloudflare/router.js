addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;
	console.log(`Url: ${url} Path: ${path}`);

	// Handle static files (e.g., /r/static/js/... or /r/static/css/...)
	if (path.startsWith('/r/static/')) {
		// Rewrite to fetch from GitHub Pages (or another static host)
		const staticUrl = `https://noamzilo.github.io/personal_website${path.replace('/r', '')}`;
		try {
			const staticResponse = await fetch(staticUrl, {
				method: request.method,
				headers: request.headers,
				redirect: 'follow',
			});
			return staticResponse;
		} catch (error) {
			return new Response('Error fetching static file: ' + error.message, {
				status: 502,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}
	}

	// Handle `/r/{somehash}` logic
	if (path.startsWith('/r/')) {
		const hash = path.substring(3); // Removes "/r/"
		const backendUrl = `http://personal-website-backend-839353010571.us-central1.run.app/llm/redirect/${hash}`;

		try {
			const response = await fetch(backendUrl, {
				method: request.method,
				headers: request.headers,
				body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
				redirect: 'follow',
			});
			let newHeaders = new Headers(response.headers);
			newHeaders.set('Access-Control-Allow-Origin', '*');
			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		} catch (error) {
			return new Response('Error fetching from backend: ' + error.message, {
				status: 502,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}
	}

	// Default behavior (proxy to GitHub Pages)
	const githubUrl = `https://noamzilo.github.io/personal_website${path}`;
	try {
		let response = await fetch(githubUrl, {
			method: request.method,
			headers: request.headers,
			body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
			redirect: 'follow',
		});

		if (response.status === 404) {
			const indexUrl = `https://noamzilo.github.io/personal_website/index.html`;
			response = await fetch(indexUrl, {
				method: 'GET',
				redirect: 'follow',
			});
		}

		let newHeaders = new Headers(response.headers);
		newHeaders.set('Access-Control-Allow-Origin', '*');
		newHeaders.delete('location');
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	} catch (error) {
		return new Response('Error fetching from GitHub: ' + error.message, {
			status: 502,
			headers: {
				'Content-Type': 'text/plain',
			},
		});
	}
}
