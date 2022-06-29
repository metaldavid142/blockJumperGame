#Importar librerías
import os
from flask import Flask, render_template


app=Flask(__name__)
#Ruta hacia la carpeta tempaltes
app._static_folder = os.path.abspath("templates/static/")
@app.route("/")
def game():
    """
    Llama a la página donde se presenta el juego

    Returns
    -------
    Retorna la página game.html alojada en la carpeta layouts 
    """  
    return render_template("layouts/game.html")

if __name__=='__main__':
    app.run(debug=True, port=5000)