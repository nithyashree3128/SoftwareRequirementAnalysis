// Pre-loaded sample projects and benchmark evaluation test cases
export const sampleProjects = [
  {
    id: "benchmark-case",
    name: "Nova Portal (Benchmark)",
    domain: "fintech",
    targetAudience: "Enterprise Banking Customers & Ops Team",
    techStack: "React, Node.js, PostgreSQL, Redis, AWS ECS",
    description: "Official evaluation benchmark testing ambiguous performance and security statements against IEEE 830 explainable refinement rules.",
    rawRequirements: "The system should be fast and secure.",
    presetBadge: "Benchmark Test"
  },
  {
    id: "fintech-payguard",
    name: "PayGuard Enterprise Wallet",
    domain: "fintech",
    targetAudience: "Global Retail Customers & Merchant Partners",
    techStack: "Next.js, Go Microservices, Kafka, CockroachDB, Kubernetes",
    description: "Real-time cross-border fiat and crypto settlement platform with automated fraud prevention and PSD2 compliance.",
    rawRequirements: `We need a quick and bulletproof crypto wallet and payment app with zero downtime that can handle lots of users.
Users should easily send money to friends with instant notification.
The app should be modern and completely secure against hackers.
The system shall export monthly transaction reports in CSV format with UTF-8 encoding.
Make coffee for the engineering team whenever Bitcoin hits an all-time high.`,
    presetBadge: "Fintech Real-World"
  },
  {
    id: "healthcare-caresync",
    name: "CareSync Digital EHR",
    domain: "healthcare",
    targetAudience: "Physicians, Nurses, Hospital Administrators & Patients",
    techStack: "React, Python FastAPI, PostgreSQL with TDE, WebRTC, Docker",
    description: "HIPAA-certified electronic health record system offering real-time patient charts, telemedicine consults, and clinical audit logging.",
    rawRequirements: `Doctors should easily see patient data in real time and it needs to be completely safe and friendly.
The system must never crash and should keep records forever without getting slow.
The system shall generate HL7 FHIR standard JSON resources for patient allergy lists.
The platform must predict future patient diseases with 100% accuracy without diagnosis.`,
    presetBadge: "Healthcare EHR"
  },
  {
    id: "ecommerce-shopvelocity",
    name: "ShopVelocity Omnichannel Store",
    domain: "ecommerce",
    targetAudience: "B2C Shoppers & E-commerce Fulfillment Specialists",
    techStack: "React 19, Tailwind CSS, Shopify Headless GraphQL, Node.js, Redis",
    description: "High-volume retail storefront featuring sub-second catalog search, flash-sale inventory reservation, and PCI-DSS compliance.",
    rawRequirements: `Make a nice modern shopping store with super fast checkout, great search, and infinite scaling.
It should accept credit cards securely and let customers track packages seamlessly.
The system shall allow shoppers to filter items by price range, brand, and customer review rating.
The system shall predict exact lottery numbers for loyal customers during checkout.`,
    presetBadge: "E-Commerce"
  },
  {
    id: "iot-aerosensor",
    name: "AeroSensor Fleet Telemetry",
    domain: "iot",
    targetAudience: "Industrial IoT Plant Operators & Maintenance Engineers",
    techStack: "MQTT Broker, Rust Edge Daemons, TimescaleDB, Grafana, AWS IoT Core",
    description: "Connected industrial sensor grid ingesting temperature and vibration telemetry with sub-second anomaly detection.",
    rawRequirements: `Sensors should instantly send data to the cloud reliably without any lag.
If a sensor gets hot it should alert us immediately.
Firmware updates should be easy and bug-free.
The edge agent shall emit a heartbeat packet every 30 seconds containing device UUID and battery voltage.`,
    presetBadge: "Industrial IoT"
  }
];
