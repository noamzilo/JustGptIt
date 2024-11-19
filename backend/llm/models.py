from django.db import models

class ShortUrls(models.Model):
    long_url = models.CharField(max_length=1050, unique=True)  # The long URL, must be unique
    url_hash = models.CharField(max_length=8, unique=True)     # The URL hash, must be unique

    def __str__(self):
        return f"{self.url_hash} - {self.long_url}"

class Queries(models.Model):
    llm_query = models.CharField(max_length=255, unique=True)  # The query string
    llm_response = models.TextField()                          # The response text

    def __str__(self):
        return f"Query: {self.llm_query}"
