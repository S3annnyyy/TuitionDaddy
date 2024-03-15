from PIL import Image
from io import BytesIO

def resize_image(input_image, size=(1000, 1000)):
    """This function takes in image and modifies it to 1000px by 1000px while
    maintaining aspect ratio to be used a thumbnail"""
    original_image = Image.open(input_image)
    original_width, original_height = original_image.size
    target_width, target_height = size

    # Calculate the aspect ratio
    aspect_ratio = original_width / original_height

    # Calculate the new dimensions while maintaining the aspect ratio
    if original_width > original_height:
        new_width = target_width
        new_height = int(new_width / aspect_ratio)
    else:
        new_height = target_height
        new_width = int(new_height * aspect_ratio)

    # Resize the image while preserving the aspect ratio
    resized_image = original_image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create a new blank image with the target size
    final_image = Image.new("RGB", (target_width, target_height), (255, 255, 255))

    # Paste the resized image onto the new blank image centered
    x_offset = (target_width - new_width) // 2
    y_offset = (target_height - new_height) // 2
    final_image.paste(resized_image, (x_offset, y_offset))

    # Convert the image to bytes
    image_bytes = BytesIO()
    final_image.save(image_bytes, format='JPEG') 

    # Rewind the buffer
    image_bytes.seek(0)

    # Return the image as bytes
    return image_bytes.getvalue()