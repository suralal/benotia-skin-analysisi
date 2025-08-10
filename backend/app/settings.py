from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    ACNE_ONNX_MODEL: str | None = os.getenv("ACNE_ONNX_MODEL")
    RUN_DIR: str = os.getenv("RUN_DIR", "./runs")

settings = Settings()
