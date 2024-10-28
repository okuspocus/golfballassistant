# generate_pdf.py
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import sys
import json

def create_pdf(data, file_path):
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    # Título
    c.setFont("Helvetica-Bold", 20)
    c.drawString(72, height - 80, "Informe de Recomendación de Bolas de Golf")

    # Subtítulo
    c.setFont("Helvetica", 12)
    c.drawString(72, height - 120, f"Nombre del usuario: {data.get('user_name', 'Usuario desconocido')}")

    # Lista de recomendaciones
    y = height - 160
    for recommendation in data.get('recommendations', []):
        c.setFont("Helvetica-Bold", 12)
        c.drawString(72, y, f"Modelo: {recommendation.get('model_name')}")
        y -= 20
        c.setFont("Helvetica", 10)
        c.drawString(72, y, f"Precio: {recommendation.get('price', 'No disponible')}")
        y -= 20
        y -= 20  # Espacio extra entre items

        if y < 72:
            c.showPage()
            y = height - 80

    c.save()

if __name__ == "__main__":
    data = json.loads(sys.argv[1])  # Datos JSON
    output_path = sys.argv[2]       # Ruta del PDF de salida
    create_pdf(data, output_path)

