import sys
import os
import whisper

def transcribe(video_path, output_dir):
    model = whisper.load_model("base")  # You can change model size here
    result = model.transcribe(video_path)
    text = result["text"]

    # Prepare .srt filename
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    srt_path = os.path.join(output_dir, f"{base_name}.srt")

    # Save subtitles to .srt file
    if "segments" in result:
        with open(srt_path, "w", encoding="utf-8") as srt_file:
            for i, segment in enumerate(result["segments"], start=1):
                start = segment["start"]
                end = segment["end"]
                # Format timestamps as HH:MM:SS,mmm
                def format_timestamp(seconds):
                    h = int(seconds // 3600)
                    m = int((seconds % 3600) // 60)
                    s = int(seconds % 60)
                    ms = int((seconds - int(seconds)) * 1000)
                    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

                srt_file.write(f"{i}\n")
                srt_file.write(f"{format_timestamp(start)} --> {format_timestamp(end)}\n")
                srt_file.write(f"{segment['text'].strip()}\n\n")

    return text, srt_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Error: Usage: python whisper_script.py <path_to_video> <output_dir>")
        sys.exit(1)

    video_path = sys.argv[1]
    output_dir = sys.argv[2]

    try:
        transcript, srt_file = transcribe(video_path, output_dir)
        print(transcript)  # Print transcript to stdout for server.js to capture
        print(srt_file)    # Print srt file path (optional, for debugging)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
