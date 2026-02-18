
from PIL import Image, ImageDraw
import os

def process_logo(input_path, output_square_path, output_favicon_path):
    print(f"Processing {input_path}...")
    
    try:
        # Open original
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        
        # Crop to square (Left side, height x height)
        # Assuming icon is on the left
        crop_size = min(width, height)
        # Left crop: (0, 0, height, height)
        square_img = img.crop((0, 0, crop_size, crop_size))
        
        # Save the square logo for UI components
        # Resize to 512x512 for better performance
        square_img_resized = square_img.resize((512, 512), Image.Resampling.LANCZOS)
        square_img_resized.save(output_square_path)
        print(f"Saved square logo to {output_square_path}")
        
        # Now generate the cool favicon from this square image
        # Create a new square background (black)
        icon_size = (256, 256)
        background = Image.new('RGBA', icon_size, (0, 0, 0, 255))
        
        # Resize square logo to fit with padding
        target_size = (216, 216)
        square_img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Center it
        offset = ((256 - square_img.size[0]) // 2, (256 - square_img.size[1]) // 2)
        background.paste(square_img, offset, square_img)
        
        # Draw Cool Border (Cyan)
        draw = ImageDraw.Draw(background)
        border_color = (56, 189, 248, 255) # Cyan
        border_width = 8
        
        # Circular Mask
        mask = Image.new('L', icon_size, 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, 256, 256), fill=255)
        
        output_ico = Image.new('RGBA', icon_size, (0, 0, 0, 0))
        output_ico.paste(background, (0, 0), mask=mask)
        
        # Draw Ring
        draw_ico = ImageDraw.Draw(output_ico)
        draw_ico.ellipse((2, 2, 254, 254), outline=border_color, width=border_width)
        
        # Save as ICO
        output_ico.save(output_favicon_path, format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32)])
        print(f"Saved favicon to {output_favicon_path}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    base_dir = r"d:\SociaVerse\sociaverse-frontend\sociaverse-frontend"
    input_logo = os.path.join(base_dir, "public", "logo.png")
    output_square = os.path.join(base_dir, "public", "logo-square.png")
    output_favicon = os.path.join(base_dir, "app", "favicon.ico")
    
    process_logo(input_logo, output_square, output_favicon)
