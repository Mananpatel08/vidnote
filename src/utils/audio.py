import subprocess


def extract_audio(video_path, audio_path):
    """
    Extract audio from a video file.
    
    Args:
        video_path: Path to the video file.
        audio_path: Path to the audio file.

    Returns:
        None
    """
    command = ["ffmpeg", "-i", video_path, "-vn", "-acodec", "mp3", audio_path]
    subprocess.run(command)
