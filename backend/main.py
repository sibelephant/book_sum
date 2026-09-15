"""Entry point for the backend service.

Re-exports the FastAPI app from `app.main` for Uvicorn and deployment compatibility.
"""
from app.main import app, create_app

__all__ = ['app', 'create_app']

if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
