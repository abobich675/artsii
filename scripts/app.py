from flask import Flask, request, jsonify
from flask_cors import CORS
from generateASCII import run

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-image', methods=['POST'])
def handle_data():
    print("processing request")
    data = request.json
    prompt = data.get("message")
    style = data.get("style")
    result = run(prompt, style)
    return jsonify({"result": f"{result}"})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6969)

