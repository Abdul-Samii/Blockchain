const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length-1; i++ ) {
      const { timestamp, prevHash, hash, data, nonce, difficulty } = chain[i];
      const realLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i-1].difficulty;
      if (prevHash !== realLastHash) return false;
      const validatedHash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
      if (hash !== validatedHash) return false;
      if (Math.abs(lastDifficulty - difficulty) > 1) return false
    }
    return true;
  }

  replaceChain(chain) {
    if (chain <= this.chain.length) {
      console.error("The incomming Chain is smaller")
      return;
    }
    if(!Blockchain.isValidChain(chain)) {
      console.error("The incomming chain is not valid")
      return;
    }
    this.chain = chain;
  }
}

const blockchain = new Blockchain();
blockchain.addBlock({data: "b1"})
blockchain.addBlock({data: "b2"})
blockchain.addBlock({data: "b3"})
blockchain.addBlock({data: "b4"})

const result = Blockchain.isValidChain(blockchain.chain)

console.log(blockchain)

module.exports = Blockchain;
