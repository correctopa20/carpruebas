# 🌿 CarbonoCer0 - Backend (FastAPI)

API desarrollada con **FastAPI** para la autenticación y gestión de usuarios con roles (`admin` y `empleado`).  
Forma parte del proyecto **CarbonoCer0**, una plataforma para medir y reducir la huella de carbono.

---

## 🚀 Requisitos previos

Antes de ejecutar el backend, asegúrate de tener instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/)
- (Opcional) [Virtualenv](https://virtualenv.pypa.io/en/latest/)

---

## ⚙️ Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/carbonocer0.git
   cd carbonocer0/backend
python -m venv venv
venv\Scripts\activate    # En Windows
source venv/bin/activate # En Linux/Mac

pip install -r requirements.txt

uvicorn app.main:app --reload

http://127.0.0.1:8000/docs
