<template>
  <div class="create-event-form" @keyup.enter="handleSubmit">
    <h1 class="title">{{ eventId ? 'Edit Event' : 'Create Event' }}</h1>
    <FormField name="name" type="text" label="Name" />
    <FormField name="category" type="text" label="Category" />
    <FormFile name="image" label="Upload image" />
    <FormAdress name="marker" label="Address" ref="markerField" />
    <FormField name="startDate" type="datetime-local" label="Start date" />
    <FormField
      name="endDate"
      type="datetime-local"
      :label="`End date${eventId ? '' : ' (optional)'}`"
    />
    <FormField
      name="maxParticipantsNumber"
      type="number"
      :label="`Max Participants${eventId ? '' : ' (optional)'}`"
    />
    <FormField name="description" type="textarea" label="Description" />
    <div class="button-section">
      <Button @click="handleSubmit" filled v-if="!isSpinnerVisible">{{
        eventId ? 'Save' : 'Create'
      }}</Button>
      <Spinner static v-else />
      <div class="error">{{ error }}</div>
    </div>
  </div>
  <Modal :visible="isModalVisibile">
    <template v-slot:header> Choose your advertisement option </template>
    <template v-slot:body>
      <AdvertisementCard
        v-for="plan in advertisementPlans"
        :option="plan.option"
        :title="plan.title"
        :description="plan.description"
        :price="plan.price"
        @selected="handleOptionSelect"
      />
    </template>
  </Modal>
</template>

<script setup>
import AdvertisementCard from './AdvertisementCard.vue'
import FormField from '@/components/FormField.vue'
import FormAdress from '@/components/FormAdress.vue'
import FormFile from '@/components/FormFile.vue'
import Button from '@/components/Button.vue'
import Spinner from '@/components/Spinner.vue'
import Modal from '@/components/Modal.vue'
import uploadImage from '@/helpers/uploadImage'
import postData from '@/helpers/postData'
import putData from '@/helpers/putData'
import toTimeDate from '@/helpers/toTimeDate'
import getData from '@/helpers/getData'
import createFileFromUrl from '@/helpers/createFileFromUrl'
import { useEventsStore } from '@/stores/useEventsStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
  eventId: Number,
  name: String,
  category: String,
  imageUrl: String,
  marker: Array,
  startDate: Number,
  endDate: Number,
  maxParticipantsNumber: Number,
  description: String
})

const router = useRouter()
const isSpinnerVisible = ref(false)
const markerField = ref(null)
const error = ref('')
const eventObj = ref({})
const isModalVisibile = ref(false)
const advertisementPlans = ref([
  {
    option: 'free',
    title: 'Free Plan',
    description:
      'Get started with our free plan and enjoy basic advertisement features without any cost. Perfect for individuals or small businesses looking to dip their toes into advertising.',
    price: 'Free'
  },
  {
    option: 'standard',
    title: 'Standard Plan',
    description:
      'Upgrade to our standard plan for enhanced advertisement features tailored to meet the needs of growing businesses. Unlock more reach and engagement with our affordable monthly subscription.',
    price: '$15/month'
  },
  {
    option: 'premium',
    title: 'Premium Plan',
    description:
      'Elevate your advertising game with our premium plan, designed for businesses seeking maximum exposure and impact. Unlock premium features and priority support to stay ahead of the competition.',
    price: '$25/month'
  }
])

let imgFile

const schema = props.eventId
  ? yup.object({
      name: yup.string(),
      category: yup.string(),
      marker: yup.array(),
      startDate: yup
        .date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('please enter a valid end date'),
      endDate: yup
        .date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('please enter a valid end date'),
      maxParticipantsNumber: yup
        .number()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('please enter a valid participants number'),
      description: yup.string()
    })
  : yup.object({
      name: yup.string().required('please enter event name'),
      category: yup.string().required('please enter event category'),
      marker: yup.array().required('please choose a direct address'),
      startDate: yup
        .date()
        .typeError('please enter a valid start date')
        .required('please enter start date'),
      endDate: yup
        .date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('please enter a valid end date'),
      maxParticipantsNumber: yup
        .number()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('please enter a valid participants number'),
      description: yup.string().required('please provide a description')
    })

const { addToStandardEvents, addToPremiumEvents } = useEventsStore()
const { values, setFieldError, validate, setFieldValue } = useForm({
  validationSchema: schema
})

if (props.eventId) {
  setDefaultValues()
}

async function setDefaultValues() {
  isSpinnerVisible.value = true

  imgFile = await createFileFromUrl(props.imageUrl)

  const addressData = await getData(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${props.marker[0]}&lon=${
      props.marker[1]
    }&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
  )

  markerField.value.address = addressData.results[0].formatted

  setFieldValue('name', props.name)
  setFieldValue('category', props.category)
  setFieldValue('image', imgFile)
  setFieldValue('marker', props.marker)
  setFieldValue('maxParticipantsNumber', props.maxParticipantsNumber)
  setFieldValue('description', props.description)
  setFieldValue('startDate', new Date(props.startDate).toISOString().split('.')[0])
  setFieldValue(
    'endDate',
    props.endDate ? new Date(props.endDate).toISOString().split('.')[0] : undefined
  )

  isSpinnerVisible.value = false
}

function handleOptionSelect(option) {
  switch (option) {
    case 'standard':
      addToStandardEvents(eventObj.value)
      break
    case 'premium':
      addToPremiumEvents(eventObj.value)
      break
  }

  router.push({ name: 'event', query: { id: eventObj.value.id } })
}

async function handleSubmit() {
  isSpinnerVisible.value = true
  error.value = ''
  let imageUrl

  const validation = await validate()

  if (!values.image) {
    setFieldError('image', 'please upload an image')

    isSpinnerVisible.value = false

    return
  }

  if (!validation.valid) {
    isSpinnerVisible.value = false

    return
  }

  if (!imgFile || imgFile !== values.image) {
    imageUrl = await uploadImage(values.image)
  } else {
    imageUrl = props.imageUrl
  }

  if (!imageUrl) {
    setFieldError('image', 'error while uploading the image')

    isSpinnerVisible.value = false

    return
  }

  const data = (({ image, startDate, endDate, ...rest }) => {
    return {
      ...rest,
      startDate: toTimeDate(startDate),
      endDate: endDate ? toTimeDate(endDate) : undefined,
      imageUrl
    }
  })(values)

  if (props.eventId) {
    const response = await putData(`${import.meta.env.VITE_API_URL}/events`, {
      ...data,
      id: props.eventId
    })

    if (response.success) {
      isModalVisibile.value = true

      eventObj.value = { ...data, id: props.eventId }
    } else {
      error.value = response.data.error
    }
  } else {
    const response = await postData(`${import.meta.env.VITE_API_URL}/events`, data)

    if (response.success) {
      isModalVisibile.value = true

      eventObj.value = { ...data, id: response.data.eventId }
    } else {
      error.value = response.data.error
    }
  }
  isSpinnerVisible.value = false
}
</script>

<style lang="scss" scoped>
.create-event-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 200;
  background-color: rgba(0, 0, 0, 0.5);
  .title {
    font-weight: 200;
  }
  .button-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .error {
      margin-top: 5px;
      height: 18px;
      font-weight: 400;
      font-size: 10px;
      color: $color-danger;
    }
  }
}

@include media-xs {
  .create-event-form {
    .button-section {
      .error {
        height: 21px;
        font-size: 14px;
      }
    }
  }
}

:deep(.modal) {
  margin: 0 20px;
  .modal-header {
    font-size: 40px;
    display: block;
    text-align: center;
  }

  .modal-body {
    display: grid;
    grid-template-columns: 1fr;
    max-height: 70vh;

    @include media-md {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
