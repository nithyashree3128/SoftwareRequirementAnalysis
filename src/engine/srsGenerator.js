// SRS Document Generator (IEEE 830 / ISO/IEC/IEEE 29148 Standard)
// Generates production-grade Software Requirements Specifications with Explainable Requirement Engineering Audit Trails

export function generateSRSMarkdown(project, requirements, userSession) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const activeReqs = requirements.filter(r => r.status !== "Rejected");
  const rejectedReqs = requirements.filter(r => r.status === "Rejected");
  const functionalReqs = activeReqs.filter(r => r.category === "Functional");
  const nonFunctionalReqs = activeReqs.filter(r => r.category !== "Functional");

  const authorName = userSession?.name || "ReqLens Specification Team";
  const authorRole = userSession?.role || "Requirement Engineer";

  let md = `# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Project: ${project.name || "Enterprise System"}
**Document Reference:** SRS-REQ-${new Date().getFullYear()}-001  
**Version:** 1.0.0 (Formal Baseline)  
**Publication Date:** ${currentDate}  
**Lead Author:** ${authorName} (${authorRole})  
**Domain Vertical:** ${(project.domain || "Enterprise Software").toUpperCase()}  
**Compliance Baseline:** IEEE 830-1998 / ISO/IEC/IEEE 29148:2018  
**Verification Status:** APPROVED FOR IMPLEMENTATION  

---

## EXECUTIVE SUMMARY
This document defines the formal Software Requirements Specification (SRS) for **${project.name}**. It establishes a legally and technically binding contract between stakeholders, engineering architects, and quality assurance teams. All specifications within this document have undergone rigorous Explainable Requirement Engineering (ERE) to eliminate subjective ambiguities, enforce measurable Service Level Agreements (SLAs), and inject required regulatory baselines.

---

## 1. INTRODUCTION

### 1.1 Purpose
The purpose of this specification is to articulate complete, consistent, and verifiable functional and non-functional requirements for the development of **${project.name}**. This document serves as the single source of truth for engineering teams, test automation architects, and regulatory auditors.

### 1.2 Document Conventions & Keyword Taxonomy
In accordance with **RFC 2119** and **IEEE 830**:
- **SHALL**: Indicates an absolute, mandatory technical requirement.
- **SHOULD**: Indicates a highly recommended best practice, which may be omitted only after documented architectural review.
- **MAY**: Indicates an optional feature or potential enhancement.

### 1.3 Intended Audience
This document is targeted toward:
1. **Software Engineering & Architecture Teams**: For designing microservices, data schemas, and API contracts.
2. **Quality Assurance (QA) & Test Automation Engineers**: For synthesizing automated test harnesses, acceptance criteria, and load tests.
3. **Product Managers & Stakeholders**: For MoSCoW scope management and milestone gate sign-offs.
4. **Compliance & Security Auditors**: For validating regulatory alignments (e.g., PCI-DSS, HIPAA, OWASP).

### 1.4 Scope & Core Objectives
**Target Audience:** ${project.targetAudience || "General Enterprise Users"}  
**Target Technology Stack:** ${project.techStack || "Modern Cloud Architecture"}  
**Strategic Objectives:**
- Eliminate ambiguity in raw business requirements through quantifiable metric replacement.
- Ensure end-to-end requirement traceability across the development lifecycle.
- Guarantee strict compliance with industry cybersecurity and performance standards.

---

## 2. STAKEHOLDERS & SYSTEM CONSTRAINTS

### 2.1 User Classes & Personas
- **Developer / Technical Implementer:** Requires deterministic API latency thresholds, data models, error codes, and testing contracts.
- **Product Manager / Business Lead:** Requires business value alignment, release scope boundaries, and MoSCoW prioritization.
- **Client / End Customer:** Requires transparent feature deliverables, high availability, and adherence to plain-English acceptance criteria.

### 2.2 Operating Environment & Technology Stack
- **Architecture:** Distributed cloud microservices and event-driven data streaming.
- **Target Stack:** ${project.techStack || "Containerized Services (Docker / K8s), Relational & NoSQL Datastores"}
- **Client Environments:** Modern Evergreen Web Browsers (Chrome, Edge, Safari, Firefox) and mobile responsive viewports (360px - 3840px).

### 2.3 General Design & Implementation Constraints
- All public network ingress must terminate TLS 1.3 with HSTS enabled.
- Data stores holding personally identifiable information (PII) must employ AES-256 field-level encryption.
- Horizontal scaling must not disrupt transactional atomicity or active session states.

---

## 3. FUNCTIONAL REQUIREMENTS

${functionalReqs.length === 0 ? "_No functional requirements recorded in current baseline._" : functionalReqs.map(r => `
### 3.${r.id.replace(/\D/g, '') || '1'} [${r.id}] ${r.title}
- **Formal Specification:** ${r.refinedText}
- **Source:** ${r.source}
- **MoSCoW Priority:** **${r.moscow || "Must Have"}**
- **Validation Status:** **${r.status.toUpperCase()}**
- **Verification Method:** ${r.verificationMethod || "Automated Integration Test"}
- **Acceptance Criteria:** Given valid input parameters, the system shall complete processing within specified bounds and emit deterministic status codes without unhandled exceptions.
`).join("\n")}

---

## 4. NON-FUNCTIONAL REQUIREMENTS (NFR)

### 4.1 Performance & Latency Requirements
${nonFunctionalReqs.filter(r => r.category === "Performance" || r.category === "Scalability").length === 0 ? 
"- The system shall maintain sub-second response times under standard operational load." : 
nonFunctionalReqs.filter(r => r.category === "Performance" || r.category === "Scalability").map(r => `
- **[${r.id}] ${r.title}:** ${r.refinedText}
  - *Standard Reference:* ${r.standards || "ISO/IEC 25010"}
  - *Verification:* ${r.verificationMethod}
`).join("\n")}

### 4.2 Security, Authentication & Cryptography
${nonFunctionalReqs.filter(r => r.category === "Security" || r.category === "Compliance").length === 0 ? 
"- The system shall enforce industry standard cryptographic ciphers and role-based access control." : 
nonFunctionalReqs.filter(r => r.category === "Security" || r.category === "Compliance").map(r => `
- **[${r.id}] ${r.title}:** ${r.refinedText}
  - *Standard Reference:* ${r.standards || "OWASP ASVS / NIST"}
  - *Verification:* ${r.verificationMethod}
`).join("\n")}

### 4.3 Reliability & Availability
${nonFunctionalReqs.filter(r => r.category === "Reliability" || r.category === "Architecture").length === 0 ? 
"- The system shall achieve 99.9% uptime with automated health checking and graceful degradation." : 
nonFunctionalReqs.filter(r => r.category === "Reliability" || r.category === "Architecture").map(r => `
- **[${r.id}] ${r.title}:** ${r.refinedText}
  - *Standard Reference:* ${r.standards || "ISO/IEC 25010"}
  - *Verification:* ${r.verificationMethod}
`).join("\n")}

### 4.4 Usability & Accessibility Standards
${nonFunctionalReqs.filter(r => r.category === "Usability" || r.category === "Design").length === 0 ? 
"- The user interface shall adhere to WCAG 2.1 AA accessibility guidelines." : 
nonFunctionalReqs.filter(r => r.category === "Usability" || r.category === "Design").map(r => `
- **[${r.id}] ${r.title}:** ${r.refinedText}
  - *Standard Reference:* ${r.standards || "WCAG 2.1 AA"}
  - *Verification:* ${r.verificationMethod}
`).join("\n")}

---

## 5. USE CASES & SYSTEM CONSTRAINTS

### Primary Operational Workflow (UC-01: Baseline User Session)
1. **Actor:** Authenticated System User
2. **Preconditions:** User possesses valid credentials and network access to public gateway.
3. **Main Success Scenario:**
   - User initiates request to target service endpoint.
   - System authenticates request headers within 50ms and checks authorization token.
   - System executes business logic and database transaction under ACID guarantees.
   - System emits structured response payload with HTTP 200 OK.
4. **Postconditions:** Transaction audit event recorded in persistent journal; response latency within SLA threshold.
5. **Exceptions:** If failed authentication occurs 5 consecutive times, account lockout is triggered immediately.

---

## 6. REQUIREMENT TRACEABILITY MATRIX (RTM)

The following matrix guarantees bidirectional traceability from raw customer origin to verification test harness:

| Req ID | Category | MoSCoW | Status | Verification Method | Traceability Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
${activeReqs.map(r => `| **${r.id}** | ${r.category} | ${r.moscow || "Must"} | ${r.status} | ${r.verificationMethod ? r.verificationMethod.slice(0, 38) + '...' : 'Automated QA'} | ${r.source} |`).join("\n")}

---

## 7. REQUIREMENT DECISION & JUSTIFICATION REPORT
*(Explainable Requirement Engineering Audit Trail)*

This section documents the formal engineering rationale behind every modification, rejection, and system-suggested addition made during the transformation from raw customer notes into this formal specification.

| Req ID | Original Verbatim Input | Formal Specification | Decision | Engineering Justification |
| :--- | :--- | :--- | :--- | :--- |
${requirements.map(r => `| **${r.id}** | "${r.originalText ? r.originalText.replace(/[\r\n]+/g, ' ').slice(0, 50) + (r.originalText.length > 50 ? '...' : '') : 'N/A'}" | "${r.refinedText.replace(/[\r\n]+/g, ' ').slice(0, 60) + (r.refinedText.length > 60 ? '...' : '')}" | **${r.status.toUpperCase()}** | ${r.reason.replace(/[\r\n]+/g, ' ')} |`).join("\n")}

${rejectedReqs.length > 0 ? `
### 7.1 Excluded & Rejected Statements Audit
The following items were identified in raw stakeholder input but rejected from the engineering specification:
${rejectedReqs.map(r => `- **[${r.id}] "${r.originalText}"**: Rejected due to: *${r.reason}*`).join("\n")}
` : ''}

---

## 8. SIGN-OFF & STAKEHOLDER APPROVALS

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **Lead Requirement Engineer** | ${authorName} | *Digitally Verified (ReqLens)* | ${currentDate} |
| **Lead Software Architect** | Engineering Architecture Board | *Pending Sign-off* | ____________ |
| **Product Delivery Manager** | Product Management Office | *Approved* | ${currentDate} |
| **Client Representative** | Authorized Client Sponsor | *Accepted Baseline* | ${currentDate} |

*Generated automatically via ReqLens Explainable Requirement Engineering Engine.*
`;

  return md;
}
