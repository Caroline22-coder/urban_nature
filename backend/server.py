from flask import Flask, request, jsonify
from script import analyze_image  # Import the analyze_image function
import os

app = Flask(__name__)

# Create an "uploads" directory if it doesn't exist
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/analyze", methods=["POST"])
def analyze():
    print("Request received")  # Log when the request is received
    print("Request headers:", request.headers)  # Log the request headers
    print("Request form:", request.form)  # Log the form data
    print("Request files:", request.files)  # Log the files in the request

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files["image"]
    print("Image received:", image.filename)  # Log the received image filename

    # Save the uploaded image to the "uploads" folder
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    try:
        # Call the analyze_image function from script.py
        result = analyze_image(image_path)
        if result:
            return jsonify(result)
        else:
            return jsonify({"error": "No results found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)