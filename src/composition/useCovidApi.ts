import { ref } from 'vue';

export const BASE_URL = 'https://covid19.mathdro.id/api';

declare const RefSymbol: unique symbol;
export interface Ref<T = any> {
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true;
  value: T;
}

export interface CovidData {
  confirmed: Ref<number>;
  recovered: Ref<number>;
  deaths: Ref<number>;
  lastUpdate: string;
  error?: string;
}
export interface CovidCountry {
  name: string;
  iso2: string;
  iso3: string;
}
export interface CovidCountries {
  [countries: string]: Array<CovidCountry>;
}
export interface CovidOptions {
  endpoint: string;
  params?: object;
  handleData?: (data: CovidData | CovidCountry[] | any) => void;
}

const getCovidResponse = async ({ endpoint, params }: CovidOptions) => {
  const response = await fetch(endpoint, params);
  return response.json();
};

export const useCovidApi = ({ endpoint, params, handleData }: CovidOptions) => {
  const isLoading = ref(true);
  const error = ref(null);

  getCovidResponse({ endpoint, params })
    .catch((error) => {
      error.value = error;
    })
    .then((data) => {
      if (handleData) {
        handleData(data);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });

  return { isLoading, error };
};
