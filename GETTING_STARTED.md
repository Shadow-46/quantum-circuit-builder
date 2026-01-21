# Getting Started with Quantum Circuit Builder 🚀

Welcome! This guide will help you build your first quantum circuit and explore the platform's features.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [First Circuit](#your-first-quantum-circuit)
3. [Using the AI Assistant](#using-the-ai-assistant)
4. [Learning Paths](#learning-paths)
5. [Optimization](#circuit-optimization)
6. [Sharing & Collaboration](#sharing--collaboration)
7. [Tips & Tricks](#tips--tricks)

---

## 🔧 Installation

### Prerequisites
- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **Python** 3.8 or higher ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/quantum-circuit-builder.git
cd quantum-circuit-builder
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open in Browser

Navigate to: [http://localhost:5173](http://localhost:5173)

✅ You should see the Quantum Circuit Builder interface!

---

## 🎯 Your First Quantum Circuit

Let's create a **Bell State** - one of the most famous quantum circuits that creates entanglement between two qubits.

### Method 1: Manual Building

1. **Set Qubits**
   - Look for the "Qubits:" input at the top
   - Set it to `2` (we need 2 qubits for a Bell state)

2. **Add Hadamard Gate**
   - In the Gate Palette on the left, click the **H** button
   - Click on **qubit 0** in the circuit canvas
   - ✨ You've applied superposition to the first qubit!

3. **Add CNOT Gate**
   - Click the **CNOT** button in the palette
   - Click on **qubit 0** (control)
   - Click on **qubit 1** (target)
   - 🎉 You've created entanglement!

4. **Simulate**
   - Click the **🔬 Simulate** button
   - View the measurement results in the chart below
   - You should see roughly 50% |00⟩ and 50% |11⟩

**What just happened?**
- The H gate created superposition: |0⟩ → (|0⟩ + |1⟩)/√2
- The CNOT gate entangled the qubits
- Measuring gives either both 0s or both 1s - they're correlated!

### Method 2: Using AI Assistant

1. **Open AI Assistant**
   - Click **🤖 AI Assistant** button

2. **Type Command**
   ```
   Create a Bell state
   ```

3. **Apply Circuit**
   - Click the **Apply Circuit** button in the response
   - The circuit is built automatically! 🎉

4. **Simulate**
   - Click **🔬 Simulate**
   - Same results as manual method!

### Method 3: Using Templates

1. **Open Circuit Templates**
   - Click **📚 Templates** button

2. **Select Bell State**
   - Find "Bell State" in the list
   - Click **Load** button

3. **Done!**
   - Circuit is loaded and ready to simulate

---

## 🤖 Using the AI Assistant

The AI Assistant understands natural language and can help you build circuits, analyze them, and learn quantum computing.

### Basic Commands

**Creating Circuits:**
```
"Create a Bell state"
"Build a 3-qubit GHZ state"
"Make a Grover's search circuit"
"Generate a quantum teleportation circuit"
```

**Analyzing Circuits:**
```
"Analyze this circuit"
"Explain what this does"
"What's the quality score?"
"Find optimization opportunities"
```

**Learning:**
```
"How does a Hadamard gate work?"
"What is superposition?"
"Explain entanglement"
```

### Quick Actions

The AI Assistant has three quick action buttons:

- **🔍 Analyze** - Get circuit quality score (0-100) and identify issues
  - Detects unused qubits
  - Finds redundant gates
  - Calculates circuit depth
  - Checks two-qubit gate ratio

- **💡 Explain** - Get a detailed explanation of your circuit
  - Step-by-step gate descriptions
  - Educational resource links
  - Learning recommendations

- **⚡ Suggest** - Get smart gate suggestions
  - Context-aware recommendations
  - Pattern completion
  - Best practices

### Example Session

```
You: Create a superposition on all qubits

AI: I'll create superposition on all qubits using Hadamard gates.
[Applies H gates to all qubits]

You: Analyze

AI: Circuit Quality Score: 95/100
✅ Good practices:
  - Efficient use of qubits
  - Simple gate sequence
⚠️ Suggestions:
  - Add measurement gates to observe results
```

---

## 🎓 Learning Paths

Perfect for beginners! Our learning paths guide you from quantum basics to advanced topics.

### Getting Started with Learning

1. **Open Learning Paths**
   - Click **🎓 Learning Paths** button

2. **Choose Your Level**
   - 🟢 **Beginner** - Start here if you're new
   - 🟡 **Intermediate** - Know the basics, want algorithms
   - 🟠 **Advanced** - Ready for applications
   - 🔴 **Expert** - Error correction and advanced topics

3. **Select a Lesson**
   - Click on any unlocked lesson
   - Locked lessons require completing prerequisites

### Lesson Structure

Each lesson has **3 steps**:

**Step 1: Content** 📖
- Learn the concept
- Understand the theory
- See what you'll build

**Step 2: Circuit** 🔧
- Interactive circuit visualization
- Gate-by-gate explanation
- Load circuit to builder to experiment

**Step 3: Quiz** ✅
- Test your knowledge
- Multiple choice questions
- Instant feedback
- Score and review

### Progress Tracking

- **Overall Progress** - Percentage across all paths
- **Lessons Completed** - Total lesson count
- **Achievements** - Badges earned
- **Points** - Accumulated from achievements

### Achievement Badges

Earn badges as you learn:

- 🎯 **First Lesson** - Complete your first lesson (10 points)
- 🏆 **Path Complete** - Finish an entire learning path (50 points)
- ⭐ **Perfect Quiz** - Score 100% on a quiz (25 points)
- 🔥 **Week Streak** - Learn every day for a week (100 points)
- 🎨 **Circuit Builder** - Build 10 unique circuits (30 points)

### Recommended Learning Order

**Week 1: Fundamentals**
1. Introduction to Qubits
2. Single-Qubit Gates
3. Measurement Basics
4. Multi-Qubit Systems

**Week 2: Entanglement & Algorithms**
5. Quantum Entanglement
6. Bell States
7. Deutsch-Jozsa Algorithm
8. Grover's Search

**Week 3: Advanced Topics**
9. Quantum Fourier Transform
10. Shor's Algorithm
11. Quantum Teleportation

---

## ⚡ Circuit Optimization

Make your circuits faster and more efficient!

### Why Optimize?

- **Reduce gate count** - Fewer operations = less error
- **Minimize depth** - Shorter circuits = better coherence
- **Hardware compatibility** - Match real quantum devices
- **Improve fidelity** - Higher success rates

### Using the Optimization Dashboard

1. **Open Dashboard**
   - Click **⚡ Advanced Optimization** button
   - (Note: Circuit must have gates)

2. **Select Algorithm**

   **Greedy Optimization** ⚡ (Recommended for beginners)
   - Fast execution (<1 second)
   - Finds obvious redundancies
   - Good for simple circuits
   - Example: H-H cancellation, X-X pairs

   **Simulated Annealing** 🌡️
   - Moderate time (~1-2 seconds)
   - Better quality results
   - Good for medium circuits
   - Uses temperature-based optimization

   **Genetic Algorithm** 🧬
   - Longer execution (~3-5 seconds)
   - Best optimization quality
   - Good for complex circuits
   - Evolves solutions over generations

   **Multi-Objective** 🎯 (Advanced)
   - Optimizes multiple goals simultaneously
   - Shows Pareto frontier
   - Choose solution based on trade-offs
   - Best for production circuits

3. **Choose Hardware Topology** (Optional)

   If you plan to run on real quantum hardware:
   - **IBM Falcon R5** - 5-qubit T-shaped
   - **IBM Eagle R3** - Hexagonal heavy-hex
   - **AWS Rigetti Aspen** - 8-qubit linear
   - **Linear Chain** - Simple 1D connectivity
   - **All-to-all** - Full connectivity (ideal)

4. **Review Results**

   The dashboard shows:
   - **Before**: Original circuit metrics
   - **After**: Optimized circuit metrics
   - **Improvement**: Percentage reduction
   - **History**: Step-by-step changes

   Key metrics:
   - Total gates
   - Circuit depth
   - Two-qubit gates
   - One-qubit gates

5. **Apply or Revert**
   - **Apply**: Replace current circuit
   - **Revert**: Keep original circuit

### Optimization Tips

✅ **Do:**
- Start with greedy optimization
- Use multi-objective for production
- Match hardware topology if targeting real devices
- Check depth AND gate count

❌ **Don't:**
- Over-optimize simple circuits
- Ignore circuit depth
- Skip testing after optimization
- Assume one algorithm is always best

### Example Results

**Original Circuit:** 
```
Gates: 24
Depth: 18
2Q Gates: 8
```

**After Greedy Optimization:**
```
Gates: 18 (-25%)
Depth: 14 (-22%)
2Q Gates: 6 (-25%)
```

---

## 📤 Sharing & Collaboration

Share your quantum circuits with others!

### Sharing a Circuit

1. **Open Sharing Modal**
   - Click **📤 Share Circuit** button

2. **Choose Sharing Mode**

   **🔗 Link Sharing** (Easiest)
   - Circuit encoded in URL
   - Copy and send link
   - Three visibility options:
     - 🌐 **Public** - Anyone can find it
     - 🔓 **Unlisted** - Only people with link
     - 🔒 **Private** - Only you (coming soon)

   **📥 Export**
   - Download circuit file
   - Three formats:
     - **JSON** - Full circuit data
     - **QASM** - OpenQASM 2.0 format (compatible with Qiskit)
     - **Text** - Human-readable description

   **📱 QR Code**
   - Generate scannable QR code
   - Great for presentations
   - Share on mobile devices

3. **Copy & Share**
   - Click **📋 Copy** button
   - Share via email, Slack, Twitter, etc.

### Version Control

Track changes to your circuits over time!

1. **Save a Version**
   - Click **🕰️ Version Control**
   - Enter commit message (e.g., "Added error correction gates")
   - Click **💾 Save Version**

2. **View History**
   - See all saved versions
   - Timestamps and commit messages
   - Circuit statistics for each version

3. **Compare Versions**
   - Click **⚖️ Compare** on any version
   - See diff view:
     - Qubit changes
     - Gate additions/removals
     - Gate type breakdown

4. **Restore Version**
   - Click **↻ Restore** on any version
   - Confirm restoration
   - Circuit reverts to that snapshot

### Commenting System

Discuss circuits with collaborators (or leave notes for yourself!):

1. **Open Comments**
   - Click **💬 Comments** button

2. **General Comment**
   - Just type in the textarea
   - Click **💬 Add Comment**
   - Appears in comment list

3. **Gate-Specific Comment**
   - Click gate button in the grid
   - Type your comment
   - Linked to that specific gate
   - Shows gate number and type

4. **Reply to Comments**
   - Click **↩️ Reply** on any comment
   - Type response
   - Creates threaded discussion

5. **Filter Comments**
   - **All** - See everything
   - **General** - Only general comments
   - **Gate** - Only gate-specific comments

---

## 💡 Tips & Tricks

### Keyboard Shortcuts

- **Ctrl/Cmd + Z** - Undo last action
- **Ctrl/Cmd + Shift + Z** - Redo action
- **Ctrl/Cmd + Y** - Redo action (alternative)
- **Enter** - Submit in AI chat or forms

### Quick Navigation

- Use **History** button to see all past changes
- Use **Templates** for common circuits
- Use **Circuit Library** to browse saved circuits
- Use **Export** for backup before major changes

### Performance Tips

- Keep circuits under 50 gates for fast simulation
- Use **Analyze & Optimize** before simulating large circuits
- Clear browser cache if interface slows down
- Save important circuits with version control

### Learning Tips

- Complete lessons in order within each path
- Try building circuits manually after loading lesson circuits
- Aim for 100% on quizzes to earn achievement badges
- Revisit lessons to reinforce concepts

### Common Mistakes to Avoid

❌ **Forgetting Measurement**
- Always add measurement gates to observe results
- Without measurement, you won't see outcomes

❌ **Wrong Qubit Order**
- CNOT control/target matters!
- First click = control, second click = target

❌ **Not Simulating**
- Build gates ≠ simulation
- Click "Simulate" to see results

❌ **Ignoring Circuit Quality**
- Use AI Analyze to catch errors
- Check for unused qubits and redundancies

### Best Practices

✅ Start simple (2-3 qubits)
✅ Use templates as references
✅ Simulate frequently to test
✅ Save versions before major changes
✅ Use AI Assistant when stuck
✅ Complete learning paths systematically

---

## 🆘 Troubleshooting

### Frontend won't start
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend errors
```bash
# Reinstall Python dependencies
cd backend
pip install --upgrade -r requirements.txt
uvicorn app.main:app --reload
```

### Simulation fails
- Check circuit has gates
- Verify qubit numbers are valid
- Ensure backend is running
- Check browser console for errors

### Can't load circuit
- Check if circuit was saved properly
- Try refreshing the page
- Check localStorage isn't full
- Try exporting and re-importing

---

## 📚 Next Steps

Now that you're set up, explore these features:

1. ✅ Complete the **Beginner Learning Path**
2. 🤖 Experiment with the **AI Assistant**
3. ⚡ Try optimizing a circuit
4. 📤 Share your first circuit
5. 🏆 Earn your first achievement badge

### Additional Resources

- **Qiskit Tutorials**: https://qiskit.org/learn/
- **Nielsen & Chuang**: Quantum Computation textbook
- **Quantum Country**: Interactive quantum computing course
- **IBM Quantum Experience**: Run circuits on real hardware

---

**Happy Quantum Computing! 🚀**

Questions? Check our [README](README.md) or open an issue on GitHub.