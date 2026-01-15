import google.generativeai as genai
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

def summarize_text(text: str) -> str:
    text = text.strip()
    if not text:
        return ""

    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY가 설정되어 있지 않습니다. .env를 확인하세요.")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(GEMINI_MODEL)

    prompt = (
        "다음 글을 한국어로 간결하게 요약해줘. "
        "핵심만 3~5문장으로 정리해.\n\n"
        f"{text}"
    )

    resp = model.generate_content(prompt)
    return resp.text.strip()
