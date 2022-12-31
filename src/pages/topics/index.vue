<script setup lang="ts">

import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, reactive, ref} from "vue";
import {Topic} from "/@src/interfaces/topic";
import {TopicService} from "/@src/services/topic.service";
import { Notyf } from 'notyf';
import moment from "moment";

const notyf = new Notyf()
const topics = ref<Topic[]>([])
const tableLoading = ref(true)
const saveButtonLoading = ref(false)
const addTopicFormOpen = ref(false)
const addTopicFormData = reactive({
  name: null as any,
  color: null as any,
  topic_image: null as any,
})
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Topics')

onMounted(() => {
  fetchTopics()
})

useHead({
  title: 'Topics - Edify',
})

const fetchTopics = async () => {
  try {
    const response = await TopicService.getTopics()
    topics.value = response.data.data
    tableLoading.value = false;
  } catch (error) {
    console.error(error)
  }
}

const onAddTopicImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addTopicFormData.topic_image = _file
  }
}

const onRemoveTopicImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addTopicFormData.topic_image = null;
}

const resetFormData = () => {
  addTopicFormData.name = null
  addTopicFormData.color = null
  addTopicFormData.topic_image = null
}

const createTopic = async () => {
  saveButtonLoading.value = true;
  const formData = new FormData();
  formData.append('name', addTopicFormData.name)
  formData.append('color', '#ffffff')
  formData.append('topic_image', addTopicFormData.topic_image)

  try {
    const response = await TopicService.createTopic(formData);
    resetFormData();
    saveButtonLoading.value = false;
    addTopicFormOpen.value = false;
    notyf.success('Topic created successfully')
    await fetchTopics();
  } catch (error) {
    saveButtonLoading.value = false;
    console.error(error)
  }
}
</script>

<template>
  <SidebarLayout open-on-mounted>
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <VButton color="primary" icon="fas fa-plus" @click="addTopicFormOpen = true" elevated> Add Topic </VButton>
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
            <th scope="col" >Name</th>
            <th scope="col">Color</th>
            <th scope="col" >Image</th>
            <th scope="col" >Sermons</th>
            <th scope="col" >Series</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Date Created</th>
            <th scope="col" data-sortable="false"></th>
          </tr>
          </thead>
          <tbody v-if="!tableLoading">
          <tr v-if="topics.length === 0">
            <td colspan="9">
              <!--Empty Placeholder-->
              <VPlaceholderSection
                title="No topic to show"
                subtitle="There is currently no topic to show in this list."
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
          <tr v-for="topic in topics">
            <td>
              <VField>
                <VControl>
                  <VCheckbox color="primary" circle outlined />
                </VControl>
              </VField>
            </td>
            <td >
              <span class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90">{{topic.name}}</span>
            </td>
            <td>
              <span class="light-text">{{ topic.color}}</span>
            </td>
            <td>
              <div class="flex-media">
                <VAvatar :picture="topic.image_url " size="medium" />
              </div>
            </td>
            <td>
              <span class="light-text">{{ topic.sermons.length}}</span>
            </td>
            <td>
              <span class="light-text">{{ topic.series.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(topic.created_at).format("YYYY-MM-DD") }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(topic.created_at).format("YYYY-MM-DD") }}</span>
            </td>
            <td>
              <VDropdown icon="feather:more-vertical" right spaced>
                <template #content>
                  <a href="#" role="menuitem" class="dropdown-item is-media">
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-reload"></i>
                    </div>
                    <div class="meta">
                      <span>Reload</span>
                      <span>Reload Widget</span>
                    </div>
                  </a>

                  <a href="#" role="menuitem" class="dropdown-item is-media">
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-cogs"></i>
                    </div>
                    <div class="meta">
                      <span>Configure</span>
                      <span>Configure widget</span>
                    </div>
                  </a>

                  <a href="#" role="menuitem" class="dropdown-item is-media">
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-cog"></i>
                    </div>
                    <div class="meta">
                      <span>Settings</span>
                      <span>Widget Settings</span>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a href="#" role="menuitem" class="dropdown-item is-media">
                    <div class="icon">
                      <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                    </div>
                    <div class="meta">
                      <span>Remove</span>
                      <span>Remove from view</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </td>
          </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>
    <VModal
      :open="addTopicFormOpen"
      size="large"
      title="Add Topic"
      actions="right"
      noclose
      @close="addTopicFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField label="Name *">
                <VControl>
                  <VInput type="text" v-model="addTopicFormData.name"  placeholder="Ex: Grace, Faith,..." />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField label="Topic Image *">
                <VControl>
                  <VFilePond
                    class="profile-filepond"
                    name="profile_filepond"
                    :chunk-retry-delays="[500, 1000, 3000]"
                    label-idle="<i class='lnil lnil-cloud-upload'></i>"
                    :accepted-file-types="['image/png']"
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
                    @addfile="onAddTopicImage"
                    @removefile="onRemoveTopicImage"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </template>
      <template #action="{ close }">
        <VButton color="primary" :loading="saveButtonLoading" raised @click="createTopic()">Save</VButton>
      </template>
    </VModal>
  </SidebarLayout>
</template>
