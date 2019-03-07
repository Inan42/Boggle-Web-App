const Game = require('./game.js').Game;

function elt(type) {
    const node = document.createElement(type);
    for (let i = 1; i < arguments.length; i++) {
        let child = arguments[i];
        if (typeof child === "string"){
            child = document.createTextNode(child);
        }
        node.appendChild(child);
    }
    return node;
}

function eltSubmit(){
    const node = document.createElement("input");
    const attClass = document.createAttribute("class"); 
    const attType = document.createAttribute("type"); 
    const attVal = document.createAttribute("value");
    attClass.value = "submitBtn";
    attType.value = "submit";
    attVal.value = "Submit";
    node.setAttributeNode(attClass);
    node.setAttributeNode(attType);
    node.setAttributeNode(attVal);
    return node;
}

function eltScore(score){
    const node = document.createElement("div");
    const attClass = document.createAttribute("class");
    attClass.value = "score";
    node.setAttributeNode(attClass);
    const child = document.createTextNode("Score: " + score);
    node.appendChild(child);

    return node;
}

function eltSubmitForm(game){
    const node = document.createElement("div");
    const form = document.createElement("form");
    //form.innerHTML += "Save? <input type=\"radio\" name=\"save\" value=\"yes\"> Yes";
    //form.innerHTML += "<input type=\"radio\" name=\"save\" value=\"no\"> No <br>";
    form.innerHTML += "<input type =\"hidden\" name=time value=" + game.time + ">";
    form.innerHTML += "<input type =\"hidden\" name=size value=" + game.size + ">";
    //form.innerHTML += "<input type =\"hidden\" name=size value=" + game.score + ">";
    form.innerHTML += "<input type =\"submit\" value=\"Save\" class=\"saveBtn\">";
    
    const attClass = document.createAttribute('class');
    const attMethod = document.createAttribute('method');
    const attAct = document.createAttribute('action');
    attClass.value = "submitscore";
    attMethod.value = "POST";
    attAct.value = "/scores/add";
    form.setAttributeNode(attClass);
    form.setAttributeNode(attMethod);
    form.setAttributeNode(attAct);
    node.appendChild(form);
    return node;
}

function alt(board,game){
    document.getElementById('submitWord').classList.add('hide');
    alert("Time's Up! If you'd like to save your score, click 'Save'!");
    const submitScore = eltSubmitForm(game);
    board.appendChild(submitScore);
    const saveBtn = document.querySelector('.saveBtn');
    saveBtn.addEventListener('click', function(){
        //console.log(game.score);
        document.querySelector('.submitscore').innerHTML += "<input type =\"hidden\" name=score value=" + game.score + ">";
        document.querySelector('.submitscore').submit();
        
    },false);

}


function main(){
	const btn = document.querySelector('.playBtn');
	btn.addEventListener('click', function(evt){
		evt.preventDefault();
		let size, time;
		if (document.querySelector('input[name="size"]:checked')){
            size = document.querySelector('input[name="size"]:checked').value;
		}
		else{
            size = 4;
		}
        if (document.querySelector('input[name="time"]:checked')){
            time = document.querySelector('input[name="time"]:checked').value;
        }
        else{
            time = 60;
        }
        //timer
       

        //hide form
        const startForm = document.querySelector('.start');
        startForm.classList.add('hide');
        
        //setup board
        console.log('test');
        const game = new Game(size,time);
        console.log(game);
        console.log(game.board);
        const board = document.querySelector('.game');
        for (let i = 0; i < size*size; i++){
            if (i%size === 0){
                board.innerHTML += "<br>";
            }
            const tile = elt("div",game.board[i]);
            const attClass = document.createAttribute('class');
            attClass.value = "tile";  
            tile.setAttributeNode(attClass);
            board.appendChild(tile);
        }
        //word form
        const wrap = elt('div');
        const subId = document.createAttribute('id');
        subId.value = 'submitWord';
        wrap.setAttributeNode(subId);
        //
        const inputForm = elt('form');
        const attMethod = document.createAttribute('method');
        attMethod.value = 'POST';
        inputForm.setAttributeNode(attMethod);
        //label
        const label = elt("label");
        const attFor = document.createAttribute('for');
        attFor.value = "inputWord";
        label.setAttributeNode(attFor);
        //input
        const input = elt('input');
        const attType = document.createAttribute('type');
        attType.value = 'text';
        input.setAttributeNode(attType);
        const attName = document.createAttribute('name');
        attName.value = 'inputWord';
        input.setAttributeNode(attName);
        const attId = document.createAttribute('id');
        attId.value = 'inputWord';
        input.setAttributeNode(attId);
        //submit btn
        const submit = eltSubmit();
        inputForm.appendChild(label);
        inputForm.appendChild(input);
        inputForm.appendChild(submit);
        wrap.appendChild(inputForm);
        board.appendChild(wrap);
        
        //setup score
        const playerScore = eltScore(game.score);
        board.appendChild(playerScore);
        //setup found word list
        const foundList = elt('div', 'Words Found');
        const attClass = document.createAttribute('class');
        attClass.value = 'foundlist';
        foundList.setAttributeNode(attClass);
        board.appendChild(foundList);
        //setup wrong word list
        const wrongList = elt('div', 'Incorrect Words');
        const attClass2 = document.createAttribute('class');
        attClass2.value = 'wronglist';
        wrongList.setAttributeNode(attClass2);
        board.appendChild(wrongList);
        //setup submitscore
        //const submitScore = eltSubmitForm(game);
        //board.appendChild(submitScore);
        
        //set timer
        window.setTimeout(alt.bind(null,board,game), time * 1000);
        
        ///handle submit
        const submitBtn = document.querySelector('.submitBtn');
        submitBtn.addEventListener('click',function(evt){
            evt.preventDefault();
            const input = document.getElementById('inputWord').value;
            //if no input, display error
            console.log(input);
            console.log(game.answerKey);
            if (game.isValid(input)){
                if (game.foundWords.indexOf(input) < 0){
                    game.addFound(input);
                    document.querySelector('.foundlist').appendChild(elt('div','✔'+input.toUpperCase()));
                    game.updateScore(input);
                    board.replaceChild(eltScore(game.score),document.querySelector('.score'));
                }
                //else word already found;
            }
            else if (game.wrongWords.indexOf(input.toUpperCase()) < 0){
                game.addWrong(input.toUpperCase());
                document.querySelector('.wronglist').appendChild(elt('div','✖️' + input.toUpperCase()));
            }
        });
        //save game
        /*const saveBtn = document.querySelector('.saveBtn');
        saveBtn.addEventListener('click', function(evt){
            //console.log(game.score);
            document.querySelector('.submitscore').innerHTML += "<input type =\"hidden\" name=score value=" + game.score + ">";
            document.querySelector('.submitscore').submit();
            
        },false);*/
        //attMethod=
        /* <form method="POST" action="">
             <label for="startValues">Start Values:</label> <input type="text" name="enteredWord" id="startValues">  
             <input class="submtBtn" type="submit" value="Submit"> </form> */
        
	});
	
	/*btn.addEventListener('click', function(evt){
	    evt.preventDefault();
	    let time;
    	if (document.querySelector('input[name="time"]:checked')){
            time = document.querySelector('input[name="size"]:checked').value;
        }
        else{
            time = 60;
        }
	    setTimeout(alt, 10 * 1000);
	});*/
}

document.addEventListener('DOMContentLoaded', main);