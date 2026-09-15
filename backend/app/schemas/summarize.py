from pydantic import BaseModel, Field


class SummarizeTextRequest(BaseModel):
    text: str = Field(..., description="The raw document text to summarize")
    length: str = Field('medium', description="Summary length: 'short', 'medium', or 'detailed'")
    style: str = Field('simple', description="Summary style: 'simple', 'academic', or 'bullets'")


class SummaryResponse(BaseModel):
    summary: str
