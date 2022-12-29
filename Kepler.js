//loome eraldi massiivid koefitsentide jaoks
var a=new Array(6);
var b=new Array(6);
var ch=new Array(6);
var ct=new Array(6);
var k=new Array(6);
var y=new Array(4);
var ynew=new Array(4);
var te=new Array(4);
var yy=new Array(4);
var yp=new Array(4);

var graafikute_kõrgus=300;
var plot_offset_X=100;
var plot_offset_Y=graafikute_kõrgus/2;

var n=4; // võrrandite arv diff võrrandi süsteemis
var e=0.025; // suvaline error
var h=10;
var t=0.0;
var nt=60000.0;
var it=0;

// Keskkond
var g_acceleration = 9.8; // m/s^2
var G_const = 6.67430e-11;// kg^-2 N*m^2


var model_num=["Maa","Mars","Veenus", "Jupiter"];
var planet_radius=[6371.0, 3389.5, 6051.8, 69911.0]; // in kilometers
var planet_mass=[5.97219e24, 6.39e23, 4.867e24, 1.898e27]; //in kilogramm
//var planet_mass=[5.97219*pow(10,24), 6.39*pow(10,23), 4.867*pow(10,24), 1.898*pow(10,27)]; //in kilogramm
//var planet_mass=[5.97219*10**24, 6.39*10**23, 4.867*10**24, 1.898*10**27];
var gravity_coef = 1.0;
var mass_default = 5.97219e24;
var radius_default = 6371.0;

// Keha
var m_body=100.0; // kilogramm
var r_body=0.001; // kilomeeter
var c_body= 0.47; //
var systeem_resetitud=true;
var sisendid_korras=false;

var plots_x_values=700;
var UUS_aja_array_fikseeritud = new Array(plots_x_values);
for (i=0; i<UUS_aja_array_fikseeritud.length; i++){
  UUS_aja_array_fikseeritud[i]=i+1;
};

y[0]=6500;
y[1]=0;
y[2]=0;
y[3]=Math.sqrt( (G_const*planet_mass[0] *1e-9)/(planet_radius[0]+100) );
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
yp[0]=yy[2];
yp[1]=yy[3];
nimetaja = Math.sqrt(yy[0]*yy[0] + yy[1]*yy[1])*Math.sqrt(yy[0]*yy[0] + yy[1]*yy[1])*Math.sqrt(yy[0]*yy[0] + yy[1]*yy[1]);
yp[2]=-(G_const*mass*1e-9*yy[0])/nimetaja;
yp[3]=-(G_const*(mass*1e-9)*yy[1])/nimetaja;
}



function integration(){
var neq,ynew=new Array(4),te=new Array(4);

 //k0
 for (i=0;i<n;i++){
   yy[i]=y[i];
  }
 diff();
 for (neq=0;neq<n;neq++){
   k[0][neq]=h*yp[neq];
 }
  
 //k1
 for (i=0;i<n;i++){
   yy[i]=y[i]+b[0][1]*k[0][i];
 }
 diff();
 for (neq=0;neq<n;neq++){
   k[1][neq]=h*yp[neq];
 }
  
 //k2
 for (i=0;i<n;i++)
   {yy[i]=y[i]+b[0][2]*k[0][i]+b[1][2]*k[1][i];
}
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
 y[2]=ynew[2];
 y[3]=ynew[3];
}



var toggle=true;
function toggle_button() {
  if (toggle==true){

    toggle= !toggle;
    luba_integreerimiseks=true;
    STOP_CONTINUE_button.html("Paus");
    STOP_CONTINUE_button.style("background-color","white")
    STOP_CONTINUE_button.style('color','black');
  }
  else if (toggle==false){ 

        toggle= !toggle;
        luba_integreerimiseks=false;
        STOP_CONTINUE_button.html("Jätka");
        STOP_CONTINUE_button.style("background-color","#4A88E0")
        STOP_CONTINUE_button.style('color','white');
   }
}

function init_model(num){

  
plot_scale=1.0;
anim_scale=1.0;

aja_massiiv=[];
Vx_massiiv=[];
Vy_massiiv=[];
Ax_massiiv=[];
Ay_massiiv=[];
Epot_massiiv=[];
Ekin_massiiv=[];
Etot_massiiv=[];  
h_massiiv=[]; //planeedi tsentrist moodulini  
V_mod_massiiv=[];
A_mod_massiiv=[];
  
model_name=model_num[num];
radius=planet_radius[num];
mass=planet_mass[num];

t=0.0;
nt=60000.0;
it=0.0;
 
background(0);
}


function setup() {
  
aja_massiiv=[];
Vx_massiiv=[];
Vy_massiiv=[];
Ax_massiiv=[];
Ay_massiiv=[];
Epot_massiiv=[];
Ekin_massiiv=[];
Etot_massiiv=[];  
h_massiiv=[]; //planeedi tsentrist moodulini  
V_mod_massiiv=[];
A_mod_massiiv=[];
  
createCanvas(800,500+graafikute_kõrgus);
background(0);
coefficients();
init_model(0);
model_name=model_num[0];

STOP_CONTINUE_button = createButton("Start");
STOP_CONTINUE_button.size(100,50);
STOP_CONTINUE_button.position(width-30, (height-graafikute_kõrgus)*0+30);
STOP_CONTINUE_button.mousePressed(toggle_button);
STOP_CONTINUE_button.style('padding','10px 20px');
STOP_CONTINUE_button.style('background-color','#4A88E0');
STOP_CONTINUE_button.style('color','white');
STOP_CONTINUE_button.style('font-weight','bold');
STOP_CONTINUE_button.style('border-radius','30px');
STOP_CONTINUE_button.style('margin-top','30px');
STOP_CONTINUE_button.style('margin-left','80px');

  
  RESET=createButton("Reset");
  RESET.size(100,50);
  RESET.position(width-30, 460);
  RESET.mousePressed(Reset_system);
  RESET.style('padding','10px 20px');
  RESET.style('background-color','grey');
  RESET.style('color','black');
  RESET.style('font-weight','bold');
  RESET.style('border-radius','30px');
  RESET.style('margin-top','30px');
  RESET.style('margin-left','80px');

EARTH_button = createButton("Maa");
EARTH_button.size(100,50);
EARTH_button.position(width-30, (height-graafikute_kõrgus)*0+100);
EARTH_button.mousePressed(function(){init_model(0);});
EARTH_button.style('padding','10px 20px');
EARTH_button.style('background-color','white');
EARTH_button.style('color','black');
EARTH_button.style('font-weight','bold');
EARTH_button.style('border-radius','30px');
EARTH_button.style('margin-top','30px');
EARTH_button.style('margin-left','80px'); 

MARS_button = createButton("Mars");
MARS_button.size(100,50);
MARS_button.position(width-30, (height-graafikute_kõrgus)*0+160);
MARS_button.mousePressed(function(){init_model(1);});
MARS_button.style('padding','10px 20px');
MARS_button.style('background-color','white');
MARS_button.style('color','black');
MARS_button.style('font-weight','bold');
MARS_button.style('border-radius','30px');
MARS_button.style('margin-top','30px');
MARS_button.style('margin-left','80px'); 

VENUS_button = createButton("Veenus");
VENUS_button.size(100,50);
VENUS_button.position(width-30, (height-graafikute_kõrgus)*0+220);
VENUS_button.mousePressed(function(){init_model(2);});
VENUS_button.style('padding','10px 20px');
VENUS_button.style('background-color','white');
VENUS_button.style('color','black');
VENUS_button.style('font-weight','bold');
VENUS_button.style('border-radius','30px');
VENUS_button.style('margin-top','30px');
VENUS_button.style('margin-left','80px'); 

X_coord_input=createInput().attribute('placeholder', 'X');
X_coord_input.position(width+90, 360);
X_coord_input.value(y[0]);
X_coord_input.size(80,15);
Y_coord_input=createInput().attribute('placeholder', 'Y');
Y_coord_input.position(width+90,390);
Y_coord_input.value(y[1]);
Y_coord_input.size(80,15);
Vx_input=createInput().attribute("placeholder","Vx");
Vx_input.position(width+90,420);
Vx_input.value(y[2]);
Vx_input.size(80,15);
Vy_input=createInput().attribute("placeholder","Vy");
Vy_input.position(width+90,450);
Vy_input.value(y[3]);
Vy_input.size(80,15);
  

Xinput_text=createP("x =");
Xinput_text.style("font: Times New Roman");
Xinput_text.style("font-size: 16px");
Xinput_text.position(width+60,345);

Yinput_text=createP("y =");
Yinput_text.style("font: Times New Roman");
Yinput_text.style("font-size: 16px");
Yinput_text.position(width+60,375);  

Vxinput_text=createP("Vx =");
Vxinput_text.style("font: Times New Roman");
Vxinput_text.style("font-size: 16px");
Vxinput_text.position(width+48,405); 

Vyinput_text=createP("Vy =");
Vyinput_text.style("font: Times New Roman");
Vyinput_text.style("font-size: 16px");
Vyinput_text.position(width+48,435);   
  
WARNING_TEXT=createP();
WARNING_TEXT.position(width/2-130,350);
WARNING_TEXT.style("color","red");
WARNING_TEXT.style("font","Times New Roman")
WARNING_TEXT.style("font-size","24px");
  
algtingimused_text=createP("Algtingimused");
algtingimused_text.position(width+50,(height-graafikute_kõrgus)*0+290);
algtingimused_text.style("font: Times New Roman");
algtingimused_text.style("font-size: 24px;");

// ------------------- PLOT OPTIONS ----------------
  
radio2 = createRadio();
radio2.position(width+50, height/2+300);
radio2.option(1,"v(t)");
radio2.option(2,"a(t)");
radio2.option(3,"E(t)");
radio2.style('width', '50px');
radio2.style('checked','0');
radio2.selected('3');

MORE_OPTIONS_TEXT=createP("Muud sätted");
MORE_OPTIONS_TEXT.position(width+50,height-260);
MORE_OPTIONS_TEXT.style("font: Times New Roman");
MORE_OPTIONS_TEXT.style("font-size: 24px");
  
PLOT_SCALE_SLIDER=createSlider(0.1, 5, 1, 0.1);
PLOT_SCALE_SLIDER.position(width+50,height-130);
PLOT_SCALE_SLIDER_TEXT=createP("Graafiku skaala");
PLOT_SCALE_SLIDER_TEXT.position(width+50, height-160);
ANIM_SCALE_SLIDER=createSlider(0.1, 5, 1, 0.1);
ANIM_SCALE_SLIDER.position(width+50,height-180);
ANIM_TEXT=createP("Animatsiooni skaala");
ANIM_TEXT.position(width+50,height-210);
//-------------------- PLOT OPTIONS ----------------
  
//noLoop();
}

var luba_integreerimiseks=false;
function draw() {
  
  clear();
  background(0);
  input_1=X_coord_input.value();
  input_2=Y_coord_input.value();
  input_3=Vx_input.value();
  input_4=Vy_input.value(); 
  
 if (sisendid_korras==false){

  if (input_1.length>0  && isNaN(input_1)==false ){
    y[0]=float(input_1);
    korras_1=true;
  } else {
    korras_1=false;

  }
  if (input_2.length>0  && isNaN(input_2)==false ){
    y[1]=float(input_2);
    korras_2=true;
  }  else {
    korras_2=false;
  }
  if (input_3.length>0  && isNaN(input_3)==false ){
    y[2]=float(input_3);
    korras_3=true;
  } else{
    korras_3=false;
  }
  if (input_4.length>0  && isNaN(input_4)==false ){
    y[3]=float(input_4);
    korras_4=true;
  } else{
    korras_4=false;
  }
   
   if (korras_1==false || korras_2==false || korras_3==false || korras_4==false ){
    WARNING_TEXT.html("Vali sobivad algtingimused!");
   } else{
     WARNING_TEXT.html("");
   }
   
   if (korras_1==true && korras_2==true && korras_3==true && korras_4==true){
     sisendid_korras=true;
    } else{
      sisendid_korras=false;
    }
 }
  
  if(sisendid_korras==true && systeem_resetitud==true && luba_integreerimiseks==true ){ 
    it=it+h;
    integration(); 
    
    E_pot = -(G_const*m_body*mass)/(Math.sqrt(y[0]*y[0]+y[1]*y[1])*1e3);
    E_kin = (m_body*(y[2]*y[2]+y[3]*y[3])*1e6)/2.0;
    E_tot = E_pot+E_kin;
    
  aja_massiiv.push(it);
  Vx_massiiv.push(y[2]);
  Vy_massiiv.push(y[3]);
  Ax_massiiv.push(yp[2]);
  Ay_massiiv.push(yp[3]);
  Etot_massiiv.push(E_tot);
  
  if (aja_massiiv.length>600){
    aja_massiiv.shift();
    Vx_massiiv.shift();
    Vy_massiiv.shift();
    Ax_massiiv.shift();
    Ay_massiiv.shift();
    Etot_massiiv.shift();
  }
    
    // MASSIIVID SIIA!!!!!!
  }

  
// mass = MASS_SLIDER.value();
// radius = RAADIUS_SLIDER.value();
plot_scale=PLOT_SCALE_SLIDER.value();
anim_scale=ANIM_SCALE_SLIDER.value();
  
fill(255);
circle(width/2, (height-graafikute_kõrgus)/2 ,2*radius/(100*anim_scale)); // Planet
  push();
  fill(255,0,0);
circle((y[0]/(100*anim_scale))+width/2, -1*y[1]/(100*anim_scale)+(height-graafikute_kõrgus)/2 ,1000/(100*anim_scale)); // Sattelite
  pop();


push();
stroke(0);
strokeWeight(3);
fill(255);
textSize(22);
text("Aeg t: "+ it,20,30);
text("x:"+round(y[0],2),30,60);
text("y:" + round(y[1],2),30,90);
text("Vx:"+round(y[2],2),30,120);
text("Vy:"+round(y[3],2),30,150);
text("h: "+(round_2(Math.sqrt(y[0]*y[0]+y[1]*y[1])-radius)), 30,180);
text("Planeet: "+model_name, width/2, (height-graafikute_kõrgus)*0+50);
text(round_0(radius*(anim_scale)),((width-200)+(width-200+radius/100))/2-30,40  );
pop();
// mass_slider_text.html("Mass: "+mass);
// radius_slider_text.html("Radius: "+radius);

// MÕÕTKAVA
push();
stroke(125);
strokeWeight(2);
line(width-200, 50,width-200,75);
line(width-200+radius/100, 50,width-200+radius/100,75);
line(width-200,50,width-200+radius/100,50)
pop();
  

// --------------------- PLOT ------------------------------


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
      GRAAFIK_V_AEG();
      break;
    case "2":
      GRAAFIK_A_AEG();
      break;
    case "3":
      GRAAFIK_E_tot_AEG();
      break;
    
  }
//------------------------PLOT-----------------------------
  
if ( Math.sqrt(y[0]*y[0]+y[1]*y[1])<=radius ) {
  push();
  fill(255,0,0);
  textSize(24)
  text("Moodul langes planeedi pinnale",width/2-150,150);
  pop();
  luba_integreerimiseks=false;
  systeem_resetitud=false;
  STOP_CONTINUE_button.html("Jätka");
  STOP_CONTINUE_button.style("background-color","#4A88E0")
  STOP_CONTINUE_button.style('color','white');
 
} 

  
}

var V_väärtused=[-15 ,-12.5 ,-10 ,-7.5 ,-5 ,-2.5 ,0 ,2.5 ,5 ,7.5 ,10 ,12.5];
function GRAAFIK_V_AEG() {
  for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    textAlign(RIGHT);
    text(round_2(V_väärtused[j]*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
  push();
  textAlign(RIGHT);
  textSize(16);
  text("Vx(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[km/s]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
  push();
  stroke(255,125,0);
  strokeWeight(1);
  for (var k=0; k<=aja_massiiv.length; k=k+1){
    if (abs(( Math.sqrt((Vx_massiiv[k]*Vx_massiiv[k])+(Vy_massiiv[k]*Vy_massiiv[k]))*10 )/plot_scale) <= graafikute_kõrgus/2) {
      //console.log(Vx_massiiv[k]);
      if (k>=1) {

        line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X,-Math.sqrt((Vx_massiiv[k-1]*Vx_massiiv[k-1])+(Vy_massiiv[k-1]*Vy_massiiv[k-1]))*10/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -Math.sqrt((Vx_massiiv[k]*Vx_massiiv[k])+(Vy_massiiv[k]*Vy_massiiv[k]))*10/plot_scale+(height-plot_offset_Y) );
  };
    };
  };
  pop();
};


function GRAAFIK_A_AEG(){
  for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    textAlign(RIGHT);
    text(round_4((V_väärtused[j]/100)*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
   push();
  textAlign(RIGHT);
  textSize(16);
  text("Ax(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[km/s2]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
push();
stroke(255,125,0);
strokeWeight(1.5);
for (var k=0; k<=aja_massiiv.length; k=k+1) {
  if ( abs((Math.sqrt(Ax_massiiv[k]*Ax_massiiv[k]+Ay_massiiv[k]*Ay_massiiv[k])*1000)/plot_scale) <= graafikute_kõrgus/2 ) {
    //console.log(Ax_massiiv[k]);
      if (k>=1) {
      stroke(255,125,0);
      strokeWeight(1);
      line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X,-(Math.sqrt(Ax_massiiv[k-1]*Ax_massiiv[k-1]+Ay_massiiv[k-1]*Ay_massiiv[k-1])  )*1000/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -(Math.sqrt(Ax_massiiv[k]*Ax_massiiv[k]+Ay_massiiv[k]*Ay_massiiv[k]))*1000/plot_scale+(height-plot_offset_Y) );
  };
  };
};
pop();    
};



function GRAAFIK_E_tot_AEG(){
    for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    textAlign(RIGHT);
    text(round_4((V_väärtused[j])*10*plot_scale) , plot_offset_X-15, height-25*j);
    pop();
  };
  push();
  textAlign(RIGHT);
  textSize(16);
  text("E(t)", plot_offset_X-35, height-graafikute_kõrgus/2);
  text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("t [s]",width-25, height-graafikute_kõrgus/2+20 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("1e8", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
  
push();
stroke(255,125,0);
strokeWeight(1.5);
for (var k=0; k<=aja_massiiv.length; k=k+1) {
  if (abs((Etot_massiiv[k]/1e8)/plot_scale) <= graafikute_kõrgus/2 ) {
    push();
    fill(255);
    stroke(255,125,0);
    strokeWeight(1);
    //console.log(Etot_massiiv[k]/1e8);
    pop();
    if (k>=1) {
      stroke(255,125,0);
      strokeWeight(1);
      line((UUS_aja_array_fikseeritud[k-1])+plot_offset_X, -(Etot_massiiv[k-1]/1e8)/plot_scale+(height-plot_offset_Y) ,(UUS_aja_array_fikseeritud[k])+plot_offset_X , -(Etot_massiiv[k]/1e8)/plot_scale+(height-plot_offset_Y) );
  };
  };
};
pop();      
};



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


function Reset_system(){

  
a=new Array(6);
b=new Array(6);
ch=new Array(6);
ct=new Array(6);
k=new Array(6);
y=new Array(4);
ynew=new Array(4);
te=new Array(4);
yy=new Array(4);
yp=new Array(4);
  

    aja_massiiv=[];
    Vx_massiiv=[];
    Vy_massiiv=[];
    Ax_massiiv=[];
    Ay_massiiv=[];
    Etot_massiiv=[];
  

 y[0]=float(X_coord_input.value());
 y[1]=float(Y_coord_input.value());
 y[2]=float(Vx_input.value());
 y[3]=float(Vy_input.value());
  
 for (var i=0; i<6; i++){
k[i]= new Array(n);}

for (var i=0; i<6;i++){
b[i]=new Array(5);}
  
t=0.0;
nt=60000.0;
it=0.0;
coefficients()
systeem_resetitud=true;
sisendid_korras=false;
}
