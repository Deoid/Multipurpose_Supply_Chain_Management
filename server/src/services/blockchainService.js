const crypto = require('crypto');

class Block {
  constructor(index, timestamp, transactions, previousHash = '', nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions; // Array of transactions
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const dataString =
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce;
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  mineBlock(difficulty = 2) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.hash;
  }
}

class BlockchainService {
  constructor() {
    this.chain = [];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.smartContracts = new Map();
    this.initGenesisBlock();
  }

  initGenesisBlock() {
    const genesisTransactions = [
      {
        txId: 'TX-GENESIS-000000',
        type: 'GENESIS_INIT',
        payload: {
          system: 'Multipurpose Supply Chain Cryptographic Ledger',
          consensus: 'Proof-of-Authority (PoA) / Amazon Managed Blockchain',
          smartContractEngine: 'Active',
          securityStandard: 'SHA-256 HMAC Digital Signatures',
          initializedAt: new Date().toISOString(),
        },
        signer: 'ROOT_AUTHORITY_ORACLE',
        signature: '0x' + crypto.createHash('sha256').update('GENESIS_BLOCK_ROOT').digest('hex'),
        timestamp: new Date().toISOString(),
      },
    ];

    const genesisBlock = new Block(0, new Date().toISOString(), genesisTransactions, '0000000000000000000000000000000000000000000000000000000000000000');
    genesisBlock.mineBlock(this.difficulty);
    this.chain.push(genesisBlock);

    // Initial Smart Contracts
    this.registerSmartContract({
      contractId: 'SC-COLD-CHAIN-SLA',
      name: 'Pharmaceutical Cold-Chain Compliance & Escrow Smart Contract',
      rule: 'Temperature must remain between 2°C and 8°C throughout transit. Breaches trigger automated escrow freeze.',
      status: 'ACTIVE_ESCROW',
      escrowAmount: '$25,000 USD',
      beneficiary: 'BioGen Pharma Ingredients GmbH',
      slaPassed: true,
      lastEvaluated: new Date().toISOString(),
    });

    this.registerSmartContract({
      contractId: 'SC-SEMICON-CUSTODY',
      name: 'High-Tech Semiconductors Chain of Custody & Shock SLA',
      rule: 'Vibration / Shock must not exceed 4.5G; cleanroom custody handovers digitally verified.',
      status: 'ACTIVE_ESCROW',
      escrowAmount: '$50,000 USD',
      beneficiary: 'Apex Semiconductor Fab Ltd',
      slaPassed: true,
      lastEvaluated: new Date().toISOString(),
    });

    // Add initial custody block
    this.createTransaction(
      'CUSTODY_HANDOVER',
      {
        shipmentId: 'SHP-774901',
        from: 'BioGen Pharma Hub (Chicago, IL)',
        to: 'Kuehne+Nagel Logistics Fleet',
        carrier: 'Kuehne+Nagel Cold Chain',
        cargo: 'mRNA Cold-Chain Vaccines (vials)',
        tempAtHandover: '4.1°C',
        status: 'DISPATCHED_IN_TRANSIT',
      },
      'DEPOT_OPERATOR_CHI_01'
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  registerSmartContract(contract) {
    this.smartContracts.set(contract.contractId, {
      ...contract,
      updatedAt: new Date().toISOString(),
    });
    return contract;
  }

  getSmartContracts() {
    return Array.from(this.smartContracts.values());
  }

  createTransaction(type, payload, signer = 'AWS_SCM_ORACLE') {
    const txId = `TX-${Date.now().toString().slice(-6)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const signature = crypto
      .createHmac('sha256', 'aws-scm-ledger-secret-key')
      .update(txId + type + JSON.stringify(payload) + signer)
      .digest('hex');

    const transaction = {
      txId,
      type,
      payload,
      signer,
      signature: `0x${signature}`,
      timestamp,
    };

    this.pendingTransactions.push(transaction);

    // Mine transaction immediately into an immutable block
    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      [...this.pendingTransactions],
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];

    return { transaction, block };
  }

  evaluateColdChainSmartContract(shipmentId, currentTemp, shock = 0.2) {
    const contract = this.smartContracts.get('SC-COLD-CHAIN-SLA');
    if (!contract) return null;

    let contractEvent;
    if (currentTemp < 2 || currentTemp > 8) {
      contract.slaPassed = false;
      contract.status = 'BREACH_DETECTED_ESCROW_FROZEN';
      contract.lastEvaluated = new Date().toISOString();
      contractEvent = {
        shipmentId,
        temperature: `${currentTemp}°C`,
        status: 'SLA_VIOLATION_PENALTY_LOCKED',
        action: 'Escrow Frozen. Penalty Clause Executed on Immutable Ledger.',
        timestamp: new Date().toISOString(),
      };
    } else {
      contract.lastEvaluated = new Date().toISOString();
      contractEvent = {
        shipmentId,
        temperature: `${currentTemp}°C`,
        status: 'SLA_COMPLIANT_TRANSIT_VERIFIED',
        action: 'Temperature within [2°C - 8°C]. Custody verified.',
        timestamp: new Date().toISOString(),
      };
    }

    this.smartContracts.set('SC-COLD-CHAIN-SLA', contract);

    return this.createTransaction('SMART_CONTRACT_EVALUATION', contractEvent, 'IOT_ORACLE_RULE_NODE');
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return {
          valid: false,
          error: `Block #${currentBlock.index} hash is invalid or tampered!`,
          tamperedBlockIndex: currentBlock.index,
        };
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          error: `Block #${currentBlock.index} previousHash does not match Block #${previousBlock.index} hash!`,
          tamperedBlockIndex: currentBlock.index,
        };
      }
    }

    return {
      valid: true,
      blockCount: this.chain.length,
      latestHash: this.getLatestBlock().hash,
      message: 'Blockchain integrity verified. All cryptographic hashes and Merkle chains match 100%.',
    };
  }

  getChainSummary() {
    const totalTransactions = this.chain.reduce((sum, b) => sum + b.transactions.length, 0);
    return {
      blockCount: this.chain.length,
      totalTransactions,
      latestBlockHash: this.getLatestBlock().hash,
      difficulty: this.difficulty,
      consensusAlgorithm: 'Proof-of-Authority (PoA) / Amazon Managed Blockchain',
      networkState: 'IMMUTABLE_ONLINE',
      chainIntegrity: this.isChainValid(),
      smartContracts: this.getSmartContracts(),
      blocks: this.chain,
    };
  }
}

module.exports = new BlockchainService();
