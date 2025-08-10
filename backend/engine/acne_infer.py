import os
import numpy as np
import cv2
from typing import List, Dict, Tuple

try:
    import onnxruntime as ort
except Exception:
    ort = None

def _postprocess_yolo_seg(outputs, img_shape):
    # Placeholder: expects boxes [N, 6] (x1,y1,x2,y2,conf,cls) and masks separate
    # For the POC, we return empty list; integrate real post later.
    return []

class AcneDetector:
    def __init__(self, onnx_path: str | None):
        self.onnx_path = onnx_path if onnx_path and os.path.exists(onnx_path) else None
        self.session = None
        if self.onnx_path and ort is not None:
            self.session = ort.InferenceSession(self.onnx_path, providers=["CPUExecutionProvider"])

    def infer(self, img_bgr: np.ndarray, skin_mask: np.ndarray) -> List[Dict]:
        if self.session is not None:
            # TODO: real preproc for YOLO-seg
            # For now, return classical fallback as a stub until a model is provided.
            pass
        return self._classical_fallback(img_bgr, skin_mask)

    def _classical_fallback(self, img_bgr: np.ndarray, skin_mask: np.ndarray) -> List[Dict]:
        # Simple redness/blob detection tuned for brown skin
        blur = cv2.medianBlur(img_bgr, 3)
        lab = cv2.cvtColor(blur, cv2.COLOR_BGR2LAB)
        L, a, b = cv2.split(lab)
        # acne tends to have higher a* (redness) and slightly lower L
        a_norm = cv2.normalize(a, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        L_inv = 255 - L
        score = cv2.addWeighted(a_norm, 0.7, L_inv, 0.3, 0)
        score[skin_mask==0] = 0
        _, mask = cv2.threshold(score, 0, 255, cv2.THRESH_OTSU)
        kernel = np.ones((3,3), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        # connected components
        num, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)
        results = []
        for i in range(1, num):
            x,y,w,h,area = stats[i]
            if area < 6 or area > 400:  # filter extreme sizes
                continue
            cx, cy = centroids[i]
            results.append({"bbox":[int(x),int(y),int(x+w),int(y+h)], "area": int(area), "conf": 0.3})
        return results
