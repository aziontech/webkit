import { readFileSync } from 'node:fs'
import { relative } from 'node:path'

import { BaseSequencer, type TestSpecification } from 'vitest/node'

import { planShards } from '../../scripts/lib/shard-plan.mjs'

const DURATIONS: Record<string, number> = JSON.parse(
  readFileSync(new URL('./shard-durations.json', import.meta.url), 'utf8')
)

export class DurationSequencer extends BaseSequencer {
  override async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    const { config } = this.ctx
    if (!config.shard) return files
    const byPath = new Map(files.map((spec) => [relative(config.root, spec.moduleId), spec]))
    const plan = planShards([...byPath.keys()], DURATIONS, config.shard.count)
    return plan[config.shard.index - 1]!.files.map((file) => byPath.get(file)!)
  }
}
