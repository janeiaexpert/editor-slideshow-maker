import os
from dotenv import load_dotenv

# Load .env.local from project root
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local")
if os.path.exists(env_path):
    load_dotenv(env_path)


class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "8701405849:AAFEPDTXtQEtXM3XZqSn7XRZ5KxSuu9Ke1s")
    database_url: str = "sqlite+aiosqlite:///./mentorship.db"
    app_name: str = "Mentorship Intelligence OS"
    debug: bool = True


settings = Settings()
