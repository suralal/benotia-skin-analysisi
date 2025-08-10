import os, json
import cv2
import numpy as np

from .preprocess import preprocess_pipeline
from .region_masks import coarse_regions_from_landmarks
from .pigmentation import pigmentation_mask
from .wrinkles import wrinkle_mask
from .acne_infer import AcneDetector
from .overlays import overlay_mask, draw_boxes
from .scoring import acne_score, pig_score, wrinkle_score, overall
from app.settings import settings

def run_pipeline(img_path: str, landmarks, run_dir: str):
    os.makedirs(run_dir, exist_ok=True)
    img = cv2.imread(img_path)
    if img is None:
        raise RuntimeError("Failed to read image")

    # Preprocess
    img_p = preprocess_pipeline(img)

    # Regions
    regions, masks = coarse_regions_from_landmarks(landmarks, img.shape)

    # Skin mask = union of regions except eyes/brows/lips (not defined here)
    skin_mask = np.zeros(img.shape[:2], np.uint8)
    for k,m in masks.items():
        skin_mask = cv2.bitwise_or(skin_mask, m)

    # Acne
    acne = AcneDetector(settings.ACNE_ONNX_MODEL)
    dets = acne.infer(img_p, skin_mask)
    acne_mask = np.zeros(img.shape[:2], np.uint8)
    total_area = skin_mask.sum()/255.0
    lesion_area = 0.0
    region_counts = {k:0 for k in masks.keys()}
    for d in dets:
        x1,y1,x2,y2 = d["bbox"]
        lesion_area += (x2-x1)*(y2-y1)
        # region assignment by center
        cx, cy = (x1+x2)//2, (y1+y2)//2
        for rk, rm in masks.items():
            if rm[cy, cx] > 0:
                region_counts[rk] += 1
                break

    # Pigmentation: compute baseline from cheeks if available
    cheeks = cv2.bitwise_or(masks["cheek_left"], masks["cheek_right"])
    pig_mask = pigmentation_mask(img_p, skin_mask=skin_mask, baseline_lab=None, tau=8.0)
    pig_area_pct = (pig_mask.sum()/255.0) / (total_area+1e-6) * 100.0

    # Wrinkles
    wr_mask_total = np.zeros_like(skin_mask)
    region_wr_density = {}
    for k,m in masks.items():
        wmask, ridge = wrinkle_mask(img_p, m, thr=0.65)
        wr_mask_total = cv2.bitwise_or(wr_mask_total, wmask)
        density = (wmask.sum()/255.0) / (m.sum()/255.0 + 1e-6)
        region_wr_density[k] = density

    # Overlays
    acne_overlay = draw_boxes(img, dets)
    pig_overlay = overlay_mask(img, pig_mask, color=(0,255,255), alpha=0.35)
    wr_overlay = overlay_mask(img, wr_mask_total, color=(255,0,0), alpha=0.35)

    cv2.imwrite(os.path.join(run_dir, "acne_overlay.png"), acne_overlay)
    cv2.imwrite(os.path.join(run_dir, "pigmentation_overlay.png"), pig_overlay)
    cv2.imwrite(os.path.join(run_dir, "wrinkles_overlay.png"), wr_overlay)

    # Scores
    count_total = sum(region_counts.values())
    acne_area_norm = lesion_area / (total_area + 1e-6)
    scores = {
        "acne": acne_score(count_total, acne_area_norm),
        "pigmentation": pig_score(pig_area_pct),
        "wrinkles": wrinkle_score(sum(region_wr_density.values())/len(region_wr_density))
    }
    scores["overall"] = overall(scores["acne"], scores["pigmentation"], scores["wrinkles"])

    # Regions report
    regions = {}
    for k in masks.keys():
        regions[k] = {
            "acne_count": int(region_counts.get(k, 0)),
            "pig_area_pct": round(pig_area_pct, 2) if k in ["cheek_left","cheek_right","forehead","nose","chin"] else None,
            "wrinkle_density": round(region_wr_density.get(k, 0.0), 4)
        }

    return {
        "scores": scores,
        "regions": regions,
        "overlays": {
            "acne": f"{run_dir}/acne_overlay.png",
            "pigmentation": f"{run_dir}/pigmentation_overlay.png",
            "wrinkles": f"{run_dir}/wrinkles_overlay.png"
        }
    }
