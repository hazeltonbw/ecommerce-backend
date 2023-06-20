/*
When passed a `dotenv` file from the `dotenv` npm package, this function 
will determine if it's being properly parsed without revealing the secret 
details of the env file
*/

require("colors");
function enviornmentVariablesChecker(dotenv) {
  let baseScript = `
    --------
    Environment Variables: Is Empty:
    `;
  if (dotenv.parsed == undefined) {
    console.log(baseScript + "true".red);
    return;
  } else {
    console.log(baseScript + "false".green);
  }
}

const checkIfBuildIsProduction = () => {
  return process.env.NODE_ENV === "production";
}

class ExpressErrorHandler extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ExpressErrorHandler"
  }
};
module.exports = { enviornmentVariablesChecker, ExpressErrorHandler, checkIfBuildIsProduction };
