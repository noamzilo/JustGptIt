import requests
from bs4 import BeautifulSoup
import urllib

def fetch_text_from_url(query):
    # Construct the URL with the query parameter
    encoded_query = urllib.parse.quote(query)
    url = f"https://letmegpt.com/search?q={encoded_query}"
    response = requests.get(url)
    # response = requests.get("https://chatgpt.com/share/672b9dd4-1bd4-8002-88d2-ea0b621490be")
    # with (open("response.html", "w")) as f:
    #     f.write(response.text)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        result = soup.find('span', {'id': 'gptans'})
        if result:
            return result.get_text(strip=True)  # Returns "THE TEXT" without extra spaces
        else:
            return "Output text not found"
    else:
        return f"Error: Unable to fetch URL, status code {response.status_code}"

