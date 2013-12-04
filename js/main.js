// Global variables
Array circles = [];
Array rects = [];
Array lines = [];


MRect rec1;
Line l1;
Circle c1;

// Setup the Processing Canvas
void setup(){
  size( 1200, 1200 );
  //strokeWeight( 10 );
  noStroke();
  frameRate( 60 );
  background(0,0,0,0);

  rec1 = new MRect(200, 800, 15, 15);
  c1 = new Circle(252, 500, 250, 250);
  l1 = new Line(rec1.x, rec1.y, c1.x, c1.y);

}

class MRect 
{
  float w; //  width
  float x; // rect xposition
  float h; // rect height
  float y ; // rect yposition
  boolean mover = false;
  boolean locked = false;
 
  MRect(float ixp, float iyp, float iw, float ih) {
    w = iw;
    x = ixp;
    h = ih;
    y = iyp;
  }
 
  void render() {
    noStroke();
    fill( 126, 199, 118 );
    rect(x-(w/2), y-(h/2), w, h);
  }

  void lineTo(x1, y1) {
    l.toX = x1;
    l.toY = y1;
    l.render();
  }
}

class Line 
{
  float fromX;
  float fromY;
  float toX;
  float toY;
  
  Line(float _fromX, float _fromY, float _toX, float _toY) {
    fromX = _fromX;
    fromY = _fromY;
    toX = _toX;
    toY = _toY;
  }

  void render() {
    stroke(126, 199, 118);
    strokeWeight(0.5);
    line(fromX, fromY, toX, toY);
  }

}

class Circle
{
  float x;
  float y;
  float w;
  float h;
  boolean mover = false;
  boolean locked = false;

  Circle(float _x, float _y, float _w, float _h) {
    x = _x;
    y = _y;
    w = _w;
    h = _h;
  }
  void render() {
    stroke(#7ec776)
    strokeWeight(10); 
    fill(#373737);
    ellipse(x, y, w, h);
    //console.log(x);
  }
}

void draw() {
  // Test if the cursor is over the circle 
  if (mouseX > c1.x - (c1.w/2) && mouseX < c1.x + (c1.w/2) && 
      mouseY > c1.y - (c1.h/2) && mouseY < c1.y + (c1.h/2)) {
    //console.log("on CIRCLE!!");
    c1.mover = true;  
  } 
  else {
    c1.mover = false;
  }

  // Test if the cursor is over the rec 
  if (mouseX > rec1.x - (rec1.w/2) && mouseX < rec1.x + (rec1.w/2) && 
      mouseY > rec1.y - (rec1.h/2) && mouseY < rec1.y + (rec1.h/2)) {
    //console.log("on REC!!");
    rec1.mover = true;  
  } 
  else {
    rec1.mover = false;
  }
  

  background(0,0,0,0);
  //if (rec1.w < 200) rec1.w ++;
  rec1.render();
  //l1.toX++;
  l1.render();
  c1.render();
  //fill(255);
  //ellipse(252, 144, 72, 72)/
}
void mousePressed() {
  if (c1.mover) {
    c1.locked = true;
  }
  else {
    c1.locked = false;
  }

  if (rec1.mover) {
    rec1.locked = true;
  }
  else {
    rec1.locked = false;
  }
}

void mouseDragged() {
    if (c1.locked) {
      c1.x = mouseX; 
      c1.y = mouseY;
      l1.toX = c1.x;
      l1.toY = c1.y;
    } 
    if (rec1.locked) {
      rec1.x = mouseX; 
      rec1.y = mouseY;
      l1.fromX = rec1.x;
      l1.fromY = rec1.y;
      l1.toX = c1.x;
      l1.toY = c1.y;
    } 
}
void mouseReleased() {

   c1.locked = false;
   rec1.locked = false;
  console.log(rec1.x + ":"+rec1.y);

}


console.log("loaded");

/*
  class Ball {

    float x;
    float y;
    int r;
    color col;
    boolean hit = false;
     
    Ball(int r_, float x_, float y_, color col_) {
      r = r_;
      x = x_;
      y = y_;
      col = col_;
    }
     
    void display(float x_, float y_) {
      x = x_;
      y = y_;
       
      noStroke();
      if (hit) {
        fill(col);
      } else {
        fill(255);
      }
      ellipse(x, y, r, r);
    }
     
    void hitTest(Ball ball) {
       
      // get larger radius
      float rad = (r > ball.r ? r : ball.r);
      // "if expressions" are if statements that return a value
       
      if (dist(x, y, ball.x, ball.y) <= rad) {
        ball.hit = true;
        hit = true;
      } else {
        ball.hit = false;
        hit = false;
      }
    }
  }

*/





//create RFINFO namspace if not already defined
var RFINFO = RFINFO || {};

(function ($) {
  RFINFO.Site = (function() {

    var clients_bts = [];
    var currClientsIndex;
    var processingInstance;
    if (!processingInstance) {
        processingInstance = Processing.getInstanceById('canvas2');
        trace(processingInstance);
    }

    $.each($(".button_rec"), function(index) {
      clients_bts.push($(this));
      $(this).bind('click', function(event) {
        /* Act on the event */
        currClientsIndex = index;
        update();
        return false;
      });
    });
    
    function update() {
      trace(currClientsIndex);
      switch(currClientsIndex) {
        case 0:
          processingInstance.beep();
          break;
      }
    }

  }());

  function trace(_val) {
    try{
      if (console) console.log(_val);
    }
    catch(e) {
    }
  }

}(jQuery.noConflict()));
