<template>
  <div class="aside">
    <div class="aside__container">
      <div class="aside__menu">
        <ul class="aside__menu-items">
          <li class="aside__menu-item">
            <font-awesome-icon icon="fa-solid fa-map-location-dot" />
          </li>
        </ul>
        <div class="aside__menu-logout" @click="logout">
          <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
        </div>
      </div>
      <div class="aside__section">
        <article class="aside__logo mx-5 mt-5">
          <img :src="logo" class="aside__logo-img" />
        </article>
        <article class="panel m-5 is-info">
          <p class="panel-heading">Route Planner</p>
          <div class="panel-block p-5">
            <b-field :label="label" class="control is-fullwidth">
              <b-autocomplete
                v-model="search"
                rounded
                :clear-on-select="true"
                :data="filterSuggestions"
                placeholder="Choose location"
                icon="magnify"
                clearable
                selected="option"
                :disabled="isLocationsSorted"
                @select="addMarker"
                @input="autoSuggest"
              >
                <template #empty>No results found</template>
              </b-autocomplete>
            </b-field>
          </div>
        </article>
        <article
          v-if="hasDirections"
          :class="`aside__directions-summary panel mx-5 ${trafficCondition}`"
        >
          <p class="panel-heading">{{ getSummaryTraffic }}</p>
        </article>
        <article
          v-if="isRoute"
          :class="`aside__directions-panel panel mx-5 ${isLocationsSorted ? 'is-sorted' : ''}`"
        >
          <p v-if="isLocationsSorted" class="panel-block" @click="zoomToLocation('start')">
            <font-awesome-icon icon="fa-solid fa-location-dot" class="fa-lg" />
            <span class="aside__directions-title">{{ startLocation.label }}</span>
            <font-awesome-icon icon="fa-solid fa-chevron-right" />
          </p>
          <p
            v-for="(location, index) in locations"
            :key="`${location.lat + index}`"
            class="panel-block"
            @click="zoomToLocation(index)"
          >
            <font-awesome-icon
              v-if="!isLocationsSorted && index === 0 && location.index === undefined"
              icon="fa-solid fa-location-dot"
              class="fa-lg"
            />
            <span v-else class="location__marker">{{
              isLocationsSorted ? mapMarkerLetters[index] : mapMarkerLetters[index - 1]
            }}</span>
            <span class="aside__directions-title">{{ location.label }}</span>
            <font-awesome-icon icon="fa-solid fa-chevron-right" />
          </p>
        </article>
        <p v-if="hasDirections" class="mx-5 pt-0 mb-5 is-size-7">
          *Locations are ordered by best route (and not by order of entry).
        </p>
        <article v-if="hasDirections" class="aside__directions-panel-card m-5">
          <div
            v-for="(direction, index) in directions"
            :key="direction.instruction"
            class="aside__directions-card card my-5"
          >
            <p class="card-header-title">
              <font-awesome-icon v-if="index === 0" icon="fa-solid fa-location-dot" class="fa-lg" />
              <span v-else class="location__marker">{{ mapMarkerLetters[index - 1] }}</span>
              {{ getLocations()[index] }}

              <span class="card-header-icon">
                {{ getSummaryTime(direction.summary.text) }}
              </span>
            </p>
            <ol class="aside__directions card-content">
              <li
                v-for="maneuver in direction.maneuver"
                :key="maneuver.id"
                class="content aside__directions-item"
              >
                {{ sanitizeHtml(maneuver.instruction) }}
              </li>
            </ol>
          </div>
        </article>
        <p v-if="hasDirections" class="mx-5 pt-0 mb-5 is-size-7">
          * Google map directions may be different than directions we're showing
        </p>
        <nav class="aside__menu-buttons py-5">
          <div class="buttons px-5">
            <b-button
              :class="`${actionLabel !== 'Navigate' ? 'is-invisible' : null}`"
              type="is-danger is-rounded"
              @click="resetRoute()"
            >
              <font-awesome-icon :icon="`fa-solid fa-trash`" />
              Rest</b-button
            >
            <b-button
              type="is-info is-rounded"
              :disabled="locations && locations.length <= 1"
              @click="optimizeRoute()"
            >
              <font-awesome-icon :icon="`fa-solid ${actionIcon}`" />
              {{ actionLabel }}</b-button
            >
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { autosuggest } from '@/api/geocodingSearch';
import { EventBus } from '@/util/event-bus';
import { signOut } from '@/util/cognito';
import Logo from '@/assets/logo.png';

export default {
  name: 'AsideComponent',
  data() {
    return {
      logo: Logo,
      label: 'Starting Location',
      isDirections: false,
      actionType: null,
      actionLabel: 'Find Route',
      actionIcon: 'fa-route',
      mapUrl: null,
      locationAddress: [],
    };
  },
  computed: {
    ...mapState({
      apiKey: state => state.map.apiKey,
      center: state => state.map.center,
      mapMarkerLetters: state => state.map.mapMarkerLetters,
      suggestions: state => state.map.suggestions,
    }),
    ...mapGetters({
      suggestions: 'map/suggestions',
      searchString: 'map/searchString',
      locations: 'map/locations',
      sequence: 'map/sequence',
      directions: 'map/directions',
      tripSummary: 'map/tripSummary',
    }),
    trafficCondition() {
      const travelTime = this.tripSummary.travelTime;
      const baseTime = this.tripSummary.baseTime;
      const traffic = travelTime - baseTime;
      let isCondition = 'is-success';
      if (traffic >= 750) {
        isCondition = 'is-danger';
      } else if (traffic >= 500) {
        isCondition = 'is-warning';
      }
      return isCondition;
    },
    getSummaryTraffic() {
      const trafficCondition = this.trafficCondition;
      let text = this.tripSummary.text;
      let condition;
      if (text.lastIndexOf('.') === text.length - 1) {
        text = text.substring(0, text.length - 1);
      }
      switch (trafficCondition) {
        case 'is-danger':
          condition = 'heavy';
          break;
        case 'is-warning':
          condition = 'medium';
          break;
        default:
          condition = 'light';
          break;
      }
      return this.sanitizeHtml(`${text} with ${condition} traffic.`);
    },
    hasDirections() {
      return this.directions && this.directions.length > 0;
    },
    isRoute() {
      return this.locations && this.locations.length > 0;
    },
    search: {
      get() {
        return this.searchString;
      },
      set(newValue) {
        return newValue;
      },
    },
    filterSuggestions() {
      const address = [];
      this.suggestions.filter(suggestion => {
        address.push(suggestion.address.label);
      });
      return address;
    },
    isLocationsSorted() {
      return this.locations && this.locations.length > 0 && this.locations[0].index !== undefined;
    },
    startLocation() {
      const [start] = this.locations.filter(location => location.index === 1) || [];
      return start;
    },
  },
  methods: {
    ...mapActions({
      updatePopupBlockerStatus: 'app/updatePopupBlockerStatus',
      updateSuggestions: 'map/updateSuggestions',
      replaceSuggestions: 'map/replaceSuggestions',
      updateSearchString: 'map/updateSearchString',
      updateMapUrl: 'map/updateMapUrl',
    }),
    sanitizeHtml(markup) {
      return markup.replace(/(<([^>]+)>)/gi, '');
    },
    getSummaryTime(summary) {
      const html = /<span class="time">(.*?)<\/span>/;
      return summary.match(html)[1];
    },
    autoSuggest(string) {
      if (string && string?.length > 0 && string !== undefined) {
        this.updateSearchString(string);
      }
      if (string && string?.length === 0) {
        this.updateSearchString(null);
        this.replaceSuggestions([]);
      }
      if (
        this.searchString &&
        this.searchString !== '' &&
        this.searchString !== undefined &&
        this.searchString.length > 0
      ) {
        this.replaceSuggestions([]);
        autosuggest({
          apiKey: this.apiKey,
          lat: this.center.lat,
          lng: this.center.lng,
          search: this.searchString,
        }).then(response => {
          const { data } = response || {};
          if (data?.items.length > 0) {
            data.items.map(item => {
              if ((item.position !== undefined) & (item.position !== '')) {
                this.updateSuggestions(item);
              }
            });
          }
        });
      }
    },
    async addMarker(option) {
      const [selection] =
        this.suggestions.filter(location => location.address.label === option) || [];
      if (selection && selection.title) {
        EventBus.$emit('addMarker', selection.title);
      }
      this.label = 'Additional Location';
    },
    getLocations() {
      const destinations = [];
      if (this.sequence && this.sequence.length > 0) {
        for (let i = 0; i < this.sequence.length; i++) {
          if (this.sequence[i].id !== 'destination1') {
            const [location] = this.locations.filter(
              item => item.lat === this.sequence[i].lat && item.lng === this.sequence[i].lng
            );
            destinations.push(location.title);
          }
        }
      }
      return destinations;
    },
    async findNavigate() {
      const { lat, lng } = this.center;
      const markers = [];
      for (let i = 0; i < this.sequence.length; i++) {
        if (this.sequence[i].id !== 'destination1') {
          markers.push(`${this.sequence[i].lat},${this.sequence[i].lng}`);
        }
      }
      if (this.mapUrl) {
        this.openWindow(this.mapUrl);
      } else {
        this.mapUrl = `https://www.google.com/maps/dir/${lat},${lng}/${markers.join(
          '/'
        )}/data=!4m2!4m1!3e0`;
        this.openWindow(this.mapUrl);
      }
    },
    async optimizeRoute() {
      if (this.actionLabel !== 'Navigate') {
        EventBus.$emit('findRoute', {});
        this.isDirections = true;
        this.actionIcon = 'fa-location-arrow';
        this.actionLabel = 'Navigate';
      } else {
        this.findNavigate();
      }
    },
    resetRoute() {
      window.location.reload(true);
    },
    openWindow() {
      const newWin = window.open(this.mapUrl);
      if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
        this.updatePopupBlockerStatus(true);
      }
      window.open(this.mapUrl);
    },
    handleMenuSelection(type) {
      switch (type) {
        case 'destinations':
          this.isDirections = false;
          break;
        case 'directions':
          this.isDirections = true;
          break;
        default:
          break;
      }
    },
    zoomToLocation(location) {
      let index = location;
      if (location === 'start') {
        index = this.locations.length - 1;
      }
      EventBus.$emit('zoomTo', index);
    },
    async logout() {
      signOut();
      this.$router.push({ name: 'login' });
    },
  },
};
</script>
<style lang="scss" scoped>
.aside {
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 20%);
  float: left;
  height: 100%;
  overflow: scroll;
  position: relative;
  width: 40%;
}

.aside__container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.aside__logo {
  display: flex;
  flex-direction: row;
  justify-content: center;

  .aside__logo-img {
    width: 200px;
  }
}

.aside__menu {
  align-items: center;
  background: $menu;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 40px;
  z-index: 3;
  @include tablet {
    width: 50px;
  }
}

.aside__menu-items {
  display: block;
  width: 100%;
}

.aside__menu-logout {
  bottom: 0;
  position: absolute;
  width: 50px;
}

.aside__menu-item,
.aside__menu-logout {
  align-items: center;
  color: $white;
  cursor: pointer;
  display: flex;
  font-size: 23px;
  height: 70px;
  justify-content: center;

  &:hover {
    background: $menu-item;
  }
}

.aside__section {
  flex: 1;
  overflow-y: scroll;
  padding-bottom: 88px;

  .svg-inline--fa {
    margin-right: 12px;
  }
}

.aside__directions-panel {
  margin-bottom: 0.5rem !important;
  margin-top: 0 !important;

  .panel-block {
    cursor: pointer;
  }

  &.is-sorted {
    .panel-block:last-child {
      display: none;
    }
  }
}

.aside__directions-title {
  flex: 1;
}

.aside__directions-summary {
  margin-bottom: 0 !important;
}

.aside__directions {
  margin-left: 20px;
  padding: 0 1rem 1rem;
}

.aside__menu-buttons {
  background: $white;
  bottom: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 20%);
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 2;

  .buttons {
    justify-content: space-between;
    .button:first-child {
      margin-left: 50px;
    }
  }
}

.aside__directions-panel-card {
  .aside__directions-card {
    .card-header-title {
      justify-content: space-between;
    }
    .card-header-icon {
      white-space: nowrap;
    }
  }

  .card:last-child {
    display: none;
  }
}

.location__marker {
  align-items: center;
  border: 2px solid #7a7a7a;
  border-radius: 50%;
  display: flex;
  font-size: 12px;
  font-weight: 900;
  height: 24px;
  justify-content: center;
  margin-right: 8px;
  max-width: 24px;
  min-width: 24px;
}
</style>
