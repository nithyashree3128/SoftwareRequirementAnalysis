// Ambiguity Dictionary: Maps vague buzzwords to measurable metrics, regex patterns, and testable alternatives
export const ambiguityDictionary = [
  {
    term: "fast",
    regex: /\b(fast|quick|rapid|speedy|prompt|in no time)\b/gi,
    category: "Performance",
    flaw: "Subjective adjective 'fast' lacks quantifiable threshold and under-specifies load conditions.",
    suggestedReplacement: "The system shall load the dashboard within 3 seconds under a concurrent load of 500 users (p95 latency <= 3000ms).",
    metric: "Response Time <= 3.0s (p95)",
    standardRef: "IEEE 830 Section 4.3.5 / ISO 29148 Non-Functional Metrics",
    reason: "Performance requirements must define exact latency percentiles and user load conditions to be verifiable by QA.",
    verificationMethod: "Automated Load Testing (k6 / JMeter) at 500 concurrent virtual users"
  },
  {
    term: "secure",
    regex: /\b(secure|safe|bulletproof|unhackable|protected|tight security)\b/gi,
    category: "Security",
    flaw: "Vague adjective 'secure' does not define cryptographic ciphers, transport protocols, or access control parameters.",
    suggestedReplacement: "The system shall enforce TLS 1.3 for all data in transit, AES-256 for data at rest, and terminate sessions after 15 minutes of inactivity.",
    metric: "TLS 1.3 + AES-256 + 15m Session Inactivity Timeout",
    standardRef: "OWASP ASVS v4.0.3 / NIST SP 800-52r2",
    reason: "Security without specified algorithms or standards cannot be audited or penetration tested.",
    verificationMethod: "Static Code Analysis (SAST) + Penetration Testing + SSL Labs A+ Verification"
  },
  {
    term: "user-friendly",
    regex: /\b(user-friendly|user friendly|intuitive|easy to use|simple to use|walk in the park|clean look)\b/gi,
    category: "Usability",
    flaw: "Subjective usability terms cannot be verified objectively across varying user demographics.",
    suggestedReplacement: "The user interface shall adhere to WCAG 2.1 Level AA standards and allow first-time users to complete checkout within 3 minutes without assistance.",
    metric: "WCAG 2.1 AA Compliance + Task Completion Time <= 180s",
    standardRef: "ISO 9241-11 Usability Framework / W3C WCAG 2.1",
    reason: "Usability criteria must cite accessibility standards and quantifiable task completion benchmarks.",
    verificationMethod: "Automated Axe-Core Accessibility Audit + Moderated Usability Testing (n=10 users)"
  },
  {
    term: "scalable",
    regex: /\b(scalable|handle lots of users|high traffic|infinite scaling|huge load|massive scale)\b/gi,
    category: "Scalability",
    flaw: "'Scalable' provides no upper boundary, concurrency targets, or resource degradation constraints.",
    suggestedReplacement: "The system shall support horizontal auto-scaling from 100 to 10,000 concurrent active users while maintaining an error rate below 0.1%.",
    metric: "10,000 Concurrent Users with Error Rate < 0.1%",
    standardRef: "IEEE 830 Non-Functional Scalability Standards",
    reason: "Architecture teams require target concurrency numbers and budget boundaries to provision autoscaling clusters.",
    verificationMethod: "Stress Testing with distributed load generators scaling up to 10k connections"
  },
  {
    term: "robust",
    regex: /\b(robust|never crash|zero downtime|bulletproof|fault-tolerant|unbreakable)\b/gi,
    category: "Reliability",
    flaw: "Zero downtime or absolute robustness is mathematically impossible; concrete SLA uptime and failover times are required.",
    suggestedReplacement: "The system shall achieve 99.9% uptime SLA (maximum 43.8 minutes unplanned downtime/month) with automated failover within 30 seconds.",
    metric: "99.9% High Availability SLA + Failover <= 30s",
    standardRef: "ISO/IEC 25010 Quality Model - Reliability",
    reason: "Service Level Agreements (SLAs) must be tied to MTTR (Mean Time to Recover) and MTBF (Mean Time Between Failures).",
    verificationMethod: "Chaos Engineering testing (Chaos Mesh) simulating node termination during peak traffic"
  },
  {
    term: "real-time",
    regex: /\b(real-time|real time|instant|instantly|immediately|without delay|zero lag)\b/gi,
    category: "Performance",
    flaw: "'Real-time' is colloquial; hard real-time vs soft real-time and maximum permissible latency must be delineated.",
    suggestedReplacement: "The system shall publish live state changes to active subscriber clients via WebSockets with an end-to-end network latency under 200 milliseconds.",
    metric: "WebSocket Propagation Latency <= 200ms",
    standardRef: "RFC 6455 WebSocket Protocol Performance Specs",
    reason: "Guarantees network packet delivery expectations across client edge connections.",
    verificationMethod: "Network Telemetry packet inspection and latency distribution histograms"
  },
  {
    term: "flexible",
    regex: /\b(flexible|adaptable|customizable for anything|do whatever)\b/gi,
    category: "Architecture",
    flaw: "Broad flexibility leads to architectural scope creep and untested edge configurations.",
    suggestedReplacement: "The system shall allow administrators to modify business tax calculation rules and fee tiers via a configuration dashboard without requiring source code deployment.",
    metric: "Dynamic Config Engine with 0 Code Deployments",
    standardRef: "12-Factor App Config Principles",
    reason: "Specifies exact customization boundaries while preserving system stability.",
    verificationMethod: "Configuration mutation testing without backend service restart"
  },
  {
    term: "efficient",
    regex: /\b(efficient|lightweight|low resource|fast running)\b/gi,
    category: "Performance",
    flaw: "Lacks memory footprint, CPU budget, and battery drain constraints.",
    suggestedReplacement: "The background synchronization daemon shall consume no more than 128 MB of RAM and limit CPU utilization to under 15% on target client hardware.",
    metric: "RAM <= 128MB, CPU <= 15%",
    standardRef: "IEEE 1012 System Verification & Resource Budgets",
    reason: "Hardware resource ceilings prevent memory leaks and mobile device battery drain.",
    verificationMethod: "Continuous Profiling using pprof / Chrome DevTools performance traces"
  },
  {
    term: "bug-free",
    regex: /\b(bug-free|bug free|error-free|no bugs|perfect code)\b/gi,
    category: "Quality Assurance",
    flaw: "'Bug-free' is an untestable marketing assertion. Software engineering demands test coverage metrics and defect density thresholds.",
    suggestedReplacement: "The codebase shall achieve a minimum of 85% automated unit/integration test coverage with zero critical (Severity 1) defects prior to production release.",
    metric: "Code Coverage >= 85%, Sev-1 Defects = 0",
    standardRef: "ISO/IEC/IEEE 29119 Software Testing Standards",
    reason: "Provides an actionable CI/CD quality gate before deployment.",
    verificationMethod: "SonarQube static analysis and Jest / Vitest coverage reports"
  },
  {
    term: "modern",
    regex: /\b(modern|cutting edge|state of the art|next gen|slick)\b/gi,
    category: "Design",
    flaw: "Aesthetic fashion statement that conveys zero technical or architectural specifications.",
    suggestedReplacement: "The user interface shall be constructed using responsive CSS grid/flexbox layouts verified across viewport resolutions from 360px (mobile) to 3840px (4K).",
    metric: "Cross-Device Responsive Viewports (360px - 3840px)",
    standardRef: "Responsive Web Design Design Specifications",
    reason: "Eliminates ambiguity regarding target device resolutions and visual breakpoints.",
    verificationMethod: "Playwright cross-browser visual regression testing across mobile, tablet, and desktop viewports"
  }
];
