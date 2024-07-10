class Road{
    constructor(x,width,lanes=3){
        this.x=x;
        this.width=width;
        this.lanes=lanes;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;

        this.top=-infinity;
        this.bottom=infinity;

        const topleft={x:this.left,y:this.top};
        const topright={x:this.right,y:this.top};
        const bottomleft={x:this.left,y:this.bottom};
        const bottomright={x:this.right,y:this.bottom};

        this.borders=[
            [topleft,bottomleft],
            [topright,bottomright]
        ];

    }
    //get lane center
    getlanecenter(lane){
        //lanewidth
        const lWidth=this.width/this.lanes;
        return this.left + lWidth/2 + Math.min(lane,this.lanes-1)*lWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";
        //create lanes
        for (let i = 1; i <= this.lanes-1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i/this.lanes
            );
            ctx.setLineDash([20,10]); 
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();  
        }
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        })
    }
}
