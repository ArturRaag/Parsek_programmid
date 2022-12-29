//loome eraldi massiivid koefitsentide jaoks
var a=new Array(6);
var b=new Array(6);
var ch=new Array(6);
var ct=new Array(6);
var k=new Array(6);

// massiivid andmete jaoks
var y=new Array(2);
var ynew=new Array(2);
var te=new Array(2);
var yy=new Array(2);
var yp=new Array(2);


var graafikute_kõrgus=300;
var plot_offset_X=100;
var plot_offset_Y=graafikute_kõrgus/2;
var plots_x_values=700;
var UUS_aja_array_fikseeritud = new Array(plots_x_values);
for (i=0; i<UUS_aja_array_fikseeritud.length; i++){
  UUS_aja_array_fikseeritud[i]=i+1;
};

var n=2; // võrrandite arv diff võrrandi süsteemis
var e=0.025; // suvaline error
var h=0.01;
var t=0.0;
var nt=6000.0;
var it=0;

var m=1;
var k_Hooke=1;

var locked=false;

var amplifier_t=10;

// ------------------------------------------------------ ALGUS -------------------------------------------------------------------------

// k_{i,n} masiiv, i=k_{i} ja n= võrrandi number
for (var i=0; i<6; i++){
k[i]= new Array(n);}

for (var i=0; i<6;i++){
b[i]=new Array(5);}


function coefficients(){

//Fehlebrgi A koefitsendid
a[0]=0;
a[1]=1.0/4.0;
a[2]=3.0/8.0 ;
a[3]=12.0/13.0;
a[4]=1;
a[5]=1.0/2.0;

 // Alguses oli massiv b initsialiseeritud kui 1 veeruline maatriks, nüüd on tal 6 rida ja 5 veergu
// Täidame B massiivi ära Fehlbergi koefitsentidega
b[0][0]=0;
b[0][1]=1.0/4.0;
b[0][2]=3.0/32.0;
b[0][3]=1932.0/2197.0;
b[0][4]=439.0/216.0;
b[0][5]=-8.0/27.0;

b[1][0]=0;
b[1][1]=0;
b[1][2]=9.0/32.0;
b[1][3]=-7200.0/2197.0;
b[1][4]=-8.0;
b[1][5]=2.0;

b[2][0]=0;
b[2][1]=0;
b[2][2]=0;
b[2][3]=7296.0/2197.0;
b[2][4]=3680.0/513.0;
b[2][5]=-3544.0/2565.0;

b[3][0]=0;
b[3][1]=0;
b[3][2]=0;
b[3][3]=0;
b[3][4]=-845.0/4104.0;
b[3][5]=1859.0/4104.0;

b[4][0]=0;
b[4][1]=0;
b[4][2]=0;
b[4][3]=0;
b[4][4]=0;
b[4][5]=-11.0/40.0;

//Fehlbergi CH koefitsendid
ch[0]=16.0/135.0;
ch[1]=0.0;
ch[2]=6656.0/12825.0;
ch[3]=28561.0/56430.0;
ch[4]=-9.0/50.0;
ch[5]=2.0/55.0;
//Fehlbergi CT koefitsendid
ct[0]=1.0/360.0;
ct[1]=0.0;
ct[2]=-128.0/4275.0;
ct[3]=-2197.0/75240;
ct[4]=1.0/50.0;
ct[5]=2.0/55.0;

}


// Differential equations
function diff() // Neid argumente ju funktsiooni sees ei ole?
{
beta=alfa/(2.0*m);
Fv=Fv_SLIDER.value();
T=T_SLIDER.value(); //periood
wv=1/T; //sagedus
omega_ruut = k_Hooke/m;

if (mudel_num==1){
//console.log(omega_ruut);
yp[0]=yy[1];
yp[1]=-omega_ruut*yy[0];
} else if (mudel_num==2){
  yp[0]=yy[1];
  yp[1]=-2*beta*yy[1]-k_Hooke*yy[0];
} else if (mudel_num==3){
  yp[0] = yy[1];
  yp[1]= -2*beta*yy[1]-k_Hooke*yy[0]+Fv*cos(wv*it);
}
}




function integration()
{
var neq,i,ynew=new Array(4),te=new Array(4);

 //document.write(neq,"<br>")
  
 //k0
 for (i=0;i<n;i++)
   {yy[i]=y[i];}
 diff();
 for (neq=0;neq<n;neq++)
   {k[0][neq]=h*yp[neq];}
  
 //k1
 for (i=0;i<n;i++)
   {yy[i]=y[i]+b[0][1]*k[0][i];}
 diff();
 for (neq=0;neq<n;neq++)
   {k[1][neq]=h*yp[neq];}
  
 //k2
 for (i=0;i<n;i++)
   {yy[i]=y[i]+b[0][2]*k[0][i]+b[1][2]*k[1][i];}
 diff();
 for (neq=0;neq<n;neq++)
   {k[2][neq]=h*yp[neq];}
  
 //k3
 for (i=0;i<n;i++)
 {
 yy[i]=y[i]+b[0][3]*k[0][i]+b[1][3]*k[1][i]+b[2][3]*k[2][i];
 }
 diff();
 for (neq=0;neq<n;neq++)
 {k[3][neq]=h*yp[neq];}
  
 //k4
 for (i=0;i<n;i++)
 {
 yy[i]=y[i]+b[0][4]*k[0][i]+b[1][4]*k[1][i]+b[2][4]*k[2][i]+b[3][4]*k[3][i];
 }
 diff();
 for (neq=0;neq<n;neq++)
 {k[4][neq]=h*yp[neq];}
  
 //k5
 for (i=0;i<n;i++)
 {
 yy[i]=y[i]+b[0][5]*k[0][i]+b[1][5]*k[1][i]+b[2][5]*k[2][i]+b[3][5]*k[3][i]+b[4][5]*k[4][i];
 }
 diff();
 for (neq=0;neq<n;neq++)
 {k[5][neq]=h*yp[neq];}
  
 // lopp liitmine
 for (neq=0;neq<n;neq++)
 {ynew[neq]=y[neq]+ch[0]*k[0][neq]+ch[1]*k[1][neq]+ch[2]*k[2][neq]+ch[3]*k[3][neq]+ch[4]*k[4][neq]+ch[5]*k[5][neq];}

//  te[neq]=Math.abs(ct[0]*k[neq][0]+ct[1]*k[neq][1]+ct[2]*k[neq][2]+ct[3]*k[neq][3]+ct[4]*k[neq][4]+ct[5]*k[neq][5]);
  
//  for (neq=0; neq<n;neq++){
//  h_uus=0.9*h*pow((e/te[neq]), 1.0/4.0); 
//  if (te[neq]>e ) {
//  h=h_uus;
//  neq=neq-1; // Kordame iteratsiooni järgmisel iteratsioonil
//  } else if (te[neq]<= e){
//  h=h_uus; // iteratsiooni ei korda, lähme edasi.
//  }
//  }
  
 t=t+h;
 y[0]=ynew[0];
 y[1]=ynew[1];
}

function init_model_1(){
  
   mudel_num=1;
   nihe=0;
  
  plot_scale=1.0;
  
  t=0.0;
  nt=60000.0;
  it=0.0;
  // pendli omadused:
   k_Hooke = 5.0;
   m = 0.1;
   T=5;
   alfa=0.1;
   Fv=5.0; 
   // HOOKE_SLIDER.value(k_Hooke);
   MASS_SLIDER.value(m);
   // T_SLIDER.value(T);
   // Fv_SLIDER.value(Fv);
   // ALPHA_SLIDER.value(alfa);
  
   omega_ruut = k_Hooke/m;

  //algtingimused
  y[0]=0.0;
  y[1]=0.0;


  aja_massiiv=[];
  Epot_massiiv=[];
  Ekin_massiiv=[];
  Etot_massiiv=[];  
}


function init_model_2(){
  
   mudel_num=2;
   nihe=0;
  
  plot_scale=1.0;
  
  t=0.0;
  nt=60000.0;
  it=0.0;
  // pendli omadused:
   k_Hooke = 5;
   m = 0.1;

   omega_ruut = k_Hooke/m;
   alfa=0.1; // Takistusjõu tegur?
   beta=alfa/(2.0*m);
   T=5;
   Fv=5.0;
   // T_SLIDER.value(T);
   // Fv_SLIDER.value(Fv);
   // ALPHA_SLIDER.value(alfa);
   // HOOKE_SLIDER.value(k_Hooke);
   MASS_SLIDER.value(m);
  
  
  //algtingimused
  y[0]=0.0;
  y[1]=0.0;

  //plot_scale=1.0;
  
  aja_massiiv=[];
  Epot_massiiv=[];
  Ekin_massiiv=[];
  Etot_massiiv=[];  
}


function init_model_3(){
  
  mudel_num=3;
  
  plot_scale=1.0;
  nihe=0;
  
  t=0.0;
  nt=6000.0;
  it=0.0;
 
  // pendli omadused:
   k_Hooke = 5;
   m = 0.1;
   omega_ruut = k_Hooke/m;
   alfa=0.1; // Takistusjõu tegur?
   beta=alfa/(2.0*m);
   Fv=5 // kN;
   T=5; //periood
   wv=1/T; //sagedus
  
   // T_SLIDER.value(T);
   // Fv_SLIDER.value(Fv);
   // ALPHA_SLIDER.value(alfa);
   // HOOKE_SLIDER.value(k_Hooke);
   MASS_SLIDER.value(m);
  
  
  
  //algtingimused
  y[0]=0.0;
  y[1]=0.0;

  //plot_scale=1.0;
  
  aja_massiiv=[];
  Epot_massiiv=[];
  Ekin_massiiv=[];
  Etot_massiiv=[];  
}


function setup() {
  
  aja_massiiv=[];
  Epot_massiiv=[];
  Ekin_massiiv=[];
  Etot_massiiv=[];  
  createCanvas(900,400+graafikute_kõrgus);
  coefficients();
  
  STOP_CONTINUE_button = createButton("Start simulation");
  STOP_CONTINUE_button.size(100,50);
  STOP_CONTINUE_button.position(width+50, height-50);
  STOP_CONTINUE_button.mousePressed(toggle_button);
  
  MODEL_1_BUTTON=createButton("Harmooniline");
  MODEL_2_BUTTON=createButton("Sumbvõnkumised");
  MODEL_3_BUTTON=createButton("Sundvõnkumised");
  
  MODEL_1_BUTTON.position(width+50,50);
  MODEL_2_BUTTON.position(width+50,100);
  MODEL_3_BUTTON.position(width+50,150);
  
  MODEL_1_BUTTON.size(100,40);
  MODEL_2_BUTTON.size(120,40);
  MODEL_3_BUTTON.size(120,40);
  
  MODEL_1_BUTTON.mousePressed(function(){clear_HTML();});
  MODEL_1_BUTTON.mousePressed(function(){init_model_1();});
  MODEL_2_BUTTON.mousePressed(function(){init_model_2();});
  MODEL_3_BUTTON.mousePressed(function(){init_model_3();});
  
  MASS_SLIDER=createSlider(0.01, 2, 0.1, 0.01);
  MASS_SLIDER.position(width+50,230);
  MASS_SLIDER_TEXT=createP("Mass: "+m+"kg");
  MASS_SLIDER_TEXT.position(width+50,200);
  
  HOOKE_SLIDER=createSlider(0.01,9.0 , 5.0, 0.01);
  HOOKE_SLIDER.position(width+50,280);
  HOOKE_SLIDER_TEXT=createP("Vedru jäikus "+k_Hooke);
  HOOKE_SLIDER_TEXT.position(width+50,250);
  
  ALPHA_SLIDER=createSlider(0,1,0.1,0.01);
  ALPHA_SLIDER.position(width+50,330);
  ALPHA_SLIDER_TEXT=createP("Takistusjõu tegur (alfa): "+ALPHA_SLIDER.value());
  ALPHA_SLIDER_TEXT.position(width+50,300);
  
  Fv_SLIDER=createSlider(0,100,10,0.1);
  Fv_SLIDER.position(width+50,370);
  Fv_SLIDER_TEXT=createP("Väline jõud (amplituud): "+Fv_SLIDER.value());
  Fv_SLIDER_TEXT.position(width+50,340);

  T_SLIDER=createSlider(0.1,10,1,0.1);
  T_SLIDER.position(width+50,410);
  T_SLIDER_TEXT=createP("Periood: "+T_SLIDER.value());
  T_SLIDER_TEXT.position(width+50,380);
  
  
  radio2 = createRadio();
  radio2.position(width+50, (height-graafikute_kõrgus)+90);
  radio2.option(1,"EK(t)");
  radio2.option(2,"EP(t)");
  radio2.option(3,"ET(t)");
  radio2.style('width', '70px');
  radio2.style('checked','0');
  radio2.selected('1');
  
  PLOT_SCALE_SLIDER=createSlider(0.01, 5, 1, 0.1);
  PLOT_SCALE_SLIDER.position(width+50,height-100);
  PLOT_SCALE_SLIDER_TEXT=createP("Graafiku skaala");
  PLOT_SCALE_SLIDER_TEXT.position(width+50, height-130);
  
  init_model_1();
  noLoop();
}


function draw() {
  
  plot_scale=PLOT_SCALE_SLIDER.value();
  
  background(0);
  m=MASS_SLIDER.value();
  k_Hooke=HOOKE_SLIDER.value();
  Fv=Fv_SLIDER.value();
  alfa=ALPHA_SLIDER.value();

  if (locked==true){
    circle(mouseX,(height-graafikute_kõrgus)/2,20);
    push();
    fill(255);
    textSize(18);
    text("nihe: "+nihe+"m",width/2,30);
    pop();
  } else if(locked==false){
      it=it+h;
    integration();
    
      ekin=0.5*m*y[1]*y[1];
      epot=0.5*k_Hooke*y[0]*y[0];
      etot=ekin+epot;
    
    
    aja_massiiv.push(it);
    Epot_massiiv.push(epot);
    Ekin_massiiv.push(ekin);
    Etot_massiiv.push(etot);   
    
    if (aja_massiiv.length>plots_x_values){
      aja_massiiv.shift();
      Epot_massiiv.shift();
      Ekin_massiiv.shift();
      Etot_massiiv.shift();
      
    }
    
    
  MASS_SLIDER_TEXT.html("Mass: "+m+"kg");
  HOOKE_SLIDER_TEXT.html("Vedru jäikus: "+k_Hooke);
  ALPHA_SLIDER_TEXT.html("Takistusjõu tegur (alfa): "+ALPHA_SLIDER.value());
  Fv_SLIDER_TEXT.html("Väline jõud (amplituud): "+Fv_SLIDER.value());
  T_SLIDER_TEXT.html("Periood: "+T_SLIDER.value());
  //console.log(y[0],y[1]);
  circle(y[0]*10+width/2,(height-graafikute_kõrgus)/2,20);
    push();
    fill(255);
    text("nihe: "+nihe+"m",width/2,30);
    pop();
  }
  push();
  fill(255);
  text("x: "+round_2(y[0]),30,40);
  text("v: "+round_2(y[1]),30,70);
  text("v: "+round_2(yp[0]),30,100);
  text("a: "+round_2(yp[1]),30,130);
  pop();
  

  //console.log(y[0],y[1],yp[0],yp[1]);

  
  //------------------------------- PLOT ---------------------------------------------------
  // plot background
push();
//fill(32,42,68);
fill(25);
rect(0,height-graafikute_kõrgus,width,height);
pop();

// plot xy axis
push();
stroke(255);
strokeWeight(2);
line(plot_offset_X,height-plot_offset_Y,width,height-plot_offset_Y); // X- axis
line(width-10,height-(plot_offset_Y+5),width,height-plot_offset_Y);
line(width-10,height-(plot_offset_Y-5),width,height-plot_offset_Y);
line(plot_offset_X,height,plot_offset_X,height-graafikute_kõrgus); // Y-axis
line(plot_offset_X-5,height-graafikute_kõrgus+10,plot_offset_X, height-graafikute_kõrgus);
line(plot_offset_X+5,height-graafikute_kõrgus+10,plot_offset_X, height-graafikute_kõrgus);
for (j=0; j < 12; j=j+1 ) {
  push();
  stroke(255);
  strokeWeight(1);
  line(plot_offset_X-5,height-25*j, plot_offset_X+5, height-25*j);
  pop();
}
pop();
  
    switch (radio2.value()) {
    //radio value is always a string
    case "1":
      GRAAFIK_E_kin_AEG();
        break;
    case "2":
      GRAAFIK_E_pot_AEG();
        break;
    case "3":
      GRAAFIK_E_tot_AEG();
      break;
  }
  
};

var nihe=0;
function mouseDragged(){
  if (mouseX<=width && mouseX>=0 && mouseY<=height-graafikute_kõrgus && mouseY >=0){
  locked=true;
  nihe=(mouseX-(width/2))/10;
  y[0]=(mouseX-(width/2))/10;
  y[1]=0;
  yp[0]=0;
  yp[1]=0;
  }
}
function mouseReleased() {
  if (mouseX<=width && mouseX>=0 && mouseY<=height-graafikute_kõrgus && mouseY >=0){
  locked = false;
  }
}
function mouseClicked() {
  if (mouseX<=width && mouseX>=0 && mouseY<=height-graafikute_kõrgus && mouseY >=0){
  nihe=(mouseX-(width/2))/10;
  y[0]=(mouseX-(width/2))/10;
  y[1]=0;
  yp[0]=0;
  yp[1]=0;
}
} 


function round_0(v) {
  return (Math.sign(v)*Math.round(Math.abs(v)));
}

function round_1(v) {
  return (Math.sign(v)*Math.round(Math.abs(v)*10)/10);
}

function round_2(v) {
  return (Math.sign(v)*Math.round(Math.abs(v)*100)/100);
}

function round_3(v) {
  return (Math.sign(v)*Math.round(Math.abs(v)*1000)/1000);
}

function round_4(v) {
  return (Math.sign(v)*Math.round(Math.abs(v)*10000)/10000);
}



var V_väärtused=[-15 ,-12.5 ,-10 ,-7.5 ,-5 ,-2.5 ,0 ,2.5 ,5 ,7.5 ,10 ,12.5];
function GRAAFIK_E_tot_AEG(){
    for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    fill(255);
    textAlign(RIGHT);
    text(round_4((V_väärtused[j])*100*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
  push();
  fill(255);
  textAlign(RIGHT);
  textSize(16);
  text("ET(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
push();
stroke(255,125,0);
strokeWeight(1.5);
for (var k=0; k<=aja_massiiv.length; k=k+1) {
  if (abs((Etot_massiiv[k]/10)/plot_scale) <= graafikute_kõrgus/2 ) {
    if (k>=1) {
      line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X, -(Etot_massiiv[k-1]/10)/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -(Etot_massiiv[k]/10)/plot_scale+(height-plot_offset_Y) );
  };
  };
};
pop();      
};



function GRAAFIK_E_kin_AEG(){
    for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    fill(255);
    textAlign(RIGHT);
    text(round_4((V_väärtused[j])*100*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
  push();
  fill(255);
  textAlign(RIGHT);
  textSize(16);
  text("EK(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
push();
stroke(255,125,0);
strokeWeight(1.5);
for (var k=0; k<=aja_massiiv.length; k=k+1) {
  if (abs((Ekin_massiiv[k]/10)/plot_scale) <= graafikute_kõrgus/2 ) {
    if (k>=1) {
      line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X, -(Ekin_massiiv[k-1]/10)/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -(Ekin_massiiv[k]/10)/plot_scale+(height-plot_offset_Y) );
  };
  };
};
pop();      
};

function GRAAFIK_E_pot_AEG(){
    for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    fill(255);
    textAlign(RIGHT);
    text(round_4((V_väärtused[j])*100*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
  push();
  fill(255);
  textAlign(RIGHT);
  textSize(16);
  text("EP(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
push();
stroke(255,125,0);
strokeWeight(1.5);
for (var k=0; k<=aja_massiiv.length; k=k+1) {
  if (abs((Epot_massiiv[k]/10)/plot_scale) <= graafikute_kõrgus/2 ) {
    if (k>=1) {
      line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X, -(Epot_massiiv[k-1]/10)/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -(Epot_massiiv[k]/10)/plot_scale+(height-plot_offset_Y) );
  };
  };
};
pop();      
};


var toggle=true;
function toggle_button() {
  if (toggle==true){
    loop();
    toggle= !toggle;
    STOP_CONTINUE_button.html("Pause");
  }
  else if (toggle==false){ 
        noLoop();
        toggle= !toggle;
        STOP_CONTINUE_button.html("Continue");
   }
}
