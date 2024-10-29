# generate_pdf.py
import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_pdf(data, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    # Configuración inicial
    c.setFont("Helvetica-Bold", 16)
    y = height - inch  # Margen superior de 1 pulgada

    # Título del informe
    c.drawString(72, y, f"Golf Ball Recommendations for {data['user_name']}")
    y -= 0.5 * inch

    # Subtítulo y ajustes de fuente
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.black)
    
    # Procesar cada modelo y razón
    for model, reason in data['recommendations'].items():
        if y < inch:  # Salto de página si el contenido llega al borde inferior
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - inch
        
        c.drawString(72, y, f"Model: {model}")
        y -= 20
        text = c.beginText(72, y)
        text.setFont("Helvetica", 10)
        text.setLeading(14)
        
        # Ajuste de línea para la razón del modelo
        for line in reason.splitlines():
            text.textLine(f"Reason: {line}")
            y -= 14
        
        c.drawText(text)
        y -= 20  # Espacio entre modelos

    c.save()

if __name__ == "__main__":
    json_data = json.loads(sys.argv[1])
    output_pdf_path = sys.argv[2]
    create_pdf(json_data, output_pdf_path)
