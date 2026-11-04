from flask import Flask, render_template, request, jsonify
from pathlib import Path
import json
import re

app = Flask(__name__)
DATA_PATH = Path(__file__).parent / "data" / "hospital_info.json"

with DATA_PATH.open(encoding="utf-8") as file:
    HOSPITAL_DATA = json.load(file)

def normalize(text):
    return re.sub(r"\s+", " ", (text or "").strip().lower())

def find_answer(message, language):
    text = normalize(message)
    if not text:
        return {
            "answer": "ご質問を入力してください。" if language == "ja" else "Please enter a question.",
            "matched": False
        }

    # Match the most specific keyword phrase first.
    candidates = []
    for item in HOSPITAL_DATA["faq"]:
        for keyword in item["keywords"]:
            key = normalize(keyword)
            if key and key in text:
                candidates.append((len(key), item))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        item = candidates[0][1]
        return {"answer": item[language], "matched": True, "topic": item["id"]}

    if any(word in text for word in ["こんにちは", "おはよう", "こんばんは", "hello", "hi", "good morning"]):
        answer = ("こんにちは。東京都立大塚病院の案内チャットボットです。受付時間、予約、アクセスなどについてご質問ください。"
                  if language == "ja" else
                  "Hello. I am the Tokyo Metropolitan Ohtsuka Hospital information chatbot. Ask me about appointments, access, departments, and other hospital information.")
        return {"answer": answer, "matched": True, "topic": "greeting"}

    fallback = (
        "申し訳ありません。その質問に対応する情報が見つかりませんでした。別の言葉で質問するか、病院の公式サイト・電話窓口でご確認ください。"
        if language == "ja" else
        "Sorry, I couldn't find an answer to that question. Try different keywords or check the hospital's official website or contact desk."
    )
    return {"answer": fallback, "matched": False}

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/api/info")
def info():
    return jsonify({
        "hospital": HOSPITAL_DATA["hospital"],
        "departments": HOSPITAL_DATA["departments"]
    })

@app.post("/api/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")
    language = payload.get("language", "en")
    if language not in ("ja", "en"):
        language = "en"
    result = find_answer(message, language)
    result["language"] = language
    return jsonify(result)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
