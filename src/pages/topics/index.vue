<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { onMounted, ref } from 'vue'
import { Topic } from '/@src/interfaces/topic'
import { TopicService } from '/@src/services/topic.service'
import moment from 'moment'
import CreateTopic from '/@src/components/edify/Create/CreateTopic.vue'
import { Notyf } from 'notyf'

const notyf = new Notyf()
const topics = ref<Topic[]>([])
const tableLoading = ref(true)
const isDeletingTopic = ref<boolean>(false)
const deleteTopicModal = ref<boolean>(false)
const selectedTopic = ref<Topic>()
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
    tableLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

const openDeleteTopicModal = (topic: Topic) => {
  deleteTopicModal.value = true
  selectedTopic.value = topic
}

const deleteTopic = async () => {
  isDeletingTopic.value = true
  try {
    const topicId = selectedTopic.value?.id as string
    await TopicService.deleteTopic(topicId)
    isDeletingTopic.value = false
    await fetchTopics()
    notyf.success('Topic deleted successfully')
  } catch (error) {
    isDeletingTopic.value = false
    console.error(error)
  }
}
</script>

<template>
  <SidebarLayout open-on-mounted>
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <CreateTopic />
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
            <tr v-for="topic in topics" :key="topic.id">
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
                  >{{ topic.name }}</span
                >
              </td>
              <td>
                <span class="light-text">{{ topic.color }}</span>
              </td>
              <td>
                <div class="flex-media">
                  <VAvatar :picture="topic.image_url" size="medium" />
                </div>
              </td>
              <td>
                <span class="light-text">{{ topic.sermons.length }}</span>
              </td>
              <td>
                <span class="light-text">{{ topic.series.length }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(topic.created_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(topic.created_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <VDropdown icon="feather:more-vertical" right spaced>
                  <template #content>
                    <a
                      href="#"
                      role="menuitem"
                      class="dropdown-item is-media"
                      @click="openDeleteTopicModal(topic)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                      </div>
                      <div class="meta">
                        <span>Delete</span>
                      </div>
                    </a>
                    <hr class="dropdown-divider" />
                    <UpdateTopic :topic="topic" @fetch-topics="fetchTopics" />
                    <hr class="dropdown-divider" />
                    <UpdateTopicImage :topic="topic" @fetch-topics="fetchTopics" />
                  </template>
                </VDropdown>
              </td>
            </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>
    <VModal
      :open="deleteTopicModal"
      size="large"
      title="Delete Topic"
      actions="right"
      noclose
      @close="deleteTopicModal = false"
    >
      <template #content>
        <h5 v-if="selectedTopic" class="has-text-centered">
          Delete
          <span class="is-medium-bold">{{ selectedTopic.name }}</span>
        </h5>
      </template>
      <template #action>
        <VButton color="primary" :loading="isDeletingTopic" raised @click="deleteTopic"
          >Delete</VButton
        >
      </template>
    </VModal>
  </SidebarLayout>
</template>
