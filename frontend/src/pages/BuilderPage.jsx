import CircuitBuilder from "../components/CircuitBuilder/CircuitBuilder";

export default function BuilderPage({ activeTutorial }) {
  return (
    <div>
      <h2>Quantum Circuit Builder</h2>
      <CircuitBuilder activeTutorial={activeTutorial} />
    </div>
  );
}
