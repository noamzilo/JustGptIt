import requests
from bs4 import BeautifulSoup


def fetch_text_from_url(query):
    # Construct the URL with the query parameter
    url = f"https://letmegpt.com/search?q={query}"

    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the text within the tag <text id="output">
        result = soup.find('text', {'id': 'output'})
        if result:
            return result.get_text(strip=True)  # Returns "THE TEXT" without extra spaces
        else:
            return "Output text not found"
    else:
        return f"Error: Unable to fetch URL, status code {response.status_code}"

