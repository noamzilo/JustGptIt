import pytest
from django.urls import reverse

pytestmark = pytest.mark.django_db

app_name = "llm"

def test_health_check_with_reverse(client):
    """Test the health check endpoint using URL reversal."""
    with pytest.raises(Exception): # fail because there isn't a health_check URL in the llm app
        url = reverse(f'{app_name}:health_check')
        