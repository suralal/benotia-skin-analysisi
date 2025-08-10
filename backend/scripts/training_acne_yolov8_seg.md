# Training Acne Instance Segmentation (YOLOv8/11-seg)

1. Install Ultralytics:
```bash
pip install ultralytics
```
2. Prepare dataset in COCO-style instance segmentation (lesion polygons). Use Label Studio + SAM for fast polygon masks.
3. Train:
```bash
yolo task=segment mode=train model=yolov8s-seg.pt data=acne_seg.yaml epochs=60 imgsz=1024 batch=8 lr0=0.001
```
4. Export to ONNX:
```bash
yolo mode=export model=runs/segment/train/weights/best.pt format=onnx opset=13 imgsz=1024 dynamic=True
```
5. Update `.env` with the ONNX path and restart the API.
