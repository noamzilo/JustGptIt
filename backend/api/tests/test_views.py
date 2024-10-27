import pytest
from django.urls import reverse

pytestmark = pytest.mark.django_db

def test_health_check_with_reverse(client):
    """Test the health check endpoint using URL reversal."""
    url = reverse('health_check')
    response = client.get(url)
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}