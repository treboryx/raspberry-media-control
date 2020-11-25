<template>
  <div
    class="max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-900 m-2 p-2 mt-2 text-white font-semibold"
  >
    <v-slider v-touch:end="updateVol" class="mt-8 mx-6 mb-4" v-model="volume" />
    <button
      @click="muteF()"
      :class="[mute ? 'bg-red-600' : 'bg-green-600']"
      class="bg-red-600 p-2 rounded-lg"
    >
      {{ mute ? "🔇" : "🔊" }}
    </button>
    Status: Volume level is {{ volume }} and
    {{ mute ? "muted" : "not muted" }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      volume: 0,
      mute: false
    };
  },
  async created() {
    const vol = await axios.get("http://192.168.1.254:4000/volume");
    this.volume = vol.data.volume;
  },
  methods: {
    muteF() {
      this.mute = !this.mute;
      axios.post(`http://192.168.1.254:4000/mute/${this.mute}`);
    },
    updateVol(vol) {
      vol = this.volume;
      axios.post(`http://192.168.1.254:4000/volume/${vol}`);
    }
  }
};
</script>

<style></style>
