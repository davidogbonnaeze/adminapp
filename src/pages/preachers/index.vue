<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, ref, reactive} from "vue";
import {PreacherService} from "/@src/services/preacher.service";
import type {Preacher} from "/@src/interfaces/preacher";
import { Notyf } from 'notyf';
import moment from "moment";


const notyf = new Notyf()
const preachers = ref<Preacher[]>([])
const addPreacherFormOpen = ref(false)
const addPreacherFormData = reactive({
  title: null as any,
  name: null as any,
  bio: null as any,
  preacher_image: null as any

})
const tableLoading = ref(true)
const saveButtonLoading = ref(false)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Preacher')

onMounted(() => {
  getPreachers()
})

useHead({
  title: 'Preachers - Edify',
})

 const createPreacher = async () => {
  saveButtonLoading.value = true;
  const formData = new FormData();
  formData.append('preacher_image', addPreacherFormData.preacher_image)
  formData.append('title', addPreacherFormData.title)
  formData.append('name', addPreacherFormData.name)
  formData.append('bio', addPreacherFormData.bio)
   try {
     await PreacherService.createPreacher(formData);
     resetFormData();
     saveButtonLoading.value = false;
     addPreacherFormOpen.value = false
     notyf.success('Preacher created successfully')
     await getPreachers();
   } catch (error) {
     saveButtonLoading.value = false;
     console.error(error)
   }
 }


 const resetFormData = () => {
   addPreacherFormData.preacher_image = null;
   addPreacherFormData.title = null;
   addPreacherFormData.bio = null;
   addPreacherFormData.name = null;
 }


const getPreachers = async () => {
  tableLoading.value = true;
  try {
    const response = await PreacherService.getPreachers()
    preachers.value = response.data.data
    tableLoading.value = false;
  } catch (error) {
    console.error(error)
  }
}

const onAddFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  const _file = fileInfo.file as File
  if (_file) {
    addPreacherFormData.preacher_image = _file
    console.log(addPreacherFormData.preacher_image)
  }
}

const onRemoveFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addPreacherFormData.preacher_image = null;
  console.log(addPreacherFormData.preacher_image)
}


</script>

<template>
  <SidebarLayout open-on-mounted>
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <VButton color="primary" icon="fas fa-plus" @click="addPreacherFormOpen = true" elevated> Add Preacher </VButton>
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
                <VAvatar :picture="'https://d1zuqyxxudi0k.cloudfront.net/' + preacher.image_url " size="medium" />
<!--                <img class="file-icon" :src="'https://d1zuqyxxudi0k.cloudfront.net/' + preacher.image_url" alt="" />-->

<!--                <div class="metax">-->
<!--                  insert ministry here-->
<!--                  <span>{{ row[6] }}</span>-->
<!--                </div>-->
              </div>
            </td>
            <td>
              <span> {{ preacher.title }} {{ preacher.name }}</span>
            </td
            ><td>
              <span class="light-text">{{preacher.bio}}</span>
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
              <span class="light-text">{{ moment(preacher.updated_at).format("YYYY-MM-DD")}}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(preacher.created_at).format("YYYY-MM-DD") }}</span>
            </td>
            <td>
              <WidgetDropdown />
            </td>
          </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>
    <VModal
      :open="addPreacherFormOpen"
      size="large"
      title="Add Preacher"
      actions="right"
      noclose
      @close="addPreacherFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-6">
              <VField class="is-image-select" label="Title *">
                <VControl>
                  <Multiselect
                    v-model="addPreacherFormData.title"
                    placeholder="Select title"
                    track-by="name"
                    label="name"
                    :search="true"
                    :options="[
                      {
                        value: 'Apostle',
                        name: 'Apostle',
                      },
                      {
                        value: 'Pastor',
                        name: 'Pastor',
                      },
                      {
                        value: 'Prophet',
                        name: 'Prophet',
                      },
                      {
                        value: 'Evangelist',
                        name: 'Evangelist',
                      },
                      {
                        value: 'Reverend',
                        name: 'Reverend',
                      },
                      {
                        value: 'Brother',
                        name: 'Brother',
                      },
                      {
                        value: 'Bishop',
                        name: 'Bishop',
                      },
                      {
                        value: 'Minister',
                        name: 'Minister',
                      },
                    ]"
                    :max-height="145"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        {{ value.name }}
                      </div>
                    </template>
                    <template #option="{ option }">
                      {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="Name *">
                <VControl>
                  <VInput type="text" v-model="addPreacherFormData.name"  placeholder="Ex: John Doe" />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField label="Preacher Image *">
                <VControl>
                  <VFilePond
                    class="profile-filepond"
                    name="profile_filepond"
                    :chunk-retry-delays="[500, 1000, 3000]"
                    label-idle="<i class='lnil lnil-cloud-upload'></i>"
                    :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                    :drop-validation="true"
                    :image-preview-height="140"
                    :image-resize-target-width="140"
                    :image-resize-target-height="140"
                    image-crop-aspect-ratio="1:1"
                    style-panel-layout="compact circle"
                    style-panel-aspext-ratio="1:1"
                    style-load-indicator-position="center bottom"
                    style-progress-indicator-position="right bottom"
                    style-button-remove-item-position="left bottom"
                    style-button-process-item-position="right bottom"
                    @addfile="onAddFile"
                    @removefile="onRemoveFile"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField label="Bio *">
                <VControl>
                  <VTextarea v-model="addPreacherFormData.bio" rows="3" placeholder="Details about the project..." />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </template>
      <template #action="{ close }">
        <VButton color="primary" :loading="saveButtonLoading" raised @click="createPreacher()">Save</VButton>
      </template>
    </VModal>
  </SidebarLayout>
</template>
