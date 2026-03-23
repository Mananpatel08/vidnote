import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL")
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.4"))
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2048"))
    CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "6000"))
    CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))
