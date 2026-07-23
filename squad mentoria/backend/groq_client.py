import json
import re
from groq import AsyncGroq
from config import settings

groq_client = AsyncGroq(api_key=settings.groq_api_key)


async def call_groq(system_prompt: str, user_prompt: str,
                    model: str = "llama-3.3-70b-versatile",
                    temperature: float = 0.3,
                    max_tokens: int = 2000) -> str:
    completion = await groq_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return completion.choices[0].message.content or ""


async def call_groq_json(system_prompt: str, user_prompt: str, **kwargs) -> dict:
    raw = await call_groq(system_prompt, user_prompt, **kwargs)
    if not raw.strip():
        return {"error": "empty_response", "note": "Groq returned empty"}

    # Try JSON parsing
    cleaned = raw.strip()
    cleaned = re.sub(r"```json\s*|\s*```", "", cleaned)

    # Try to find JSON in the response
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to extract JSON object from text
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        return {"raw": cleaned, "note": "Could not parse as JSON"}
