addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;
	console.log(`Url: ${url} Path: ${path}`);

	// Construct GitHub URL to proxy
	const githubUrl = `https://noamzilo.github.io/personal_website${path}`;

	try {
		// Fetch the resource from GitHub Pages
		let response = await fetch(githubUrl, {
			method: request.method,
			headers: request.headers,
			body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
			redirect: 'follow', // Follow redirects automatically
		});

		// If the response is 404, serve index.html for client-side routing
		if (response.status === 404) {
			const indexUrl = `https://noamzilo.github.io/personal_website/index.html`;
			response = await fetch(indexUrl, {
				method: 'GET',
				redirect: 'follow',
			});
		}

		// Clone the response to modify headers
		let newHeaders = new Headers(response.headers);

		// Add CORS header
		newHeaders.set('Access-Control-Allow-Origin', '*');
		newHeaders.delete('location'); // Remove the location header if any

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});

	} catch (error) {
		// If there's an error, return a 502 response
		return new Response('Error fetching from GitHub: ' + error.message, {
			status: 502,
			headers: {
				'Content-Type': 'text/plain',
			},
		});
	}
}
