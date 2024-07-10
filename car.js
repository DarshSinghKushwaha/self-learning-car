class Car{
    constructor(x,y,width,height,type){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.accel=0.2;
        switch (type) {
            case "user":
                this.maxspeed=3;
                break;
        
            default:
                this.maxspeed=2;
                break;
        }
        
        this.frict=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=type=='user';

        if(type=='user'){
            this.sensor=new Sensor(this);
            this.brain=new Neurals([this.sensor.rayCount,6,4]);
        }
        this.controls=new Controls(type);
        this.img=new Image();
        this.img.src="car.png"

        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;

        const maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
    }

    update(borders,traffic){
        //run only when not damaged
        if (!this.damaged) {
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessdamage(borders,traffic);
        }
        if(this.sensor){
            this.sensor.update(borders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset);
            const outputs=Neurals.feedforward(offsets,this.brain);
            // console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.backward=outputs[3];
            }
        }
    }
    //check if damaged
    #assessdamage(borders,traffic){
        for(let i=0;i<borders.length;i++){
            if(polyIntersect(this.polygon,borders[i])){
                // this.damaged=true;
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polyIntersect(this.polygon,traffic[i].polygon)){
                // this.damaged=true;
                return true;
            }
        }
        //this.damaged=false;
        return false;
    }
    //Create the car by polygons
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }
    //Move the car
    #move(){
        //To accelerate
        if(this.controls.forward){
            this.speed += this.accel;
        }
        //To decellerate
        if(this.controls.backward){
            this.speed -= this.accel;
        }
        //to cap max speed
        if (this.speed>this.maxspeed) {
            this.speed=this.maxspeed;
        }
        //To cap max speed backwards
        if (this.speed<-this.maxspeed/2) {
            this.speed=-this.maxspeed/2;
        }
        //Forward friction
        if (this.speed>0) {
            this.speed-=this.frict;
        }
        //backward friction
        if (this.speed<0) {
            this.speed+=this.frict;
        }
        //Stop the car at ultra low speeds using friction
        if(Math.abs(this.speed)<this.frict){
            this.speed=0;
        }
        //Steer only when moving
        if (this.speed!=0) {
            const flip=this.speed>0?1:-1;
            //To steer left
            if (this.controls.left) {
                this.angle+=0.03*flip;
            }
            //To steer right
            if (this.controls.right) {
                this.angle-=0.03*flip;
            }

        }
        
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,colour,drawsensor=false){

        //Change car colour when damaged
        if (this.damaged) {
            ctx.fillStyle="red";
        }else{
            ctx.fillStyle=colour;
        }
        //draw car's polygon
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawsensor){
            this.sensor.draw(ctx);
        }
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();
    }
}