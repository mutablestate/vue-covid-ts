<script lang="ts">
/* eslint-disable no-unused-vars */
import { defineComponent, ref, computed, watchEffect } from 'vue';
import dayjs from 'dayjs';
import StatsGrid from './StatsGrid.vue';
import { useCovidApi, BASE_URL } from '../composition/useCovidApi';
import {
  Ref,
  CovidData,
  CovidCountry,
  CovidCountries
} from '../composition/useCovidApi';

export default defineComponent({
  name: 'CountryStats',
  components: {
    StatsGrid
  },
  setup() {
    const selectedCountry = ref('');
    const countries = ref<CovidCountry[]>([]);
    const confirmed = ref(0);
    const recovered = ref(0);
    const deaths = ref(0);
    const lastUpdate = ref('');
    const loading = ref(true);
    const dataError = ref('');

    const updatedAt = computed(() => {
      if (lastUpdate.value) {
        const date = dayjs(lastUpdate.value);
        return date.format('YYYY-MM-DD HH:mm:ss Z');
      }
    });

    const updateCountries = (data: CovidCountries) => {
      countries.value = data.countries;
    };
    useCovidApi({
      endpoint: `${BASE_URL}/countries`,
      handleData: updateCountries
    });

    const updateStats = (data: CovidData) => {
      if (data.error) {
        dataError.value = data.error;
      } else {
        dataError.value = '';
        confirmed.value = data.confirmed.value;
        recovered.value = data.recovered.value;
        deaths.value = data.deaths.value;
        lastUpdate.value = data.lastUpdate;
      }
    };
    watchEffect(() => {
      if (selectedCountry.value) {
        useCovidApi({
          endpoint: `${BASE_URL}/countries/${selectedCountry.value}`,
          handleData: updateStats
        });
      }
    });

    const handleSelectCountry = (event: any) => {
      selectedCountry.value = event.target.value;
    };

    return {
      dataError,
      countries,
      confirmed,
      recovered,
      deaths,
      updatedAt,
      selectedCountry,
      handleSelectCountry
    };
  }
});
</script>

<template>
  <div>
    <form class="w-full max-w-sm mt-10 mx-auto">
      <div class="w-full px-3 mb-6">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-state"
        >
          By Country
        </label>
        <div class="relative">
          <select
            id="grid-state"
            v-model="selectedCountry"
            class="select-options"
            @change="handleSelectCountry"
          >
            <option disabled value="">Please select one</option>
            <option
              v-for="country in countries"
              :key="country.iso2"
              :value="country.iso2"
              >{{ country.name }}</option
            >
          </select>
          <div class="caret">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </form>
    <section v-if="dataError">
      <p class="text-l text-red-500">{{ dataError.message || dataError }}</p>
    </section>
    <section v-if="updatedAt && !dataError">
      <p class="text-l">Last Updated</p>
      <p>{{ updatedAt }}</p>
      <StatsGrid
        :confirmed="confirmed"
        :deaths="deaths"
        :recovered="recovered"
        :tag="selectedCountry"
      />
    </section>
  </div>
</template>

<style lang="postcss">
.caret {
  @apply pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700;
}
.select-options {
  @apply block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700;
  @apply py-3 px-4 pr-8 rounded leading-tight;
}
.select-options:focus {
  @apply outline-none bg-white border-gray-500;
}
</style>
