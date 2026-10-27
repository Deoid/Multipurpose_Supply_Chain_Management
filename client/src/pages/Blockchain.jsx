import React, { useState, useEffect } from 'react';
import {
  Link2,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  DollarSign,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
  Hash,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import {
  fetchBlockchain,
  verifyBlockchainIntegrity,
  recordCustodyTransaction,
  evaluateSmartContractSla,
} from '../services/api';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Blockchain() {
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testingContract, setTestingContract] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shipmentId: 'SHP-774901',
    carrier: 'DHL Global Express',
    origin: 'Cleveland Logistics Waypoint (OH)',
    destination: 'Boston Life Sciences Receiving Bay',
    signer: 'INSPECTOR_BOST_04',
    notes: 'Seal #KN-992 intact. Cold-chain dry ice level at 100%. Digital signature confirmed.',
  });

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      const res = await fetchBlockchain();
      if (res.success) {
        setLedgerData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyBlockchainIntegrity();
      if (res.success) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleCreateCustodyBlock = async (e) => {
    e.preventDefault();
    try {
      const res = await recordCustodyTransaction(formData);
      if (res.success) {
        setShowModal(false);
        loadBlockchainData();
      }
    } catch (err) {
      alert('Error recording custody block: ' + err.message);
    }
  };

  const handleSimulateContract = async (temp) => {
    setTestingContract(true);
    try {
      await evaluateSmartContractSla('SHP-774901', temp);
      await loadBlockchainData();
    } catch (err) {
      alert('Error evaluating contract: ' + err.message);
    } finally {
      setTestingContract(false);
    }
  };

  const blocks = ledgerData?.blocks || [];
  const smartContracts = ledgerData?.smartContracts || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Immutable Blockchain Ledger & Smart Contracts</h2>
            <AwsArchitectureBadge service="blockchain" action="Amazon Managed Blockchain" />
          </div>
          <p className="text-xs text-slate-300">
            Cryptographic SHA-256 Merkle blocks, tamper-proof chain of custody, and automated Cold-Chain SLA escrow smart contracts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-md"
          >
            <ShieldCheck className={`w-4 h-4 ${verifying ? 'animate-spin' : 'text-purple-400'}`} />
            <span>Verify Chain Integrity</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aws-orange hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Sign Custody Handover</span>
          </button>
        </div>
      </div>

      {/* Verification Success Box (if verified) */}
      {verificationResult && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Cryptographic Validation Passed:</span> {verificationResult.message}
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
            {verificationResult.blockCount} Blocks Validated
          </span>
        </div>
      )}

      {/* Smart Contract Escrow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {smartContracts.map((contract) => (
          <div
            key={contract.contractId}
            className="p-5 rounded-2xl bg-slate-800/80 border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-purple-400">{contract.contractId}</span>
                <StatusBadge status={contract.status} />
              </div>

              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>{contract.name}</span>
              </h3>
              <p className="text-xs text-slate-300 mb-3">{contract.rule}</p>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Locked Escrow Pool:</span>
                  <span className="font-mono font-bold text-emerald-400">{contract.escrowAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary:</span>
                  <span className="text-white font-medium">{contract.beneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Compliance:</span>
                  <span className={contract.slaPassed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {contract.slaPassed ? '✔ 100% Compliant' : '✖ Breach - Escrow Frozen'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Automated Oracle Trigger</span>
              {contract.contractId === 'SC-COLD-CHAIN-SLA' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateContract(4.2)}
                    disabled={testingContract}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold"
                  >
                    Simulate OK (4.2°C)
                  </button>
                  <button
                    onClick={() => handleSimulateContract(11.5)}
                    disabled={testingContract}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold"
                  >
                    Simulate Breach (11.5°C)
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Blockchain Explorer */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-xl p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-purple-400" />
              <span>Live Block Explorer (Chronological Merkle Chain)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each block contains SHA-256 cryptographic hashes, difficulty nonces, and digitally signed supply chain transactions.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {blocks.length} Blocks Mined
          </span>
        </div>

        {/* Blocks Horizontal/Vertical Flow */}
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={block.hash}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-500/50 transition-all shadow-md relative"
            >
              {/* Block Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                    #{block.index}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">
                      {block.index === 0 ? 'Genesis Block (Root)' : `Block #${block.index}`}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-400">Nonce:</span>
                  <span className="text-aws-orange font-bold">{block.nonce}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">Tx Count:</span>
                  <span className="text-white font-bold">{block.transactions.length}</span>
                </div>
              </div>

              {/* Hash Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="block text-[10px] text-slate-500 font-sans uppercase font-bold">Current Block Hash</span>
                  <span className="text-purple-300 break-all select-all">{block.hash}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="block text-[10px] text-slate-500 font-sans uppercase font-bold">Previous Block Hash</span>
                  <span className="text-slate-400 break-all select-all">{block.previousHash}</span>
                </div>
              </div>

              {/* Transactions in Block */}
              <div className="mt-2 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Mined Transactions & Digital Signatures:
                </span>
                {block.transactions.map((tx, tIdx) => (
                  <div
                    key={tx.txId || tIdx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-aws-orange font-bold text-[11px]">{tx.txId}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        {tx.type}
                      </span>
                    </div>

                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      {typeof tx.payload === 'object' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                          {Object.entries(tx.payload).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-slate-500">{k}:</span> <span className="text-slate-200">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        tx.payload
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Signer: <strong className="text-slate-400">{tx.signer}</strong></span>
                      <span className="truncate max-w-xs">Sig: {tx.signature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custody Handover Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Digitally Sign & Mine Custody Handover Block</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustodyBlock} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Shipment ID</label>
                  <input
                    type="text"
                    required
                    value={formData.shipmentId}
                    onChange={(e) => setFormData({ ...formData, shipmentId: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Carrier Fleet</label>
                  <input
                    type="text"
                    required
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Handover Origin</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Destination Facility</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inspector / Signing Oracle Agent</label>
                <input
                  type="text"
                  required
                  value={formData.signer}
                  onChange={(e) => setFormData({ ...formData, signer: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inspection Notes & Seal Verification</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Sign & Mine Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
