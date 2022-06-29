import os

from flask import Flask, render_template

app=Flask(__name__)
app._static_folder = os.path.abspath("templates/static/")
@app.route("/")
def game():
    return render_template("layouts/game.html")

if __name__=='__main__':
    app.run(debug=True, port=5000)
