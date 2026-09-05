"use strict";

const statusDot = document.getElementById("status-dot");
const statUptime = document.getElementById("stat-uptime");
const statInstr = document.getElementById("stat-instr");
const bootProgress = document.getElementById("boot-progress");
const bootFile = document.getElementById("boot-file");
const bootPct = document.getElementById("boot-pct");
const bootFill = document.getElementById("boot-fill");
const btnRestart = document.getElementById("btn-restart");
const btnPause = document.getElementById("btn-pause");
const btnStop = document.getElementById("btn-stop");

const emulator = new V86({
  wasm_path: "build/v86.wasm",
  memory_size: 128 * 1024 * 1024,
  vga_memory_size: 2 * 1024 * 1024,
  bios: { url: "bios/seabios.bin" },
  vga_bios: { url: "bios/vgabios.bin" },
  bzimage: { url: "images/buildroot-bzimage.bin", async: false },
  filesystem: {},
  cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
  serial_container_xtermjs: document.getElementById("terminal"),
  autostart: true,
  disable_keyboard: false,
});

const bootStart = performance.now();

emulator.add_listener("download-progress", (e) => {
  bootFile.textContent = e.file_name.split("/").pop();
  if (e.lengthComputable) {
    const pct = Math.round((e.loaded / e.total) * 100);
    bootPct.textContent = pct + "%";
    bootFill.style.width = pct + "%";
  }
});

emulator.add_listener("emulator-loaded", () => {
  statusDot.classList.add("booting");
});

emulator.add_listener("emulator-started", () => {
  statusDot.classList.remove("booting");
  statusDot.classList.add("running");
  btnRestart.disabled = false;
  btnPause.disabled = false;
  btnStop.disabled = false;
  setTimeout(() => bootProgress.classList.add("hidden"), 800);
});

emulator.add_listener("emulator-stopped", () => {
  statusDot.classList.remove("running");
});

// Live stats
setInterval(() => {
  if (!emulator.is_running()) return;
  const secs = Math.floor((performance.now() - bootStart) / 1000);
  statUptime.textContent = secs + "s";
  const n = emulator.get_instruction_counter();
  statInstr.textContent =
    n > 1e9 ? (n / 1e9).toFixed(2) + "B" : n > 1e6 ? (n / 1e6).toFixed(1) + "M" : n;
}, 1000);

btnRestart.addEventListener("click", () => emulator.restart());

btnPause.addEventListener("click", () => {
  if (emulator.is_running()) {
    emulator.stop();
    btnPause.textContent = "resume";
  } else {
    emulator.run();
    btnPause.textContent = "pause";
  }
});

btnStop.addEventListener("click", () => {
  emulator.stop();
  btnRestart.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
});
