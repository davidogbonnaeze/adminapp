<script setup lang="ts">

import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, ref} from "vue";
import {Category} from "/@src/interfaces/category";
import {CategoryService} from "/@src/services/category.service";

const categories = ref<Category[]>([])
const loading = ref(true)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Categories')

onMounted(() => {
  getCategories()
})

useHead({
  title: 'Categories - Edify',
})

const getCategories = async () => {
  try {
    const response = await CategoryService.getCategories()
    categories.value = response.data.data
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
          <VButton color="primary" icon="fas fa-plus" elevated> Add Category </VButton>
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
          <tbody v-if="!loading">
          <tr v-if="categories.length === 0">
            <td colspan="9">
              <!--Empty Placeholder-->
              <VPlaceholderSection
                title="No sermon to show"
                subtitle="There is currently no sermon to show in this list."
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
              <span class="light-text">{{ category.image_url }}</span>
            </td>
            <td>
              <span class="light-text">{{ category.sermons.length}}</span>
            </td>
            <td>
              <span class="light-text">{{ category.series.length }}</span>
            </td>
            <td>
              <span class="light-text">{{ category.updated_at }}</span>
            </td>
            <td>
              <span class="light-text">{{ category.created_at }}</span>
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
  </SidebarLayout>
</template>
