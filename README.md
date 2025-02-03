# 🎵 AI Music Generation System  

This is a web-based AI-powered **Music Generation System** built using **FastAPI, React.js, and Facebook's `musicgen-small` model**.  

To run this project, you'll need to replace the following files with the ones from your local setup:

### Files to replace:  
- **`main.py`**: This is the backend script with FastAPI. Replace your existing script or create new one.  
- **`app.js`**: This is the frontend script using React.js. Replace with your original app.js in src. 
- **`app.css`**: This is the styling for the frontend. Replace with your original app.css in src.

Make sure you have Python 3.8+ installed, then run:
   pip install fastapi torch transformers scipy numpy pydantic[dotenv] uvicorn

Start the Server : uvicorn main:app --reload 
Run React App : npm start
