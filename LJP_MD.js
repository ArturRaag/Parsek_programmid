var graafikute_kõrgus=310;
var plot_offset_X=100;
var plot_offset_Y=graafikute_kõrgus/2;
var plot_scale=1.0;
var plot_bottom_buffer=25;

// Constants
 var m=0.5;
 var epsilon=2;
 var sigma = 10;
 var dt=0.004;
 var t=0;
 var tau=Math.sqrt(((t*t)*24*epsilon)/(sigma*sigma));
 
 var n1=10;
 var n2=20;
 var particles=n1*n2;

var ax=new Array(particles);
var ay=new Array(particles);
var x=new Array(particles);
var y=new Array(particles);
var vx=new Array(particles);
var vy=new Array(particles);
var v_moodul = new Array(particles);
var vcorr=new Array(particles);

var v_max=1; // For generating random velocity values.

//*** data initialiation ***
var rh=10; // kaugus seinast y-suunas.
var rw=4.96; //kaugu seinast x-suunas.
var rl=new Array(2);
rl[0]=20.0;
rl[1]=40.0;
var inum=0;

var rcut=3.0; // SEE KIIRENDAB calc1() funktsioonis arvutamist millegipärast?????
var ag=0; // raskuskiirendus
var scaler=10;
var temperature=0.;
var show_one=false;
var draw_trail=false;
var draw_etot_plot=false;
var draw_vel_plot=true;
var trail_history = new Array();
var energy_array=[];
var iteratsioon=0;
var aja_array=[];
var plots_x_values=600;
var UUS_aja_array_fikseeritud = new Array(plots_x_values);
for (i=0; i<UUS_aja_array_fikseeritud.length; i++){
  UUS_aja_array_fikseeritud[i]=i+1;
};

//#####################################################################################
//### ------------- PAIGUTAME OSAKESED VÕREKUJULISE KONFIGURATSIOONIGA ------------- ##
//#####################################################################################
//_____________________________________________________________________________________
// Siin "1.12" on osakeste vaheline kaugus, mille puhul nad on tasakaalus.
// Muutuja "rw" on arv, mille võrra on kõik osakesed x-telje suunas nihutatud algasendist.
// Muutuja "rh" on arv, mille võrra on kõik osakesed y-telje suunas nihutatud algasendist.
// Muutujad "rw" ja "rh" lihtsalt tagavad meil seda, et osakesed oleksid initsialiseeritud
// seinast veidi eemal.
//_____________________________________________________________________________________
for (i=0; i<n1; i++){
  for (j=0; j<n2;j++){
        x[inum]= i*1.12+rw;
        y[inum]= j*1.12+rh;
        vx[inum]= (2.*Math.random()-1.)*v_max;
        vy[inum]= (2.*Math.random()-1.)*v_max; 
        // vx[inum]= 0;
        // vy[inum]= 0;
        inum++;
  }
}


//#####################################################################################
//##################------------ SETUP FUNCTION -------------##########################
//#####################################################################################
//_____________________________________________________________________________________
// Setupis on põhiliselt vaid graafiliseliidese elementide initsaliseerimine.
// Ainuke reaalne arvutus on funktsioon "forces()", mis initsialiseerib kõik
// osakestele mõjuvad jõud/kiirendused.
//_____________________________________________________________________________________
function setup() {
  createCanvas(rl[0]*scaler+500, rl[1]*scaler+graafikute_kõrgus);
  
  STOP_CONTINUE_button = createButton("Start");
  STOP_CONTINUE_button.size(100,50);
  STOP_CONTINUE_button.position(150, (height-graafikute_kõrgus)*0+30);
  STOP_CONTINUE_button.mousePressed(toggle_button);
  STOP_CONTINUE_button.style('padding','10px 20px');
  STOP_CONTINUE_button.style('background-color','#4A88E0');
  STOP_CONTINUE_button.style('color','white');
  STOP_CONTINUE_button.style('font-weight','bold');
  STOP_CONTINUE_button.style('border-radius','30px');
  STOP_CONTINUE_button.style('margin-top','30px');
  STOP_CONTINUE_button.style('margin-left','80px');
  
  SLOW_DOWN=createButton("Slow down");
  SLOW_DOWN.size(100,50);
  SLOW_DOWN.position(150, (height-graafikute_kõrgus)*0+90);
  SLOW_DOWN.mousePressed(slow_down);
  SLOW_DOWN.style('padding','10px 20px');
  SLOW_DOWN.style('background-color','white');
  SLOW_DOWN.style('color','black');
  SLOW_DOWN.style('font-weight','bold');
  SLOW_DOWN.style('border-radius','30px');
  SLOW_DOWN.style('margin-top','30px');
  SLOW_DOWN.style('margin-left','80px');
  
  RESET=createButton("Reset");
  RESET.size(100,50);
  RESET.position(150, (height-graafikute_kõrgus)*0+210);
  RESET.mousePressed(Reset_system);
  RESET.style('padding','10px 20px');
  RESET.style('background-color','grey');
  RESET.style('color','black');
  RESET.style('font-weight','bold');
  RESET.style('border-radius','30px');
  RESET.style('margin-top','30px');
  RESET.style('margin-left','80px');
  
  TEMP_SLIDER = createSlider(0.1 ,30, 1, 0.1);
  TEMP_SLIDER.position(410,180);
  TEMP_SLIDER.style("transform","rotate(-90deg)");
  TEMP_SLIDER.attribute("disabled","");
  Temperature_text=createP("");
  Temperature_text.position(470,80);
  Temperature_text.style("font-family: Times New Roman, Times, serif");
  Temperature_text.style("color: black");
  Temperature_text.style("font-size: 16px");
  
  GRAVITY_SLIDER = createSlider(0, 0.5, abs(ag) , 0.01);
  GRAVITY_SLIDER.position(330, 180);
  GRAVITY_SLIDER.style("transform","rotate(-90deg)");
  GRAVITY_SLIDER.attribute("disabled","");
  Gravity_text=createP("");
  Gravity_text.position(390,80);
  Gravity_text.style("font-family: Times New Roman, Times, serif");
  Gravity_text.style("color: black");
  Gravity_text.style("font-size: 16px");
  
  text_for_init=createP("For initializations");
  text_for_init.style("font-family: Times New Roman, Times, serif");
  text_for_init.style("color: black");
  text_for_init.style("font-size: 24px");
  text_for_init.position(520,20);
  radio_init = createRadio();
  radio_init.option("1","random");
  radio_init.option("2","static");
  radio_init.position(530,100);
  radio_init.style('width', '150px');
  radio_init.selected('1');
  radio_init.attribute('name', 'inits');
  
  gravity_checkbox= createCheckbox('Gravity', false);
  gravity_checkbox.position(386,260);
  gravity_checkbox.style("text-align","center");
  gravity_checkbox.changed(myCheckedEvent_gravity);
  
  temp_checkbox= createCheckbox('Temperature', false);
  temp_checkbox.position(466,260);
  temp_checkbox.style("text-align","center");
  temp_checkbox.changed(myCheckedEvent_temp);
  
  
  // more_options_text=createP("More options");
  // more_options_text.style("font-family: Times New Roman, Times, serif");
  // more_options_text.style("color: black");
  // more_options_text.style("font-size: 24px");
  // more_options_text.position(520,120);
  single_checkbox = createCheckbox('Single', false);
  single_checkbox.position(531,190);
  single_checkbox.style("text-align","center");
  single_checkbox.changed(myCheckedEvent_single);
  
  trail_checkbox = createCheckbox('Trail', false);
  trail_checkbox.position(531,210);
  trail_checkbox.style("text-align","center");
  trail_checkbox.id("trailing");
  trail_checkbox.changed(myCheckedEvent_trail);
  trail_checkbox.disabled=true;
  
  
  etot_checkbox = createCheckbox('Etot', false);
  etot_checkbox.position(rl[0]*10,380);
  etot_checkbox.style("text-align","center");
  etot_checkbox.id("etot_check");
  etot_checkbox.changed(myCheckedEvent_etot);
  etot_checkbox.disabled=true;
  
  velocity_checkbox = createCheckbox('Velocity', true);
  velocity_checkbox.position(rl[0]*10+50,380);
  velocity_checkbox.style("text-align","center");
  velocity_checkbox.id("etot_check");
  velocity_checkbox.changed(myCheckedEvent_velocity);
  velocity_checkbox.disabled=true;
  
  
  //radio_plots = createRadio();
  //radio_plots.option("3","Velocity");
  //radio_plots.option("4","Etot");
  //radio_plots.position(rl[0]*10,380);
  //radio_plots.style('width', '150px');
  //radio_plots.selected('3');
  //radio_plots.attribute('name', 'plots');
  
  
  temporary_energy=createP("");
  temporary_energy.position(400,350);
  
  forces(); // initsialiseerib esimesed kiirendused, enne arvutamist.
}




//#####################################################################################
//##################------------ DRAW FUNCTION -------------###########################
//#####################################################################################
//_____________________________________________________________________________________
// Animatsiooni kiirendamiseks loome tsükkli, mis arvutab ühes draw() iteratsioonis
// muutuja "cpf" poolt määratud arvu integreerimis iteratsioone. 
// Ehk teisisõnu, integreerimise samm on küll väike, mis aitab säilitada täpsust, kuid
// iga uue "draw()" kaadri korral väljastame me vaid näiteks iga 10nda kaadri.
//_____________________________________________________________________________________
function draw() {
  temperature= Math.sqrt(TEMP_SLIDER.value());
  ag=-(GRAVITY_SLIDER.value());
  val=radio_init.value();
  //plot_vals=radio_plots.value();
  Gravity_text.html(round_2(ag));
  Temperature_text.html(round_2(temperature));
  
  
  var it=0;
  // Visualiseerimis kiiruse määramine
  var cpf=10; // calculations per draw() frame
  energy();
  if (calculate_new==true){
    for (it=0;it<cpf; it++ ){
    calc1();}
  iteratsioon=iteratsioon+cpf
  energy_array.push(etot);
  aja_array.push(iteratsioon);
  if (energy_array.length>plots_x_values){
    energy_array.shift()
  }
  }

  // console.log(energy_array.length);
  
  background(254);
  
  push();
  fill(255)
  rect(rl[0]*scaler, 0, rl[0]*scaler+500,rl[1]*scaler)
  pop();
  
  temporary_energy.html(etot)
 
 // Joonestame osakesed
  push();
  fill(74, 136, 224);
  strokeWeight(1.5);
  
  if (show_one==true){
    if (draw_trail==true){
    circle(x[50]*10,y[50]*10,7);
    pos_history=createVector(x[50]*10,y[50]*10);
    trail_history.push(pos_history);
    for (i=0;i<trail_history.length; i++){
      final_trail_coords  = trail_history[i];
      circle(final_trail_coords.x, final_trail_coords.y,0.75);
    }
    if (trail_history.length>1000){
      trail_history.shift();
    }
    }else if(draw_trail==false){
      circle(x[50]*10,y[50]*10,7);
    }
  }else if(show_one==false){
  for (i=0; i<particles; i++){
    circle(x[i]*10, y[i]*10,7);
  }
  }
  pop();
  

  if (draw_etot_plot==true){
    GRAAFIK_E_tot_AEG();
  }
  if (draw_vel_plot==true){
    kiiruste_jaotus();
  }


}


// Osakeste 1,2,3...n kiirenduste summaarsed väärtused (x ja y projektsioonidena).
function forces (){
         var i,k,rd,sumx,sumy,dist,xx,yy;
         
         //#####################################################################################
         //################ Siin lihtsalt initsialiseerime kiirenduse massiivi. ################
         //#####################################################################################
         for (i=0;i<particles;i++)
         {
            ax[i]=0.;
            ay[i]=0.;
         }
         
         
         //#####################################################################################
         //##### Siin arvutame osakese "k" kiirenduse kõikide osakesete "i"-de suhtes. #########
         //#####################################################################################
         
         // Ehk võtame vaatluse alla osakese "1".
         // Seejärel, võtame vaatluse alla osakese "2".
         // Arvutame osakeste "1" ja "2" vahelise kagused x ja y suunas. ("xx" ja "yy").
         // Arvutame kauguse mooduli "dist".
         // Arvutame osakese "1" ja osakese "2" vahelise kiirenduse "rd".
         // NB!!!! "rd" kehtib ainult praeguse iteratsiooni jaoks, ehk ainult osakese "1" ja "2" vahel.
         //____________________________________________________________________________________________
         // Kiirenduse "x" ja "y" projektsioonide jaoks korrutame "rd" läbi "xx"-ga ja "yy"-ga.
         // Saame staatilised muutujad "sumx" ja "sumy", mis on praeguses iteratsioonis osakeste "1" ja
         // "2" vaheliste kiirenduste vastavad projektsioonid.
         // ____________________________________________________________________________________________
         // KUNA EESMÄRK ON ARVUTADA SUMMAARNE KIIRENDUS OSAKESELE 1, SIIS LIIDAME "sumx" MASSIIVILE
         // "ax" ESIMESELE ELEMENDILE OTSA (ax[k]=ax[k]+sumx).
         // ____________________________________________________________________________________________
         // Järgmisel iteratsioonil on vaatluse all endiselt osake "k=1" ja osake "i=3".
         // Analoogselt jõuame muutujani "sumx", mis sel iteratsioonil omistab uue väärtuse
         // mida saame ka see kord liita juurde massiivi "ax" esimesele elemendile "ax[k]".
         // Nõnda itereerime kõik osakesed "i"-d läbi, ning saame lõpuks sumaarse kiirenduse osakese "1"
         // jaoks.
         // Edasi tuleb meil osake "2" ja "3" (kuna i=k+1), "2" ja "4", "2" ja "5" jne...
         // ____________________________________________________________________________________________
         // NB!
         // Paralleelselt arvutame ka juba etteruttavalt osakeste i (ehk 2...n) summaarsed kiirendused,
         // Kuna osakese "1" kiirenduste arvutamisel, mõjub osakesele "i=2...n" jõud esimese osakese
         // poolt, aga vastupidises suunas, siis saamegi jooksvalt arvutada ka ka vahepealsed summaarsed
         // kiirendused teiste osakeste jaoks. Ehk "ax[i]=ax[i]-sumx.
         
         for (k=0;k<particles-1;k++)
         {
            for (i=k+1;i<particles;i++)
            {
               xx=x[k]-x[i];
               yy=y[k]-y[i];
               dist=Math.pow(xx,2)+Math.pow(yy,2);
               
                if(dist<rcut){ // See teeb arvutamise millegipärast kiiremaks????
               
                  rd=[2./Math.pow(dist,6)-1.]/Math.pow(dist,8);
                  sumx=rd*xx;
                  sumy=rd*yy;
                  ax[k]=ax[k]+sumx; // Summaarne osakese k kiirendus osakeste i suhtes. NB! "sumx" ei ole tegelikult summa, vaid hoopis praeguse iteratsiooni "k" ja "i" vaheline kiirendus. Järgmisel iteratsioonil resetib.
                  ay[k]=ay[k]+sumy;
                  ax[i]=ax[i]-sumx;
                  ay[i]=ay[i]-sumy;
                    }
               
               
            }}
           
         //#####################################################################################
         //##################### Raskuskiirenduse arvesse võtmine ##############################
         //#####################################################################################
          if (gravity_checkbox.checked()){
            for (i=0;i<particles;i++){
               ay[i]=ay[i]-ag;
            }
          } 
}





function calc1(){
//#####################################################################################
//##################------------ Velocity Verlet -------------#########################
//#####################################################################################
//_____________________________________________________________________________________
// Järgnevas tsükklis arvutatakse Verleti uut kiirust V_(i+1).
// Kuid arvutamise protsess on jaotatud kaheks tsükkliks.
// Esimeses tsükkliks arvutame kiiruse V_(i+1) esimest liiget, ehk ainult praeguse
// kiirenduse A_i osa.
// Kiiruse V_(i+1) teist osa arvutatakse teises for tsükklis all pool.
// Lisaks arvutame loomulikult ka koordinaadid järgmisel sammul.
//_____________________________________________________________________________________
         var k,xx,yy,va,vvx,vvy;
         for (k=0;k<particles;k++){
            xx=x[k]+vx[k]*dt+0.5*ax[k]*dt*dt;
            yy=y[k]+vy[k]*dt+0.5*ay[k]*dt*dt;
            vvx=vx[k]+0.5*ax[k]*dt;
            vvy=vy[k]+0.5*ay[k]*dt;
            vcorr[k]=0;
//----X põrked----
            //#####################################################################################
            //##------------ Kontrollime, kas osake on endiselt kastis või mitte -------------#####
            //#####################################################################################     
            if (xx >= rl[0]){
            //_____________________________________________________________________________________
            // Kui osakese X komponent peaks hüppama järgmise sammu puhul kastist välja paremat kätt,
            // siis tõstame ta kasti sisse tagasi ning muudame kiiruse märki (x projektsioon).
            //_____________________________________________________________________________________
               xx=2.*rl[0]-xx;
               vx[k]=-vvx;
               vcorr[k]=1;
            }
            else if(xx <= 0.){
            //_____________________________________________________________________________________
            // Kui osakese X komponent peaks hüppama järgmise sammu puhul kastist välja vasakut kätt,
            // siis tõstame ta kasti sisse tagasi ning muudame kiiruse märki (x projektsioon).
            //_____________________________________________________________________________________
               xx=-xx;
               vx[k]=-vvx;
                vcorr[k]=1;
            }
            else{
            //_____________________________________________________________________________________
            // Kui osake kastist välja ei hüppa. Siis salvestame lihtsalt arvutatud uue kiiruse 
            // esimese liikme andmemassiivi (mida järgmises tsükklis kasutame summeerimises teise
            // liikmega, ehk A_(i+1) osaga).
            // Lisaks salvestame ka uue koordinaadi andmemassiivi.
            //_____________________________________________________________________________________
               vx[k]=vvx;
            }
            x[k]=xx;
           
//---- Y põrked ----
            //_____________________________________________________________________________________
            // Käitume analoogselt nagu x projektsioonidega.
            //_____________________________________________________________________________________
            if (yy >= rl[1]){
               yy=2.*rl[1]-yy;
               vy[k]=-vvy;
               vcorr[k]=1;
            }
            else if(yy <= 0.)
            {
               yy=-yy;
               vy[k]=-vvy;   
               vcorr[k]=1;
            }
            else
            {
               vy[k]=vvy;
            }
            y[k]=yy;
         }

        //_____________________________________________________________________________________
        // Arvutame kiirendused järgmise ajahetke jaoks, ehk A_(i+1).
        //_____________________________________________________________________________________
         forces();
         for (k=0;k<particles;k++){
            //_____________________________________________________________________________________
            // Kasutades eelmises tsükklis arvutatud kiirust kiirenduse A_i liikme korral, saame
            // nüüd talle otsa liita teise liikme A_(i+1) komponendi Verleti valemist.
            //_____________________________________________________________________________________
            vx[k]=vx[k]+0.5*ax[k]*dt;
            vy[k]=vy[k]+0.5*ay[k]*dt;
         }
 for (i=0;i<particles; i++){
   v_moodul[i]=Math.sqrt(vx[i]*vx[i]+vy[i]*vy[i]);
   // TEMP SLIDER VÄÄRTUS SIIN
   // console.log(T)
   // vx[i]=vx[i]*T;
   // vy[i]=vy[i]*T;
   
   if (temp_checkbox.checked()){ 
     if(vcorr[i]==1){
        va=Math.sqrt(vx[i]*vx[i]+vy[i]*vy[i]);
        if(va !== 0.){
          vx[i]=temperature*vx[i]/va;
          vy[i]=temperature*vy[i]/va;
        }
     }
  } 
 }

}



var V_väärtused=[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1.0];
function kiiruste_jaotus(){
  
      //------------------------------- PLOT ---------------------------------------------------
  // plot background
push();
//fill(32,42,68);
fill(15);
rect(0,height-graafikute_kõrgus,width,height);
pop();

// plot xy axis
push();
stroke(255);
strokeWeight(2);
line(plot_offset_X,height-plot_bottom_buffer,width,height-plot_bottom_buffer); // X- axis
line(width-10,height-(plot_bottom_buffer+5),width,height-plot_bottom_buffer);
line(width-10,height-(plot_bottom_buffer-5),width,height-plot_bottom_buffer);
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
  
  
  // x-ticks---------------------------------------------------------------------
    for (var j=0; j<V_väärtused.length; j=j+1){
    push();
    fill(255);
    textAlign(CENTER);
    text(round_2((V_väärtused[j])*10) ,plot_offset_X+25*j+10 , height-5);
    pop();
  };
  push();
  fill(255);
  textAlign(RIGHT);
  textSize(16);
  text("Sagedus", plot_offset_X-25, height-graafikute_kõrgus/2);
  //text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("Kiirus",width-25, height-10 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
push();
stroke(255,125,0);
strokeWeight(1.5);
  
  //----------------------------- SAGEDUS TABELI LOOMINE --------------------------------------
var korv_01 = 0;
var korv_02 = 0;
var korv_03 = 0;
var korv_04 = 0;
var korv_05 = 0;
var korv_06 = 0;
var korv_07 = 0;
var korv_08 = 0;
var korv_09 = 0;
var korv_10 = 0;
var korv_11 = 0;
var korv_12 = 0;
var korv_13 = 0;
var korv_14 = 0;
var korv_15 = 0;
var korv_16 = 0;
var korv_17 = 0;
var korv_18 = 0;  
var korv_19 = 0;  
var korv_20 = 0;
var korv_21 = 0;
for (var k=0; k<=v_moodul.length; k=k+1) {
    if(v_moodul[k]<=0.5){
      korv_01++
    }else if (v_moodul[k]<=1){
      korv_02++
    }else if (v_moodul[k]<=1.5){
      korv_03++
    } else if (v_moodul[k]<=2){
      korv_04++
    } else if (v_moodul[k]<=2.5){
      korv_05++
    } else if (v_moodul[k]<=3){
      korv_06++
    } else if (v_moodul[k]<=3.5){
      korv_07++
    } else if (v_moodul[k]<=4){
      korv_08++
    } else if (v_moodul[k]<=4.5){
      korv_09++
    } else if (v_moodul[k]<=5){
      korv_10++
    } else if (v_moodul[k]<=5.5){
      korv_11++
    }else if (v_moodul[k]<=6){
      korv_12++
    }else if (v_moodul[k]<=6.5){
      korv_13++
    }else if (v_moodul[k]<=7){
      korv_14++
    }else if (v_moodul[k]<=7.5){
      korv_15++
    }else if (v_moodul[k]<=8){
      korv_16++
    }else if (v_moodul[k]<=8.5){
      korv_17++
    }else if (v_moodul[k]<=9){
      korv_18++
    }else if (v_moodul[k]<=9.5){
      korv_19++
    }else if (v_moodul[k]<=10){
      korv_20++
    }else if (v_moodul[k]>10){
      korv_21++
    }
};
var korvid= [korv_01, korv_02, korv_03, korv_04, korv_05, korv_06, korv_07, korv_08, korv_09, korv_10,korv_11, korv_12, korv_13,korv_14,korv_15,korv_16,korv_17,korv_18,korv_19,korv_20, korv_21];
pop();
  rectMode(CORNER)
  fill(74, 136, 224);
  for (i=0; i<korvid.length-1; i++){
    if (korvid[i]*3>graafikute_kõrgus-plot_bottom_buffer){
      rect(plot_offset_X+5+25*i, height-plot_bottom_buffer, 10, -graafikute_kõrgus+plot_bottom_buffer);
    } else{
      rect(plot_offset_X+5+25*i, height-plot_bottom_buffer, 10, -korvid[i]*3);   
    }
  }
};

function GRAAFIK_E_tot_AEG(){
      //------------------------------- PLOT ---------------------------------------------------
  // plot background
push();
//fill(32,42,68);
fill(15);
rect(0,height-graafikute_kõrgus,width,height);
pop();

// plot xy axis
push();
stroke(255);
strokeWeight(2);
line(plot_offset_X,height-graafikute_kõrgus/2,width,height-graafikute_kõrgus/2); // X- axis
line(width-10,height-graafikute_kõrgus/2-5,width,height-graafikute_kõrgus/2);
line(width-10,height-graafikute_kõrgus/2+5,width,height-graafikute_kõrgus/2);
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
  
  
  // x-ticks---------------------------------------------------------------------
  //   for (var j=0; j<V_väärtused.length; j=j+1){
  //   push();
  //   fill(255);
  //   textAlign(CENTER);
  //   text(round_2((V_väärtused[j])*10) ,plot_offset_X+25*j+10 , height-5);
  //   pop();
  // };
  push();
  fill(255);
  textAlign(RIGHT);
  textSize(16);
  text("Etot", plot_offset_X-25, height-graafikute_kõrgus/2);
  //text("[J]", plot_offset_X-35, height-graafikute_kõrgus/2+15);
  text("aeg",width-25, height-graafikute_kõrgus/2+15 );
  pop();
  push();
  textAlign(LEFT);
  textSize(14);
  text("", plot_offset_X+10, height-graafikute_kõrgus+15);
  pop();
push();
  for (i=0;i<=energy_array.length;i++){
     // console.log((energy_array[i]))
    // console.log(-(energy_array[i]/1000+(height-plot_offset_Y)))
    if (i>=1) {
    stroke(74,136,224);
    line(UUS_aja_array_fikseeritud[i-1]+plot_offset_X, (energy_array[i-1]/100+(height-plot_offset_Y)),UUS_aja_array_fikseeritud[i]+plot_offset_X, (energy_array[i]/100+(height-plot_offset_Y)));
    }
  }
pop();
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


var toggle=true;
var calculate_new=false;
function toggle_button() {
  if (toggle==true){

    toggle= !toggle;
    calculate_new=true;
    STOP_CONTINUE_button.html("Pause");
    STOP_CONTINUE_button.style("background-color","white")
    STOP_CONTINUE_button.style('color','black');
  }
  else if (toggle==false){ 

        toggle= !toggle;
        calculate_new=false;
        STOP_CONTINUE_button.html("Resume");
        STOP_CONTINUE_button.style("background-color","#4A88E0")
          STOP_CONTINUE_button.style('color','white');
   }
}

function energy (){
            var i,k,dist,rd;
            ek=0.;
            ep=0.;
            for (k=0;k<particles-1;k++)
            {
               for (i=k+1;i<particles;i++)
               {
                  xx=x[k]-x[i];
                  yy=y[k]-y[i];
                  dist=Math.pow(xx,2)+Math.pow(yy,2);
                  
                  
                  if(dist < Math.pow(rcut,2)){
                     rd=1./Math.pow(dist,12)-1./Math.pow(dist,6);
                     ep=ep+rd;
                  }
                  
               }
               ek=ek+Math.pow((vx[k]+vy[k]),2);
               // ep=ep+6.*y[k]*ag;
            }
            
            // ek=ek+Math.pow(vx[particles-1],2)+Math.pow(vy[particles-1],2);
            //ep=ep+6.*y[na-1]*ag;
           ek=ek*3.
           etot=ek+ep;
}






function Reset_system(){
  inum=0;
  xx=0;
  yy=0;
  trail_history = new Array();
  energy_array=[];
  aja_array=[];
  iteratsioon=0;
  
  for (i=0;i<particles;i++){
            ax[i]=0.;
            ay[i]=0.;
            vx[i]=0;
            vy[i]=0;
         }
  
  if (val=="2"){
    for (i=0; i<n1; i++){
    for (j=0; j<n2;j++){
        x[inum]= i*1.12+rw;
        y[inum]= j*1.12+rh;
        //vx[inum]= (2.*Math.random()-1.)*v_max;
        //vy[inum]= (2.*Math.random()-1.)*v_max; 
        vx[inum]= 0;
        vy[inum]= 0;
        inum++;
    }
    }
  } else if (val=="1"){
        for (i=0; i<n1; i++){
        for (j=0; j<n2;j++){
            x[inum]= i*1.12+rw;
            y[inum]= j*1.12+rh;
            vx[inum]= (2.*Math.random()-1.)*v_max;
            vy[inum]= (2.*Math.random()-1.)*v_max; 
            // vx[inum]= 0;
            // vy[inum]= 0;
            inum++;
    }
    }
  }
}

function slow_down(){
  for (i=0; i<particles; i++){
            vx[i]=vx[i]*0.00001;
            vy[i]=vy[i]*0.00001;
  }
}



function myCheckedEvent_temp() {
  if (temp_checkbox.checked()) {
      temperature=TEMP_SLIDER.value();
    TEMP_SLIDER.removeAttribute('disabled');
  } else {
    temperature=0;
    TEMP_SLIDER.attribute("disabled","");
  }
}



function myCheckedEvent_gravity() {
  if (gravity_checkbox.checked()) {
      ag=GRAVITY_SLIDER.value();
      GRAVITY_SLIDER.removeAttribute('disabled');
  } else {
    GRAVITY_SLIDER.attribute("disabled","");
    GRAVITY_SLIDER.value(0);
    ag=0;
  }
}

function myCheckedEvent_single() {
  if (single_checkbox.checked()) {
      show_one=true;
      
  } else {
    show_one=false;
    trail_history = new Array();
    trail_checkbox.checked(false);
  }
}


function myCheckedEvent_trail() {
  if (trail_checkbox.checked()  ) {
      draw_trail=true;
  } else {
    draw_trail=false;
    trail_history = new Array();
    // enable trailing TEMP_SLIDER.attribute("disabled","");
  }
}

function myCheckedEvent_etot(){
  if (etot_checkbox.checked()){
    draw_etot_plot=true;
    velocity_checkbox.checked(false);
    draw_vel_plot=false;
  } else{
    draw_etot_plot=false;

  }
  
}

function myCheckedEvent_velocity(){
  
    if (velocity_checkbox.checked()){
    draw_vel_plot=true;
    etot_checkbox.checked(false);
    draw_etot_plot=false;
  } else{
    draw_vel_plot=false;
  }
}
