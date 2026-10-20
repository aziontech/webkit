import {
  chosenVersion,
  dependenciesOf,
  deployTarget,
  OWNED_DEPENDENCIES,
  resourceTypeLabel
} from './releases'

export const deployResource = ({ key, type, name, kind = '', ...rest }) => ({
  key,
  type,
  name,
  serving: true,
  change: null,
  ...deployTarget(type, name, kind),
  ...rest
})

export const removedResource = ({ key, type, name, icon }) => ({
  key,
  type,
  name,
  icon,
  label: resourceTypeLabel(type),
  serving: false,
  versions: [],
  note: 'Stops serving this workload',
  change: { label: 'Removed', severity: 'danger' }
})

const pickedVersion = (versions, id) => {
  const picked = chosenVersion(versions, id)
  return picked ? { id: picked.id, name: picked.name } : null
}

export const withDependencies = (resources, resourcePicks) =>
  resources.map((resource) => {
    const source = chosenVersion(resource.versions, resourcePicks[resource.key])?.id ?? ''
    const dependencies = resource.serving
      ? Object.entries(dependenciesOf(resource.type, resource.name, source)).flatMap(
          ([type, names]) =>
            names.map((name) => ({
              key: `${resource.key}@${source}:${type}-${name}`,
              type,
              name,
              ...deployTarget(type, name)
            }))
        )
      : []
    return {
      ...resource,
      source,
      owner: resource.serving && Boolean(OWNED_DEPENDENCIES[resource.type]),
      dependencies
    }
  })

export const pinnedVersions = (groups, resourcePicks, dependencyPicks) => ({
  resources: groups
    .filter((resource) => resource.serving)
    .map((resource) => ({
      type: resource.type,
      name: resource.name,
      version: pickedVersion(resource.versions, resourcePicks[resource.key])
    })),
  dependencies: groups.flatMap((resource) =>
    resource.dependencies.map((dependency) => ({
      parent: { type: resource.type, name: resource.name },
      type: dependency.type,
      name: dependency.name,
      version: pickedVersion(dependency.versions, dependencyPicks[dependency.key])
    }))
  )
})
