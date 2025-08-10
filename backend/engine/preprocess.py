import cv2
import numpy as np

def msrcr(img_bgr: np.ndarray, scales=(15, 80, 250), weight=None) -> np.ndarray:
    # Multi-Scale Retinex with Color Restoration (simplified)
    img = img_bgr.astype(np.float32) + 1.0
    log_img = np.log(img)
    if weight is None:
        weight = [1/len(scales)] * len(scales)
    msr = np.zeros_like(img)
    for w, s in zip(weight, scales):
        blur = cv2.GaussianBlur(img, (0,0), s)
        msr += w * (log_img - np.log(blur + 1.0))
    # color restoration
    sum_rgb = np.sum(img, axis=2, keepdims=True)
    c = 46.0
    msrcr_img = c * (np.log(c*img) - np.log(sum_rgb + 1.0)) * msr
    msrcr_img = cv2.normalize(msrcr_img, None, 0, 255, cv2.NORM_MINMAX)
    return msrcr_img.astype(np.uint8)

def adaptive_gamma(img_bgr: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    mean = np.mean(gray)/255.0
    gamma = 0.7 if mean < 0.4 else (1.0 if mean < 0.6 else 1.2)
    inv = 1.0/gamma
    lut = np.array([((i/255.0) ** inv) * 255 for i in range(256)]).astype("uint8")
    return cv2.LUT(img_bgr, lut)

def specular_suppress(img_bgr: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    h,s,v = cv2.split(hsv)
    mask = (v > 245) & (s < 25)
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask.astype(np.uint8)*255, cv2.MORPH_CLOSE, kernel, iterations=1)
    res = img_bgr.copy()
    res[mask>0] = cv2.inpaint(res, mask, 3, cv2.INPAINT_TELEA)[mask>0]
    return res

def preprocess_pipeline(img_bgr: np.ndarray) -> np.ndarray:
    x = msrcr(img_bgr)
    x = adaptive_gamma(x)
    x = specular_suppress(x)
    return x
