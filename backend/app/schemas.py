from pydantic import BaseModel, Field
from typing import List, Tuple, Optional, Dict

class Pose(BaseModel):
    yaw: float | None = None
    pitch: float | None = None
    roll: float | None = None

class Device(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None

class CaptureInfo(BaseModel):
    gamma: Optional[float] = None
    lux: Optional[float] = None
    pose: Optional[Pose] = None

class AnalyzeRequest(BaseModel):
    landmarks: List[Tuple[float, float, float]] = Field(..., description="List of 468 3D face landmarks")
    device: Optional[Device] = None
    capture: Optional[CaptureInfo] = None

class OverlayPaths(BaseModel):
    acne: Optional[str] = None
    pigmentation: Optional[str] = None
    wrinkles: Optional[str] = None

class RegionMetrics(BaseModel):
    acne_count: int | None = None
    pig_area_pct: float | None = None
    wrinkle_density: float | None = None

class AnalyzeResult(BaseModel):
    status: str
    job_id: str
    scores: Dict[str, float] | None = None
    regions: Dict[str, RegionMetrics] | None = None
    overlays: OverlayPaths | None = None
    message: Optional[str] = None
