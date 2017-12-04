// VIEWMODELS
// =============================

Vue.component('questions', {

  template: '#questions-template',

  data: () => ({
    results: [],
    choices: [],
    question: [],
    correctAnswer: '',
    counter: 0,
    isCorrect: false,
    showFeedback: false,

    amount: 10,
    category: 9,

    score: 0
  }),

  mounted() {
    this.startGame();
  },

  methods: {

    startGame: function() {
      const url = 'https://opentdb.com/api.php?';

      fetch(url + 'amount='+this.amount + '&category=' + this.category + '&type=multiple')
        .then(response => {
            return response.json()
        })
        .then(data => { 
            this.results = data.results;
        })
        .then(() => {
          this.getQuestion();
        })
        .catch(error => {
          console.log(error);
        })
    },

    getQuestion: function() {
      // this points to the vue instance
      this.showFeedback = false;

      if (this.results[this.counter] !== undefined) {
        var incorrectAnswers = this.results[this.counter].incorrect_answers;
        this.correctAnswer = this.results[this.counter].correct_answer;
        this.choices = incorrectAnswers;
        this.choices.push(this.correctAnswer);
        this.shuffleAnswerChoices(this.choices);

        this.question = this.results[this.counter].question;

        this.counter++;
      } else {
        console.log("no more questions bro");
      }
      
    },

    shuffleAnswerChoices: function(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

      return array;
    },

    selectChoice: function(e) {
      var answer = this.correctAnswer;
      var selectedAnswer = e.target.innerHTML;
      
      if (answer === e.target.innerHTML) {
        this.isCorrect = true;
        console.log("correct answer");
        this.showFeedback = true;
        this.score++;
      } else {
        this.isCorrect = false;
        console.log("incorrect answer");
        this.showFeedback = true;
      }

      setTimeout(() => {
        this.getQuestion();
      }, 3000);  
    }

  }


})


new Vue({
  el: '#app'
});


