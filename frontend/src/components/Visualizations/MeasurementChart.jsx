export default function MeasurementChart({ results }) {
  if (!results) return null;
  const entries = Object.entries(results.counts);
  return (
    <div>
      <h3>Results</h3>
      <p>Shots: {results.total_shots}</p>
      {entries.map(([bits, count]) => (
        <div key={bits}>
          {bits}: {count} ({(results.probabilities[bits] * 100).toFixed(1)}%)
        </div>
      ))}
    </div>
  );
}
