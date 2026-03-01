# Product Requirements Document (PRD)

## Parametric 2D Planning App (Dry-Glazed Glass Railing)

---

## 1. Product Overview

**Objective**
Develop a web-based parametric 2D planning application for TK8200 dry-glazed glass railing systems. The system will generate rule-based layouts, automatic glass panel division, shop drawings (PDF), BOM/cutting lists, and DXF exports.

This is **not** a freeform CAD tool. It is a **geometry-driven configurator** similar in workflow to the reference screenshots provided (step-based UI + live preview + parameter panel).

**Target Users**

* Estimators
* Sales engineers
* Project managers
* Glass/aluminum system fabricators

**Primary Value**

* Fast rule-based railing layout
* Elimination of manual panel calculations
* Automated documentation (PDF + BOM)
* DXF export for fabrication

---

## 2. Reference-Based UI Direction

Based on the screenshots provided:

### UI Characteristics to Emulate

* Left-side parameter control panel
* Central 2D drawing preview area
* Top navigation tabs / workflow steps
* Clean technical interface (not artistic)
* Dimension annotations shown directly on drawing
* Immediate visual feedback when parameters change

The UI should feel like:

> A simplified professional planning tool with structured inputs and deterministic output.

---

## 3. Scope Definition

## 3.1 MVP Scope

### Included

* Straight railing runs
* Basic 90° corners
* Parametric glass panel logic
* Dimensioned 2D drawing view
* PDF shop drawing generation
* BOM / cutting list export
* DXF export (2D)

### Excluded (Future Phases)

* 3D visualization
* Curved railings
* Multi-level stair logic
* Structural engineering checks
* ERP integration

---

## 4. Functional Requirements

---

# 4.1 Layout Engine

### 4.1.1 Layout Types

* Straight run
* L-shape (90° corner)

### 4.1.2 User Inputs

* Total run length
* Corner inclusion toggle
* System height
* Glass thickness
* Base shoe profile (TK8200 variants)
* Mounting type
* Panel gap
* Minimum/maximum panel width
* Edge clearances

---

# 4.2 Parametric Geometry Engine

This is the core of the system.

### 4.2.1 Automatic Glass Panel Division

The system must:

1. Subtract edge clearances
2. Subtract corner offsets (if applicable)
3. Calculate number of panels:

   ```
   N = floor((EffectiveLength + gap) / (maxPanelWidth + gap))
   ```
4. Rebalance panels:

   * Equalize widths
   * Respect min/max constraints
   * Distribute remainder evenly

### 4.2.2 Corner Handling

* Separate panel groups per segment
* Optional corner gap control
* No arbitrary geometry editing

### 4.2.3 Deterministic Logic

The system must:

* Reject invalid configurations
* Display validation messages
* Prevent illegal geometry states

---

# 4.3 2D Drawing Engine

### Requirements

* Vector-based rendering (SVG or Canvas)
* Scalable viewport
* Zoom / pan
* Auto dimension lines
* Panel numbering
* Segment labeling

### Drawing Must Include:

* Total length
* Individual panel widths
* Gaps
* Base profile line
* Height indication
* Corner annotation (if applicable)

Rendering must be:

* Precision-based (millimeter accuracy)
* Fabrication-ready

---

# 4.4 BOM / Cutting List Engine

### Must Generate:

**Glass Table**

* Panel ID
* Width
* Height
* Thickness
* Quantity

**Base Shoe**

* Segment length
* Total quantity

**Accessories (if defined)**

* Gaskets
* End caps
* Fasteners

Export formats:

* On-screen table
* CSV download
* Included in PDF

---

# 4.5 PDF Shop Drawing Generator

### PDF Must Contain:

1. Project header

   * Project name
   * Client
   * Date
   * Version

2. 2D drawing (scaled)

3. Dimension annotations

4. BOM table

5. Notes section

PDF should be:

* Vector-based
* Print-ready (A3/A4 landscape)
* Professional formatting

Library suggestions:

* pdf-lib
* jsPDF
* Puppeteer (if server-side rendering)

---

# 4.6 DXF Export (Preferred)

### Output:

* 2D geometry only
* Layers:

  * Glass panels
  * Dimensions
  * Base profile
  * Text

Format:

* AutoCAD R12 or 2000 compatible
* Millimeter units

Suggested approach:

* Custom DXF writer
* Or lightweight DXF generation library

---

## 5. Non-Functional Requirements

### Performance

* Layout recompute < 50ms
* PDF generation < 2 seconds
* Smooth zoom/pan at 60fps

### Precision

* Geometric tolerance: ±1mm

### Browser Support

* Chrome (latest)
* Edge
* Safari

### Architecture

* Frontend-only preferred (MVP)
* No backend required
* Pure deterministic client-side computation

---

## 6. Technical Stack (Suggested)

### Frontend

* React
* TypeScript
* SVG renderer (preferred for precision)
* Zustand or lightweight state manager

### Geometry Core

* Custom parametric engine (pure math)
* No dependency on Three.js (2D only)

### Exports

* jsPDF / pdf-lib
* Custom DXF generator

---

## 7. System Architecture

```
UI Layer
   ↓
State Manager
   ↓
Parametric Geometry Engine
   ↓
2D Renderer
   ↓
Export Layer (PDF / BOM / DXF)
```

Strict separation between:

* Geometry logic
* Visualization
* Export logic

---

## 8. Milestones

### Milestone 1 – Core Geometry Engine

* Straight runs
* Panel division logic
* Validation system

### Milestone 2 – 2D Drawing UI

* SVG renderer
* Dimensioning system
* Zoom/pan

### Milestone 3 – BOM + PDF

* Table generation
* Styled PDF export

### Milestone 4 – DXF Export

* Layered 2D export
* CAD compatibility testing

---

## 9. Acceptance Criteria

The MVP is accepted when:

* User inputs total length and system constraints
* System auto-generates valid panel layout
* 2D drawing displays dimensioned panels
* PDF shop drawing exports correctly
* BOM matches drawing
* DXF opens correctly in AutoCAD

---

## 10. Future Expansion

* Stair logic
* Curved runs
* 3D preview
* Cloud saving
* Admin pricing mode
* Quote generation
* Multi-system library

---

# Final Positioning

This product is:

* A deterministic geometry configurator
* A fabrication planning tool
* A digital replacement for Excel + manual drafting
* A system-specific TK8200 rule engine

It is **not**:

* A general drafting tool
* A freeform drawing app
* A BIM platform
