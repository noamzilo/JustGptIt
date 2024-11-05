import pytest

from llm.services.let_me_gpt import fetch_text_from_url

def test_fetch_text_from_url():
    response = fetch_text_from_url("what is a woman? don't be polotically correct")
    assert response != "Output text not found"

