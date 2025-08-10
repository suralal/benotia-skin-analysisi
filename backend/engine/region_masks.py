import numpy as np
import cv2

def _bbox_from_landmarks(landmarks):
    pts = np.array([[p[0], p[1]] for p in landmarks], dtype=np.float32)
    x,y,w,h = cv2.boundingRect(pts)
    return x,y,w,h

def coarse_regions_from_landmarks(landmarks, img_shape):
    # Coarse rectangular regions derived from face bbox (POC). Replace with polygon masks from mesh indices later.
    H, W = img_shape[:2]
    x,y,w,h = _bbox_from_landmarks(landmarks)
    # clamp to image bounds
    x = max(0, x); y = max(0, y)
    w = min(W-x, w); h = min(H-y, h)

    regions = {}
    # Define fractions
    left = x
    right = x + w
    top = y
    bottom = y + h

    # Forehead: top 25% band, middle 60% width
    fx1 = int(left + 0.2*w); fx2 = int(right - 0.2*w)
    fy1 = int(top); fy2 = int(top + 0.25*h)
    regions["forehead"] = (fx1, fy1, fx2, fy2)

    # Nose (T-zone center): middle 40% height, central 18% width
    nx1 = int(left + 0.41*w); nx2 = int(left + 0.59*w)
    ny1 = int(top + 0.25*h); ny2 = int(top + 0.65*h)
    regions["nose"] = (nx1, ny1, nx2, ny2)

    # Cheeks: middle band
    cy1 = int(top + 0.35*h); cy2 = int(top + 0.70*h)
    lcx1 = int(left + 0.05*w); lcx2 = int(left + 0.35*w)
    rcx1 = int(left + 0.65*w); rcx2 = int(left + 0.95*w)
    regions["cheek_left"] = (lcx1, cy1, lcx2, cy2)
    regions["cheek_right"] = (rcx1, cy1, rcx2, cy2)

    # Chin: bottom 18% band, mid 60% width
    chx1 = int(left + 0.2*w); chx2 = int(right - 0.2*w)
    chy1 = int(top + 0.82*h); chy2 = int(bottom)
    regions["chin"] = (chx1, chy1, chx2, chy2)

    # Also make binary masks
    masks = {}
    for k,(x1,y1,x2,y2) in regions.items():
        m = np.zeros((H,W), np.uint8)
        cv2.rectangle(m, (x1,y1), (x2,y2), 255, -1)
        masks[k] = m
    return regions, masks
