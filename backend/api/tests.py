# import requests

# url = "http://localhost:8000/send-email"
# data = {
# 	"name": "John Doe",
# 	"company": "Acme Corp",
# 	"email": "johndoe@example.com",
# 	"phone": "123456789",
# 	"content": "Looking for a web-based solution."
# }

# response = requests.post(url, json=data)
# print(response.json())

# """
# curl -X POST http://127.0.0.1:8000/api/send-email      -H "Content-Type: application/json"      -d '{
#            "name": "John Doe",
#            "company": "Acme Corp",
#            "email": "johndoe@example.com",
#            "phone": "123456789",
#            "content": "Looking for a web-based solution."
#          }'
# """



import smtplib

EMAIL_HOST = "smtp.zoho.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "contact@yaksano.com"  # Full Zoho email
EMAIL_HOST_PASSWORD = "mypass"  # Use App Password

try:
    server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
    server.starttls()
    server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
    print("✅ Successfully logged in to Zoho SMTP!")
    server.quit()
except Exception as e:
    print(f"❌ SMTP Login Failed: {e}")
