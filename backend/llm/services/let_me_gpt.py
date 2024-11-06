import requests
from bs4 import BeautifulSoup
import urllib


def fetch_text_from_url(query):
    # Construct the URL with the query parameter
    encoded_query = urllib.parse.quote(query)
    url = f"https://letmegpt.com/search?q={encoded_query}"
    print(f"url={url}")
    # Send a GET request to the URL
    response = requests.get(url)
    # with (open("response.html", "w")) as f:
    #     f.write(response.text)
    print(f"response={response}")
    print(f"response.status_code={response.status_code}")
    # Check if the request was successful
    if response.status_code == 200:
        print(response.text)
        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the text within the tag <text id="output">
        result = soup.find('span', {'id': 'gptans'})
        if result:
            return result.get_text(strip=True)  # Returns "THE TEXT" without extra spaces
        else:
            return "Output text not found"
    else:
        return f"Error: Unable to fetch URL, status code {response.status_code}"

