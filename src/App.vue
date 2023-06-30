<script lang="ts">
import { defineComponent } from "vue";
import { ISeletedTicker, ITickers } from "./interfaces";

import VContainer from "./components/ui/VContainer.vue";
import VPagePreloader from "./components/ui/VPagePreloader.vue";
import AddIcon from "./imgs/icons/AddIcon.vue";
import CloseIcon from "./imgs/icons/CloseIcon.vue";
import DeleteIcon from "./imgs/icons/DeleteIcon.vue";

import { lockPageScroll } from "./utils";

export default defineComponent({
  name: "App",
  data() {
    return {
      formAddTickerInputTickerName: "",
      formAddTickerErrors: [] as string[],
      tickers: [] as ITickers,
      selectedTicker: null as ISeletedTicker,
      isCoinListLoading: false,
      coinList: [] as string[],
    };
  },
  mounted() {
    lockPageScroll(true);

    setTimeout(() => {
      this.isCoinListLoading = true;
      lockPageScroll(false);
    }, 3000);
  },
  components: {
    AddIcon,
    DeleteIcon,
    CloseIcon,
    VContainer,
    VPagePreloader,
  },
});
</script>

<template>
  <main class="flex-auto pb-32 pt-10">
    <VPagePreloader v-if="isCoinListLoading === false" />
    <section>
      <VContainer>
        <div>
          <form>
            <fieldset class="w-full max-w-none sm:w-auto sm:max-w-xs">
              <legend class="block text-sm text-gray-700">
                <label for="wallet">Тикер</label>
              </legend>
              <div class="relative mt-1 rounded-md shadow-md">
                <input
                  v-model="formAddTickerInputTickerName"
                  type="text"
                  name="wallet"
                  id="wallet"
                  class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Например DOGE"
                />
              </div>
              <ul
                v-if="coinList.length !== 0"
                class="flex flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2 shadow-md"
              >
                <li v-for="coin in coinList" :key="coin" class="flex">
                  <button
                    type="button"
                    class="inline-block min-h-[18px] cursor-pointer rounded-md bg-gray-300 px-2 text-xs font-bold uppercase text-gray-800"
                  >
                    {{ coin }}
                  </button>
                </li>
              </ul>
              <div
                v-if="formAddTickerErrors.length !== 0"
                class="mt-1 flex flex-col gap-y-1 text-sm text-red-600"
              >
                <span
                  v-for="error in formAddTickerErrors"
                  :key="error.trim()"
                  >{{ error }}</span
                >
              </div>
            </fieldset>
            <button
              type="submit"
              class="mt-2 inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-bold leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <AddIcon />
              <span>Добавить</span>
            </button>
          </form>
        </div>
      </VContainer>
    </section>
    <section v-if="tickers.length !== 0">
      <VContainer>
        <div>
          <hr class="my-8 w-full border-t border-gray-600" />
          <div
            class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
          >
            <article
              v-for="ticker in tickers"
              :key="ticker.name"
              :aria-label="`Открыть ${ticker.name} график`"
              tabindex="0"
              class="cursor-pointer drop-shadow transition-all duration-150 ease-in-out active:drop-shadow-md md:hover:drop-shadow-md"
            >
              <div
                class="flex flex-col items-center rounded-t-lg border-b border-b-gray-200 bg-white px-4 py-5 text-center sm:p-6"
              >
                <span
                  class="truncate text-sm font-bold uppercase text-gray-500"
                >
                  {{ ticker.name }} - USD
                </span>
                <span class="mt-1 text-3xl font-bold text-gray-900">{{
                  ticker.price === 0 ? "-" : ticker.price
                }}</span>
              </div>
              <button
                class="text-md flex w-full items-center justify-center gap-x-1 rounded-b-lg bg-gray-100 px-4 py-4 font-bold text-gray-500 transition-all active:bg-gray-200 active:text-gray-600 sm:px-6 md:hover:bg-gray-200 md:hover:text-gray-600"
              >
                <DeleteIcon />
                <span>Удалить</span>
              </button>
            </article>
          </div>
        </div>
      </VContainer>
    </section>
    <section v-if="selectedTicker !== null">
      <VContainer>
        <div class="relative">
          <hr class="my-8 w-full border-t border-gray-600" />
          <h3 class="my-8 text-lg font-bold leading-6 text-gray-900">
            {{ selectedTicker.name }} - USD
          </h3>
          <div class="flex h-64 items-end border-b border-l border-gray-600">
            <div class="h-24 w-10 border bg-purple-800"></div>
            <div class="h-32 w-10 border bg-purple-800"></div>
            <div class="h-48 w-10 border bg-purple-800"></div>
            <div class="h-16 w-10 border bg-purple-800"></div>
          </div>
          <button
            :aria-label="`Закрыть ${selectedTicker.name} график`"
            type="button"
            class="absolute right-0 top-8 text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>
      </VContainer>
    </section>
  </main>
</template>
