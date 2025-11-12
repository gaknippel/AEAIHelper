import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import PIL.Image 
import io


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-2.5-pro')

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "no image file provided"}), 400
        

        image_file = request.files['image']

        prompt_from_user = request.form.get('prompt', 'analyze this image')

        constraint = "IMPORTANT: Keep the response to 100 words or less."

        prompt_from_user = f"{prompt_from_user}\n\n{constraint}"

        image_bytes = image_file.read()

        img = PIL.Image.open(io.BytesIO(image_bytes))

        response = model.generate_content([prompt_from_user,img ])

        return jsonify({"suggestions": response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)