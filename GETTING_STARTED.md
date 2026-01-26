# Getting Started with Quantum Circuit Builder 🚀

Welcome! This comprehensive guide will help you install, configure, and master the Quantum Circuit Builder platform.

---

## 📊 Platform Overview

**Quantum Circuit Builder** is a full-stack quantum development platform featuring:
- 💻 Visual circuit design with drag-and-drop
- 🤖 AI-powered circuit generation and optimization
- ☁️ Cloud storage with real-time collaboration
- 🔑 Public REST API for programmatic access
- 🎓 25 interactive learning lessons
- 📊 Advanced quantum simulation

**Target Users:** Students, researchers, quantum developers, educators

---

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Authentication & Account](#authentication--account)
3. [First Circuit](#your-first-quantum-circuit)
4. [Using the AI Assistant](#using-the-ai-assistant)
5. [Cloud Features](#cloud-features--collaboration)
6. [API Access](#api-access)
7. [Learning Paths](#learning-paths)
8. [Optimization](#circuit-optimization)
9. [Tips & Tricks](#tips--tricks)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Installation & Setup

### System Requirements

**Minimum:**
- **OS:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM:** 4 GB
- **Storage:** 500 MB free space
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

**Recommended:**
- **RAM:** 8 GB or more
- **CPU:** Multi-core processor
- **Internet:** Stable connection for cloud features

### Prerequisites

1. **Node.js 16+** ([Download](https://nodejs.org/))
   ```bash
   node --version  # Should be v16.0.0 or higher
   npm --version   # Should be v8.0.0 or higher
   ```

2. **Python 3.8+** ([Download](https://python.org/))
   ```bash
   python --version  # Should be 3.8.0 or higher
   pip --version     # Should be 20.0.0 or higher
   ```

3. **Git** ([Download](https://git-scm.com/))
   ```bash
   git --version  # Should be 2.30.0 or higher
   ```

### Installation Steps

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

## 🔐 Authentication & Account

### Create Your Account

1. **Navigate to the Platform**
   - Open [http://localhost:5173](http://localhost:5173)

2. **Click "Sign Up"**
   - Located in the top-right corner

3. **Fill Registration Form**
   ```
   Email: your.email@example.com
   Password: (8+ characters, mix of letters & numbers)
   Username: YourUsername
   ```

4. **Verify Email** (if enabled)
   - Check your inbox for verification link

5. **Login**
   - Use your credentials to access the platform

### User Profile

Once logged in, you can:
- 📝 **Edit Profile** - Update username, avatar, bio
- 📊 **View Progress** - See learning achievements
- 💾 **Manage Circuits** - Access saved circuits
- 🔑 **API Keys** - Generate keys for programmatic access
- ⚙️ **Settings** - Configure preferences

### Cloud Sync

✅ **Automatic Synchronization** - All circuits and progress are saved to the cloud  
✅ **Cross-Device Access** - Login from any device to access your work  
✅ **Version Control** - Track changes and restore previous versions  
✅ **Sharing** - Share circuits with public links or collaborators

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

## ☁️ Cloud Features & Collaboration

### Saving Your Work

All circuits are **automatically saved to the cloud** when you're logged in:

1. **Auto-Save** - Every change is synced in real-time
2. **Version Control** - Track circuit evolution
3. **Cross-Device** - Access from anywhere

### Version Control

Create snapshots of your circuit at important milestones:

1. **Click 🕰️ Version Control**
2. **Enter Commit Message**
   ```
   "Added error correction layer"
   "Optimized gate count by 30%"
   "Initial Bell state implementation"
   ```
3. **Save Version**
4. **View History** - See all previous versions
5. **Compare Versions** - Diff view shows changes
6. **Restore** - Revert to any previous version

### Real-Time Collaboration

Work on circuits with others simultaneously:

1. **Share Circuit** - Get a shareable link
2. **Invite Collaborators** - Send link to team members
3. **See Live Cursors** - Track each user's position
4. **Chat** - Communicate while editing
5. **Presence Indicators** - See who's online

**Collaboration Features:**
- 👥 **Multi-user editing** - Edit circuits together
- 💬 **Real-time chat** - Discuss while building
- 🖱️ **Live cursors** - See collaborators' positions
- 🔔 **Notifications** - Join/leave alerts
- 🎨 **User colors** - Each person has a unique color

### Sharing Circuits

Share your work with the world:

1. **Click 📤 Share Circuit**
2. **Choose Visibility**
   - 🔓 **Public** - Anyone can view
   - 🔗 **Unlisted** - Only with link
   - 🔒 **Private** - Only you
3. **Copy Link** - Share URL
4. **Generate QR Code** - Mobile scanning
5. **Export** - Download as JSON/QASM/text

### Comments & Discussion

Engage with the community:

1. **Click 💬 Comments**
2. **Add General Comment** - Discuss the circuit
3. **Comment on Specific Gate** - Click gate first
4. **Reply to Comments** - Start discussions
5. **Filter Comments** - All/General/Gate-specific

---

## 🔑 API Access

Programmatic access to all platform features via REST API.

### Generate API Key

1. **Login to Platform**
2. **Navigate to Profile** → **API Keys**
3. **Click "Create New Key"**
4. **Configure Key**
   ```
   Name: "My Project API Key"
   Rate Limit: 1000 requests/hour
   Expiration: 90 days (or never)
   ```
5. **Copy Secret** - Shown only once! Save it securely.

### Using Your API Key

**JavaScript Example:**
```javascript
const axios = require('axios');

const API_KEY = 'qcb_your_secret_key_here';
const BASE_URL = 'http://localhost:8000/api/v1';

// Get all your circuits
const response = await axios.get(`${BASE_URL}/circuits`, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

console.log(response.data);
```

**Python Example:**
```python
import requests

API_KEY = 'qcb_your_secret_key_here'
BASE_URL = 'http://localhost:8000/api/v1'

# Get all your circuits
response = requests.get(
    f'{BASE_URL}/circuits',
    headers={'Authorization': f'Bearer {API_KEY}'}
)

print(response.json())
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/circuits" \
  -H "Authorization: Bearer qcb_your_secret_key_here"
```

### API Features

- ✅ **30+ Endpoints** - Full platform access
- ✅ **Rate Limiting** - Configurable limits (100-10,000/hr)
- ✅ **OpenAPI Docs** - Interactive documentation at `/docs`
- ✅ **Usage Analytics** - Track your API consumption
- ✅ **Secure** - Bcrypt-hashed keys
- ✅ **Versioned** - `/api/v1/` with backward compatibility

**Explore API:** [http://localhost:8000/docs](http://localhost:8000/docs)

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