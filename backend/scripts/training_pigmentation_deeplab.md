# Training Pigmentation Segmentation (DeepLabV3+/HRNet)

- Create semantic masks where pigmented regions are 1 and background 0.
- Use Albumentations with color-cast, brightness, JPEG artifacts to mimic real phones.
- Score in app via **relative ΔE** to personal baseline to reduce tone bias.
