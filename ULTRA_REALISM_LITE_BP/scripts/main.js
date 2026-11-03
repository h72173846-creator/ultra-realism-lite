import { world, system } from "@minecraft/server";

const MAX = 100;

function getThirst(p) {
  const v = p.getDynamicProperty("ur_thirst");
  return typeof v === "number" ? v : MAX;
}

function setThirst(p, v) {
  p.setDynamicProperty("ur_thirst", Math.max(0, Math.min(MAX, v)));
}

// كل 10 ثواني: العطش ينقص
system.runInterval(() => {
  for (const p of world.getAllPlayers()) {
    let t = getThirst(p) - 2;
    setThirst(p, t);

    if (t <= 0) {
      p.addEffect("slowness", 260, { amplifier: 1, showParticles: false });
      p.addEffect("weakness", 260, { amplifier: 0, showParticles: false });
    } else if (t <= 20) {
      p.addEffect("slowness", 260, { amplifier: 0, showParticles: false });
    }
  }
}, 200);

// كل ثانيتين: عرض العطش فوق الهوت بار
system.runInterval(() => {
  for (const p of world.getAllPlayers()) {
    p.onScreenDisplay.setActionBar("§bالعطش: " + getThirst(p) + "%");
  }
}, 40);

// شرب الماء يرجّع العطش
world.afterEvents.itemCompleteUse.subscribe((e) => {
  if (e.itemStack.typeId === "minecraft:potion") {
    setThirst(e.source, getThirst(e.source) + 40);
  }
});
