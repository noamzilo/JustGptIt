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
from constants import backend_version_name, DEPLOY_TIME, BUILD_TIME

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

class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


def llm(request):
    # parse a POST request parameter with a string of the query the user would like to pass on to gpt. Return the response from gpt.

    # get the query from the POST request
    query = request.POST.get('query', None)
    if query is None:
        return HttpResponse("No query provided", status=400)
    
    # simulate the gpt response
    response = f"Response from GPT: {query}"
    return HttpResponse(response)