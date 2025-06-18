from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cloudinary_utils import obtener_imagenes_cloudinary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/imagenes")
def listar_imagenes():
    return obtener_imagenes_cloudinary()
