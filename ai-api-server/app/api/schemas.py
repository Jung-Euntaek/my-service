from pydantic import BaseModel
from typing import List

class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    result: str
    history_id: int

class HistoryItem(BaseModel):
    id: int
    timestamp: str
    action: str
    model: str

class HistoryListResponse(BaseModel):
    items: List[HistoryItem]

class HistoryDetailResponse(BaseModel):
    id: int
    timestamp: str
    action: str
    model: str
    input: str
    output: str

class DeleteResponse(BaseModel):
    ok: bool
