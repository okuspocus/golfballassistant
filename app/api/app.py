import os
import psycopg2
from flask import Flask, request, jsonify
from psycopg2.extras import RealDictCursor
from flask_cors import CORS  # Import flask-cors

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Cargar las variables de entorno para la conexión con PostgreSQL
DATABASE_URL = os.getenv('DATABASE_URL')

# Función para conectarse a la base de datos
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)  # RealDictCursor devuelve los resultados como diccionarios
        return conn
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    keywords = data.get("keywords")

    if not keywords:
        return jsonify({"error": "Missing 'keywords' in request."}), 400

    conn = get_db_connection()

    if conn is None:
        return jsonify({"error": "Unable to connect to the database."}), 500

    cursor = conn.cursor()

    # Consulta para buscar bolas de golf por nombre usando el operador ILIKE
    query = """
        SELECT model_name, image_url, referral_link, price 
        FROM golf_balls 
        WHERE model_name ILIKE %s
        LIMIT 2
    """
    cursor.execute(query, (f"%{keywords}%",))
    results = cursor.fetchall()
    conn.close()

    if results:
        return jsonify(results)  # Devolver los resultados directamente como JSON
    else:
        return jsonify({"error": "No results found"}), 404

if __name__ == "__main__":
    app.run(debug=True)






