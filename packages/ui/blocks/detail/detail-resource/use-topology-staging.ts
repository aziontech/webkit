import type {
  FlowDiagramBindOption,
  FlowDiagramNodeData,
  FlowDiagramNodeField
} from '@aziontech/ui/flow-diagram-root'
import { toast } from '@aziontech/ui/toast'
import { computed, type ComputedRef, onScopeDispose, reactive, readonly, type Ref, ref } from 'vue'

/** A slot of the topology that a resource can be bound to. */
export interface TopologyTarget {
  /** The kind of resource the slot takes, such as Firewall. */
  kind: string
  /** The kind glyph class. */
  icon: string
  /** The resources the slot can bind. */
  options: FlowDiagramBindOption[]
  /** What the node says while nothing is bound. */
  unbound?: string
  /** What the node says about the deployed binding. */
  bound?: string
  /** False when the binding can be changed but not removed. */
  removable?: boolean
  /** The facts of the deployed binding. */
  fields?: FlowDiagramNodeField[]
}

/** One staged change, as the deploy drawer lists it. */
export interface TopologyStagedChange {
  /** The slot key. */
  key: string
  /** The kind of resource. */
  kind: string
  /** The deployed binding, or Not bound. */
  from: string
  /** The staged binding, or Removed. */
  to: string
}

export interface UseTopologyStagingOptions {
  /** The bindable slots, by key. */
  targets: Record<string, TopologyTarget>
  /** What is bound in Production, by slot key; empty when nothing is. */
  bound: Record<string, string>
  /** The name of what is deployed, used in the toasts. */
  name: string
  /** The id of the toast that follows the deployment. */
  toastId: string
  /** Dismisses the toast when the page is left. */
  dismissOnLeave?: boolean
  /** Takes the person back to the topology from the Edit action of the toast. */
  onEdit: () => void
}

export interface UseTopologyStagingReturn {
  /** How many changes wait for the next deploy. */
  stagedCount: ComputedRef<number>
  /** The staged changes, as the deploy drawer lists them. */
  stagedChanges: ComputedRef<TopologyStagedChange[]>
  /** The last thing that was staged, announced under the diagram. */
  stagedNote: Readonly<Ref<string>>
  /** A deployment is in flight. */
  deploying: Readonly<Ref<boolean>>
  /** The diagram node of one slot, with its staged or deployed binding. */
  slotNode: (key: string) => FlowDiagramNodeData
  /** Stages a binding on a slot. */
  bind: (key: string, value: string) => void
  /** Stages the removal of a binding, or drops a staged one. */
  unbind: (key: string) => void
  /** Announces the create flow of a slot. */
  createTarget: (key: string) => void
  /** Deploys the staged changes to Production. */
  deploy: () => void
}

function topologySlotNode(
  key: string,
  target: TopologyTarget,
  pick: string | undefined,
  deployedValue: string | undefined
): FlowDiagramNodeData {
  const removing = pick === ''
  const value = pick === undefined ? deployedValue : pick
  const base = {
    id: key,
    eyebrow: target.kind,
    icon: target.icon,
    bindable: true,
    bindOptions: target.options,
    removable: target.removable !== false
  }
  if (!value) {
    return {
      ...base,
      status: removing ? 'Staged' : '',
      severity: removing ? 'warning' : 'neutral',
      dashed: true,
      message: removing ? `Deploy to remove this ${target.kind.toLowerCase()}.` : target.unbound
    }
  }
  return {
    ...base,
    title: value,
    boundValue: value,
    status: pick === undefined ? 'Active' : 'Staged',
    severity: pick === undefined ? 'success' : 'warning',
    dashed: pick !== undefined,
    message:
      pick === undefined
        ? target.bound || ''
        : `Deploy to apply this ${target.kind.toLowerCase()}.`,
    fields: pick === undefined ? target.fields : undefined
  }
}

function announceLive(
  options: UseTopologyStagingOptions,
  changes: number,
  onEdit: () => void,
  onRedeploy: () => void
): void {
  toast.success(`${options.name} is live.`, {
    id: options.toastId,
    description: changes
      ? `${changes} topology ${changes === 1 ? 'change' : 'changes'} now serve Production.`
      : 'Production serves the active version.',
    duration: 0,
    closable: true,
    actions: [
      { label: 'Edit', onClick: onEdit },
      { label: 'Redeploy', onClick: onRedeploy }
    ]
  })
}

function applyStaged(deployed: Record<string, string>, staged: Record<string, string>): void {
  for (const [key, value] of Object.entries(staged)) {
    deployed[key] = value
    delete staged[key]
  }
}

function stagingEdits(
  targets: Record<string, TopologyTarget>,
  deployed: Record<string, string>,
  staged: Record<string, string>,
  stagedNote: Ref<string>
): Pick<UseTopologyStagingReturn, 'bind' | 'unbind' | 'createTarget'> {
  const bind = (key: string, value: string) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    stagedNote.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const unbind = (key: string) => {
    if (staged[key] !== undefined && staged[key] !== '') delete staged[key]
    else if (deployed[key]) staged[key] = ''
    stagedNote.value = `${targets[key].kind} staged for removal.`
  }
  const createTarget = (key: string) => {
    stagedNote.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }
  return { bind, unbind, createTarget }
}

export function useTopologyStaging(options: UseTopologyStagingOptions): UseTopologyStagingReturn {
  const { targets } = options
  const deployed = reactive<Record<string, string>>({ ...options.bound })
  const staged = reactive<Record<string, string>>({})
  const stagedCount = computed(() => Object.keys(staged).length)
  const stagedNote = ref('')
  const deploying = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const slotNode = (key: string): FlowDiagramNodeData =>
    topologySlotNode(key, targets[key], staged[key], deployed[key])

  const stagedChanges = computed(() =>
    Object.entries(staged).map(([key, value]) => ({
      key,
      kind: targets[key].kind,
      from: deployed[key] || 'Not bound',
      to: value || 'Removed'
    }))
  )

  const { bind, unbind, createTarget } = stagingEdits(targets, deployed, staged, stagedNote)

  const editStaged = () => {
    toast.dismiss(options.toastId)
    options.onEdit()
  }

  const deploy = () => {
    deploying.value = true
    const changes = stagedChanges.value.length
    toast.loading(`Deploying ${options.name}…`, {
      id: options.toastId,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      applyStaged(deployed, staged)
      deploying.value = false
      stagedNote.value = ''
      announceLive(options, changes, editStaged, deploy)
    }, 1500)
  }

  onScopeDispose(() => {
    clearTimeout(timer)
    if (options.dismissOnLeave) toast.dismiss(options.toastId)
  })

  return {
    stagedCount,
    stagedChanges,
    stagedNote: readonly(stagedNote),
    deploying: readonly(deploying),
    slotNode,
    bind,
    unbind,
    createTarget,
    deploy
  }
}
