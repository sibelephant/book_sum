from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    text: str = Field(..., description="Summary text to convert to audio")
    voice: str = Field('alloy', description="OpenAI voice: alloy, echo, fable, onyx, nova, or shimmer")
