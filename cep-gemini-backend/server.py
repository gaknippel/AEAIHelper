import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import PIL.Image 


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-2.5-pro')

@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "no image file provided"}), 400
        

        image_file = request.files['image']
        # Get the prompt from the frontend's request

        prompt_from_user = request.form.get('prompt', 'analyze this image')

        constraint = "IMPORTANT: Keep the response to 100 words or less."

        prompt_from_user = f"{prompt_from_user}\n\n{constraint}"

        img = PIL.Image.open(image_file.stream)

        # Call the Gemini API
        response = model.generate_content([prompt_from_user,img ])

        # Send the response back to the frontend
        return jsonify({"suggestions": response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)