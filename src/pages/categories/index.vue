<script setup lang="ts">

import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, reactive, ref} from "vue";
import {Category} from "/@src/interfaces/category";
import {CategoryService} from "/@src/services/category.service";
import { Notyf } from 'notyf';
import moment from "moment";
import {TopicService} from "/@src/services/topic.service";

const notyf = new Notyf()
const categories = ref<Category[]>([])
const tableLoading = ref(true)
const saveButtonLoading = ref(false)
const addCategoryFormOpen = ref(false)
const addCategoryFormData = reactive({
  name: null as any,
  color: null as any,
  category_image: null as any,
})
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Categories')

onMounted(() => {
  fetchCategories()
})

useHead({
  title: 'Categories - Edify',
})

const fetchCategories = async () => {
  try {
    const response = await CategoryService.getCategories()
    categories.value = response.data.data
    tableLoading.value = false;
  } catch (error) {
    console.error(error)
  }
}

const onAddCategoryImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addCategoryFormData.category_image = _file
  }
}

const onRemoveCategoryImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addCategoryFormData.category_image = null;
}

const resetFormData = () => {
  addCategoryFormData.name = null
  addCategoryFormData.color = null
  addCategoryFormData.category_image = null
}

const createCategory = async () => {
  saveButtonLoading.value = true;
  const formData = new FormData();
  formData.append('name', addCategoryFormData.name)
  formData.append('color', '#ffffff')
  formData.append('category_image', addCategoryFormData.category_image)

  try {
    const response = await CategoryService.createCategory(formData);
    resetFormData();
    saveButtonLoading.value = false;
    addCategoryFormOpen.value = false;
    notyf.success('Category created successfully')
    await fetchCategories();
  } catch (error) {
    saveButtonLoading.value = false;
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
          <VButton color="primary" icon="fas fa-plus" @click="addCategoryFormOpen = true" elevated> Add Category </VButton>
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
          <tr v-if="categories.length === 0">
            <td colspan="9">
              <!--Empty Placeholder-->
              <VPlaceholderSection
                title="No category to show"
                subtitle="There is currently no category to show in this list."
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
          <tr v-for="category in categories">
            <td>
              <VField>
                <VControl>
                  <VCheckbox color="primary" circle outlined />
                </VControl>
              </VField>
            </td>
            <td >
              <span class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90">{{category.name}}</span>
            </td>
            <td>
              <span class="light-text">{{ category.color}}</span>
            </td>
            <td>
              <VAvatar :picture="'https://d1zuqyxxudi0k.cloudfront.net/' + category.image_url " size="medium" />
            </td>
            <td>
              <span class="light-text">{{ category.sermons.length}}</span>
            </td>
            <td>
              <span class="light-text">{{ category.series.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(category.updated_at).format("YYYY-MM-DD")}}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(category.created_at).format("YYYY-MM-DD") }}</span>
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
      :open="addCategoryFormOpen"
      size="large"
      title="Add Category"
      actions="right"
      noclose
      @close="addCategoryFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField label="Name *">
                <VControl>
                  <VInput type="text" v-model="addCategoryFormData.name"  placeholder="Ex: Chants, Confessions,..." />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField label="Category Image *">
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
                    @addfile="onAddCategoryImage"
                    @removefile="onRemoveCategoryImage"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </template>
      <template #action="{ close }">
        <VButton color="primary" :loading="saveButtonLoading" raised @click="createCategory()">Save</VButton>
      </template>
    </VModal>
  </SidebarLayout>
</template>
