/* eslint-disable radix */
/* eslint-disable @lwc/lwc/no-document-query */
import { LightningElement, track } from 'lwc';
const MaxX = 32;
const MaxY = 16;
const DELAY = 1000/3;
const MShape = 3;
const SHAPES = {
    0 : [0,1,0,
         1,1,1,
         0,1,0], 
    1 : [0,1,0,
         0,1,0,
         0,1,0],
    2 : [1,1,0,
         0,1,0,
         0,1,1],
    3 : [0,1,1,
         0,1,0,
         1,1,0],
    4 : [0,0,0,
         1,0,1,
         1,1,1],
    5 : [1,1,1,
         1,0,1,
         1,0,1]
};

export default class TetrisGame extends LightningElement {
    
    @track gameBlocks;  //[]
    @track score;       //0
    renderCompleted;    //false
    shapeCreated;
    shapeMoving;        //false
    @track nextShape;
    timer;
    ticks;              //0  //To hold how much count/iterations/seconds has passed

    //experimental
    currentShape;

    constructor(){
        super();
        console.log('Hello constructor!');
        this.gameBlocks = [];
        this.score = 0;
        this.renderCompleted = false;
        this.nextShape = [];
        this.shapeCreated = false;
        this.shapeMoving = false;
        this.ticks = 0;
        this.createBoard();
    }

    createBoard(){
        let _gblocks = []; //Temp variable to hold the data
        let each = {};
        for(let i=0; i<MaxX; i++){
            for(let j=0; j<MaxY; j++){
                each = {
                    key: i + ':' + j,
                    x : i,
                    y : j
                };
                _gblocks.push(each); 
            }
        }
        this.gameBlocks = _gblocks; //In order to avoid multiple reactive changes
    }

    renderedCallback(){
        if(!this.renderCompleted){
            console.log('Inside renderedCallback. Should run only once~!');
            if(this.timer) clearInterval(this.timer);
            this.timer = setInterval(()=>{
                this.startGame();
            }, DELAY);
            console.log('Timer Generated with Id : ' + this.timer);
            this.renderCompleted = true;
        }
    }

    startGame(){
        try{
            if(this.shapeCreated){
                console.log('I am moving');
                this.move();
            }
            else{
                console.log('I am generating shape');
                this.generateNextShape();
                this.drawShape();
            }
            this.ticks+=1;    
            this.score+=1;           
            console.log('Current Ticks : ' + this.ticks);   
        }
        catch(error){
            console.log(`Error occurred ${JSON.stringify(error)}`);
            this.handleStopTimer();
        }
    }

    drawShape(){
        ///////////////////////////////////////////////
        // If we assume the shape is 3 boxes long,  
        // we will consider it as a 3 X 3 matrix
        ///////////////////////////////////////////////
        if(this.shapeCreated){
            let count = 0;
            this.index = 0;
            let shape = ['1:0','1:1','2:1', '0:1', '1:2']; //These are ON squares
            console.log('shape=> ' + shape);
            let _gameBlocks = [];
            for(let b of this.gameBlocks){
                let includeKey = shape.includes(b.key);
                if(includeKey){
                    b.class = 'on';
                    console.log(`Test: ${b.x}, ${b.y}`);
                }
                _gameBlocks.push(b);
                count = count+1;
                if(count > 3*this.MaxX) break;
            }
            this.gameBlocks = _gameBlocks;
        }
    }

    generateNextShape(){
        if(!this.shapeCreated){
            let index = Math.floor(Math.random()*100) % Object.keys(SHAPES).length;
            this.currentShape = index;
            let binaryShape = [...SHAPES[index]];  //get the shape in binary
            console.log('BS->' + binaryShape);
            let _nextShape = [];
            for(let i=0; i<9; i++){
                let each = {
                    key :  'key'+i,
                    class : binaryShape[i] ? 'on-shape' : '' //if the bit represents 1, mark it as 'ON'
                };
                //  console.log('Each->' + each.key);
                _nextShape.push(each);
            }
            //console.log('HAHA' + JSON.stringify(_nextShape) );
            this.nextShape = _nextShape;  
            this.shapeCreated = true;
        }    
    }

    move(){
        if(this.shapeCreated){
            let _gameBlocks = this.template.querySelectorAll('.on');
            console.log('Size->' + _gameBlocks.length);
            for(let el of _gameBlocks){
                let dk = el.getAttribute('data-key');
                console.log('dk=>' + dk);

                let x = dk.split(":")[0];
                let y = dk.split(":")[1];
                let newX = parseInt(x) + 1;
                console.log('old x' + x);
                console.log('new X' + newX);
                if(newX === 32){
                    //this.shapeCreated = false;
                    newX = 0;
                }    

                let newY = parseInt(y);
                let nextKey = `${newX}:${newY}`;
                console.log('nextKey=>' + nextKey);
                let nextElement = this.template.querySelector(`div[data-key='${nextKey}']`);
                console.log('nextElement=>' + nextElement);
                nextElement.classList.add('on');
                el.classList.remove('on');
            }
        }
    }    

    showInfo(e){
        console.dir(e.target.getAttribute('data-key'));
    }

    handleStopTimer(){
        if(this.timer) clearInterval(this.timer);
    }

    blink(){
    // move(){
    //     if(this.shapeCreated){
    //         let _gameBlocks = [];
    //         for(let b of this.gameBlocks){
    //             let newX = parseInt(b.x) + 1;
    //             let newY = parseInt(b.y);
    //             if(newX > MaxX-2) newX=0;
    //             let nextKey = `${newX}:${newY}`; 
    //             let each = {
    //                 key: nextKey,
    //                 x : newX,
    //                 y : newY,
    //                 class: b.class === 'on' ? 'off' : 'on'
    //             };
    //             _gameBlocks.push(each);
    //         }

    //         this.gameBlocks = _gameBlocks;

    //         // If the shape reaches the bottom a new shape needs to be generated
    //         // if(this.ticks % MaxX === 0){
    //         //     console.log(`Getting new shape with ${this.ticks}`);
    //         //     this.shapeCreated = false;
    //         // }
    //     }
    // }
    }
}