# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# import os
# import google.generativeai as genai
# import markdown2  # To convert markdown to HTML

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)

# # Get the API key from environment variable
# api_key = os.getenv("GOOGLE_API_KEY")

# # Configure the Gemini API
# genai.configure(api_key=api_key)

# @app.route('/generate', methods=['POST'])
# def generate_response():
#     input_data = request.json.get('input')
    
#     # Start a new chat without history
#     model = genai.GenerativeModel("gemini-pro")
#     chat = model.start_chat(history=[])
    
#     # Send a message and get the response (without streaming)
#     response = chat.send_message(input_data)
    
#     # Collect and join the response text
#     output = "".join(chunk.text for chunk in response)
    
#     # Convert markdown to HTML
#     html_output = markdown2.markdown(output)
    
#     # Return HTML response with proper content type
#     return jsonify({"output": html_output})

# if __name__ == '__main__':
#     app.run(port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import base64
from PIL import Image
from io import BytesIO

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with credentials

# Get the API key from environment variables
api_key = os.getenv("GOOGLE_API_KEY")

# Configure the Gemini API
genai.configure(api_key=api_key)

@app.route('/generate', methods=['POST'])
def generate_response():
    """Generate a chatbot response using Gemini API."""
    input_data = request.json.get('input')

    if not input_data:
        return jsonify({"error": "No input provided"}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # 🔄 Updated model
        chat = model.start_chat(history=[])

        response = chat.send_message(input_data)
        output = response.text  # 🔄 Fixed text extraction

        return jsonify({"output": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/image-to-text', methods=['POST'])
def image_to_text():
    """Extract text from an image using Gemini API."""
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    img = Image.open(image)

    # Convert image to Base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    model = genai.GenerativeModel("gemini-1.5-flash")  # 🔄 Updated model

    try:
        response = model.generate_content([
            {"parts": [
                {"inline_data": {"mime_type": "image/png", "data": img_base64}},
                {"text": "Extract text from this image and summarize it."}
            ]}
        ])

        extracted_text = response.text if response else "Failed to extract text."
        return jsonify({"text": extracted_text})

    except Exception as e:
        print("Error processing image:", str(e))  # Log error to console
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)



