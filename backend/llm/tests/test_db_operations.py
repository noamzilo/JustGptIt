import pytest
from llm.models import ShortUrls, Queries

@pytest.mark.django_db
def test_shorturls_crud_operations():
    # CREATE
    short_url = ShortUrls.objects.create(
        llm_query="Sample Query",
        short_url="https://short.url/abc123"
    )
    assert short_url.id is not None  # Ensure that the entry was created

    # READ
    fetched_url = ShortUrls.objects.get(id=short_url.id)
    assert fetched_url.llm_query == "Sample Query"

    # UPDATE
    fetched_url.llm_query = "Updated Query"
    fetched_url.save()
    updated_url = ShortUrls.objects.get(id=short_url.id)
    assert updated_url.llm_query == "Updated Query"

    # DELETE
    fetched_url.delete()
    with pytest.raises(ShortUrls.DoesNotExist):
        ShortUrls.objects.get(id=short_url.id)

@pytest.mark.django_db
def test_queries_crud_operations():
    # CREATE
    query = Queries.objects.create(
        llm_query="Another Sample Query",
        llm_response="Sample response"
    )
    assert query.id is not None  # Ensure that the entry was created

    # READ
    fetched_query = Queries.objects.get(id=query.id)
    assert fetched_query.llm_query == "Another Sample Query"

    # UPDATE
    fetched_query.llm_response = "Updated Response"
    fetched_query.save()
    updated_query = Queries.objects.get(id=query.id)
    assert updated_query.llm_response == "Updated Response"

    # DELETE
    fetched_query.delete()
    with pytest.raises(Queries.DoesNotExist):
        Queries.objects.get(id=query.id)
