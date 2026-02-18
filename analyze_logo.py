
from PIL import Image, ImageOps
import sys

def analyze_image(path):
    try:
        img = Image.open(path).convert('L') # Grayscale
        # Invert if it's mostly black (assuming content is light) to find content
        # Or just look for non-black pixels.
        # User image "Hackster Sec" had white skull on black.
        # So we look for pixels > threshold.
        
        # Get bounding box of non-black content
        bbox = img.getbbox()
        if bbox:
            print(f"Content Bounding Box: {bbox}")
            width = bbox[2] - bbox[0]
            height = bbox[3] - bbox[1]
            print(f"Content Size: {width}x{height}")
            
            # Simple heuristic: if width >> height, it's landscape text.
            # We want the square part on the left (icon)?
            # Or maybe the content is small and centered.
        else:
            print("Image appears to be completely black/empty.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_image(r"d:\SociaVerse\sociaverse-frontend\sociaverse-frontend\public\logo.png")
