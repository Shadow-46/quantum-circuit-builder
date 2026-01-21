# Quantum Circuit Builder 🔮

> An intelligent, educational quantum development platform with AI assistance, advanced optimization, and collaborative features.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ✨ What's New in Version 2.0 (Phase 9)

🤖 **AI-Assisted Circuit Design** - Natural language to quantum circuits  
⚡ **Advanced Optimization** - Multi-objective algorithms with hardware mapping  
🎓 **Interactive Learning Paths** - 25 lessons from basics to error correction  
📤 **Collaborative Workspace** - Share, version, and comment on circuits

---

## 🚀 Features

### Core Functionality
- 🎨 **Visual Circuit Builder** - Drag-and-drop interface for quantum gates
- 🔬 **Quantum Simulation** - Real-time circuit execution and measurement
- 📊 **Visualization Suite** - Measurements, statevector, Bloch sphere, density matrix
- 🎯 **12+ Quantum Gates** - H, X, Y, Z, CNOT, SWAP, Toffoli, T, S, and more
- 🌐 **Hardware Integration** - Run circuits on real quantum hardware

### 🤖 AI & Intelligence (Phase 9)
- **Natural Language Processing** - Convert text to quantum circuits
  - *"Create a Bell state"* → Instant circuit generation
  - Pattern recognition for 6+ quantum algorithms
- **Smart Suggestions** - Context-aware gate recommendations
- **Circuit Analysis** - Automated quality scoring and optimization hints
- **Learning Assistant** - Circuit explanations and educational resources

### ⚡ Advanced Optimization (Phase 9)
- **4 Optimization Algorithms**
  - Greedy gate cancellation
  - Simulated annealing
  - Genetic algorithm
  - Multi-objective Pareto optimization
- **Hardware-Specific Mapping** - 5 topology options (IBM, AWS, Linear, All-to-all)
- **Interactive Dashboard** - Before/after comparison with metrics
- **Gate Decomposition** - Automatic Toffoli, SWAP, CZ decomposition

### 🎓 Educational Platform (Phase 9)
- **25 Interactive Lessons** across 4 difficulty levels:
  - 🟢 Beginner: Quantum basics, gates, measurement (10 lessons)
  - 🟡 Intermediate: Algorithms (Deutsch-Jozsa, Grover's, QFT) (5 lessons)
  - 🟠 Advanced: Applications (Shor's, VQE, QAOA) (3 lessons)
  - 🔴 Expert: Error correction (2 lessons)
- **Interactive Quiz System** - Test knowledge with instant feedback
- **Achievement System** - 5 badge types with point rewards
- **Progress Tracking** - Persistent learning history

### 📤 Collaboration Tools (Phase 9)
- **Circuit Sharing**
  - URL-based sharing with QR codes
  - Public/Unlisted/Private visibility modes
  - Social sharing integration
- **Version Control**
  - Save circuit snapshots with commit messages
  - Diff comparison between versions
  - Restore previous versions
- **Comment System**
  - General circuit discussions
  - Gate-specific threading
  - Reply functionality
- **Export Options**
  - JSON (circuit data)
  - OpenQASM 2.0
  - Human-readable text

### 🔧 Additional Features
- 📚 **Circuit Library** - Pre-built templates (Bell, GHZ, Grover's, Shor's, etc.)
- 🎨 **Noise Simulation** - Test circuits with realistic quantum noise
- 📈 **Circuit Statistics** - Depth, gate count, entanglement analysis
- 🔄 **Circuit Transpiler** - Basis gate decomposition
- ⏱️ **History & Undo/Redo** - Full action history with keyboard shortcuts
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-circuit-builder.git
cd quantum-circuit-builder

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### Running the Application

```bash
# Terminal 1: Start backend (from backend/ directory)
uvicorn app.main:app --reload

# Terminal 2: Start frontend (from frontend/ directory)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎓 Learning Path

New to quantum computing? Follow our structured learning path:

1. **Start with Basics** (🟢 Beginner)
   - Introduction to Qubits
   - Single-Qubit Gates
   - Measurement Basics
   
2. **Learn Algorithms** (🟡 Intermediate)
   - Deutsch-Jozsa Algorithm
   - Grover's Search
   - Quantum Fourier Transform

3. **Explore Applications** (🟠 Advanced)
   - Shor's Factoring Algorithm
   - Variational Quantum Eigensolver
   - Quantum Approximate Optimization

4. **Master Error Correction** (🔴 Expert)
   - Quantum Error Models
   - Bit Flip Code

**Access learning paths:** Click "🎓 Learning Paths" in the circuit builder

---

## 🤖 Using AI Assistant

The AI assistant can help you build circuits using natural language:

**Examples:**
- *"Create a Bell state"* - Generates H and CNOT gates
- *"Build a 3-qubit GHZ state"* - Creates entangled state
- *"Explain this circuit"* - Provides detailed analysis
- *"Optimize for gate count"* - Suggests improvements

**Quick Actions:**
- 🔍 **Analyze** - Get circuit quality score and issues
- 💡 **Explain** - Understand what your circuit does
- ⚡ **Suggest** - Get next gate recommendations

---

## ⚡ Optimization Guide

### Using the Optimization Dashboard

1. **Select Algorithm:**
   - **Greedy** - Fast, good for simple circuits
   - **Simulated Annealing** - Better results, moderate time
   - **Genetic** - Best quality, longer execution
   - **Multi-Objective** - Pareto frontier with multiple solutions

2. **Choose Hardware Topology:**
   - IBM Falcon R5 (5-qubit T-shaped)
   - IBM Eagle R3
   - AWS Rigetti Aspen
   - Linear chain
   - All-to-all connectivity

3. **Review Metrics:**
   - Total gate count reduction
   - Circuit depth improvement
   - Two-qubit gate minimization

4. **Apply or Revert** - Test optimized circuit before committing

---

## 📤 Sharing & Collaboration

### Share Your Circuit

1. Click **📤 Share Circuit** button
2. Choose sharing mode:
   - **🔗 Link** - Copy shareable URL
   - **📥 Export** - Download as JSON/QASM/text
   - **📱 QR Code** - Generate scannable code

### Version Control

1. Click **🕰️ Version Control**
2. Enter commit message
3. Save version snapshot
4. Compare versions with diff view
5. Restore previous versions anytime

### Add Comments

1. Click **💬 Comments**
2. Select gate (optional) or comment generally
3. Reply to existing comments
4. Filter by type (All/General/Gate)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Zustand** - State management
- **Vite** - Build tool
- **CSS3** - Styling with gradients and animations

### Backend
- **FastAPI** - Python web framework
- **Qiskit** - Quantum circuit simulation
- **Uvicorn** - ASGI server
- **NumPy** - Numerical computations

### Key Features
- **localStorage** - Client-side persistence
- **Base64 Encoding** - Circuit URL sharing
- **Pattern Matching** - AI circuit recognition
- **Multi-objective Optimization** - Pareto frontier analysis

---

## 📊 Project Statistics

- **Total Lines of Code:** ~15,000+
- **Components:** 50+ React components
- **Features:** 40+ major features
- **Learning Lessons:** 25 interactive lessons
- **Quantum Algorithms:** 15+ templates
- **Development Phases:** 9 completed

---

## 🗺️ Roadmap

### ✅ Completed
- Phase 1-8: Core circuit builder, visualization, hardware integration
- Phase 9: AI assistance, optimization, learning, collaboration

### 🔜 Upcoming (Phase 10+)
- Real-time multi-user collaboration with WebSockets
- User authentication and cloud storage
- Mobile native apps (iOS/Android)
- REST API for third-party integrations
- Enterprise features (SSO, audit logs)
- Advanced ML-based circuit optimization

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Qiskit** - IBM's quantum computing framework
- **Nielsen & Chuang** - Quantum Computation and Quantum Information
- **Quantum Computing Community** - For inspiration and support

---

## 📧 Contact

Have questions or feedback? Reach out:

- 📧 Email: your.email@example.com
- 🐦 Twitter: @yourhandle
- 💼 LinkedIn: your-profile

---

**Built with ❤️ for the quantum computing community**