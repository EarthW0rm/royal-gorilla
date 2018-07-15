const centerString = (text, numberOfSpaces) => {
    var l = text.length;
    var w2 = Math.floor(numberOfSpaces / 2);
    var l2 = Math.floor(l / 2);
    var s = new Array(w2 - l2 + 1).join(" ");
    text = s + text + s;
    if (text.length < numberOfSpaces)
    {
        text += new Array(numberOfSpaces - text.length + 1).join(" ");
    }
    if(text.length - 1 == numberOfSpaces)
        text = text.substr(0, numberOfSpaces);
    return text;
};

const logWithColor = (text, color, bg) => {
    color = color || color.yellow;
    bg = bg || color.bgGreen

    console.log(bg(color(centerString(text, 84))));
}
module.exports.Rule = () => {}


module.exports.Logo = () => { }

module.exports.ShowMessage = logWithColor;

const color = require('ansi-colors');
module.exports.MessageHelper = {
    title: (txt) => {
        logWithColor(txt, color.yellow, color.bgGreen);
    },
    warn: (txt) => {
        logWithColor(color.symbols.warning + " " + txt, color.black, color.bgYellow);
    },
    lightInfo: (txt) => {
        logWithColor(txt, color.gray, color.bgBlack);
    },
    lightTitle: (txt) => {
        logWithColor(txt, color.black, color.bgCyan);
    },
    error: (txt) => {
        logWithColor(">>>>>ERROR<<<<<", color.white, color.bgRed);
        logWithColor(txt, color.red, color.bgWhite);
    },
    pathJs: (txt) => {
        logWithColor(color.underline(txt), color.yellow, color.bgBlack);
    },
    pathCss: (txt) => {
        logWithColor(color.underline(txt), color.magenta, color.bgBlack);
    }

}

