import SearchService from "@/services/search-service";
import { LycheeStateStore } from "@/stores/LycheeState";
import { trans } from "laravel-vue-i18n";
import { computed, ref, Ref } from "vue";

export function useSearch(albumid: Ref<string>, lycheeStore: LycheeStateStore, search_term: Ref<string>, search_page: Ref<number>) {
	const albums = ref<App.Http.Resources.Models.ThumbAlbumResource[]>([]);
	const photos = ref<App.Http.Resources.Models.PhotoResource[]>([]);
	const noData = computed<boolean>(() => albums.value.length === 0 && photos.value.length === 0);
	const searchMinimumLengh = ref(undefined as number | undefined);
	const isSearching = ref(false);
	const from = ref(0);
	const per_page = ref(0);
	const total = ref(0);

	const photoHeader = computed(() => {
		return trans("lychee.PHOTOS") + " (" + total.value + ")";
	});

	const albumHeader = computed(() => {
		return trans("lychee.ALBUMS") + " (" + albums.value.length + ")";
	});

	function searchInit() {
		SearchService.init(albumid.value).then((response) => {
			searchMinimumLengh.value = response.data.search_minimum_length;
		});
	}

	function search(terms: string) {
		if (terms.length < 3) {
			albums.value = [];
			photos.value = [];
			return;
		}
		lycheeStore.search_album_id = albumid.value;
		search_term.value = terms;
		isSearching.value = true;
		SearchService.search(albumid.value, search_term.value, search_page.value).then((response) => {
			albums.value = response.data.albums;
			photos.value = response.data.photos;
			from.value = response.data.from;
			per_page.value = response.data.per_page;
			total.value = response.data.total;
			isSearching.value = false;
		});
	}

	function refresh() {
		isSearching.value = true;
		search_page.value = Math.ceil(from.value / per_page.value) + 1;
		SearchService.search(albumid.value, search_term.value, search_page.value).then((response) => {
			albums.value = response.data.albums;
			photos.value = response.data.photos;
			from.value = response.data.from;
			per_page.value = response.data.per_page;
			total.value = response.data.total;
			isSearching.value = false;
		});
	}

	function clear() {
		albums.value = [];
		photos.value = [];
		from.value = 0;
		per_page.value = 0;
		total.value = 0;
	}

	return {
		albums,
		photos,
		noData,
		searchMinimumLengh,
		isSearching,
		from,
		per_page,
		total,
		photoHeader,
		albumHeader,
		searchInit,
		search,
		clear,
		refresh,
	};
}