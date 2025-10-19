from flask import Flask, request, jsonify
from flask_cors import CORS
from generateASCII import run

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-image', methods=['POST'])
def handle_data():
    data = request.json
    prompt = data.get("message")
    result = run(prompt)
    return jsonify({"result": f"{result}"})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

