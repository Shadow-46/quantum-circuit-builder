import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';
import {
  generateCircuitFromNL,
  getSmartSuggestions,
  analyzeCircuit,
  explainCircuit,
  getEducationalResources,
} from '../../utils/aiNLPProcessor';

const AIAssistant = ({ circuit, onApplyCircuit, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message and analysis
  useEffect(() => {
    const welcomeMessage = {
      type: 'ai',
      content: "👋 Hi! I'm your AI quantum circuit assistant. I can help you:\n\n• **Create circuits** from natural language (e.g., 'create a Bell state')\n• **Analyze** your current circuit for issues\n• **Suggest** next steps and optimizations\n• **Explain** circuit functionality\n\nWhat would you like to do?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Analyze current circuit
    if (circuit.gates.length > 0) {
      const circuitAnalysis = analyzeCircuit(circuit.gates, circuit.numQubits);
      setAnalysis(circuitAnalysis);

      // Get smart suggestions
      const smartSuggestions = getSmartSuggestions(circuit.gates, circuit.numQubits);
      setSuggestions(smartSuggestions);
    }
  }, [circuit]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Process input
    setTimeout(() => {
      processUserInput(input);
      setInput('');
      setIsProcessing(false);
    }, 500);
  };

  const processUserInput = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    // Check for different intents
    if (lowerInput.includes('create') || lowerInput.includes('make') || lowerInput.includes('generate')) {
      handleCreateIntent(userInput);
    } else if (lowerInput.includes('explain') || lowerInput.includes('what')) {
      handleExplainIntent();
    } else if (lowerInput.includes('analyze') || lowerInput.includes('check')) {
      handleAnalyzeIntent();
    } else if (lowerInput.includes('suggest') || lowerInput.includes('recommend')) {
      handleSuggestIntent();
    } else if (lowerInput.includes('help')) {
      handleHelpIntent();
    } else {
      const aiMessage = {
        type: 'ai',
        content: "I'm not sure what you want me to do. Try asking me to:\n• Create a circuit\n• Explain the current circuit\n• Analyze for errors\n• Suggest next steps",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleCreateIntent = (userInput) => {
    const result = generateCircuitFromNL(userInput, circuit.numQubits);

    if (result.success) {
      const aiMessage = {
        type: 'ai',
        content: result.message,
        action: {
          type: 'apply_circuit',
          circuit: result.circuit,
          label: 'Apply to Circuit',
        },
        info: result.info,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      const aiMessage = {
        type: 'ai',
        content: result.message,
        suggestion: result.suggestedAction,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleExplainIntent = () => {
    const explanation = explainCircuit(circuit.gates, circuit.numQubits);
    const resources = getEducationalResources(circuit.gates);

    const aiMessage = {
      type: 'ai',
      content: explanation,
      resources: resources.length > 0 ? resources : null,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleAnalyzeIntent = () => {
    const circuitAnalysis = analyzeCircuit(circuit.gates, circuit.numQubits);
    
    let content = `**Circuit Analysis:**\n\n`;
    content += `Quality Score: ${circuitAnalysis.score}/100\n\n`;
    
    if (circuitAnalysis.issues.length > 0) {
      content += `**Issues Found (${circuitAnalysis.issues.length}):**\n`;
      circuitAnalysis.issues.forEach((issue, idx) => {
        content += `${idx + 1}. ${issue.message} (${issue.severity})\n`;
        if (issue.suggestion) {
          content += `   💡 ${issue.suggestion}\n`;
        }
      });
      content += '\n';
    }

    if (circuitAnalysis.optimizations.length > 0) {
      content += `**Optimization Opportunities (${circuitAnalysis.optimizations.length}):**\n`;
      circuitAnalysis.optimizations.forEach((opt, idx) => {
        content += `${idx + 1}. ${opt.message}\n`;
        content += `   💡 ${opt.suggestion}\n`;
      });
    }

    if (circuitAnalysis.issues.length === 0 && circuitAnalysis.optimizations.length === 0) {
      content += "✅ Your circuit looks good! No issues found.";
    }

    const aiMessage = {
      type: 'ai',
      content,
      analysis: circuitAnalysis,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSuggestIntent = () => {
    const smartSuggestions = getSmartSuggestions(circuit.gates, circuit.numQubits);

    let content = "**Smart Suggestions:**\n\n";
    
    if (smartSuggestions.length === 0) {
      content += "Your circuit is complete! Consider running a simulation to see results.";
    } else {
      smartSuggestions.forEach((sugg, idx) => {
        content += `${idx + 1}. **${sugg.title}**\n`;
        content += `   ${sugg.description}\n\n`;
      });
    }

    const aiMessage = {
      type: 'ai',
      content,
      suggestions: smartSuggestions,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleHelpIntent = () => {
    const aiMessage = {
      type: 'ai',
      content: `**Available Commands:**\n\n
**Circuit Creation:**
• "Create a Bell state"
• "Make a superposition"
• "Generate Grover's algorithm"
• "Add a GHZ state"

**Analysis:**
• "Analyze my circuit"
• "Check for errors"
• "Find optimization opportunities"

**Learning:**
• "Explain this circuit"
• "What does this circuit do?"
• "Show me resources"

**Suggestions:**
• "What should I add next?"
• "Suggest improvements"
• "Recommend next steps"`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleApplyAction = (action) => {
    if (action.type === 'apply_circuit') {
      onApplyCircuit(action.circuit);
      
      const confirmMessage = {
        type: 'ai',
        content: "✅ Circuit applied successfully! You can now simulate or modify it further.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'analyze') {
      handleAnalyzeIntent();
    } else if (action === 'explain') {
      handleExplainIntent();
    } else if (action === 'suggest') {
      handleSuggestIntent();
    }
  };

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div className="ai-assistant-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="ai-header-title">
            <span className="ai-icon">🤖</span>
            <h2>AI Assistant</h2>
            <span className="ai-status online">●</span>
          </div>
          <button className="ai-close" onClick={onClose}>✕</button>
        </div>

        {/* Analysis Summary */}
        {analysis && (
          <div className="ai-analysis-summary">
            <div className="analysis-score">
              <div className="score-circle" style={{ '--score': analysis.score }}>
                <span className="score-value">{analysis.score}</span>
                <span className="score-label">Quality</span>
              </div>
            </div>
            <div className="analysis-stats">
              <div className="stat-item">
                <span className="stat-value">{analysis.stats.totalGates}</span>
                <span className="stat-label">Gates</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{analysis.stats.depth}</span>
                <span className="stat-label">Depth</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{analysis.issues.length}</span>
                <span className="stat-label">Issues</span>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ${msg.type}`}>
              {msg.type === 'ai' && <span className="message-icon">🤖</span>}
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                
                {msg.action && (
                  <button
                    className="message-action-btn"
                    onClick={() => handleApplyAction(msg.action)}
                  >
                    {msg.action.label}
                  </button>
                )}

                {msg.resources && (
                  <div className="message-resources">
                    <strong>📚 Learn More:</strong>
                    {msg.resources.map((resource, ridx) => (
                      <div key={ridx} className="resource-item">
                        <strong>{resource.topic}</strong>
                        <p>{resource.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.type === 'user' && <span className="message-icon user">👤</span>}
            </div>
          ))}
          {isProcessing && (
            <div className="ai-message ai typing">
              <span className="message-icon">🤖</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="ai-quick-actions">
          <button onClick={() => handleQuickAction('analyze')} className="quick-action-btn">
            🔍 Analyze
          </button>
          <button onClick={() => handleQuickAction('explain')} className="quick-action-btn">
            💡 Explain
          </button>
          <button onClick={() => handleQuickAction('suggest')} className="quick-action-btn">
            ✨ Suggest
          </button>
        </div>

        {/* Input Area */}
        <div className="ai-input-area">
          <input
            type="text"
            className="ai-input"
            placeholder="Ask me anything... (e.g., 'create a Bell state')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isProcessing}
          />
          <button 
            className="ai-send-btn"
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
