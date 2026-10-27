// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SupplyChainEscrow
 * @dev Enterprise Smart Contract for Multipurpose Supply Chain Management
 * Implements automated escrow locking, IoT cold-chain temperature SLA verification,
 * and multi-party cryptographic custody transfers on EVM-compatible chains (Ethereum, Polygon, Arbitrum).
 */
contract SupplyChainEscrow {
    address public immutable owner;

    enum EscrowStatus { PENDING, ACTIVE_LOCKED, COMPLIANT_RELEASED, BREACH_FROZEN }
    enum ShipmentCategory { PHARMA_COLD_CHAIN, HIGH_TECH_ELECTRONICS, INDUSTRIAL_MACHINERY, BIOTECH }

    struct CustodyRecord {
        address handler;
        string location;
        uint256 timestamp;
        string notes;
    }

    struct ShipmentContract {
        string shipmentId;
        address payable seller;
        address payable carrier;
        address buyer;
        uint256 escrowAmount;
        int256 minTempThreshold; // e.g. 2°C (stored as 2)
        int256 maxTempThreshold; // e.g. 8°C (stored as 8)
        EscrowStatus status;
        ShipmentCategory category;
        bool isBreached;
        uint256 createdAt;
    }

    mapping(string => ShipmentContract) public shipments;
    mapping(string => CustodyRecord[]) public custodyAuditTrail;

    event EscrowDeposited(string indexed shipmentId, address indexed buyer, uint256 amount);
    event CustodyTransferred(string indexed shipmentId, address indexed handler, string location, uint256 timestamp);
    event TelemetryEvaluated(string indexed shipmentId, int256 currentTemp, bool compliant);
    event EscrowReleased(string indexed shipmentId, address indexed beneficiary, uint256 amount);
    event EscrowFrozenOnBreach(string indexed shipmentId, int256 breachTemp, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute");
        _;
    }

    modifier onlyParties(string memory _shipmentId) {
        ShipmentContract memory s = shipments[_shipmentId];
        require(
            msg.sender == s.buyer || msg.sender == s.seller || msg.sender == s.carrier || msg.sender == owner,
            "Caller not authorized for this shipment"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Initiates a shipment with locked escrow funds.
     */
    function initiateShipmentEscrow(
        string memory _shipmentId,
        address payable _seller,
        address payable _carrier,
        int256 _minTemp,
        int256 _maxTemp,
        ShipmentCategory _category
    ) external payable {
        require(msg.value > 0, "Escrow deposit must be > 0");
        require(shipments[_shipmentId].escrowAmount == 0, "Shipment ID already exists");

        shipments[_shipmentId] = ShipmentContract({
            shipmentId: _shipmentId,
            seller: _seller,
            carrier: _carrier,
            buyer: msg.sender,
            escrowAmount: msg.value,
            minTempThreshold: _minTemp,
            maxTempThreshold: _maxTemp,
            status: EscrowStatus.ACTIVE_LOCKED,
            category: _category,
            isBreached: false,
            createdAt: block.timestamp
        });

        emit EscrowDeposited(_shipmentId, msg.sender, msg.value);
    }

    /**
     * @notice Records physical handover between parties with digital signature.
     */
    function recordCustodyTransfer(
        string memory _shipmentId,
        string memory _location,
        string memory _notes
    ) external onlyParties(_shipmentId) {
        custodyAuditTrail[_shipmentId].push(CustodyRecord({
            handler: msg.sender,
            location: _location,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit CustodyTransferred(_shipmentId, msg.sender, _location, block.timestamp);
    }

    /**
     * @notice Oracle endpoint called by AWS IoT Core / backend rules engine.
     * Evaluates live temperature against SLA boundaries.
     */
    function evaluateIoTTelemetry(
        string memory _shipmentId,
        int256 _currentTemp
    ) external onlyOwner {
        ShipmentContract storage s = shipments[_shipmentId];
        require(s.status == EscrowStatus.ACTIVE_LOCKED, "Escrow is not active");

        if (_currentTemp < s.minTempThreshold || _currentTemp > s.maxTempThreshold) {
            s.isBreached = true;
            s.status = EscrowStatus.BREACH_FROZEN;
            emit EscrowFrozenOnBreach(_shipmentId, _currentTemp, "Thermal breach detected. Escrow locked for dispute.");
        } else {
            emit TelemetryEvaluated(_shipmentId, _currentTemp, true);
        }
    }

    /**
     * @notice Releases escrow to seller and carrier upon successful verified delivery.
     */
    function releaseDeliveryEscrow(string memory _shipmentId) external onlyParties(_shipmentId) {
        ShipmentContract storage s = shipments[_shipmentId];
        require(s.status == EscrowStatus.ACTIVE_LOCKED, "Escrow cannot be released");
        require(!s.isBreached, "Cannot release escrow: SLA was breached");

        s.status = EscrowStatus.COMPLIANT_RELEASED;
        uint256 carrierFee = (s.escrowAmount * 15) / 100; // 15% to freight carrier
        uint256 sellerPayout = s.escrowAmount - carrierFee;

        s.carrier.transfer(carrierFee);
        s.seller.transfer(sellerPayout);

        emit EscrowReleased(_shipmentId, s.seller, s.escrowAmount);
    }

    /**
     * @notice Returns complete custody audit trail count for a shipment.
     */
    function getCustodyTrailCount(string memory _shipmentId) external view returns (uint256) {
        return custodyAuditTrail[_shipmentId].length;
    }
}
