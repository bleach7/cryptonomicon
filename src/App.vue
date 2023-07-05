<script lang="ts">
import { defineComponent } from "vue";
import type {
  ISeletedTicker,
  ITicker,
  ITickers,
  TIntervalID,
} from "./interfaces";

import AddIcon from "./assets/imgs/icons/AddIcon.vue";
import CloseIcon from "./assets/imgs/icons/CloseIcon.vue";
import DeleteIcon from "./assets/imgs/icons/DeleteIcon.vue";
import VContainer from "./components/ui/VContainer.vue";
import VDivider from "./components/ui/VDivider.vue";
import VPagePreloader from "./components/ui/VPagePreloader.vue";

import { getCoinList, getTickerPrice } from "./api";
import {
  deleteTickerFromLocalStorage,
  getTickersFromLocalStorage,
  lockPageScroll,
  setTickersToLocalStorage,
} from "./utils";

export default defineComponent({
  name: "App",
  data() {
    return {
      formAddTickerInputTickerName: "",
      formAddTickerIsError: false,
      tickers: [] as ITickers,
      selectedTicker: null as ISeletedTicker,
      isCoinListLoading: false,
      coinList: [] as string[],
      selectedTickerGraph: [] as number[],
      currentPage: 1,
      searchQuery: "",
      pageSize: 6,
    };
  },
  async mounted() {
    try {
      lockPageScroll(true);
      const coinListData = await getCoinList();

      if (Array.isArray(coinListData)) {
        this.coinList = coinListData;
        this.isCoinListLoading = true;
        lockPageScroll(false);
      }
    } catch (error) {
      console.log(error);
    }
  },
  components: {
    AddIcon,
    DeleteIcon,
    CloseIcon,
    VContainer,
    VPagePreloader,
    VDivider,
  },
  methods: {
    handleAddTicker() {
      const newTickerName = this.formAddTickerInputTickerName
        .toLowerCase()
        .trim();

      const existingTicker = this.tickers.find(
        (ticker) => ticker.name === newTickerName
      );

      if (existingTicker) {
        this.formAddTickerIsError = true;

        this.$nextTick(() => {
          const inputEl = document.getElementById("wallet");

          if (inputEl) {
            inputEl.focus();
          }
        });

        return;
      }

      const newTicker: ITicker = {
        name: newTickerName,
        price: 0,
      };

      const intervalId = this.handleTrackingTicker(newTickerName);

      if (intervalId) {
        newTicker.intervalId = intervalId;
      }

      this.tickers.push(newTicker);
      setTickersToLocalStorage(this.tickers);

      this.formAddTickerInputTickerName = "";
      this.searchQuery = "";

      if (this.formAddTickerIsError) {
        this.formAddTickerIsError = false;
      }
    },
    filteredTickers() {
      if (this.searchQuery === "") {
        return this.tickers;
      }

      return this.tickers.filter((ticker) =>
        ticker.name.includes(this.searchQuery.toLowerCase().trim())
      );
    },
    handleAddTickerUseCoinHint(coinName: string) {
      const newTickerName = coinName.toLowerCase().trim();

      const existingTicker = this.tickers.find(
        (ticker) => ticker.name === newTickerName
      );

      if (existingTicker) {
        this.formAddTickerIsError = true;

        this.$nextTick(() => {
          const inputEl = document.getElementById("wallet");

          if (inputEl) {
            inputEl.focus();
          }
        });

        return;
      }

      const newTicker: ITicker = {
        name: newTickerName,
        price: 0,
      };

      const intervalId = this.handleTrackingTicker(newTickerName);

      if (intervalId) {
        newTicker.intervalId = intervalId;
      }

      this.tickers.push(newTicker);

      setTickersToLocalStorage(this.tickers);

      this.formAddTickerInputTickerName = "";
      this.searchQuery = "";

      if (this.formAddTickerIsError) {
        this.formAddTickerIsError = false;
      }
    },
    handleDeleteTicker(tickerToRemove: ITicker) {
      this.tickers = this.tickers.filter((ticker) => {
        if (ticker.name === tickerToRemove.name) {
          deleteTickerFromLocalStorage(ticker);
          if (tickerToRemove.intervalId) {
            clearInterval(tickerToRemove.intervalId);
          }
          if (this.selectedTicker) {
            if (this.selectedTicker === tickerToRemove.name) {
              this.selectedTicker = null;
              this.selectedTickerGraph = [];
            }
          }
        } else {
          return ticker;
        }
      });
    },
    handleSelectTicker(tickerToSelect: ITicker) {
      this.selectedTickerGraph = [];
      this.selectedTicker = tickerToSelect.name;
    },
    handleCloseGraph() {
      this.selectedTicker = null;
      this.selectedTickerGraph = [];
    },
    handleTrackingTicker(tickerName: string): TIntervalID {
      const intervalId = setInterval(async () => {
        try {
          const price = await getTickerPrice(tickerName);

          if (price) {
            const formatPrice =
              price > 1 ? price.toFixed(2) : price.toPrecision(2);

            this.tickers = this.tickers.map((ticker) => {
              if (ticker.name === tickerName.toLowerCase()) {
                if (this.selectedTicker) {
                  if (this.selectedTicker === ticker.name) {
                    this.selectedTickerGraph.push(Number(price));
                  }
                }

                return {
                  ...ticker,
                  price: Number(formatPrice),
                };
              } else {
                return ticker;
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      }, 5000);

      return intervalId;
    },
    normalizeGraph(): number[] {
      const maxValue = Math.max(...this.selectedTickerGraph);
      const minValue = Math.min(...this.selectedTickerGraph);

      return this.selectedTickerGraph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    resetPage() {
      this.currentPage = 1;
    },
  },
  watch: {
    resetPage() {
      this.currentPage = 1;
    },
  },
  computed: {
    isEmptyFormAddTickerName() {
      return this.formAddTickerInputTickerName.trim().length === 0;
    },
    filteredCoinList() {
      if (this.formAddTickerInputTickerName === "") {
        return this.coinList;
      } else {
        return this.coinList.filter((coin) =>
          coin
            .toLowerCase()
            .includes(this.formAddTickerInputTickerName.toLowerCase())
        );
      }
    },
    totalPages(): number {
      return Math.ceil(this.filteredTickers().length / this.pageSize);
    },
    visibleTickers(): ITickers {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      return this.filteredTickers().slice(startIndex, endIndex);
    },
  },
  created() {
    const tickersFromLocalStorage = getTickersFromLocalStorage();

    if (tickersFromLocalStorage) {
      this.tickers = tickersFromLocalStorage;

      this.tickers.forEach((ticker) => {
        const intervalId = this.handleTrackingTicker(ticker.name);
        if (intervalId) {
          ticker.intervalId = intervalId;
        }
      });
    }
  },
});
</script>

<template>
  <main class="flex-auto pb-32 pt-10">
    <VPagePreloader v-if="isCoinListLoading === false" />
    <section>
      <VContainer>
        <div>
          <form @submit.prevent="handleAddTicker">
            <fieldset class="w-full max-w-none sm:w-auto sm:max-w-xs">
              <legend class="block text-sm text-gray-700">
                <label for="wallet">Тикер</label>
              </legend>
              <div class="relative mt-1 rounded-md shadow-md">
                <input
                  v-model="formAddTickerInputTickerName"
                  type="text"
                  id="wallet"
                  class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Например DOGE"
                />
              </div>
              <template v-if="!isEmptyFormAddTickerName">
                <ul
                  v-if="coinList.length !== 0"
                  class="flex flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2 shadow-md"
                >
                  <li
                    v-for="coin in filteredCoinList.slice(0, 4)"
                    :key="coin"
                    class="flex"
                  >
                    <button
                      @click="handleAddTickerUseCoinHint(coin)"
                      type="button"
                      class="inline-block min-h-[18px] cursor-pointer rounded-md bg-gray-300 px-2 text-xs font-bold uppercase text-gray-800 transition-colors duration-150 ease-in-out active:bg-gray-400 md:hover:bg-gray-400"
                    >
                      {{ coin }}
                    </button>
                  </li>
                </ul>
              </template>
              <div
                v-if="formAddTickerIsError === true"
                class="mt-1 flex flex-col gap-y-1 text-sm text-red-600"
              >
                <span>Такой тикер уже добавлен</span>
              </div>
            </fieldset>
            <button
              :disabled="isEmptyFormAddTickerName"
              type="submit"
              class="mt-3 inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-bold leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              <AddIcon />
              <span>Добавить</span>
            </button>
          </form>
        </div>
      </VContainer>
    </section>
    <section v-if="tickers.length !== 0" class="mt-[20px]">
      <VContainer>
        <div>
          <div class="max-w-xs">
            <div class="relative mt-1 rounded-md shadow-md">
              <input
                v-model="searchQuery"
                @input="resetPage"
                type="text"
                placeholder="Поиск..."
                class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>
          <section
            v-if="tickers.length >= 7"
            class="mt-3 flex items-center gap-x-[10px]"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              type="button"
              class="inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-bold leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              Назад
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              type="button"
              class="inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-bold leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              Вперёд
            </button>
          </section>
        </div>
      </VContainer>
    </section>
    <section v-if="tickers.length !== 0">
      <VContainer>
        <div>
          <VDivider />
          <div
            class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
          >
            <article
              v-for="tickerItem in visibleTickers"
              :key="tickerItem.name"
              :aria-label="`Открыть ${tickerItem.name} график`"
              :class="{
                ['outline outline-purple-800']:
                  tickerItem.name === selectedTicker,
              }"
              @click="handleSelectTicker(tickerItem)"
              tabindex="0"
              class="cursor-pointer drop-shadow transition-shadow duration-150 ease-in-out active:drop-shadow-md md:hover:drop-shadow-md"
            >
              <div
                class="flex flex-col items-center rounded-t-lg border-b border-b-gray-200 bg-white px-4 py-5 text-center sm:p-6"
              >
                <span
                  class="truncate text-sm font-bold uppercase text-gray-500"
                >
                  {{ tickerItem.name }} - USD
                </span>
                <span class="mt-1 text-3xl font-bold text-gray-900">{{
                  tickerItem.price === 0 ? "-" : tickerItem.price
                }}</span>
              </div>
              <button
                @click.stop="handleDeleteTicker(tickerItem)"
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
          <VDivider />
          <h3 class="my-8 text-lg font-bold uppercase leading-6 text-gray-900">
            {{ selectedTicker }} - USD
          </h3>
          <div class="flex h-64 items-end border-b border-l border-gray-600">
            <div
              v-for="(bar, idx) in normalizeGraph()"
              :key="idx"
              :style="{ height: `${bar}%` }"
              class="w-10 border bg-purple-800"
            ></div>
          </div>
          <button
            @click="handleCloseGraph"
            :aria-label="`Закрыть ${selectedTicker} график`"
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
