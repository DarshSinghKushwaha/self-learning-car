//Define Structure of whole network
class Neurals{
    constructor(neurons){
        this.levels=[];
        for(let i=0;i<neurons.length-1;i++){
            this.levels.push(new Level(
                    neurons[i],
                    neurons[i+1]
            ));
        }
    }
    //Method to forward output to next layers in network serially
    static feedforward(givenInputs,network){
        let outputs=Level.feedforward(givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedforward(outputs,network.levels[i]);
        }
        return outputs;
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}
//Define Structure of a Single level of network
class Level{
    constructor(inputcount,outputcount){
        this.inputs=new Array(inputcount);
        this.outputs=new Array(outputcount);
        this.biases=new Array(outputcount);
        this.weights=[];
        for (let i = 0; i < inputcount; i++) {
            this.weights[i]=new Array(outputcount);  
        }
        Level.#randomize(this);
    }
    //Randomly initialise the weights and biases of neurons
    static #randomize(level){
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
               level.weights[i][j]=Math.random()*2-1;
            }  
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i]=Math.random()*2-1;
        }
    }
    //method to forward output to next neurons in a layer serially
    static feedforward(givenInputs,level){
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i]=givenInputs[i];
        }
        for (let i = 0; i < level.outputs.length; i++) {
            let sum=0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum+=level.inputs[j]*level.weights[j][i]; 
            }
            if (sum>level.biases[i]&& i!=3) {
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
        }
        return level.outputs;
    }
}