function defaultWeight(durations) {
  const values = Object.values(durations).sort((a, b) => a - b)
  return values.length ? values[Math.floor(values.length / 2)] : 1
}

export function planShards(files, durations, count) {
  const fallback = defaultWeight(durations)
  const weight = (file) => durations[file] ?? fallback
  const ordered = [...files].sort((a, b) => weight(b) - weight(a) || a.localeCompare(b))
  const shards = Array.from({ length: count }, () => ({ files: [], load: 0 }))
  for (const file of ordered) {
    const lightest = shards.reduce((min, shard) => (shard.load < min.load ? shard : min))
    lightest.files.push(file)
    lightest.load += weight(file)
  }
  return shards
}
