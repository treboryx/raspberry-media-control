const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { device } = require("../config");
let paused = false;

const setVolume = async (value) => {
  const sink = await getSink();
  await exec(`pactl set-sink-volume ${sink} ${value}%`);
};
const setMute = async (value) => {
  const sink = await getSink();
  await exec(`pactl set-sink-mute ${sink} ${value}`);
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

const getSink = async () => {
  const { stdout, stderr } = await exec("pactl info");
  let n = stdout.split("Default Sink: ");

  n = n[1].split("Default Source:");
  n = n[0].trim();
  return n;
};

const getMute = async () => {
  const sink = await getSink();
  const { stdout, stderr } = await exec("pactl list");
  let n = stdout.split(sink);
  n = n[1].split("Mute: ");
  n = n[1].split("Volume: ");
  n = n[0].trim();
  return n === "no" ? false : true;
};

const cmd = async (cmd) => {
  console.log(cmd);
  if (cmd === "Pause") paused = true;
  if (cmd === "Play") paused = false;
  const { stdout, stderr } = await exec(
    `dbus-send --system --print-reply --dest=org.bluez /org/bluez/hci0/${device}/player0 org.bluez.MediaPlayer1.${cmd}`
  );
};

module.exports = { setVolume, setMute, getVolume, getMute, paused, cmd };
