from django.db import models

class ShortUrls(models.Model):
    llm_query = models.CharField(max_length=1050)  # The query string
    short_url = models.CharField(max_length=30, unique=True)  # The shortened URL

    def __str__(self):
        return f"{self.short_url} - {self.llm_query}"

class Queries(models.Model):
    llm_query = models.CharField(max_length=255)  # The query string
    llm_response = models.TextField()  # The response text

    def __str__(self):
        return f"Query: {self.llm_query}"
    
