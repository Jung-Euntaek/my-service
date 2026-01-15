from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router as api_router
from app.db.sqlite import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    init_db()
    yield
    # shutdown (필요하면 여기에 정리 코드)

app = FastAPI(
    title="AI API Server",
    lifespan=lifespan,
)

app.include_router(api_router, prefix="/api")
