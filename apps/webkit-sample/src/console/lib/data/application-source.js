import { APPLICATIONS } from './applications'
import { APPLICATION_BUILD_TREE, bucketTree } from './object-storage'
import { findDeploymentByApplication, provisionedApplications } from './provisioning'
import { latestBuiltVersionId } from './releases'

export const applicationBucketName = (application) => `${application.name}-assets`

export function applicationBucket(application) {
  const record = findDeploymentByApplication(application.id)
  const name = record?.bucket?.name ?? applicationBucketName(application)
  const populated = record
    ? Boolean(record.bucket)
    : Boolean(latestBuiltVersionId(String(application.name)))

  return {
    id: name,
    name,
    access: record?.bucket?.access ?? 'Public',
    href: `/object-storage/${name}`,
    tree: populated ? APPLICATION_BUILD_TREE : {}
  }
}

export function storageTree(bucketId) {
  const owner = [...APPLICATIONS, ...provisionedApplications.value].find(
    (application) => applicationBucket(application).id === bucketId
  )
  return owner ? applicationBucket(owner).tree : bucketTree(bucketId)
}
