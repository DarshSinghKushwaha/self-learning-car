const canvas=document.getElementById('mycanvas');
canvas.width=200;
const networkcanvas=document.getElementById('networkcanvas');
networkcanvas.width=300;

const ctx=canvas.getContext("2d");
const networkctx=networkcanvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const N=1000;
const cars=gencars(N);

let bestcar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic=[
    // new Car(road.getlanecenter(1),-100,30,50,'ai'),
    new Car(road.getlanecenter(0),-300,30,50,'ai'),
    new Car(road.getlanecenter(2),-300,30,50,'ai'),
    new Car(road.getlanecenter(0),-500,30,50,'ai'),
    new Car(road.getlanecenter(1),-500,30,50,'ai'),
    new Car(road.getlanecenter(1),-800,30,50,'ai'),
    new Car(road.getlanecenter(2),-800,30,50,'ai')
];
animate();

function save(){
    localStorage.setItem("bestbrain",JSON.stringify(bestcar.brain));
}
function discard(){
    localStorage.removeItem("bestbrain");
}
function gencars(N){
    const cars=[];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getlanecenter(1),100,30,50,"user"));
    }
    return cars;
}
//To animate movement of car
function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);   
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic); 
    }
    //find the best performer
    bestcar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    canvas.height=window.innerHeight;
    networkcanvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-bestcar.y+canvas.height*0.7);
    //draw road
    road.draw(ctx);
    
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx,"green");   
    }
    ctx.globalAlpha=0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(ctx,"lightgray");
    }
    ctx.globalAlpha=1;
    //draw the best performer
    bestcar.draw(ctx,"lightblue",true);
    ctx.restore();
    networkctx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkctx,bestcar.brain);
    requestAnimationFrame(animate);
}