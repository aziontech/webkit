<script setup>
  import ShellMockup from '@aziontech/webkit/shell-mockup'
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg)">
    <div class="h-80 w-full">
      <ShellMockup
        shell="console"
        title="Workloads"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
          <ShellMockup.Part :order="0">
            <div class="flex items-center justify-between gap-(--spacing-md)">
              <span class="text-heading-sm text-(--text-default)">Workloads</span>
              <Button
                label="Create workload"
                icon="pi pi-plus"
                size="medium"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="1">
            <div class="flex items-center gap-(--spacing-sm)">
              <InputText
                placeholder="Search workloads"
                size="small"
              />
              <Tag
                label="3 active"
                severity="success"
                size="small"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="2">
            <Table border>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell>Domain</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell principal>my-workload</Table.Cell>
                  <Table.Cell>my-workload.azion.app</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>storefront</Table.Cell>
                  <Table.Cell>shop.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>docs-portal</Table.Cell>
                  <Table.Cell>docs.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Deploying"
                      severity="warning"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </ShellMockup.Part>
        </div>
      </ShellMockup>
    </div>
    <div class="h-80 w-full">
      <ShellMockup
        shell="console"
        title="Workloads › my-workload"
        rail="workloads"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
          <ShellMockup.Part :order="0">
            <div class="flex items-center justify-between gap-(--spacing-md)">
              <span class="text-heading-sm text-(--text-default)">Workloads</span>
              <Button
                label="Create workload"
                icon="pi pi-plus"
                size="medium"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="1">
            <div class="flex items-center gap-(--spacing-sm)">
              <InputText
                placeholder="Search workloads"
                size="small"
              />
              <Tag
                label="3 active"
                severity="success"
                size="small"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="2">
            <Table border>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell>Domain</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell principal>my-workload</Table.Cell>
                  <Table.Cell>my-workload.azion.app</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>storefront</Table.Cell>
                  <Table.Cell>shop.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>docs-portal</Table.Cell>
                  <Table.Cell>docs.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Deploying"
                      severity="warning"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </ShellMockup.Part>
        </div>
      </ShellMockup>
    </div>
    <div class="h-80 w-full">
      <ShellMockup
        shell="legacy"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
          <ShellMockup.Part :order="0">
            <div class="flex items-center justify-between gap-(--spacing-md)">
              <span class="text-heading-sm text-(--text-default)">Workloads</span>
              <Button
                label="Create workload"
                icon="pi pi-plus"
                size="medium"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="1">
            <div class="flex items-center gap-(--spacing-sm)">
              <InputText
                placeholder="Search workloads"
                size="small"
              />
              <Tag
                label="3 active"
                severity="success"
                size="small"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="2">
            <Table border>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell>Domain</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell principal>my-workload</Table.Cell>
                  <Table.Cell>my-workload.azion.app</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>storefront</Table.Cell>
                  <Table.Cell>shop.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>docs-portal</Table.Cell>
                  <Table.Cell>docs.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Deploying"
                      severity="warning"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </ShellMockup.Part>
        </div>
      </ShellMockup>
    </div>
  </div>
</template>
