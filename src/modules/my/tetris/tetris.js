/* eslint-disable @lwc/lwc/no-document-query */
import { LightningElement, track } from 'lwc';
const MaxX = 32;
const MaxY = 16;
const DELAY = 1000/0.5;
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
        this.gameBlocks = [];
        this.score = 0;
        this.renderCompleted = false;
        this.nextShape = [];
        this.shapeCreated = false;
        this.shapeMoving = false;
        this.ticks = 0;
    }

    renderedCallback(){
        if(!this.renderCompleted){
            console.log('Inside renderedCallback. Should run only once~!');
            this.createBoard();
            this.startGame();
            this.renderCompleted = true;
        }
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

    startGame(){
        if(this.timer) clearInterval(this.timer);
        this.timer = setInterval(()=>{
            let index = Math.floor(Math.random()*100) % Object.keys(SHAPES).length;
            this.currentShape = index;
            let binaryShape = [...SHAPES[index]];  //get the shape in binary
            //console.log('BS->' + binaryShape);
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
            
            


            /////////////////////////////////////////
            // If we assume the shape is for 3 X 3 matrix, we will consider
            // 3*MaxX squares
            if(!this.shapeCreated){
                let count = 0;
                // Use this.index in the calculation
                let shape = ['1:0','1:1','2:1', '0:1', '1:2'];
                console.log('shape=> ' + shape);
                let _gameBlocks = [];
                for(let b of this.gameBlocks){
                    //console.log('shape.includes(b.key)' + shape.includes(b.key));
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
                this.shapeCreated = true;
            }

            // if(this.shapeCreated && !this.shapeMoving){
            //     // console.log('I am here hello inside');
            //     for(let el of this.template.querySelectorAll('.on')){
            //         // console.log('I am here hello inside2222');
            //         let dk = el.getAttribute('data-key');
            //         // console.log('current KEy : ' + dk);
            //         let x = dk.split(":")[0];

            //         if(x > MaxX-2) x=0;
                    
            //         let y = dk.split(":")[1];
            //         // eslint-disable-next-line radix
            //         let nextKey = `${parseInt(x)+1}:${parseInt(y)}`;
            //         // console.log('NExt KEy : ' + nextKey);
            //         let nextElement = this.template.querySelector(`div[data-key='${nextKey}']`);
            //         el.classList.toggle('on');
            //         nextElement.classList.add('on');
            //     }
            // }
            
            // if(Math.random() > 0.5){
            //     this.shapeCreated = false;
            // }
            

            /////////////////////////////////////////
            
            
        }, DELAY);
        console.log('hello' + this.timer);
    }

    // generateNextShape(){
    //     let index = Math.floor(Math.random()*100)%3;
    //     let binaryShape = [...SHAPES[index]];  //get the shape in binary
    //     console.log('BS->' + binaryShape);
    //     let _nextShape = [];
    //     for(let i=0; i<9; i++){
    //         let each = {
    //             key :  'key'+i,
    //             class : binaryShape[i] ? 'on' : '' //if the bit represents 1, mark it as 'ON'
    //         };
    //         console.log('Each->' + each.key);
    //         _nextShape.push(each);
    //     }
    //     console.log('HAHA' + JSON.stringify(_nextShape) );
    //     this.nextShape = _nextShape;
    // }

    showInfo(e){
        console.dir(e.target.getAttribute('data-key'));
    }
}