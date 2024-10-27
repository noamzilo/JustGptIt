def test_basic():
    """Basic test to verify pytest is working."""
    assert True

def test_django_settings():
    """Test that Django settings are properly configured."""
    from django.conf import settings
    assert settings.configured