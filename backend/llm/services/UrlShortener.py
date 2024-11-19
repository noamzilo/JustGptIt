from llm.models import ShortUrls
import hashlib
import string
from django.db import IntegrityError

class UrlShortener:
    @staticmethod
    def hash_url(long_url, length=8):
        """
        Generate a deterministic hash for the long URL.
        """
        base62_chars = string.ascii_letters + string.digits
        hash_object = hashlib.sha256(long_url.encode())
        hash_int = int(hash_object.hexdigest(), 16)  # Convert hash to integer
        base62 = []
        while hash_int > 0:
            hash_int, remainder = divmod(hash_int, 62)
            base62.append(base62_chars[remainder])
        return ''.join(reversed(base62[:length]))

    @staticmethod
    def create_hash(long_url):
        """
        Create a URL hash for the given long URL. Insert into the database and
        do nothing if the record already exists (no duplicates allowed).
        """
        url_hash = UrlShortener.hash_url(long_url)
        try:
            # Try to create the new mapping
            ShortUrls.objects.create(long_url=long_url, url_hash=url_hash)
        except IntegrityError as ex:
            # If the IntegrityError occurs, check if it already exists
            existing_entry = ShortUrls.objects.filter(long_url=long_url).first()
            if existing_entry:
                url_hash = existing_entry.url_hash
            else:
                raise ex
        return url_hash

    @staticmethod
    def expand(url_hash):
        """
        Retrieve the long URL for a given URL hash.
        """
        try:
            entry = ShortUrls.objects.get(url_hash=url_hash)
            return entry.long_url
        except ShortUrls.DoesNotExist:
            raise ValueError(f"Short URL does not exist: {url_hash}")
        except ShortUrls.MultipleObjectsReturned:
            raise ValueError(f"Multiple entries found for the short URL: {url_hash}")
