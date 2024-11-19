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
		hash_input = long_url
		hash_object = hashlib.sha256(hash_input.encode())
		hash_int = int(hash_object.hexdigest(), 16)  # Convert hash to integer
		base62 = []
		while hash_int > 0:
			hash_int, remainder = divmod(hash_int, 62)
			base62.append(base62_chars[remainder])
		return ''.join(reversed(base62[:length]))  

	@staticmethod
	def shorten(long_url):
		"""
		Create a short URL for the given long URL. Insert into the database and
		do nothing if the record already exists (no duplicates allowed).
		"""
		short_url = UrlShortener.hash_url(long_url)
		try:
			# Try to create the new mapping
			ShortUrls.objects.create(long_url=long_url, short_url=short_url)
			return short_url
		except IntegrityError:
			# If the IntegrityError occurs, check if it already exists
			existing_entry = ShortUrls.objects.filter(long_url=long_url).first()
			if existing_entry:
				return existing_entry.short_url


	@staticmethod
	def expand(short_url):
		"""
		Retrieve the long URL for a given short URL.
		"""
		try:
			entry = ShortUrls.objects.get(short_url=short_url)
			if entry:
				return entry.long_url
		except ShortUrls.DoesNotExist:
			raise ValueError(f"Short URL does not exist. {short_url}")
		except ShortUrls.MultipleObjectsReturned:
			raise ValueError(f"Multiple entries found for the short URL. Should be impossible. {short_url}")
