const blockchainService = require('../services/blockchainService');

exports.getBlockchainLedger = async (req, res) => {
  try {
    const summary = blockchainService.getChainSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.verifyBlockchain = async (req, res) => {
  try {
    const verification = blockchainService.isChainValid();
    res.json({ success: true, data: verification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addCustodyTransaction = async (req, res) => {
  try {
    const {
      type = 'CUSTODY_HANDOVER',
      shipmentId = 'SHP-774901',
      origin,
      destination,
      carrier = 'Kuehne+Nagel Cold Chain',
      signer = 'DEPOT_VERIFIER_AGENT',
      notes,
    } = req.body;

    const payload = {
      shipmentId,
      carrier,
      origin: origin || 'Warehouse Alpha Hub',
      destination: destination || 'Receiving Dock Gate 4',
      notes: notes || 'Physical seals inspected and tamper-evident signatures recorded.',
      timestamp: new Date().toISOString(),
    };

    const result = blockchainService.createTransaction(type, payload, signer);
    res.status(201).json({
      success: true,
      message: 'Transaction verified, digitally signed, and mined into immutable block.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.evaluateSmartContract = async (req, res) => {
  try {
    const { shipmentId, temperature, shock } = req.body;
    const result = blockchainService.evaluateColdChainSmartContract(
      shipmentId || 'SHP-774901',
      Number(temperature !== undefined ? temperature : 4.2),
      Number(shock || 0.2)
    );
    res.json({
      success: true,
      message: 'Smart contract SLA evaluated and execution event mined onto blockchain.',
      data: result,
      smartContracts: blockchainService.getSmartContracts(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
