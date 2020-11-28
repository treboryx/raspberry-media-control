<template>
  <div
    class="h-screen mx-auto overflow-hidden shadow-lg bg-gray-900 p-2 text-white font-semibold flex flex-col"
  >
    <v-slider v-touch:end="updateVol" class="mt-8 mx-6 mb-4" v-model="volume" />
    <div class="flex justify-center m-4">
      <button
        @click="muteF()"
        :class="[mute ? 'bg-red-600' : 'bg-green-600']"
        class="p-2 rounded-lg p-4"
      >
        {{ mute ? "🔇" : "🔊" }}
      </button>
    </div>
    <div class="flex justify-center mt-4">
      Status: Volume level is {{ volume }}% and
      <span v-if="mute" class="ml-1 text-red-500">muted</span>
      <span v-else class="ml-1 text-green-500">unmuted</span>
    </div>
    <div class="flex justify-center mt-4">
      ⬇️⬇️Bluetooth only (Working: Spotify, Youtube, Windows Media Player)⬇️⬇️
    </div>
    <div class="flex justify-center items-center">
      <button @click="cmd('Previous')" class="m-2 bg-blue-600 p-4 rounded-lg">
        ⏮
      </button>
      <button
        @click="cmd('Pause')"
        :class="[pause ? 'bg-red-600' : 'bg-green-600']"
        class="m-8 p-4 rounded-lg"
      >
        {{ pause ? "⏸" : "▶" }}
      </button>
      <button @click="cmd('Next')" class="m-2 bg-blue-600 p-4 rounded-lg">
        ⏭
      </button>
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
      mute: false,
      pause: false
    };
  },
  async created() {
    await getStats();
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
    async cmd(cmd) {
      if (cmd === "Pause") this.pause = !this.pause;
      await axios.post(`http://192.168.1.254:4000/cmd/${cmd}`);
    },
    async getStats() {
      const d = await axios.get("http://192.168.1.254:4000/stats");
      this.volume = d.data.data.volume;
      this.mute = d.data.data.mute;
      this.pause = d.data.data.pause;
    }
  }
};
</script>

<style></style>
