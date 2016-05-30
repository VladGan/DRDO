var dots = [];
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext('2d');

const sigma = Math.sqrt(3.0);

function buildDot(x,y) {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2, true);
  ctx.fillStyle="#000000";
  ctx.fill();
  ctx.closePath();
  dots.push({x:x, y:y, conn: []});
  return {x:x, y:y}
}
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawDot(dot, col) {
  if (!col) col = getRandomColor()
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2, true);
  ctx.fillStyle=col;
  ctx.fill();
  ctx.closePath();
  return {x:dot.x, y:dot.y}
}

function drawDots() {
  var col = getRandomColor()
  for (var i =0; i<dots.length;i++)
    drawDot(dots[i], col)
}

function distance(x1,y1,x2,y2){
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
}


function max(a,b,c){
  if (c == undefined) c=-9999999999;
  if (a>=b && a>=c) return a;
  if (b>=a && b>=c) return b;
  return c;
}

function CoordsOfCent(x1,y1,x2,y2,x3,y3){
  const S = x1*y2+x2*y3+x3*y1-x1*y3-x3*y2-x2*y1;
  const r12 = distance(x1,y1,x2,y2),
        r13 = distance(x1,y1,x3,y3),
        r23 = distance(x2,y2,x3,y3);

  const K1 = ((r12*r12 + r13*r13 - r23*r23)*sigma)/2 + Math.abs(S),
        K2 = ((r23*r23 + r12*r12 - r13*r13)*sigma)/2 + Math.abs(S),
        K3 = ((r13*r13 + r23*r23 - r12*r12)*sigma)/2 + Math.abs(S);

  const d = Math.abs(S)*sigma + 0.5*((r12*r12 + r13*r13 - r23*r23) + (r23*r23 + r12*r12 - r13*r13) + (r13*r13 + r23*r23 - r12*r12));

  const ans = {};
  ans.X = (K1*K2*K3) / (2*Math.abs(S)*sigma*d)*(x1/K1 + x2/K2 + x3/K3);
  ans.Y = (K1*K2*K3) / (2*Math.abs(S)*sigma*d)*(y1/K1 + y2/K2 + y3/K3);

  return ans;
}

function getAngle(x1,y1,x2,y2,x3,y3, dist2, dist3) {
  return Math.acos(((x2-x1)*(x3-x1) + (y2-y1)*(y3-y1))/(dist2*dist3));
}

function checkAddingAdditional(dot) {
  for (var i = 0; i<dots.length; i++){
    if (dots[i].conn.length == 1) {
      const dist1 = distance(dot.x, dot.y, dots[i].x, dots[i].y)
      const dist2 = distance(dots[i].conn[0].x, dots[i].conn[0].y, dots[i].x, dots[i].y)
      const angle = getAngle(dots[i].x, dots[i].y, dots[i].conn[0].x, dots[i].conn[0].y, dot.x,dot.y, dist1, dist2)
      if (angle > (2.0*Math.PI)/3.0){
        dots.push(dot)
        dot.conn.push(dots[i])
        dots[i].conn.push(dot)
        return true
      }
    }
    else
    if (dots[i].conn.length == 2) {
      const dist1 = distance(dot.x, dot.y, dots[i].x, dots[i].y)
      const dist2 = distance(dots[i].conn[0].x, dots[i].conn[0].y, dots[i].x, dots[i].y)
      const angle = getAngle(dots[i].x, dots[i].y, dots[i].conn[0].x, dots[i].conn[0].y, dot.x,dot.y, dist1, dist2)
      if (angle == (2.0*Math.PI)/3.0){
        dots.push(dot)
        dot.conn.push(dots[i])
        dots[i].conn.push(dot)
        return true
      }
    }
  }
  return false
}

function draw() {
  var col = getRandomColor()
  for (var i = 0; i<dots.length; i++)
    for (var j = 0; j<dots[i].conn.length; j++) {
      ctx.beginPath();
      ctx.moveTo(dots[i].x, dots[i].y);
      ctx.lineTo(dots[i].conn[j].x, dots[i].conn[j].y);
      ctx.strokeStyle = col
      ctx.stroke();
    }
}

function getSim(x1,y1,x2,y2){
  x2-=x1;
  y2-=y1;
  const newDot1 = {x: 0.5*x2-(Math.sqrt(3)/2)*y2 + x1, y: (Math.sqrt(3)/2)*x2 + 0.5*y2 + y1, conn:[]}
  const newDot2 = {x: 0.5*x2+(Math.sqrt(3)/2)*y2 + x1, y:-(Math.sqrt(3)/2)*x2 + 0.5*y2 + y1, conn:[]}
  return {first:newDot1, second:newDot2};
}

function handle3(dth){
  const dist1 = distance(dth[0].x,dth[0].y, dth[1].x,dth[1].y);
  const dist2 = distance(dth[0].x,dth[0].y, dth[2].x,dth[2].y);
  const dist3 = distance(dth[2].x,dth[2].y, dth[1].x,dth[1].y);


  const angle1 = getAngle(dth[0].x,dth[0].y,dth[1].x,dth[1].y,dth[2].x,dth[2].y, dist1,dist2);
  const angle2 = getAngle(dth[1].x,dth[1].y,dth[0].x,dth[0].y,dth[2].x,dth[2].y, dist1,dist3);
  const angle3 = getAngle(dth[2].x,dth[2].y,dth[1].x,dth[1].y,dth[0].x,dth[0].y, dist3,dist2);

  const angle = max(angle1, angle2, angle3)

  if (angle >= 2*Math.PI/3) {
    if (dth[0].conn.length == 3 || dth[1].conn.length == 3 || dth[2].conn.length == 3) return false;
    if (angle1 == angle) {
      dth[0].conn.push(dth[1]);dth[1].conn.push(dth[0]);
      dth[0].conn.push(dth[2]);dth[2].conn.push(dth[0]);
    }
    else
    if (angle2 == angle) {
      dth[1].conn.push(dth[0]);dth[0].conn.push(dth[1]);
      dth[1].conn.push(dth[2]);dth[2].conn.push(dth[1])
    }
    else
    if (angle3 == angle) {
      dth[2].conn.push(dth[0]);dth[0].conn.push(dth[2]);
      dth[2].conn.push(dth[1]);dth[1].conn.push(dth[2])
    }
  }
  else {
    const newC = CoordsOfCent(dth[0].x,dth[0].y, dth[1].x,dth[1].y, dth[2].x,dth[2].y);
    const newX = newC.X;
    const newY = newC.Y;
    const newDot = {x:newX, y:newY, conn:[]}
    newDot.conn.push(dth[0])
    newDot.conn.push(dth[1])
    newDot.conn.push(dth[2])
    dots.push(newDot)
    dth[0].conn.push(newDot)
    dth[1].conn.push(newDot)
    dth[2].conn.push(newDot)
  }
  return true;
}

function CenterOfCircle(dot1, dot2, dot3){
  const x1 = dot1.x, x2 = dot2.x, x3 = dot3.x;
  const y1 = dot1.y, y2 = dot2.y, y3 = dot3.y;
  const z = (x1 - x2)*(y3-y1) - (y1-y2)*(x3-x1);
  const z1 = x1*x1+y1*y1;
  const z2 = x2*x2+y2*y2;
  const z3 = x3*x3+y3*y3;
  const zx = (y1-y2)*z3+(y2-y3)*z1 + (y3-y1)*z2;
  const zy = (x1-x2)*z3+(x2-x3)*z1 + (x3-x1)*z2;

  return {x:-zx/(2*z), y:zy/(2*z)}
}

function PerCir(dot1, dot2, dot3, A){
  const cent = CenterOfCircle(dot1, dot2, dot3);
  const d = distance(dot3.x, dot3.y, A.x, A.y);
  const R = distance(dot1.x, dot1.y, cent.x, cent.y);
  var alpha = getAngle(dot3.x, dot3.y, cent.x, cent.y, A.x, A.y, R, d);
  if (alpha>Math.PI)
    alpha = 2*Math.PI - alpha;
  if (alpha>Math.PI/6)
    return false;
  const l = R*(Math.sin(2*alpha)/Math.sin(alpha));

  return (d>=l);
}

function build() {
  if (dots.length <= 1) return;
  if (dots.length == 2) {
    dots[0].conn.push(dots[1])
    dots[1].conn.push(dots[0])
    return;
  }
  if (dots.length == 3) {
    handle3([dots[0], dots[1], dots[2]])
    return;
  }
  const dotsRes = $.extend(true, [], dots);

  for (var i = 0; i<dots.length; i++)
  {
    const dot = dots[i];
    dots.splice(i,1)
    build()
    if (checkAddingAdditional(dot)) return;
    //dots = dotsRes.slice()
    dots = $.extend(true, [], dotsRes);
  }

  for (var i = 0; i<dots.length; i++)
    for (var j = i+1; j<dots.length; j++) {
      var dot1 = dots[i];
      var dot2 = dots[j];
      dots.splice(i,1)
      dots.splice(j-1,1)
      const dotsRes2 = $.extend(true, [], dots);
      const newDots = getSim(dot1.x,dot1.y,dot2.x,dot2.y);
      var newDot1 = newDots.first;
      var newDot2 = newDots.second;

      var f1 = {x:newDot1.x, y:newDot1.y}
      dots.push(newDot1);
      build();
      for (var p = 0; p<dots.length; p++) if (f1.x == dots[p].x && f1.y == dots[p].y) {newDot1 = dots[p];break;}
      if (newDot1.conn.length == 1 && PerCir(dot1,dot2,newDot1,newDot1.conn[0])) {
        var dot3 = newDot1.conn[0]
        dots.splice(dots.indexOf(newDot1), 1);
        dot3.conn.splice(dot3.conn.indexOf(newDot1), 1);
        dots.push(dot1); dots.push(dot2);
        delete newDot1;
        handle3([dot1, dot2, dot3])
        return;
      }
      dots = $.extend(true, [], dotsRes2);

      var f2 = {x:newDot2.x, y:newDot2.y}
      dots.push(newDot2);
      build();
      for (var p = 0; p<dots.length; p++) if (f2.x == dots[p].x && f2.y == dots[p].y) {newDot2 = dots[p];break;}
      if (newDot2.conn.length == 1 && PerCir(dot1,dot2,newDot2,newDot2.conn[0])) {
        var dot3 = newDot2.conn[0]
        handle3([dot1, dot2, dot3])
        dots.splice(dots.indexOf(newDot2), 1);
        dot3.conn.splice(dot3.conn.indexOf(newDot2), 1);
        dots.push(dot1); dots.push(dot2);
        newDot2.conn=[]
        delete newDot2;
        return;
      }
      dots = $.extend(true, [], dotsRes);
    }
}

function start() {
  build()
  draw()
}

function initialize(){
  var deltaX = canvas.offsetLeft;
  var deltaY = canvas.offsetTop;

  $('#network').click(function(e){
    var x = e.clientX-deltaX
      , y = e.clientY-deltaY
    buildDot(x,y);
  })
}

initialize()