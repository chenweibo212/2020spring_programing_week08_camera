const p5 = require("p5");

const p5draw = (p) => {
    p.setup = () => {
        p.background(0);
    }

    p.draw = () => {
        p.textSize(50);
        p.strokeWeight(0);
        p.fill(255);
        p.typeText(welcome,0,25,50,20);
    }

    p.typeText = (sentence, n, x, y, speed) => {
        if (n < (sentence.length)) {
            p.text(sentence.substring(0, n+1), x, y);
            n++;
            setTimeout(function() {
              p.typeText(sentence, n, x, y, speed)
            }, speed);
          }
    }
}