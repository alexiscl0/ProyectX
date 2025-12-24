from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "port": 3306
}

DB_NAME = "parkpro"

def init_db():
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.execute(f"USE {DB_NAME}")
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                telefono VARCHAR(20),
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vehiculos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                tipo VARCHAR(20) NOT NULL,
                marca VARCHAR(50) NOT NULL,
                modelo VARCHAR(50) NOT NULL,
                placa VARCHAR(20) UNIQUE NOT NULL,
                color VARCHAR(30),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS reservas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                codigo VARCHAR(20) UNIQUE NOT NULL,
                usuario_id INT NOT NULL,
                vehiculo_id INT NOT NULL,
                tipo_espacio VARCHAR(20) NOT NULL,
                modalidad VARCHAR(20) NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NOT NULL,
                precio DECIMAL(10,2) NOT NULL,
                estado VARCHAR(20) DEFAULT 'activa',
                notas TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS precios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo_vehiculo VARCHAR(20) NOT NULL,
                modalidad VARCHAR(20) NOT NULL,
                precio DECIMAL(10,2) NOT NULL
            )
        """)
        
        cursor.execute("SELECT COUNT(*) FROM precios")
        if cursor.fetchone()[0] == 0:
            precios_iniciales = [
                ('moto', 'diario', 5.0),
                ('auto', 'diario', 10.0),
                ('camion', 'diario', 15.0),
                ('moto', 'mensual', 100.0),
                ('auto', 'mensual', 200.0),
                ('camion', 'mensual', 300.0),
                ('moto', 'anual', 1000.0),
                ('auto', 'anual', 2000.0),
                ('camion', 'anual', 3000.0),
            ]
            
            sql = "INSERT INTO precios (tipo_vehiculo, modalidad, precio) VALUES (%s, %s, %s)"
            cursor.executemany(sql, precios_iniciales)
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error al inicializar base de datos: {e}")


@app.route("/api/registro", methods=["POST"])
def registrar():
    try:
        data = request.get_json()
        
        if not data.get('nombre') or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Faltan datos requeridos"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor()
        
        
        sql = """
            INSERT INTO usuarios (nombre, email, password, telefono)
            VALUES (%s, %s, %s, %s)
        """
        
        cursor.execute(sql, (
            data['nombre'],
            data['email'],
            data['password'],
            data.get('telefono', '')
        ))
        
        conn.commit()
        usuario_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "mensaje": "Usuario registrado exitosamente",
            "usuario_id": usuario_id
        }), 201
        
    except mysql.connector.IntegrityError:
        return jsonify({"error": "El email ya está registrado"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email y contraseña requeridos"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor(dictionary=True)
        
        sql = "SELECT * FROM usuarios WHERE email = %s AND password = %s"
        cursor.execute(sql, (data['email'], data['password']))
        
        usuario = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if usuario:
            return jsonify({
                "mensaje": "Login exitoso",
                "usuario": {
                    "id": usuario['id'],
                    "nombre": usuario['nombre'],
                    "email": usuario['email'],
                    "telefono": usuario['telefono']
                }
            }), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/vehiculos", methods=["GET"])
def obtener_vehiculos():
    try:
        usuario_id = request.args.get('usuario_id')
        
        if not usuario_id:
            return jsonify({"error": "usuario_id requerido"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor(dictionary=True)
        
        sql = "SELECT * FROM vehiculos WHERE usuario_id = %s"
        cursor.execute(sql, (usuario_id,))
        
        vehiculos = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({"vehiculos": vehiculos}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/vehiculos", methods=["POST"])
def agregar_vehiculo():
    try:
        data = request.get_json()
        
        campos_requeridos = ['usuario_id', 'tipo', 'marca', 'modelo', 'placa']
        for campo in campos_requeridos:
            if not data.get(campo):
                return jsonify({"error": f"Campo requerido: {campo}"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor()
        
        sql = """
            INSERT INTO vehiculos (usuario_id, tipo, marca, modelo, placa, color)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        cursor.execute(sql, (
            data['usuario_id'],
            data['tipo'],
            data['marca'],
            data['modelo'],
            data['placa'].upper(),
            data.get('color', '')
        ))
        
        conn.commit()
        vehiculo_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "mensaje": "Vehículo agregado exitosamente",
            "vehiculo_id": vehiculo_id
        }), 201
        
    except mysql.connector.IntegrityError:
        return jsonify({"error": "La placa ya está registrada"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/reservas", methods=["GET"])
def obtener_reservas():
    try:
        usuario_id = request.args.get('usuario_id')
        
        if not usuario_id:
            return jsonify({"error": "usuario_id requerido"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor(dictionary=True)
        
        sql = """
            SELECT r.*, v.marca, v.modelo, v.placa
            FROM reservas r
            JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE r.usuario_id = %s
            ORDER BY r.fecha_creacion DESC
        """
        
        cursor.execute(sql, (usuario_id,))
        reservas = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({"reservas": reservas}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/reservas", methods=["POST"])
def crear_reserva():
    try:
        data = request.get_json()
        
        campos_requeridos = ['usuario_id', 'vehiculo_id', 'tipo_espacio', 
                            'modalidad', 'fecha_inicio', 'fecha_fin']
        for campo in campos_requeridos:
            if not data.get(campo):
                return jsonify({"error": f"Campo requerido: {campo}"}), 400
        
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor(dictionary=True)
        
        sql_precio = "SELECT precio FROM precios WHERE tipo_vehiculo = %s AND modalidad = %s"
        cursor.execute(sql_precio, (data['tipo_espacio'], data['modalidad']))
        
        precio_info = cursor.fetchone()
        
        if not precio_info:
            cursor.close()
            conn.close()
            return jsonify({"error": "Precio no encontrado"}), 404
        
        precio = precio_info['precio']
        
        import random
        codigo = f"PKP-{random.randint(10000, 99999)}"
        
        sql = """
            INSERT INTO reservas 
            (codigo, usuario_id, vehiculo_id, tipo_espacio, modalidad, 
             fecha_inicio, fecha_fin, precio, notas)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.execute(sql, (
            codigo,
            data['usuario_id'],
            data['vehiculo_id'],
            data['tipo_espacio'],
            data['modalidad'],
            data['fecha_inicio'],
            data['fecha_fin'],
            precio,
            data.get('notas', '')
        ))
        
        conn.commit()
        reserva_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "mensaje": "Reserva creada exitosamente",
            "reserva_id": reserva_id,
            "codigo": codigo,
            "precio": float(precio)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/reservas/<int:reserva_id>", methods=["DELETE"])
def cancelar_reserva(reserva_id):
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor()
        
        sql = "UPDATE reservas SET estado = 'cancelada' WHERE id = %s"
        cursor.execute(sql, (reserva_id,))
        
        conn.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Reserva no encontrada"}), 404
        
        cursor.close()
        conn.close()
        
        return jsonify({"mensaje": "Reserva cancelada exitosamente"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/precios", methods=["GET"])
def obtener_precios():
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor(dictionary=True)
        
        sql = "SELECT * FROM precios ORDER BY tipo_vehiculo, modalidad"
        cursor.execute(sql)
        
        precios = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({"precios": precios}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def index():
    """Página principal de la API"""
    return jsonify({
        "mensaje": "ParkPro API - Sistema de Estacionamiento",
        "version": "1.0",
        "estado": "En línea",
        "base_datos": DB_NAME,
        "endpoints": {
            "registro": "POST /api/registro",
            "login": "POST /api/login",
            "vehiculos": "GET/POST /api/vehiculos",
            "reservas": "GET/POST /api/reservas",
            "precios": "GET /api/precios"
        }
    })


@app.route("/api/estado", methods=["GET"])
def estado():
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        
        return jsonify({
            "estado": "OK",
            "base_datos": "Conectada"
        }), 200
    except Exception as e:
        return jsonify({
            "estado": "ERROR",
            "base_datos": "Desconectada",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    init_db()
    
    print("""
      Servidor: http://localhost:5000
      Base de datos: parkpro
    """)
    
    app.run(debug=True, port=5000)