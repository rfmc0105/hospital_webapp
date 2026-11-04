# Hospital Reception Chatbot

A bilingual (Japanese / English) visitor-information demo for Tokyo Metropolitan Ohtsuka Hospital. Built with Flask, HTML, CSS, and vanilla JavaScript. The chatbot uses local keyword matching and JSON data; it does not require an AI API key or paid API.

## Project structure

```text
Hospital_Reception_Chatbot/
├── app.py
├── requirements.txt
├── render.yaml
├── README.md
├── data/
│   └── hospital_info.json
├── templates/
│   └── index.html
└── static/
    ├── app.js
    └── style.css
```

## Run locally

1. Install Python 3.10 or newer.
2. Open a terminal in this project folder.
3. Create and activate a virtual environment (optional but recommended).

   Windows PowerShell:
   ```powershell
   py -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

   macOS / Linux:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

4. Install packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the app:
   ```bash
   python app.py
   ```
6. Open http://127.0.0.1:5000 in your browser.

## Deploy to GitHub and Render

1. Create a new repository on GitHub.
2. Upload the contents of this project folder (not the ZIP file itself) to the repository.
3. In Render, choose **New +** → **Web Service** and connect the GitHub repository.
4. Use these settings:
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Select a plan and deploy. Render will provide a public URL when deployment finishes.

The included `render.yaml` contains the same service configuration for Blueprint-based deployment.

## Main files

- `app.py`: Flask routes and rule-based response matching.
- `data/hospital_info.json`: Hospital details, FAQ keywords, and Japanese/English answers.
- `templates/index.html`: Page structure and content areas.
- `static/app.js`: Language switching, suggested questions, and chat requests.
- `static/style.css`: Responsive visual design.
- `requirements.txt`: Python packages.
- `render.yaml`: Render deployment configuration.

## Updating hospital information

Edit `data/hospital_info.json` to update phone numbers, address, links, and answers. Add keywords to the relevant FAQ entry so the chatbot can recognize additional question wording. Restart the application after editing.

## Important accuracy and safety notice

This is an independent demonstration project, not an official hospital service and not affiliated with Tokyo Metropolitan Hospital Organization. Information was transcribed from publicly available hospital pages when this project was prepared. Hospital procedures, fees, hours, and services can change; users should confirm details with the hospital's official website or by phone before visiting.

The chatbot provides administrative visitor information only. It does not diagnose conditions, recommend treatment, or replace professional medical advice. For a life-threatening emergency in Japan, call 119. For emergency hospital attendance, the hospital asks visitors to call ahead.

## Official sources

- https://www.tmhp.jp/ohtsuka/en/
- https://www.tmhp.jp/ohtsuka/en/outpatient.html
- https://www.tmhp.jp/ohtsuka/en/directions.html
- https://www.tmhp.jp/ohtsuka/en/contact.html
