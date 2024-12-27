import os
import openai
from constants import OPENAI_API_KEY

def fetch_openai_response(query, api_key=OPENAI_API_KEY):
	client = openai.OpenAI(api_key=api_key)
	
	try:
		response = client.chat.completions.create(
			model="gpt-3.5-turbo",
			messages=[
				{"role": "user", "content": query}
			]
		)
		return response.choices[0].message.content
	except Exception as e:
		return f"Error: {str(e)}"
