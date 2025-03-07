import pytest
from django.urls import reverse

app_name = "api"

pytestmark = pytest.mark.django_db

def test_health_check_with_reverse(client):
    """Test the health check endpoint using URL reversal."""
    url = reverse(f'{app_name}:health_check')
    response = client.get(url)
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}