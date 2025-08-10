import os, shutil
from fastapi import UploadFile

def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)

async def save_upload(file: UploadFile, dest: str):
    with open(dest, "wb") as f:
        while True:
            chunk = await file.read(1024*1024)
            if not chunk:
                break
            f.write(chunk)
    return dest
