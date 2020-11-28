<template>
  <div
    class="h-screen mx-auto overflow-hidden shadow-lg bg-gray-900 p-2 text-white font-semibold flex flex-col"
  >
    <v-slider v-touch:end="updateVol" class="mt-8 mx-6 mb-4" v-model="volume" />
    <div class="flex justify-center m-4">
      <button
        @click="muteF()"
        :class="[mute ? 'bg-red-600' : 'bg-green-600']"
        class="bg-red-600 p-2 rounded-lg p-4"
      >
        {{ mute ? "🔇" : "🔊" }}
      </button>
    </div>
    <div class="flex justify-center mt-4">
      Status: Volume level is {{ volume }}% and
      <span v-if="mute" class="ml-1 text-red-500">muted</span>
      <span v-else class="ml-1 text-green-500">unmuted</span>
    </div>
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
    this.getMute();
    this.getVolume();
  },
  methods: {
    muteF() {
      this.mute = !this.mute;
      axios.post(`http://192.168.1.254:4000/mute/${this.mute}`);
    },
    updateVol(vol) {
      vol = this.volume;
      axios.post(`http://192.168.1.254:4000/volume/${vol}`);
    },
    async getMute() {
      const f = await axios.get("http://192.168.1.254:4000/mute");
      this.mute = f.data.mute;
    },
    async getVolume() {
      const vol = await axios.get("http://192.168.1.254:4000/volume");
      this.volume = vol.data.volume;
    }
  }
};
</script>

<style></style>
