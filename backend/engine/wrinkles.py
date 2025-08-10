import numpy as np
import cv2

def gabor_ridge_map(gray: np.ndarray, scales=(3,5), thetas=(0,30,60,90,120,150)):
    acc = np.zeros_like(gray, dtype=np.float32)
    for s in scales:
        for th in thetas:
            ksize = int(6*s)|1
            kern = cv2.getGaborKernel((ksize, ksize), s, np.deg2rad(th), 10.0, 0.5, 0, ktype=cv2.CV_32F)
            resp = cv2.filter2D(gray, cv2.CV_32F, kern)
            acc = np.maximum(acc, resp)
    acc = (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)
    return acc

def wrinkle_mask(img_bgr: np.ndarray, region_mask: np.ndarray, thr: float = 0.65):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    ridge = gabor_ridge_map(gray)
    ridge[region_mask==0] = 0.0
    mask = (ridge > thr).astype(np.uint8)*255
    # thin lines slightly
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    return mask, ridge
