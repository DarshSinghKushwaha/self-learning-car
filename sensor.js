class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 4;
        this.rays = [];
        this.readings=[];
    }

    update(borders,traffic){
        this.#castrays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            let ray=this.rays[i];
            let reading=this.#getReading(ray,borders,traffic);
            this.readings.push(reading);
            }
    }
    //To note collission points
    #getReading(ray,borders,traffic){
        let touches=[];
        //To show collissions with border
        for(let i=0;i<borders.length;i++){
            const touch=getIntersect(
                ray[0],
                ray[1],
                borders[i][0],
                borders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }
        //To show collissions with traffic
        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersect(
                    ray[0],
                    ray[1], 
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }
        else{
            const offsets=touches.map(e=>e.offset);
            const minoffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minoffset)
        }
    }
    //To cast radar rays
    #castrays(){
        this.rays=[];
        for (let i = 0; i < this.rayCount; i++) {
            const rayangle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            );  
            const start={x:this.car.x,y:this.car.y};
            const end={
                x:this.car.x-Math.sin(this.car.angle+rayangle)*this.rayLength,
                y:this.car.y-Math.cos(this.car.angle+rayangle)*this.rayLength
                };
            this.rays.push([start,end]);
        }
    }
    //To display sensor rays
    draw(ctx){
        for (let i = 0; i < this.rayCount; i++) {
            let end=this.rays[i][1];
            if (this.readings[i]) {
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}