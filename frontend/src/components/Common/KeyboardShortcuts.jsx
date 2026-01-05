import { useState, useEffect } from 'react';

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      category: '⚙️ General',
      items: [
        { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
        { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last action' },
        { keys: ['Ctrl', 'S'], description: 'Save circuit (export)' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modals/dialogs' },
      ]
    },
    {
      category: '🎮 Circuit Controls',
      items: [
        { keys: ['Delete'], description: 'Remove selected gate' },
        { keys: ['Backspace'], description: 'Remove selected gate' },
        { keys: ['Ctrl', 'C'], description: 'Copy selected gate' },
        { keys: ['Ctrl', 'V'], description: 'Paste copied gate' },
        { keys: ['Ctrl', 'A'], description: 'Select all gates' },
      ]
    },
    {
      category: '🚀 Quick Actions',
      items: [
        { keys: ['Space'], description: 'Pause/Resume simulation' },
        { keys: ['R'], description: 'Reset circuit' },
        { keys: ['M'], description: 'Add measurement' },
        { keys: ['S'], description: 'Run simulation' },
        { keys: ['E'], description: 'Open export menu' },
      ]
    },
    {
      category: '📊 Navigation',
      items: [
        { keys: ['Tab'], description: 'Navigate between sections' },
        { keys: ['Shift', 'Tab'], description: 'Navigate backwards' },
        { keys: ['Ctrl', 'H'], description: 'Go to home' },
        { keys: ['Ctrl', 'B'], description: 'Go to builder' },
        { keys: ['Ctrl', '?'], description: 'Open help' },
      ]
    },
    {
      category: '🎯 Gate Shortcuts',
      items: [
        { keys: ['H'], description: 'Add Hadamard gate' },
        { keys: ['X'], description: 'Add X (NOT) gate' },
        { keys: ['Y'], description: 'Add Y gate' },
        { keys: ['Z'], description: 'Add Z gate' },
        { keys: ['C'], description: 'Add CNOT control' },
        { keys: ['T'], description: 'Add T gate' },
        { keys: ['P'], description: 'Add Phase gate' },
      ]
    }
  ];

  // Handle keyboard shortcut to open shortcuts panel
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check for '?' key (Shift + /) to open shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="shortcuts-overlay" onClick={() => setIsOpen(false)}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button 
            className="btn-close-shortcuts" 
            onClick={() => setIsOpen(false)}
            aria-label="Close shortcuts"
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-content">
          <p className="shortcuts-intro">
            Master these shortcuts to build quantum circuits faster! Press <kbd>?</kbd> anytime to show this panel.
          </p>

          <div className="shortcuts-grid">
            {shortcuts.map((section, idx) => (
              <div key={idx} className="shortcuts-section">
                <h3 className="shortcuts-category">{section.category}</h3>
                <div className="shortcuts-list">
                  {section.items.map((shortcut, sidx) => (
                    <div key={sidx} className="shortcut-item">
                      <div className="shortcut-keys">
                        {shortcut.keys.map((key, kidx) => (
                          <span key={kidx}>
                            <kbd className="key">{key}</kbd>
                            {kidx < shortcut.keys.length - 1 && (
                              <span className="key-separator">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="shortcut-description">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="shortcuts-footer">
            <div className="shortcuts-tip">
              💡 <strong>Pro Tip:</strong> Combine shortcuts for maximum efficiency! 
              Try <kbd>H</kbd> → <kbd>X</kbd> → <kbd>M</kbd> for a quick Bell state circuit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
