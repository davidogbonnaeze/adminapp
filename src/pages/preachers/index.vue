<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { onMounted, ref } from 'vue'
import { PreacherService } from '/@src/services/preacher.service'
import type { Preacher } from '/@src/interfaces/preacher'
import moment from 'moment'
import { Notyf } from 'notyf'

const notyf = new Notyf()
const preachers = ref<Preacher[]>([])
const tableLoading = ref(true)
const isDeletingPreacher = ref<boolean>(false)
const deletePreacherModal = ref<boolean>(false)
const selectedPreacher = ref<Preacher>()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Preacher')

onMounted(() => {
  getPreachers()
})

useHead({
  title: 'Preachers - Edify',
})

const getPreachers = async () => {
  tableLoading.value = true
  try {
    const response = await PreacherService.getPreachers()
    preachers.value = response.data.data
    tableLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

const openDeletePreacherModal = (preacher: Preacher) => {
  deletePreacherModal.value = true
  selectedPreacher.value = preacher
}

const deletePreacher = async () => {
  isDeletingPreacher.value = true
  try {
    const preacherId = selectedPreacher.value?.id as string
    await PreacherService.deletePreacher(preacherId)
    isDeletingPreacher.value = false
    await getPreachers()
    notyf.success('Preacher deleted successfully')
  } catch (error) {
    isDeletingPreacher.value = false
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
          <CreatePreacher />
        </VButtons>
      </div>
      <VLoader :active="tableLoading" size="large">
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
              <th scope="col">Image</th>
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
          <tbody v-if="!tableLoading">
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
            <tr v-for="preacher in preachers" :key="preacher.id">
              <td>
                <VField>
                  <VControl>
                    <VCheckbox color="primary" circle outlined />
                  </VControl>
                </VField>
              </td>
              <td>
                <div class="flex-media">
                  <VAvatar :picture="preacher.image_url" size="medium" />
                </div>
              </td>
              <td>
                <span> {{ preacher.title }} {{ preacher.name }}</span>
              </td>
              <td>
                <span class="light-text">{{ preacher.bio }}</span>
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
                <span class="light-text">{{
                  moment(preacher.updated_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(preacher.created_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <VDropdown icon="feather:more-vertical" right spaced>
                  <template #content>
                    <a
                      href="#"
                      role="menuitem"
                      class="dropdown-item is-media"
                      @click="openDeletePreacherModal(preacher)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                      </div>
                      <div class="meta">
                        <span>Delete</span>
                      </div>
                    </a>
                    <hr class="dropdown-divider" />
                    <UpdatePreacher
                      :preacher="preacher"
                      @fetch-preachers="getPreachers"
                    />
                  </template>
                </VDropdown>
              </td>
            </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>
    <VModal
      :open="deletePreacherModal"
      size="large"
      title="Delete Preacher"
      actions="right"
      noclose
      @close="deletePreacherModal = false"
    >
      <template #content>
        <h5 v-if="selectedPreacher" class="has-text-centered">
          Delete
          <span class="is-medium-bold"
            >{{ selectedPreacher.title }} {{ selectedPreacher.name }}</span
          >
        </h5>
      </template>
      <template #action>
        <VButton
          color="primary"
          :loading="isDeletingPreacher"
          raised
          @click="deletePreacher"
          >Delete</VButton
        >
      </template>
    </VModal>
  </SidebarLayout>
</template>
