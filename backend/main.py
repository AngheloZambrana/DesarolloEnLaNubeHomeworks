import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cloudinary_utils import obtener_imagenes_cloudinary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PALABRAS_PROHIBIDAS = [
    # Básicas y comunes
    "mierda", "puta", "hijo de puta", "tu puta madre", "carajo", "joder", "coño",

    # Insultos fuertes
    "cabron", "imbecil", "idiota", "gilipollas", "bastardo", "maldito", "zorra",

    # Mexicano
    "pendejo", "pinche", "chingar", "chingado", "chingados", "chingón", "verga", "huevón", "no mames",

    # Argentina/Uruguay/Chile
    "boludo", "pelotudo", "forro", "conchetumare", "culiao", "concha de tu madre",

    # Ofensivos homófobos (desaconsejados incluso para censura)
    "maricon", "joto", "maraco",

    # Frases completas
    "que te jodan", "vete a la mierda", "me cago en la puta", "me cago en tus muertos",
    "la hostia", "me cago en la leche", "me cago en todo lo que se menea",

    # Otros
    "cojones", "pañico", "tonto del culo", "come mierda", "lame culo",
    "chupapijas", "chupamela", "traga leche", "chupahuevos",
]

def moderar_contenido(texto: str) -> str:
    texto_moderado = texto
    for palabra in PALABRAS_PROHIBIDAS:
        patron = re.compile(rf"\b{re.escape(palabra)}\b", re.IGNORECASE)
        texto_moderado = patron.sub("[redacted]", texto_moderado)
        
    return texto_moderado
@app.get("/imagenes")
def listar_imagenes():
    return obtener_imagenes_cloudinary()

class PostModeracionRequest(BaseModel):
    contenido: str

@app.post("/moderar-post")
def moderar_post(request: PostModeracionRequest):
    contenido_limpio = moderar_contenido(request.contenido)
    return {"contenido_moderado": contenido_limpio}
