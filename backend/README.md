# Skin Analysis POC — Track B (Own Models)

FastAPI backend that accepts a selfie and face landmarks (468 points), then:
- Normalizes lighting/color (Retinex + gamma)
- Builds coarse **region masks** (forehead, cheeks L/R, nose/T-zone, chin) from the landmark bbox
- Runs **acne**, **pigmentation**, and **wrinkle** analysis
  - Acne: ONNX YOLO-seg if provided, else classical blob/redness fallback
  - Pigmentation: personal baseline in CIELAB + ΔE threshold with shadow suppression
  - Wrinkles: multi-orientation Gabor ridge map → density per region
- Scores each condition and returns JSON + PNG overlays

This POC is CPU-friendly. GPU/ONNX/TensorRT can be added later.

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# run
uvicorn app.main:app --reload --port 8000
```

### Request (multipart)
```bash
curl -X POST http://localhost:8000/v1/analysis   -F "image=@/path/to/selfie.jpg"   -F 'landmarks=[ [100,120,0], [110,130,0], ... ]'
```

### Poll
```bash
curl http://localhost:8000/v1/analysis/{job_id}
```

### Env
Copy `.env.example` to `.env` and set paths if you have an ONNX model for acne:
```
ACNE_ONNX_MODEL=./models/acne_yolov8_seg.onnx
```

### Notes
- Region masks here are **coarse** (derived from the face bbox) to keep the POC simple. Replace with precise polygon masks from your 468-point indices for better accuracy.
- If `ACNE_ONNX_MODEL` is missing, the pipeline falls back to a redness/blob detector.
- Overlays are written to `./runs/{job_id}/`.
