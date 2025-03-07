import requests

url = "http://localhost:8000/send-email"
data = {
	"name": "John Doe",
	"company": "Acme Corp",
	"email": "johndoe@example.com",
	"phone": "123456789",
	"content": "Looking for a web-based solution."
}

response = requests.post(url, json=data)
print(response.json())
