addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;
	console.log(`Url: ${url} Path: ${path}`);

	// Construct GitHub URL to proxy
	const githubUrl = `https://noamzilo.github.io/personal_website/${path}`;

	try {
		// Follow all redirects from GitHub Pages
		let response = await fetch(githubUrl, {
			method: request.method,
			headers: request.headers,
			body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
			redirect: 'follow',  // Follow redirects automatically
		});

		// Clone the response to modify headers if needed
		response = new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});

		// Add necessary headers to prevent any further redirects or unwanted behavior
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.delete('location');  // Remove the location header if any

		return response;

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
