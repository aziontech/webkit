<script setup>
  import BrowserFrame from '@aziontech/webkit/browser-frame'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <div class="flex flex-wrap items-start gap-(--spacing-xl)">
      <div class="min-w-0 grow basis-(--container-xs)">
        <BrowserFrame
          :width="375"
          :height="812"
          address="https://www.azion.com"
          aria-label="Azion platform page at mobile size, 375 by 812 pixels"
        >
          <SectionContainer max-width="site">
            <SectionGap
              size="small"
              hatch
            />
            <SectionModule
              :divided="false"
              :padded="false"
            >
              <template #header>
                <SectionTitle
                  kind="horizontal"
                  eyebrow="Platform"
                  title="Build, secure and deliver from one platform"
                  description="Run your applications, protect them and cache their responses on the same distributed network."
                >
                  <template #actions>
                    <Button
                      kind="outlined"
                      label="See all products"
                    />
                  </template>
                </SectionTitle>
              </template>
              <FrameBox
                flush
                borders="y"
                marks="all"
              >
                <CardGrid
                  flush
                  kind="frame"
                  :columns="3"
                  :mobile-columns="1"
                >
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-edge-application"
                      title="Applications"
                      description="Deploy web apps and APIs close to every user, with no servers to provision."
                    />
                  </CardGrid.Cell>
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-edge-firewall"
                      title="Firewall"
                      description="Stop DDoS, bots and injection attacks before a request reaches your origin."
                    />
                  </CardGrid.Cell>
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-tiered-cache"
                      title="Tiered Cache"
                      description="Answer repeat requests from the nearest location and offload your origin."
                    />
                  </CardGrid.Cell>
                </CardGrid>
              </FrameBox>
            </SectionModule>
            <SectionGap
              size="small"
              hatch
            />
            <SectionModule
              :divided="false"
              :padded="false"
            >
              <CallToAction
                framed
                kind="split"
                eyebrow="Get started"
                title="Deploy your first application."
                title-muted="Run it everywhere."
                description="Start on the free plan and move to production when you are ready. No credit card required."
              >
                <template #actions>
                  <Button
                    kind="secondary"
                    label="Start for free"
                  />
                </template>
                <template #aside>
                  <Button
                    kind="outlined"
                    label="Talk to a specialist"
                  />
                </template>
              </CallToAction>
            </SectionModule>
            <SectionGap
              size="small"
              hatch
            />
          </SectionContainer>
        </BrowserFrame>
      </div>
      <div class="min-w-0 grow-2 basis-(--container-xl)">
        <BrowserFrame
          :width="768"
          :height="1024"
          address="https://www.azion.com"
          aria-label="Azion platform page at tablet size, 768 by 1024 pixels"
        >
          <SectionContainer max-width="site">
            <SectionGap
              size="small"
              hatch
            />
            <SectionModule
              :divided="false"
              :padded="false"
            >
              <template #header>
                <SectionTitle
                  kind="horizontal"
                  eyebrow="Platform"
                  title="Build, secure and deliver from one platform"
                  description="Run your applications, protect them and cache their responses on the same distributed network."
                >
                  <template #actions>
                    <Button
                      kind="outlined"
                      label="See all products"
                    />
                  </template>
                </SectionTitle>
              </template>
              <FrameBox
                flush
                borders="y"
                marks="all"
              >
                <CardGrid
                  flush
                  kind="frame"
                  :columns="3"
                  :mobile-columns="1"
                >
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-edge-application"
                      title="Applications"
                      description="Deploy web apps and APIs close to every user, with no servers to provision."
                    />
                  </CardGrid.Cell>
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-edge-firewall"
                      title="Firewall"
                      description="Stop DDoS, bots and injection attacks before a request reaches your origin."
                    />
                  </CardGrid.Cell>
                  <CardGrid.Cell kind="canvas">
                    <Topic
                      :heading-level="3"
                      icon="ai ai-tiered-cache"
                      title="Tiered Cache"
                      description="Answer repeat requests from the nearest location and offload your origin."
                    />
                  </CardGrid.Cell>
                </CardGrid>
              </FrameBox>
            </SectionModule>
            <SectionGap
              size="small"
              hatch
            />
            <SectionModule
              :divided="false"
              :padded="false"
            >
              <CallToAction
                framed
                kind="split"
                eyebrow="Get started"
                title="Deploy your first application."
                title-muted="Run it everywhere."
                description="Start on the free plan and move to production when you are ready. No credit card required."
              >
                <template #actions>
                  <Button
                    kind="secondary"
                    label="Start for free"
                  />
                </template>
                <template #aside>
                  <Button
                    kind="outlined"
                    label="Talk to a specialist"
                  />
                </template>
              </CallToAction>
            </SectionModule>
            <SectionGap
              size="small"
              hatch
            />
          </SectionContainer>
        </BrowserFrame>
      </div>
    </div>
    <BrowserFrame
      :width="1280"
      :height="800"
      address="https://www.azion.com"
      aria-label="Azion platform page at desktop size, 1280 by 800 pixels"
    >
      <SectionContainer max-width="site">
        <SectionGap
          size="small"
          hatch
        />
        <SectionModule
          :divided="false"
          :padded="false"
        >
          <template #header>
            <SectionTitle
              kind="horizontal"
              eyebrow="Platform"
              title="Build, secure and deliver from one platform"
              description="Run your applications, protect them and cache their responses on the same distributed network."
            >
              <template #actions>
                <Button
                  kind="outlined"
                  label="See all products"
                />
              </template>
            </SectionTitle>
          </template>
          <FrameBox
            flush
            borders="y"
            marks="all"
          >
            <CardGrid
              flush
              kind="frame"
              :columns="3"
              :mobile-columns="1"
            >
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-edge-application"
                  title="Applications"
                  description="Deploy web apps and APIs close to every user, with no servers to provision."
                />
              </CardGrid.Cell>
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-edge-firewall"
                  title="Firewall"
                  description="Stop DDoS, bots and injection attacks before a request reaches your origin."
                />
              </CardGrid.Cell>
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-tiered-cache"
                  title="Tiered Cache"
                  description="Answer repeat requests from the nearest location and offload your origin."
                />
              </CardGrid.Cell>
            </CardGrid>
          </FrameBox>
        </SectionModule>
        <SectionGap
          size="small"
          hatch
        />
        <SectionModule
          :divided="false"
          :padded="false"
        >
          <CallToAction
            framed
            kind="split"
            eyebrow="Get started"
            title="Deploy your first application."
            title-muted="Run it everywhere."
            description="Start on the free plan and move to production when you are ready. No credit card required."
          >
            <template #actions>
              <Button
                kind="secondary"
                label="Start for free"
              />
            </template>
            <template #aside>
              <Button
                kind="outlined"
                label="Talk to a specialist"
              />
            </template>
          </CallToAction>
        </SectionModule>
        <SectionGap
          size="small"
          hatch
        />
      </SectionContainer>
    </BrowserFrame>
  </div>
</template>
