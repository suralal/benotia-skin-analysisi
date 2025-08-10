import numpy as np
import cv2

def overlay_mask(img_bgr: np.ndarray, mask: np.ndarray, color=(0,255,0), alpha=0.35):
    color_mask = np.zeros_like(img_bgr)
    color_mask[mask>0] = color
    return cv2.addWeighted(img_bgr, 1.0, color_mask, alpha, 0)

def draw_boxes(img_bgr: np.ndarray, boxes, color=(0,0,255)):
    out = img_bgr.copy()
    for b in boxes:
        x1,y1,x2,y2 = b["bbox"]
        cv2.rectangle(out, (x1,y1), (x2,y2), color, 2)
    return out
