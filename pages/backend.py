# backend.py
from fastapi import FastAPI, File, UploadFile, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
import numpy as np  # type: ignore
import cv2  # type: ignore
from keras.models import load_model  # type: ignore
from typing import Dict

app = FastAPI()

# 1. Allow frontend calls (React @ localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # <- should be 3000 for React frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load model once at startup
try:
    model = load_model("sign_language_model.h5")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# 3. Mapping indices to ASL letters
index_to_letter = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E',
    5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'K',
    10: 'L', 11: 'M', 12: 'N', 13: 'O', 14: 'P',
    15: 'Q', 16: 'R', 17: 'S', 18: 'T', 19: 'U',
    20: 'V', 21: 'W', 22: 'X', 23: 'Y', 24: 'Z'
}

# 4. Constants
box_width, box_height = 200, 200

@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, str]:
    # Read image bytes and decode into OpenCV image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file uploaded.")

    # Preprocess: crop, grayscale, resize, normalize, reshape
    cropped = img[0:box_height, 0:box_width]
    gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (28, 28))
    normalized = resized.astype("float32") / 255.0
    x = np.expand_dims(normalized, axis=(0, -1))  # shape: (1, 28, 28, 1)

    # Prediction
    preds = model.predict(x)[0]
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])

    if confidence < 0.6:
        return {"letter": "❌ Result not confident enough. Try again, Monarch."}

    result_letter = index_to_letter.get(idx, "?")
    return {"letter": f"👑 YOUR LETTER IS HERE MONARCH : {result_letter}"}
