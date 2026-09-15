import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router

logging.basicConfig(level=logging.INFO)


def create_app() -> FastAPI:
    """Application factory for Summara API."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    # Mount API routes
    app.include_router(api_router)

    return app


app = create_app()
