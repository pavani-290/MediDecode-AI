# MediDecode AI: UI/UX Wireframes & Technical Blueprint

This document contains professional blueprints for the MediDecode AI platform. Use these Mermaid diagrams for your PowerPoint presentations by taking a screenshot of the rendered output.

---

## 1. High-Level User Journey
A comprehensive flow of how a patient interacts with the deciphering node.

```mermaid
graph TD
    Start([User: Uploads Prescription]) --> Vision[Gemini 3 Flash: Handwriting OCR]
    Vision --> Logic[Clinical Reasoning & Jargon Decoding]
    Logic --> ResultTab{User Choice}
    ResultTab --> Summary[Audio Summary & Plain Language Overview]
    ResultTab --> MedMatrix[Medication Schedule & Interaction Matrix]
    ResultTab --> GPS[Grounded GPS Pharmacy Discovery]
    Summary --> End([Printable PDF Report])
    MedMatrix --> End
    GPS --> End
```

---

## 2. Landing Page Architecture
The visual layout of the entry portal designed for medical trust.

```mermaid
graph TD
    subgraph "Landing Page (Hero)"
    H1[Nav: Logo + Lang + Login]
    H2[Hero Text: 'Health, decoded.']
    H3[CTA: 'Start Analysis' Primary Button]
    end
    subgraph "Proof & Trust"
    T1[Workflow: 4-Step Clinical Journey]
    T2[Comparison: MediDecode vs Generic Apps]
    T3[Features: 10 Core AI Modules]
    end
```

---

## 3. Analysis Dashboard Wireframe
The core interface where medical decoding happens.

```mermaid
graph LR
    subgraph "Dashboard UI"
    D1[Header: Back to Portal | Download PDF]
    D2[Main Tabs: Overview | Meds | Labs | Safety]
    D3[Content Pane: Interactive Decoded Data]
    D4[Sidebar: Verified Store Finder - GPS Grounded]
    D5[Chatbot: Floating Health Concierge]
    end
```

---

## 4. Technical Grounding Flow
How Vertex AI ensures zero-hallucination for physical pharmacy locations.

```mermaid
sequenceDiagram
    participant User
    participant App as MediDecode App
    participant GPS as Browser Geolocation
    participant AI as Gemini 2.5 Flash
    participant Tool as Google Maps Tool

    User->>App: Request Nearby Stores
    App->>GPS: Acquire Coordinates
    GPS-->>App: Latitude/Longitude
    App->>AI: Find Pharmacies at these coordinates
    AI->>Tool: Search nearby (Grounded)
    Tool-->>AI: Real Physical Entities
    AI-->>App: Verified Store List (JSON)
    App-->>User: Proximity-Locked Store Cards
```

---
*Note: These diagrams represent the verified technical architecture of the MediDecode solution.*