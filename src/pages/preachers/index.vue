<script setup lang="ts">
import { datatableV3 } from '/@src/data/layouts/datatable-v3'
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, ref, reactive} from "vue";
import {PreacherService} from "/@src/services/preacher.service";
import type {Preacher} from "/@src/interfaces/preacher";

const preachers = ref<Preacher[]>([])
const loading = ref(true)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Preacher')

onMounted(() => {
  getPreachers()
})

useHead({
  title: 'Preachers - Edify',
})


const getPreachers = async () => {
  try {
    const response = await PreacherService.getPreachers()
    preachers.value = response.data.data
    loading.value = false;
  } catch (error) {
    console.error(error)
  }
}


</script>

<template>
  <SidebarLayout open-on-mounted>
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <VButton color="primary" icon="fas fa-plus" elevated> Add Preacher </VButton>
        </VButtons>
      </div>
      <VLoader :active="loading" size="large">
        <VSimpleDatatables>
          <thead>
          <tr>
            <th scope="col" data-sortable="false">
              <VField>
                <VControl>
                  <!--                <VCheckbox color="primary" circle outlined />-->
                </VControl>
              </VField>
            </th>
            <th scope="col">Name</th>
            <th scope="col">Bio</th>
            <th scope="col" data-sortable="false">Sermons</th>
            <th scope="col" data-sortable="false">Series</th>
            <th scope="col" data-sortable="false">Followers</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Date Created</th>
            <th scope="col" data-sortable="false"></th>
          </tr>
          </thead>
          <tbody v-if="!loading">
          <tr v-if="preachers.length === 0">
            <td colspan="9">
              <!--Empty Placeholder-->
              <VPlaceholderSection
                title="No preacher to show"
                subtitle="There is currently no preacher to show in this list."
              >
                <template #image>
                  <img
                    class="light-image"
                    src="/@src/assets/illustrations/placeholders/search-4.svg"
                    alt=""
                  />
                  <img
                    class="dark-image"
                    src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                    alt=""
                  />
                </template>
              </VPlaceholderSection>
            </td>
          </tr>
          <tr v-for="preacher in preachers">
            <td>
              <VField>
                <VControl>
                  <VCheckbox color="primary" circle outlined />
                </VControl>
              </VField>
            </td>
            <td>
              <div class="flex-media">
                <VAvatar :picture="preacher.image_url" size="small" />

                <div class="meta">
                  <span> {{ preacher.title }} {{ preacher.name }}</span>
<!--                  insert ministry here-->
<!--                  <span>{{ row[6] }}</span>-->
                </div>
              </div>
            </td>
            <td>
              <span class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90">{{preacher.bio}}</span>
            </td>
            <td>
              <span class="light-text">{{ preacher.sermons?.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ preacher.series?.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ preacher.followers?.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ preacher.updated_at }}</span>
            </td>
            <td>
              <span class="light-text">{{ preacher.created_at }}</span>
            </td>
            <td>
              <WidgetDropdown />
            </td>
          </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>
  </SidebarLayout>
</template>
