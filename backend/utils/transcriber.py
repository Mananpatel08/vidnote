import whisper
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("medium", device=device)


def transcribe_audio(audio_path: str) -> str:
    result = model.transcribe(
        str(audio_path), language="en", fp16=torch.cuda.is_available()
    )

    # Remove repeated sentences (hallucination artifact)
    lines = result["text"].split(". ")
    seen = set()
    clean = []
    for line in lines:
        stripped = line.strip()
        if stripped and stripped not in seen:
            seen.add(stripped)
            clean.append(stripped)

    return ". ".join(clean)
