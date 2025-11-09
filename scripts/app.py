from flask import Flask, request, jsonify
from flask_cors import CORS
from generateASCII import run_generation, run_fetch, run_upload
import base64, io
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-image', methods=['POST'])
def handle_generation():
    print("processing request")
    data = request.json
    prompt = data.get("message")
    style = data.get("style")
    ascii, path = run_generation(prompt, style)
    return jsonify({"ascii": ascii, "style": style, "path": path})


@app.route('/api/get-database-ascii', methods=['POST'])
def handle_database():
    print("processing request")
    data = request.json
    path = data.get("path")
    style = data.get("style")
    ascii = run_fetch(path, style)
    return jsonify({"ascii": ascii, "style": style, "path": path})

@app.route('/api/get-upload-ascii', methods=['POST'])
def handle_upload():
    print("processing request")
    file = request.files["file"]
    image_bytes = file.read()
    style = request.form.get("style")
    ascii = run_upload(image_bytes, style)
    return jsonify({"ascii": ascii, "style": style})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6969)

