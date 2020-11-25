const util = require("util");
const exec = util.promisify(require("child_process").exec);

const setVolume = async (value) => {
  await exec(
    `pactl set-sink-volume alsa_output.platform-soc_audio.analog-mono ${value}%`
  );
};
const setMute = async (value) => {
  await exec(
    `pactl set-sink-mute alsa_output.platform-soc_audio.analog-mono ${value}`
  );
};

const getVolume = async () => {
  try {
    const { stdout, stderr } = await exec("amixer get Master");
    if (stdout.length) {
      let n = stdout.split("[");
      n = n[1].split("%");
      return Number(n[0]);
    } else if (stderr.length) {
      return 3;
    }
  } catch (e) {
    console.log(e);
    return 3;
  }
};

module.exports = { setVolume, setMute, getVolume };
