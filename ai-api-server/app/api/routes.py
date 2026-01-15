from fastapi import APIRouter, HTTPException
from app.services.summarize import summarize_text
from app.db.sqlite import insert_history, list_history, get_history, delete_history
from app.core.config import GEMINI_MODEL

from app.api.schemas import (
    SummarizeRequest,
    SummarizeResponse,
    HistoryListResponse,
    HistoryDetailResponse,
    DeleteResponse,
)

router = APIRouter()

@router.get("/")
def api_root():
    return {"message": "API 서버 정상 작동 중"}

@router.get("/health")
def health():
    return {"ok": True}

@router.post("/summarize", response_model=SummarizeResponse)
def summarize(req: SummarizeRequest):
    result = summarize_text(req.text)
    history_id = insert_history(
        action="summary",
        model=GEMINI_MODEL,
        input_text=req.text,
        output_text=result,
    )
    return {"result": result, "history_id": history_id}

@router.get("/history", response_model=HistoryListResponse)
def history_list(limit: int = 50):
    return {"items": list_history(limit=limit)}

@router.get("/history/{history_id}", response_model=HistoryDetailResponse)
def history_detail(history_id: int):
    row = get_history(history_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not Found")
    return row

@router.post("/history/{history_id}/delete", response_model=DeleteResponse)
def history_delete(history_id: int):
    ok = delete_history(history_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Not Found")
    return {"ok": ok}
