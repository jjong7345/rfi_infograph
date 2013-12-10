var data;
var design = [];
var production = [];
var strategy = [];
var video = [];
var research = [];

var projects = [];


jQuery.ajax({
  url: 'data.xml'
})
.done(function(_xml) {
  console.log("success");
  data = _xml;
  jQuery("body").fadeIn();
  jQuery(data).find('projects').find('project').each(function() {

    var node = jQuery(this);
    var projectObj = {};
    projectObj.name =  node.find('title').text();
    parseData(node, "design", projectObj);
    parseData(node, "production", projectObj);
    parseData(node, "strategy", projectObj);
    parseData(node, "video", projectObj);
    parseData(node, "research", projectObj);
    parseData(node, "admin", projectObj);
    parseData(node, "tech", projectObj);
    projects.push(projectObj);
    console.log(projectObj);
  });
})
.fail(function() {
  console.log("error");
})
.always(function() {
  console.log("complete");
});

function parseData(_xml, _val, _project) {
  //_project["total_fee"] = _xml.find("total_fee").text();
  //_project["total_budget"] = 
  _project[_val] = [];
  _xml.find(_val).find('employees').find('person').each(function() {
    var obj = {};
    obj.name = jQuery(this).find('name').text();
    obj.total_fee = jQuery(this).find('total_fee').text();
    obj.total_budget = jQuery(this).find('total_budget').text();
    jQuery(data).find("seats").find('seat').each(function() {
      if (jQuery(this).find('name').text() == obj.name) {
        obj.x = jQuery(this).find('xPos').text();
        obj.y = jQuery(this).find('yPos').text()
      }
    });
    _project[_val].push(obj);
  });
}

// Global variables
Array circles_group = [];
Array lines_group = [];
Array circles = [];
boolean looping = false;


/*Array production = [ { name:"chelsea", x:"748", y:"636", total_hours:"1", total_fee:"175", percent:"0.13", total_budget:"100" },
                     { name:"Arielle", x:"775", y:"636", total_hours:"131", total_fee:"11790", percent:"16.38", total_budget:"12000"},
                     { name:"Fred", x:"775", y:"797", total_hours:"159", total_fee:"44520", percent:"19.88", total_budget:"30000" }];*/
//Array research = [ { name:"Julianne", x:"775", y:"689", total_hours:"1.5", total_fee:"262.5", percent:"0.19", total_budget:"600" }];



PFont fontA;

float unitPerDollor = 0.00225; //(100/44400)
float unitPerDollorBig = 130/76200;

var processingInstance;
// Setup the Processing Canvas
void setup(){
  size( 1200, 1200 );
  //strokeWeight( 10 );
  noStroke();
  smooth();
  frameRate( 60 );
  background(0,0,0,0);
  noLoop();
  fontA = createFont("avenir_lt_std35_light");
  textFont(fontA, 11);  

  if (!processingInstance) {
    processingInstance = Processing.getInstanceById('canvas2');
  } 
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
  float strokeColor;
  
  Line(float _fromX, float _fromY, float _toX, float _toY, float _strokeColor) {
    fromX = _fromX;
    fromY = _fromY;
    toX = _toX;
    toY = _toY;
    strokeColor = _strokeColor;
  }

  void render() {
    smooth();
    stroke(strokeColor);
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
  float strokeColor;
  float strokeWeightNo;
  float fillColor;
  float totalBudget = 0;
  float tempBudget = 0;
  float totalFee = 0;
  float tempFee = 0;
  String title = "";
  boolean mover = false;
  boolean locked = false;
  boolean spread = false;

  float totalBudgetDollor = 0;
  float totalFeeDollor = 0;
  
  Tween t;
  Tween t2;
  Tween t3;
  Tween t4;

  Circle(float _x, float _y, float _w, float _h, float _strokeColor, float _strokeWeight, float _fillColor) {
    x = _x;
    y = _y;
    w = _w;
    h = _h;
    strokeColor = _strokeColor;
    strokeWeightNo = _strokeWeight;
    fillColor = _fillColor;


    //if (_title) title = _title;
  }
  void setTitle(String _val) {
    title = _val;
  }
  
  void render() {

    float colorIndex;
    colorIndex = (((Math.abs(totalBudgetDollor-totalFeeDollor)/totalBudgetDollor) * 100)/130) * 100 * 2;

    if (totalFee > totalBudget) {

      noStroke();
      smooth();
      fill(#FFFFFF);
      ellipse(x, y, tempBudget, tempBudget);

      noStroke();
      smooth();
      fill(130 + colorIndex, 130 - colorIndex, 0);
      ellipse(x, y, tempBudget, tempBudget);

    }
    else {
      noStroke();
      smooth();
      fill(#FFFFFF);
      ellipse(x, y, tempBudget, tempBudget);

      noStroke();
      smooth();
      fill(130 - colorIndex, 130+colorIndex, 0);
      ellipse(x, y, tempBudget, tempBudget);

    }
  
    stroke(strokeColor);
    strokeWeight(strokeWeightNo);
    fill(fillColor);
    ellipse(x, y, w, h);

    fill(#FFFFFF);
    text(title, x, y+2);
    textAlign(CENTER);

    update();
  }
  public void update() {
    if ((t) && (t2)) {
      t.tick();
      t2.tick();
    }

    if (t3) t3.tick();
    if (t4) t4.tick();
  }
  public void goto(tx, ty, _ease) {

    var ease;
    if(_ease) ease =  _ease;
    else  ease = "backEaseOut"

    t = new Tween(this, "x", Tween[ease], x, tx, 0.5);
    t2 = new Tween(this, "y", Tween[ease], y, ty, 0.5);
    t.start();
    t2.start();
  }
  public void animateBudgetCircle(from, to, from2, to2) {
    t3 = new Tween(this, "tempBudget", Tween.strongEaseOut, from, to, 0.5);
    t3.start();
    t4 = new Tween(this, "tempFee", Tween.strongEaseOut, from2, to2, 0.5);
    t4.start();
  }
}

void draw() {
  if (looping) {
    cursor(ARROW);
    // Test if the cursor is over the circle 
    for (var i=0; i<circles.length; i++) {
      if (mouseX > circles[i].x - (circles[i].w/2) && mouseX < circles[i].x + (circles[i].w/2) && 
        mouseY > circles[i].y - (circles[i].h/2) && mouseY < circles[i].y + (circles[i].h/2)) {
        circles[i].mover = true;
        cursor(HAND);
      } 
      else {
        circles[i].mover = false;
      }

    }

    // Test if the cursor is over the rec 
    /*if (mouseX > rec1.x - (rec1.w/2) && mouseX < rec1.x + (rec1.w/2) && 
        mouseY > rec1.y - (rec1.h/2) && mouseY < rec1.y + (rec1.h/2)) {
      rec1.mover = true;  
    } 
    else {
      rec1.mover = false;
    }*/
    

    background(0,0,0,0);
    /*if (!c2.spread) {
      for (var i=0; i<projects[0].design.length; i++) {
        lines_design[i].toX = circles_design[i].x;
        lines_design[i].toY = circles_design[i].y;
        lines_design[i].render();
        circles_design[i].update();
        circles_design[i].render();
      }

    }
    c1.render();

    if (!c1.spread) {
      for (var i=0; i<projects[0].production.length; i++) {
        lines_production[i].toX = circles_production[i].x;
        lines_production[i].toY = circles_production[i].y;
        lines_production[i].render();
        circles_production[i].update ();
        circles_production[i].render();
      }

    }
    c2.render();*/

    for (var i=0; i<circles.length; i++) {
      if (!circles[i].spread) {
        for (var j=0; j<circles.length; j++) {
          if (i!=j) {
            //console.log("dsfsd:"+j);
            for (var k=0; k<circles_group[j].length; k++) {
              lines_group[j][k].toX = circles_group[j][k].x;
              lines_group[j][k].toY = circles_group[j][k].y;
              lines_group[j][k].render();
              circles_group[j][k].update();
              circles_group[j][k].render();
            }
          }
        }
      }
    }
    for (var i=0; i<circles.length; i++) {
      circles[i].render();
    }
  }
}
void mousePressed() {

  for (var i=0; i<circles.length; i++) {
    if (mouseX > circles[i].x - (circles[i].w/2) && mouseX < circles[i].x + (circles[i].w/2) && 
        mouseY > circles[i].y - (circles[i].h/2) && mouseY < circles[i].y + (circles[i].h/2)) {
      circles[i].mover = true;
    } 
    else {
      circles[i].mover = false;
    }
    if (circles[i].mover) {
      circles[i].locked = true;
    }
    else {
      circles[i].locked = false;
    }

  }
  /*if (mouseX > c1.x - (c1.w/2) && mouseX < c1.x + (c1.w/2) && 
      mouseY > c1.y - (c1.h/2) && mouseY < c1.y + (c1.h/2)) {
    c1.mover = true;
  } 
  else {
    c1.mover = false;
  }

  if (mouseX > c2.x - (c2.w/2) && mouseX < c2.x + (c2.w/2) && 
      mouseY > c2.y - (c2.h/2) && mouseY < c2.y + (c2.h/2)) {
    c2.mover = true; 
  } 
  else {
    c2.mover = false;
  }*/

  /*if (c1.mover) {
    c1.locked = true;
  }
  else {
    c1.locked = false;
  }
  if (c2.mover) {
    c2.locked = true;
  }
  else {
    c2.locked = false;
  }*/

  /*if (rec1.mover) {
    rec1.locked = true;
  }
  else {
    rec1.locked = false;
  }*/
}

void mouseDragged() {
  /*if (c1.locked) {
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
  } */
}
void mouseReleased() {

  for (var k=0; k<circles.length; k++) {
    
    if (circles[k].locked) {
      if (!circles[k].spread) {
        circles[k].goto(160 + (300*k), 400);
        var xpos = 300 + (300*k);
        for (var i=0; i<circles_group[k].length; i++) {
          circles_group[k][i].goto(xpos, 400);
          xpos += 120;
        }
        circles[k].spread = true;
        circles[k].animateBudgetCircle(circles[k].totalBudget, 0, circles[k].totalFee, 0);

        
        for (var l=0; l<circles.length; l++) {
          if (l!=k) {
            if (l>k) {
              circles[l].goto(1400, 400);
              for (var j=0; j<circles_group[l].length; j++) {
                circles_group[l][j].x = 1300;
              }
            }
            else {
               circles[l].goto(-200, 400);
              for (var j=0; j<circles_group[l].length; j++) {
                circles_group[l][j].x = -100;
              } 
            }
          }
        }
      }
      else {
        circles[k].goto(160 + (300*k), 400, "strongEaseOut");
        for (var i=0; i<circles_group[k].length; i++) {
          circles_group[k][i].goto(circles[k].x, 400, "strongEaseOut");
        }
        circles[k].spread = false;
        circles[k].animateBudgetCircle(0, circles[k].totalBudget, 0, circles[k].totalFee);

        for (var l=0; l<circles.length; l++) {
          if (l!=k) {
            circles[l].goto(160 + (300*l), 400, "strongEaseOut");
            for (var j=0; j<circles_group[l].length; j++) {
              circles_group[l][j].goto(160 + (300*l), 400, "strongEaseOut");
            }
          }
        }
      }
    }
    circles[k].locked = false;
 
 }

  /*if (c2.locked) {
    if (!c2.spread) {
      c2.goto(460, 400);
      var xpos = 600;
      for (var i=0; i<projects[0].production.length; i++) {
        circles_production[i].goto(xpos, 400);
        xpos += 120;
      }
      c2.spread = true;
      c2.animateBudgetCircle(c2.totalBudget, 0, c2.totalFee, 0);

      c1.goto(-200, 400);
      for (var j=0; j<projects[0].design.length; j++) {
        circles_design[j].x = -100;
      }
    }
    else {
      c2.goto(460, 400, "strongEaseOut");
      for (var i=0; i<projects[0].production.length; i++) {
        circles_production[i].goto(460, 400, "strongEaseOut");
      }
      c2.spread = false;
      c2.animateBudgetCircle(0, c2.totalBudget, 0, c2.totalFee);

      c1.goto(160, 400, "strongEaseOut");
      for (var j=0; j<projects[0].design.length; j++) {
        circles_design[j].goto(160, 400, "strongEaseOut");
      }
    }
  }
  c2.locked = false;*/

  //c1.goto(mouseX, mouseY);
}

void populateCircles(_projectIndex, _group, _title, _x, _color, _totalBudget, _totalFee) {

  Array temp_circles= [];
  Array temp_lines = [];

  for (var i=0; i<projects[_projectIndex][_group].length; i++) {
    var circle = new Circle(600, 600, 20, 20, _color, 5, #373737);
    temp_circles.push(circle);
    var line = new Line(Number(projects[_projectIndex][_group][i].x), Number(projects[_projectIndex][_group][i].y), circle.x, circle.y, _color);
    temp_lines.push(line);

    
    circle.totalBudgetDollor = Number(projects[_projectIndex][_group][i].total_budget);
    circle.totalFeeDollor = Number(projects[_projectIndex][_group][i].total_fee);
    circle.totalBudget = 50 + (Number(projects[_projectIndex][_group][i].total_budget) * unitPerDollor);
    circle.totalFee = 50 + (Number(projects[_projectIndex][_group][i].total_fee) * unitPerDollor);
    (function(_i) {
      setTimeout( function() { temp_circles[_i].animateBudgetCircle(0, temp_circles[_i].totalBudget, 0, temp_circles[_i].totalFee) }, 600);
    })(i);
    //circle.animateBudgetCircle(0, circle.totalBudget, 0,circle.totalFee)
    
    circle.goto(_x, 400);
  }
  circles_group.push(temp_circles);
  lines_group.push(temp_lines);

  var c1 = new Circle(600, 600, 75, 75, _color, 8, #373737);
  c1.setTitle(_title);
  c1.totalBudgetDollor = _totalBudget;
  c1.totalFeeDollor = _totalFee;
  c1.totalBudget = 90 + (_totalBudget*unitPerDollorBig);
  c1.totalFee = 90 + (_totalFee*unitPerDollorBig);;
  setTimeout( function() { c1.animateBudgetCircle(0, c1.totalBudget, 0, c1.totalFee) }, 300);
  c1.goto(_x, 400);

  circles.push(c1);
}


void showClient(_index) {
  circles_group = [];
  circles = [];
  lines = [];

  switch(_index) {
    case 0:
      populateCircles(0, "design", "Design", 160, #7ec776, 76200, 67775.5);
      populateCircles(0, "production", "Production", 460, #7e609b, 42100, 56485);

      break;
    case 1:
      populateCircles(1, "design", "Design", 160, #7ec776, 76200, 67775.5);
      populateCircles(1, "production", "Production", 460, #7e609b, 42100, 30000);

      break;
  }

  loop();
  looping = true;
}

void accessVariable(_val) {
  return _val;
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
          clients_bts[currClientsIndex].addClass("active");
          processingInstance.showClient(currClientsIndex);
          //processingInstance.noLoop();
          break;
        case 1:
          clients_bts[currClientsIndex].addClass("active");
          processingInstance.showClient(currClientsIndex);
          //processingInstance.noLoop();
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