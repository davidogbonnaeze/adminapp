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
    :open="openUpdatePreacherModal"
    size="large"
    title="Update Preacher"
    actions="right"
    noclose
    @close="openUpdatePreacherModal = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-6">
            <VField class="is-image-select" label="Title *">
              <VControl>
                <Multiselect
                  v-model="updatePreacherFormData.title"
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
                <VInput
                  v-model="updatePreacherFormData.name"
                  type="text"
                  placeholder="Ex: John Doe"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <VField label="Bio *">
              <VControl>
                <VTextarea
                  v-model="updatePreacherFormData.bio"
                  rows="3"
                  placeholder="Details about the project..."
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton color="primary" :loading="saveButtonLoading" raised @click="updatePreacher"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
import { reactive, ref } from 'vue'
import { Preacher } from '/@src/interfaces/preacher'
import { PreacherService } from '/@src/services/preacher.service'

const props = defineProps<{
  preacher: Preacher
}>()

const emit = defineEmits(['fetchPreachers'])
const notyf = new Notyf()
const openUpdatePreacherModal = ref(false)
const updatePreacherFormData = reactive({
  title: null as any,
  name: null as any,
  bio: null as any,
})
const saveButtonLoading = ref(false)

const openUpdateModal = () => {
  if (props.preacher) {
    const preacher = props.preacher
    updatePreacherFormData.title = preacher.title
    updatePreacherFormData.name = preacher.name
    updatePreacherFormData.bio = preacher.bio
  }
  openUpdatePreacherModal.value = true
}

const prepareUpdatePreacherPayload = () => {
  const payload = {
    title: updatePreacherFormData.title,
    name: updatePreacherFormData.name,
    bio: updatePreacherFormData.bio,
  }
  return payload
}

const updatePreacher = async () => {
  saveButtonLoading.value = true
  const payload = prepareUpdatePreacherPayload()
  try {
    const response = await PreacherService.updatePreacher(props.preacher.id, payload)
    console.log(response)
    saveButtonLoading.value = false
    openUpdatePreacherModal.value = false
    notyf.success('Preacher updated successfully')
    emit('fetchPreachers')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
