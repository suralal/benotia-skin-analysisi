import numpy as np
import cv2

def rgb2lab(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

def deltaE(lab1, lab2):
    # CIE76
    return np.sqrt(np.sum((lab1.astype(np.float32) - lab2.astype(np.float32))**2, axis=2))

def pigmentation_mask(img_bgr: np.ndarray, skin_mask: np.ndarray, baseline_lab=None, tau: float = 8.0):
    lab = rgb2lab(img_bgr)
    if baseline_lab is None:
        # compute baseline from pixels within mask (assume cheeks mask already applied when passed)
        mean = np.median(lab[skin_mask>0], axis=0)
        baseline_lab = mean
    # ΔE relative to baseline
    de = deltaE(lab, baseline_lab)
    # suppress strong shading edges
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    grad = cv2.Laplacian(gray, cv2.CV_32F, ksize=3)
    grad = np.abs(grad)
    grad = (grad - grad.min()) / (grad.max() - grad.min() + 1e-6)
    shadow_edges = (grad > 0.6)
    # threshold
    mask = (de > tau).astype(np.uint8)*255
    mask[shadow_edges] = 0
    mask[skin_mask==0] = 0
    # cleanup
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=1)
    return mask
