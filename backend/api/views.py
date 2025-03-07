import json
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from google.cloud import storage
from django.http import HttpResponse, JsonResponse
import logging
import os
import sys
from constants import backend_version_name, DEPLOY_TIME, BUILD_TIME
from django.views.decorators.csrf import csrf_exempt
from config.settings import EMAIL_HOST_USER
from django.core.mail import EmailMessage

print("Views module loaded", file=sys.stderr)

logger = logging.getLogger(__name__)

def test_view(request):
    logger.debug("Test view called")
    return HttpResponse("Test view works")


@api_view(['GET'])
def version(request):
    version = backend_version_name
    return Response({
        "version": f"{version}",
        "docker_build_time": f"{BUILD_TIME}",
        "deploy_time": f"{DEPLOY_TIME}"
    })

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

import json

@csrf_exempt
@api_view(['POST'])
def send_email(request):
	try:
		# Debugging: Print the raw request body
		print("Raw body:", request.body)

		# Check Content-Type
		print("Content-Type:", request.content_type)

		# Parse JSON
		data = json.loads(request.body.decode('utf-8'))

		# Debug parsed data
		print("Parsed Data:", data)

		name = data.get('name')
		company = data.get('company')
		email = data.get('email')
		phone = data.get('phone')
		content = data.get('content')

		if not all([name, company, email, phone, content]):
			return JsonResponse({'error': 'All fields are required'}, status=400)

		subject = "New Project Inquiry"
		message = f"""
		New inquiry received:
		
		Name: {name}
		Company: {company}
		Email: {email}
		Phone: {phone}
		Content: {content}
		"""

		from django.core.mail import send_mail
		email = EmailMessage(
			subject=subject,
			body=message,
			from_email=EMAIL_HOST_USER,
			to=['contact@yaksano.com'],
			bcc=['winnersalmostwin@gmail.com']
		)
		email.send(fail_silently=False)

		return JsonResponse({'message': 'Email sent successfully'})

	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=400)
	except Exception as e:
		return JsonResponse({'error': str(e)}, status=500)
