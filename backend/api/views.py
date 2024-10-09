from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer
from google.cloud import storage
from django.http import HttpResponse
import logging
import os
import sys

print("Views module loaded", file=sys.stderr)

logger = logging.getLogger(__name__)

def test_view(request):
    logger.debug("Test view called")
    return HttpResponse("Test view works")


@api_view(['GET'])
def hello_world(request):
    try:
        with open("/app/build_time.txt", "r") as f: # created during docker build
            build_time = f.read().strip()
    except FileNotFoundError:
        build_time = 'Build time not available'
    return Response({"message": f"Hello, World! Last build time: {build_time}"})

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


def test_gcp(request):
    try:
        # Create a storage client using the credentials from settings
        storage_client = storage.Client(project=settings.GCP_PROJECT_ID, credentials=settings.GCP_CREDENTIALS)
        
        # List buckets in the project
        buckets = list(storage_client.list_buckets())
        
        return HttpResponse(f"Successfully connected to GCP. Found {len(buckets)} buckets.")
    except Exception as e:
        return HttpResponse(f"Error connecting to GCP: {str(e)}")