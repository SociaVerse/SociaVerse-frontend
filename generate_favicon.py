
from PIL import Image, ImageDraw, ImageOps
import os

def create_favicon(input_path, output_path):
    print(f"Processing {input_path}...")
    
    try:
        # Open the original logo
        img = Image.open(input_path).convert("RGBA")
        
        # Create a new square background (black, as requested for other components)
        # Size 256x256 for good quality ico
        size = (256, 256)
        background = Image.new('RGBA', size, (0, 0, 0, 255))
        
        # Calculate resize to fit within the square with some padding
        # Leave 20px padding on each side -> 216x216 max
        target_size = (216, 216)
        img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Center the image
        bg_w, bg_h = background.size
        img_w, img_h = img.size
        offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
        
        # Paste the logo onto the black background
        background.paste(img, offset, img)
        
        # Create a drawing context
        draw = ImageDraw.Draw(background)
        
        # Draw a "Cool" border 
        # Gradient-like effect isn't easy with basic PIL without numpy, 
        # so let's do a nice solid border that matches the app theme (Blue/Indigo)
        # or a white border for high visibility request
        
        # Let's do a Cyan/Blue border since the app has that theme
        border_color = (56, 189, 248, 255) # Light Blue/Cyan
        border_width = 8
        
        # Draw a rounded rectangle or circle? 
        # Circle looks more "modern app icon"
        # Create a mask for rounded corners
        mask = Image.new('L', size, 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, 256, 256), fill=255)
        
        # Apply strict circular mask to background
        output = Image.new('RGBA', size, (0, 0, 0, 0))
        output.paste(background, (0, 0), mask=mask)
        
        # Draw the ring on the output
        draw_output = ImageDraw.Draw(output)
        draw_output.ellipse((2, 2, 254, 254), outline=border_color, width=border_width)

        # Save as ICO
        output.save(output_path, format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
        print(f"Successfully saved favicon to {output_path}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Input: public/logo.png
    # Output: app/favicon.ico
    base_dir = r"d:\SociaVerse\sociaverse-frontend\sociaverse-frontend"
    input_logo = os.path.join(base_dir, "public", "logo.png")
    output_ico = os.path.join(base_dir, "app", "favicon.ico")
    
    create_favicon(input_logo, output_ico)
