// Domain Baseline Requirement Templates
// Provides pre-defined industry templates and missing essential requirements for requirement completion
export const domainTemplates = {
  fintech: {
    id: "fintech",
    name: "Financial Technology (Fintech)",
    icon: "ShieldCheck",
    standards: ["PCI-DSS v4.0", "SOC 2 Type II", "NIST SP 800-63B", "GDPR"],
    description: "High-security banking, wallet, payment gateway, and asset management systems requiring strict compliance, idempotency, and audit trails.",
    baselineRequirements: [
      {
        id: "FIN-SEC-01",
        title: "Account Lockout & Brute Force Defense",
        refinedText: "The system shall lock an account after 5 consecutive failed login attempts for a duration of 15 minutes, and dispatch a security notification email.",
        category: "Security",
        moscow: "Must Have",
        reason: "Critical security control mandated by PCI-DSS Requirement 8.3.4 to prevent credential stuffing and automated dictionary attacks.",
        verificationMethod: "Automated penetration test executing 6 consecutive invalid credentials and asserting HTTP 423 Locked"
      },
      {
        id: "FIN-SEC-02",
        title: "Mandatory Multi-Factor Authentication",
        refinedText: "The system shall enforce Time-based One-Time Password (TOTP) or biometric Multi-Factor Authentication (2FA) for any fund transfer exceeding $50.00.",
        category: "Security",
        moscow: "Must Have",
        reason: "PSD2 Strong Customer Authentication (SCA) compliance for high-value financial movements.",
        verificationMethod: "Integration test asserting step-up authentication challenge on transfers > $50.00"
      },
      {
        id: "FIN-DATA-01",
        title: "Double-Entry Transaction Ledger",
        refinedText: "All monetary movements shall be recorded as immutable double-entry ledger entries with balance sum checksums equal to zero in an ACID-compliant database transaction.",
        category: "Reliability",
        moscow: "Must Have",
        reason: "Financial integrity requires tamper-evident auditability and zero floating-point rounding errors.",
        verificationMethod: "Database transaction isolation test validating strict rollback on debit/credit mismatch"
      },
      {
        id: "FIN-SEC-03",
        title: "Payment Idempotency Guarantees",
        refinedText: "The payment API shall enforce unique idempotency keys on all charge requests, ensuring duplicate requests within 24 hours do not trigger multiple debits.",
        category: "Functional",
        moscow: "Must Have",
        reason: "Prevents double-charging customers during network drops or client retry storms.",
        verificationMethod: "Replay attack simulation sending identical idempotency keys concurrently"
      }
    ]
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare & Digital Health",
    icon: "Activity",
    standards: ["HIPAA Security Rule", "HITECH Act", "HL7 / FHIR", "ISO 27799"],
    description: "Electronic Health Record (EHR), patient portal, and telemedicine applications demanding strict Protected Health Information (PHI) confidentiality and audit logging.",
    baselineRequirements: [
      {
        id: "HC-SEC-01",
        title: "Immutable PHI Access Audit Logging",
        refinedText: "The system shall log every read, update, or export operation involving Protected Health Information (PHI) with cryptographic timestamp, practitioner user ID, patient ID, and IP address into a write-once audit log.",
        category: "Compliance",
        moscow: "Must Have",
        reason: "Mandatory HIPAA requirement (§164.312(b)) to detect unauthorized access to patient medical records.",
        verificationMethod: "Audit log inspection verifying non-repudiation and tamper detection after record retrieval"
      },
      {
        id: "HC-DATA-01",
        title: "Cryptographic PHI Encryption at Rest and Transit",
        refinedText: "All patient health records, diagnostic scans, and clinical notes shall be encrypted at rest using AES-GCM-256 and transmitted exclusively over TLS 1.3 encrypted channels.",
        category: "Security",
        moscow: "Must Have",
        reason: "HIPAA Security Rule technical safeguards for electronic PHI (ePHI).",
        verificationMethod: "Storage volume inspection and TLS cipher suite handshake auditing"
      },
      {
        id: "HC-COMM-01",
        title: "Telehealth WebRTC Stream Privacy",
        refinedText: "Video consultations between patients and clinical practitioners shall utilize end-to-end encrypted WebRTC streams with zero media recording unless explicit dual-party digital consent is recorded.",
        category: "Security",
        moscow: "Must Have",
        reason: "Protects patient-doctor confidentiality during remote clinical consultations.",
        verificationMethod: "Wireshark packet capture asserting SRTP encryption payload opacity"
      },
      {
        id: "HC-EMERG-01",
        title: "Emergency Clinical Break-Glass Override",
        refinedText: "The system shall provide an authorized 'Break-Glass' emergency override allowing trauma staff instant access to critical allergy records, triggering immediate executive audit alarms.",
        category: "Functional",
        moscow: "Should Have",
        reason: "Prevents life-threatening medical errors when unconscious patients enter emergency rooms.",
        verificationMethod: "Role simulation asserting immediate record unlock with SIEM notification dispatch"
      }
    ]
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-Commerce & Retail",
    icon: "ShoppingCart",
    standards: ["PCI-DSS Level 1", "WCAG 2.1 AA", "GDPR / CCPA", "ISO 27001"],
    description: "High-volume digital storefronts, shopping carts, inventory synchronization, and omnichannel order fulfillment platforms.",
    baselineRequirements: [
      {
        id: "ECOM-PERF-01",
        title: "Product Search Sub-Second Latency",
        refinedText: "The product catalog search shall return filtered results for queries with over 100,000 SKUs within 300 milliseconds under a concurrent load of 2,000 queries per second.",
        category: "Performance",
        moscow: "Must Have",
        reason: "Direct business correlation between catalog response latency, bounce rate, and checkout conversion.",
        verificationMethod: "Distributed load test measuring 95th percentile response time for fuzzy search queries"
      },
      {
        id: "ECOM-CART-01",
        title: "Atomic Inventory Reservation Timer",
        refinedText: "Upon proceeding to checkout, the system shall temporarily reserve cart inventory for exactly 15 minutes, automatically releasing stock back to public inventory upon cart expiration.",
        category: "Functional",
        moscow: "Must Have",
        reason: "Prevents overselling flash-sale inventory while avoiding permanent stock lockups from abandoned carts.",
        verificationMethod: "Concurrency race-condition test validating inventory count decrement and release timer"
      },
      {
        id: "ECOM-PAY-01",
        title: "PCI-Compliant Hosted Tokenization",
        refinedText: "The checkout flow shall tokenize customer credit card credentials via an iframe hosted by a certified Level-1 PCI-DSS payment processor with zero raw PAN touching merchant application servers.",
        category: "Security",
        moscow: "Must Have",
        reason: "Eliminates merchant liability and drastically reduces PCI-DSS SAQ-A audit scope.",
        verificationMethod: "Network telemetry intercept inspecting payload parameters for absence of raw credit card PAN"
      },
      {
        id: "ECOM-NOTIF-01",
        title: "Transactional Order Confirmation Dispatch",
        refinedText: "The system shall dispatch transactional confirmation emails and SMS receipts with itemized order details within 60 seconds of successful payment capture.",
        category: "Functional",
        moscow: "Should Have",
        reason: "Customer assurance and legal proof of digital purchase contract.",
        verificationMethod: "End-to-end integration test asserting webhook arrival time <= 60s"
      }
    ]
  },
  iot: {
    id: "iot",
    name: "IoT & Smart Hardware",
    icon: "Cpu",
    standards: ["ISO/IEC 30141", "MQTT v5.0", "OWASP IoT Top 10", "ETSI EN 303 645"],
    description: "Connected edge devices, sensor telemetry ingestion pipelines, remote firmware updates (OTA), and automated telemetry alerting.",
    baselineRequirements: [
      {
        id: "IOT-TELE-01",
        title: "High-Throughput MQTT Telemetry Ingestion",
        refinedText: "The ingestion gateway shall ingest sensor telemetry via MQTT v5.0 with QoS 1 at a minimum throughput of 10,000 messages per second with data packet loss under 0.01%.",
        category: "Performance",
        moscow: "Must Have",
        reason: "Prevents message drops and telemetry gaps during regional hardware sensor bursts.",
        verificationMethod: "MQTT load simulator publishing 10,000 msgs/sec and verifying broker ingestion metrics"
      },
      {
        id: "IOT-ALERT-01",
        title: "Sub-Second Critical Telemetry Anomaly Alerting",
        refinedText: "When an edge sensor detects temperature exceeding 85°C or vibration threshold spikes, the system shall broadcast an emergency telemetry alarm to the operations dashboard within 500 milliseconds.",
        category: "Functional",
        moscow: "Must Have",
        reason: "Prevents industrial equipment overheating and catastrophic mechanical failure.",
        verificationMethod: "Hardware test injection sending over-temp payloads and checking dashboard timestamp"
      },
      {
        id: "IOT-OTA-01",
        title: "Cryptographically Signed Over-the-Air (OTA) Updates",
        refinedText: "All Over-The-Air (OTA) firmware binaries shall be cryptographically signed using Ed25519; target edge devices shall reject unsigned binaries and support automatic fallback to prior firmware on boot failure.",
        category: "Security",
        moscow: "Must Have",
        reason: "Guards against malicious firmware tampering and device bricking during failed field updates.",
        verificationMethod: "OTA mock deployment flashing corrupt and valid binary images to test fallback bootloader"
      },
      {
        id: "IOT-CACHE-01",
        title: "Edge Disconnect Local Data Caching",
        refinedText: "Edge gateway hardware shall locally buffer up to 72 hours of telemetry readings during cellular network outages, automatically synchronizing data upon reconnection with timestamp preservation.",
        category: "Reliability",
        moscow: "Should Have",
        reason: "Preserves historical sensor data continuity across remote cellular connection blackouts.",
        verificationMethod: "Network disconnection simulation lasting 2 hours followed by reconnection audit"
      }
    ]
  }
};
