// Advanced export utilities for quantum circuits

// Export circuit to OpenQASM 2.0 format
export const exportToQASM2 = (circuit) => {
  const { numQubits, gates } = circuit;
  
  let qasm = `OPENQASM 2.0;\n`;
  qasm += `include "qelib1.inc";\n\n`;
  qasm += `// Circuit: ${circuit.name || 'Quantum Circuit'}\n`;
  if (circuit.description) {
    qasm += `// ${circuit.description}\n`;
  }
  qasm += `\n`;
  qasm += `qreg q[${numQubits}];\n`;
  qasm += `creg c[${numQubits}];\n\n`;

  // Convert gates to QASM
  gates.forEach((gate) => {
    const qasmGate = convertGateToQASM(gate);
    if (qasmGate) {
      qasm += qasmGate + '\n';
    }
  });

  // Add measurements
  qasm += `\n// Measurements\n`;
  for (let i = 0; i < numQubits; i++) {
    qasm += `measure q[${i}] -> c[${i}];\n`;
  }

  return qasm;
};

// Export circuit to OpenQASM 3.0 format
export const exportToQASM3 = (circuit) => {
  const { numQubits, gates } = circuit;
  
  let qasm = `OPENQASM 3;\n`;
  qasm += `include "stdgates.inc";\n\n`;
  qasm += `// Circuit: ${circuit.name || 'Quantum Circuit'}\n`;
  if (circuit.description) {
    qasm += `// ${circuit.description}\n`;
  }
  qasm += `\n`;
  qasm += `qubit[${numQubits}] q;\n`;
  qasm += `bit[${numQubits}] c;\n\n`;

  // Convert gates to QASM 3
  gates.forEach((gate) => {
    const qasmGate = convertGateToQASM3(gate);
    if (qasmGate) {
      qasm += qasmGate + '\n';
    }
  });

  // Add measurements
  qasm += `\n// Measurements\n`;
  for (let i = 0; i < numQubits; i++) {
    qasm += `c[${i}] = measure q[${i}];\n`;
  }

  return qasm;
};

// Convert gate to QASM 2.0 format
const convertGateToQASM = (gate) => {
  const { type, qubit, targetQubit, targetQubit2, angle } = gate;

  switch (type) {
    case 'H':
      return `h q[${qubit}];`;
    case 'X':
      return `x q[${qubit}];`;
    case 'Y':
      return `y q[${qubit}];`;
    case 'Z':
      return `z q[${qubit}];`;
    case 'S':
      return `s q[${qubit}];`;
    case 'T':
      return `t q[${qubit}];`;
    case 'RX':
      return `rx(${angle || 0}) q[${qubit}];`;
    case 'RY':
      return `ry(${angle || 0}) q[${qubit}];`;
    case 'RZ':
      return `rz(${angle || 0}) q[${qubit}];`;
    case 'CNOT':
      return `cx q[${qubit}], q[${targetQubit}];`;
    case 'CZ':
      return `cz q[${qubit}], q[${targetQubit}];`;
    case 'CY':
      return `cy q[${qubit}], q[${targetQubit}];`;
    case 'CH':
      return `ch q[${qubit}], q[${targetQubit}];`;
    case 'SWAP':
      return `swap q[${qubit}], q[${targetQubit}];`;
    case 'CRX':
      return `crx(${angle || 0}) q[${qubit}], q[${targetQubit}];`;
    case 'CRY':
      return `cry(${angle || 0}) q[${qubit}], q[${targetQubit}];`;
    case 'CRZ':
      return `crz(${angle || 0}) q[${qubit}], q[${targetQubit}];`;
    case 'Toffoli':
      return `ccx q[${qubit}], q[${targetQubit}], q[${targetQubit2}];`;
    case 'Fredkin':
      return `cswap q[${qubit}], q[${targetQubit}], q[${targetQubit2}];`;
    default:
      return `// Unsupported gate: ${type}`;
  }
};

// Convert gate to QASM 3.0 format
const convertGateToQASM3 = (gate) => {
  // QASM 3 uses similar syntax but different naming
  return convertGateToQASM(gate);
};

// Export circuit to Qiskit Python code
export const exportToQiskit = (circuit) => {
  const { numQubits, gates } = circuit;
  
  let code = `# Generated Qiskit code\n`;
  code += `# Circuit: ${circuit.name || 'Quantum Circuit'}\n`;
  if (circuit.description) {
    code += `# ${circuit.description}\n`;
  }
  code += `\n`;
  code += `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister\n`;
  code += `from qiskit import execute, Aer\n`;
  code += `from qiskit.visualization import plot_histogram\n`;
  code += `import numpy as np\n\n`;
  
  code += `# Create quantum circuit\n`;
  code += `qr = QuantumRegister(${numQubits}, 'q')\n`;
  code += `cr = ClassicalRegister(${numQubits}, 'c')\n`;
  code += `qc = QuantumCircuit(qr, cr)\n\n`;

  // Add gates
  code += `# Add gates\n`;
  gates.forEach((gate) => {
    const qiskitGate = convertGateToQiskit(gate);
    if (qiskitGate) {
      code += qiskitGate + '\n';
    }
  });

  // Add measurements
  code += `\n# Measure all qubits\n`;
  code += `qc.measure(qr, cr)\n\n`;

  // Add execution code
  code += `# Execute circuit\n`;
  code += `backend = Aer.get_backend('qasm_simulator')\n`;
  code += `job = execute(qc, backend, shots=1024)\n`;
  code += `result = job.result()\n`;
  code += `counts = result.get_counts(qc)\n\n`;
  code += `# Display results\n`;
  code += `print("Measurement results:", counts)\n`;
  code += `plot_histogram(counts)\n`;

  return code;
};

// Convert gate to Qiskit Python code
const convertGateToQiskit = (gate) => {
  const { type, qubit, targetQubit, targetQubit2, angle } = gate;

  switch (type) {
    case 'H':
      return `qc.h(${qubit})`;
    case 'X':
      return `qc.x(${qubit})`;
    case 'Y':
      return `qc.y(${qubit})`;
    case 'Z':
      return `qc.z(${qubit})`;
    case 'S':
      return `qc.s(${qubit})`;
    case 'T':
      return `qc.t(${qubit})`;
    case 'RX':
      return `qc.rx(${angle || 0}, ${qubit})`;
    case 'RY':
      return `qc.ry(${angle || 0}, ${qubit})`;
    case 'RZ':
      return `qc.rz(${angle || 0}, ${qubit})`;
    case 'CNOT':
      return `qc.cx(${qubit}, ${targetQubit})`;
    case 'CZ':
      return `qc.cz(${qubit}, ${targetQubit})`;
    case 'CY':
      return `qc.cy(${qubit}, ${targetQubit})`;
    case 'CH':
      return `qc.ch(${qubit}, ${targetQubit})`;
    case 'SWAP':
      return `qc.swap(${qubit}, ${targetQubit})`;
    case 'CRX':
      return `qc.crx(${angle || 0}, ${qubit}, ${targetQubit})`;
    case 'CRY':
      return `qc.cry(${angle || 0}, ${qubit}, ${targetQubit})`;
    case 'CRZ':
      return `qc.crz(${angle || 0}, ${qubit}, ${targetQubit})`;
    case 'Toffoli':
      return `qc.ccx(${qubit}, ${targetQubit}, ${targetQubit2})`;
    case 'Fredkin':
      return `qc.cswap(${qubit}, ${targetQubit}, ${targetQubit2})`;
    default:
      return `# Unsupported gate: ${type}`;
  }
};

// Export circuit to LaTeX (Quantikz) format
export const exportToLatex = (circuit) => {
  const { numQubits, gates } = circuit;
  
  let latex = `\\documentclass{article}\n`;
  latex += `\\usepackage{quantikz}\n\n`;
  latex += `\\begin{document}\n\n`;
  latex += `% Circuit: ${circuit.name || 'Quantum Circuit'}\n`;
  if (circuit.description) {
    latex += `% ${circuit.description}\n`;
  }
  latex += `\n`;
  latex += `\\begin{quantikz}\n`;

  // Calculate maximum step
  const maxStep = gates.length > 0 ? Math.max(...gates.map(g => g.step || 0)) : 0;

  // Create a grid for gate placement
  const grid = Array(numQubits).fill(null).map(() => Array(maxStep + 1).fill(null));

  // Place gates in grid
  gates.forEach((gate) => {
    const step = gate.step || 0;
    grid[gate.qubit][step] = gate;
  });

  // Generate LaTeX for each qubit
  for (let q = 0; q < numQubits; q++) {
    latex += `\\lstick{$q_{${q}}$} `;
    
    for (let s = 0; s <= maxStep; s++) {
      const gate = grid[q][s];
      if (gate) {
        latex += convertGateToLatex(gate, q) + ' ';
      } else {
        latex += '& \\qw ';
      }
    }
    
    latex += `& \\meter{}\\\\\n`;
  }

  latex += `\\end{quantikz}\n\n`;
  latex += `\\end{document}\n`;

  return latex;
};

// Convert gate to LaTeX (Quantikz) format
const convertGateToLatex = (gate, currentQubit) => {
  const { type, qubit, targetQubit } = gate;

  switch (type) {
    case 'H':
      return '& \\gate{H}';
    case 'X':
      return '& \\gate{X}';
    case 'Y':
      return '& \\gate{Y}';
    case 'Z':
      return '& \\gate{Z}';
    case 'S':
      return '& \\gate{S}';
    case 'T':
      return '& \\gate{T}';
    case 'RX':
      return `& \\gate{R_x}`;
    case 'RY':
      return `& \\gate{R_y}`;
    case 'RZ':
      return `& \\gate{R_z}`;
    case 'CNOT':
      if (currentQubit === qubit) {
        return `& \\ctrl{${targetQubit - qubit}}`;
      } else if (currentQubit === targetQubit) {
        return '& \\targ{}';
      }
      return '& \\qw';
    case 'CZ':
    case 'CY':
    case 'CH':
      if (currentQubit === qubit) {
        return `& \\ctrl{${targetQubit - qubit}}`;
      } else if (currentQubit === targetQubit) {
        return `& \\gate{${type.slice(1)}}`;
      }
      return '& \\qw';
    case 'SWAP':
      return '& \\swap{1}';
    default:
      return '& \\qw';
  }
};

// Download file helper
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export circuit in multiple formats
export const exportCircuit = (circuit, format) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = (circuit.name || 'circuit').replace(/\s+/g, '_');

  switch (format) {
    case 'qasm2':
      const qasm2 = exportToQASM2(circuit);
      downloadFile(qasm2, `${baseName}_${timestamp}.qasm`, 'text/plain');
      return qasm2;

    case 'qasm3':
      const qasm3 = exportToQASM3(circuit);
      downloadFile(qasm3, `${baseName}_${timestamp}_v3.qasm`, 'text/plain');
      return qasm3;

    case 'qiskit':
      const qiskit = exportToQiskit(circuit);
      downloadFile(qiskit, `${baseName}_${timestamp}.py`, 'text/x-python');
      return qiskit;

    case 'latex':
      const latex = exportToLatex(circuit);
      downloadFile(latex, `${baseName}_${timestamp}.tex`, 'text/x-latex');
      return latex;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Get circuit statistics for export
export const getCircuitStatistics = (circuit) => {
  const { gates, numQubits } = circuit;
  
  const gateTypes = {};
  gates.forEach(gate => {
    gateTypes[gate.type] = (gateTypes[gate.type] || 0) + 1;
  });

  const depth = gates.length > 0 ? Math.max(...gates.map(g => g.step || 0)) + 1 : 0;
  
  return {
    numQubits,
    totalGates: gates.length,
    depth,
    gateTypes,
    twoQubitGates: gates.filter(g => 
      ['CNOT', 'CZ', 'CY', 'SWAP', 'CRX', 'CRY', 'CRZ', 'CH'].includes(g.type)
    ).length,
    threeQubitGates: gates.filter(g => 
      ['Toffoli', 'Fredkin'].includes(g.type)
    ).length,
  };
};
