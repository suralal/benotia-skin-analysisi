from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Tuple
import os, io, uuid, json, threading

from .schemas import AnalyzeRequest, AnalyzeResult, RegionMetrics, OverlayPaths
from .settings import settings
from engine.pipeline import run_pipeline
from engine.storage_local import ensure_dir, save_upload
from PIL import Image

app = FastAPI(title="Skin Analysis POC — Track B")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory job store for POC
_JOBS = {}
_LOCK = threading.Lock()

@app.post("/v1/analysis", response_model=AnalyzeResult)
async def analyze(background_tasks: BackgroundTasks,
                  image: UploadFile = File(...),
                  landmarks: str = Form(...)):
    try:
        lms = json.loads(landmarks)
        if not isinstance(lms, list) or len(lms) < 200:
            raise ValueError("Invalid landmarks; expected ~468 points")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Bad landmarks: {e}")

    job_id = str(uuid.uuid4())
    run_dir = os.path.join(settings.RUN_DIR, job_id)
    ensure_dir(run_dir)
    img_path = os.path.join(run_dir, "input.jpg")
    await save_upload(image, img_path)

    with _LOCK:
        _JOBS[job_id] = {"status": "processing"}

    background_tasks.add_task(_process_job, job_id, img_path, lms, run_dir)
    return AnalyzeResult(status="processing", job_id=job_id)

def _process_job(job_id: str, img_path: str, landmarks, run_dir: str):
    try:
        result = run_pipeline(img_path, landmarks, run_dir)
        with _LOCK:
            _JOBS[job_id] = {
                "status": "done",
                "scores": result["scores"],
                "regions": result["regions"],
                "overlays": result["overlays"]
            }
    except Exception as e:
        with _LOCK:
            _JOBS[job_id] = {"status": "error", "message": str(e)}

@app.get("/v1/analysis/{job_id}", response_model=AnalyzeResult)
def get_result(job_id: str):
    data = _JOBS.get(job_id)
    if not data:
        raise HTTPException(status_code=404, detail="job not found")

    resp = {"status": data["status"], "job_id": job_id}
    if data["status"] == "done":
        resp["scores"] = data["scores"]
        resp["regions"] = data["regions"]
        resp["overlays"] = data["overlays"]
    elif data["status"] == "error":
        resp["message"] = data["message"]
    return JSONResponse(resp)
