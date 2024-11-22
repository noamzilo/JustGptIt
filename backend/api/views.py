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



