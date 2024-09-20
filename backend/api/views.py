from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Project
from .serializers import ProjectSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, World!"})

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"}, status=status.HTTP_200_OK)

class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer