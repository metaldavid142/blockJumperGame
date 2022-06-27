$( document ).ready(function() {

   function createCanvas(parent, width, height) {
    /*
    Creación del lienzo
        
    Parameters
    ----------
    parent : str
    width : int
        ancho del lienzo
    height : str
        largo del lienzo 
    Returns
    -------
    Retorna el lienzo
    */
    var canvas = document.getElementById("inputCanvas");
    canvas.context = canvas.getContext('2d');
    return canvas;
  }

  function init(container, width, height, fillColor) {
     /*
    Creación del lienzo
        
    Parameters
    ----------
    container : str
    width : int
        ancho del lienzo
    height : str
        largo del lienzo
    fillcolor : str
        relleno del dibujo
    Returns
    -------
    Retorna los componentes del lienzo
    */
    var canvas = createCanvas(container, width, height);
    var ctx = canvas.context;
    ctx.fillCircle = function(x, y, radius, fillColor) {
      this.fillStyle = fillColor;
      this.beginPath();
      this.moveTo(x, y);
      this.arc(x, y, radius, 0, Math.PI * 2, false);
      this.fill();
    };
    ctx.clearTo = function(fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, width, height);
    };
    ctx.clearTo("#fff");

    canvas.onmousemove = function(e) {
      if (!canvas.isDrawing) {
        return;
      }
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;
      var radius = 5;
      var fillColor = 'yellow';
      ctx.fillCircle(x, y, radius, fillColor);
    };
    canvas.onmousedown = function(e) {
      canvas.isDrawing = true;
    };
    canvas.onmouseup = function(e) {
      canvas.isDrawing = false;
    };
  }

  var container = document.getElementById('canvas');
  init(container, 200, 200, '#ddd');

  function clearCanvas() {
     /*
    Limpia el lienzo
    */
    var canvas = document.getElementById("inputCanvas");
    var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getData() {
     /*
    Obtiene la información del lienzo a traves del método POST
    */
    var canvas = document.getElementById("inputCanvas");
    var imageData = canvas.context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var outputData = []
    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      outputData.push(brightness);
    }
    $.post( "/postmethod", {
      canvas_data: JSON.stringify(outputData)
    }, function(err, req, resp){
      window.location.href = "/results/"+resp["responseJSON"]["unique_id"];  
      console.log(resp);
    });
  }

  $( "#clearButton" ).click(function(){
    clearCanvas();
  });

  $( "#sendButton" ).click(function(){
    getData();
  });
});