let input = "Hello world! This is a test sentence.";
function reverseWordsInSentence(sentence) {
    // split the sentence into words
    let words = sentence.split(' ');
   
    // reverse each word
    words = words.map(word => word.split('').reverse().join(''));
   
    // join the reversed words back into a sentence
    sentence = words.join(' ');
   
    return sentence;
   }
   console.log(reverseWordsInSentence(input));