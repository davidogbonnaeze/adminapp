<template>
  <a href="#" role="menuitem" class="dropdown-item is-media" @click="openUpdateModal">
    <div class="icon">
      <i aria-hidden="true" class="fa fa-edit"></i>
    </div>
    <div class="meta">
      <span>Edit</span>
    </div>
  </a>
  <VModal
    :open="openUpdateTopicModal"
    size="large"
    title="Add Topic"
    actions="right"
    noclose
    @close="openUpdateTopicModal = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField label="Name *">
              <VControl>
                <VInput
                  v-model="updateTopicFormData.name"
                  type="text"
                  placeholder="Ex: Grace, Faith,..."
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton color="primary" :loading="saveButtonLoading" raised @click="updateTopic"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Topic } from '/@src/interfaces/topic'
import { Notyf } from 'notyf'
import { reactive, ref } from 'vue'
import { TopicService } from '/@src/services/topic.service'

const props = defineProps<{
  topic: Topic
}>()

const emit = defineEmits(['fetchTopics'])
const notyf = new Notyf()
const saveButtonLoading = ref(false)
const openUpdateTopicModal = ref(false)
const updateTopicFormData = reactive({
  name: null as any,
})

const openUpdateModal = () => {
  if (props.topic) {
    const topic = props.topic
    updateTopicFormData.name = topic.name
  }
  openUpdateTopicModal.value = true
}

const prepareUpdateTopicPayload = () => {
  const payload = {
    name: updateTopicFormData.name,
  }
  return payload
}

const updateTopic = async () => {
  saveButtonLoading.value = true
  const payload = prepareUpdateTopicPayload()
  try {
    const response = await TopicService.updateTopic(props.topic.id, payload)
    console.log(response)
    saveButtonLoading.value = false
    openUpdateTopicModal.value = false
    notyf.success('Topic updated successfully')
    emit('fetchTopics')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
