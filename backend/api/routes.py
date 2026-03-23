import shutil
import pathlib
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from fastapi import HTTPException
from backend.utils import extract_audio, transcribe_audio, generate_notes, create_pdf

router = APIRouter()

BASE_DIR = pathlib.Path(__file__).parent.parent.parent

UPLOADS_DIR = BASE_DIR / "uploads"
OUTPUTS_DIR = BASE_DIR / "outputs"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/")
def home():
    return {"message": "Video to Notes API"}


@router.post("/video-to-text")
def video_to_text(file: UploadFile = File(...)):
    video_path = UPLOADS_DIR / file.filename
    audio_path = UPLOADS_DIR / f"{file.filename}.mp3"

    with open(video_path, "wb") as v:
        shutil.copyfileobj(file.file, v)

    extract_audio(video_path, audio_path)
    text = transcribe_audio(audio_path)
    return {"status": "success", "text": text}


@router.post("/notes")
def generate(file: UploadFile = File(...)):
    video_path = UPLOADS_DIR / file.filename
    audio_path = UPLOADS_DIR / f"{file.filename}.mp3"
    pdf_path = OUTPUTS_DIR / f"{file.filename}_notes.pdf"

    with open(video_path, "wb") as v:
        shutil.copyfileobj(file.file, v)

    extract_audio(video_path, audio_path)
    text = transcribe_audio(audio_path)
    notes = generate_notes(text)
    create_pdf(notes, filename=str(pdf_path))

    return {"status": "success", "text": text, "notes": notes, "pdf": pdf_path.name}


@router.get("/download/{filename}")
def download_pdf(filename: str):
    path = OUTPUTS_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, media_type="application/pdf", filename=filename)
