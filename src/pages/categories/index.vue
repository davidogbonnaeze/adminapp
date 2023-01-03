<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { onMounted, ref } from 'vue'
import { Category } from '/@src/interfaces/category'
import { CategoryService } from '/@src/services/category.service'
import moment from 'moment'
import CreateCategory from '/@src/components/edify/CreateCategory.vue'
import { Notyf } from 'notyf'

const notyf = new Notyf()
const categories = ref<Category[]>([])
const tableLoading = ref(true)
const isDeletingCategory = ref<boolean>(false)
const deleteCategoryModal = ref<boolean>(false)
const selectedCategory = ref<Category>()

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
    tableLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

const opendeleteCategoryModal = (category: Category) => {
  deleteCategoryModal.value = true
  selectedCategory.value = category
}

const deleteCategory = async () => {
  isDeletingCategory.value = true
  try {
    const categoryId = selectedCategory.value?.id as string
    await CategoryService.deleteCategory(categoryId)
    isDeletingCategory.value = false
    await fetchCategories()
    notyf.success('Category deleted successfully')
  } catch (error) {
    isDeletingCategory.value = false
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
          <CreateCategory />
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
              <th scope="col">Name</th>
              <th scope="col">Color</th>
              <th scope="col">Image</th>
              <th scope="col">Sermons</th>
              <th scope="col">Series</th>
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
            <tr v-for="category in categories" :key="category.id">
              <td>
                <VField>
                  <VControl>
                    <VCheckbox color="primary" circle outlined />
                  </VControl>
                </VField>
              </td>
              <td>
                <span
                  class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90"
                  >{{ category.name }}</span
                >
              </td>
              <td>
                <span class="light-text">{{ category.color }}</span>
              </td>
              <td>
                <VAvatar :picture="category.image_url" size="medium" />
              </td>
              <td>
                <span class="light-text">{{ category.sermons.length }}</span>
              </td>
              <td>
                <span class="light-text">{{ category.series.length }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(category.updated_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(category.created_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <VDropdown icon="feather:more-vertical" right spaced>
                  <template #content>
                    <a
                      href="#"
                      role="menuitem"
                      class="dropdown-item is-media"
                      @click="opendeleteCategoryModal(category)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                      </div>
                      <div class="meta">
                        <span>Delete</span>
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
      :open="deleteCategoryModal"
      size="large"
      title="Delete Category"
      actions="right"
      noclose
      @close="deleteCategoryModal = false"
    >
      <template #content>
        <h5 v-if="selectedCategory" class="has-text-centered">
          Delete
          <span class="is-medium-bold">{{ selectedCategory.name }}</span>
        </h5>
      </template>
      <template #action>
        <VButton
          color="primary"
          :loading="isDeletingCategory"
          raised
          @click="deleteCategory"
          >Delete</VButton
        >
      </template>
    </VModal>
  </SidebarLayout>
</template>
