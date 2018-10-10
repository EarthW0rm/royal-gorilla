const centerString = (text, numberOfSpaces) => {
    return text;
};

const logCenter = (text) => {
    console.log(centerString(text, process.stdout.columns));
}

const logWithColor = (text, color, bg) => {
    color = color || color.yellow;
    bg = bg || color.bgGreen

    console.log(bg(color(centerString(text, process.stdout.columns))));
}
module.exports.Rule = () => { }

module.exports.Logo = () => {
    logWithColor('***************************', color.bgBlack, color.yellowBright);
    logWithColor('****                   ****', color.bgBlack, color.yellowBright);
    logWithColor('****   ROYAL GORILLA   ****', color.bgBlack, color.yellowBright);
    logWithColor('****                   ****', color.bgBlack, color.yellowBright);
    logWithColor('***************************', color.bgBlack, color.yellowBright);
}

module.exports.ShowMessage = logWithColor;

const color = require('ansi-colors');
module.exports.MessageHelper = {
    title: (txt) => {
        logWithColor(txt, color.black, color.bgGreen);
    },
    warn: (txt) => {
        logWithColor(color.symbols.warning + " " + txt, color.yellow, color.bgBlack);
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

