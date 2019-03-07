//this code uses the boggle algorithms api in order to help create a board,
//check if words are valid, and score words
//documentation: https://www.npmjs.com/package/pf-boggle
const boggle = require('pf-boggle');
//const _ = require('lodash');

class Game{
    constructor(size,time){
        this.size = size;
        this.time = time;
        this.score = 0;
        this.board = boggle.generate(size);
        this.answerKey = this.getAnswerKey(); 
        this.foundWords = [];
        this.wrongWords = [];
    }
    
    getAnswerKey(){
        const soln = boggle.solve(this.board);
        return soln.map(ele => ele.word);
    }
    
    isValid(word){
        return this.answerKey.filter(ele => ele === word.toUpperCase()).length > 0;
    }
    
    addFound(word){
        this.foundWords.push(word);
    }
    
    addWrong(word){
        this.wrongWords.push(word);
    }
    
    updateScore(word){
        this.score += boggle.points(word,this.size);
    }
    
}

module.exports = {
    Game:Game,
};