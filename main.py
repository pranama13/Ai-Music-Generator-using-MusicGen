import os
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scipy.io.wavfile import write
import torch
from transformers import MusicgenForConditionalGeneration, AutoProcessor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Music Generation API", description="Generate music using AI", version="1.0")
from fastapi.staticfiles import StaticFiles

app.mount("/generated_audio", StaticFiles(directory="generated_audio"), name="generated_audio")
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
device = "cpu"

try:
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small").to(device)
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    print("Model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"Error loading model: {e}")

AUDIO_STORAGE_PATH = "generated_audio"
os.makedirs(AUDIO_STORAGE_PATH, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "MusicGen API is running. Use /docs for API documentation."}

class MusicRequest(BaseModel):
    prompt: str
    duration: int = 10  


@app.post("/generate-music")
def generate_music(request: MusicRequest):
    try:
        print(f"Received request: {request.prompt}, duration: {request.duration}s")

        inputs = processor(text=[request.prompt], return_tensors="pt").to(device)

        
        with torch.no_grad():
            audio_values = model.generate(
                **inputs,
                do_sample=True,
                max_new_tokens=request.duration * 50  
            )

        print("Generated audio values:", audio_values.shape)

        
        audio_waveform = audio_values[0].cpu().detach().numpy().squeeze()
        audio_waveform = (audio_waveform * 32767).astype(np.int16)
        filename = f"{AUDIO_STORAGE_PATH}/{np.random.randint(1, 100000)}.wav"
        write(filename, 32000, audio_waveform)
        print(f"Generated music saved: {filename}")

        return {"audio_url": f"/{filename}"}

    except Exception as e:
        print("Error generating music:", str(e))
        raise HTTPException(status_code=500, detail=f"Error generating music: {str(e)}")
