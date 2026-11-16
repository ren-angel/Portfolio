import { Monitor, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { THEMES, WALLPAPERS, useSettings, type ThemePref } from "@/lib/settings";
import { playSound, setSoundsEnabled } from "@/lib/sounds";
import LangSwitcher from "../LangSwitcher";

const THEME_ICON: Record<ThemePref, typeof Sun> = { system: Monitor, light: Sun, night: Moon };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border-2 border-k-outline bg-k-surface/70 p-3">
      <legend className="rounded-full border-2 border-k-outline bg-k-lav px-3 font-heading text-sm">{title}</legend>
      {children}
    </fieldset>
  );
}

const choice = (on: boolean) =>
  `flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 p-2 text-center font-heading text-sm transition-transform hover:-translate-y-0.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 ${
    on ? "border-k-outline bg-k-pink shadow-[0_3px_0_var(--k-outline)]" : "border-k-outline/40 border-dashed"
  }`;

export default function SettingsWindow() {
  const { t } = useI18n();
  const s = t.settings;
  const { settings, update } = useSettings();

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <Group title={s.theme}>
        <div role="radiogroup" aria-label={s.theme} className="grid grid-cols-3 gap-2">
          {THEMES.map((th) => {
            const Icon = THEME_ICON[th];
            return (
              <label key={th} className={choice(settings.theme === th)}>
                <input type="radio" name="theme" value={th} checked={settings.theme === th} onChange={() => { playSound("click"); update({ theme: th }); }} className="sr-only" />
                <span
                  aria-hidden="true"
                  className="grid h-12 w-full place-items-center rounded-xl border-2 border-k-outline"
                  style={{
                    background: th === "night" ? "linear-gradient(160deg,#141129,#33244A)" : th === "light" ? "linear-gradient(160deg,#E3F2FD,#FFE3EE)" : "linear-gradient(110deg,#E3F2FD 50%,#141129 50%)",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: th === "night" ? "#F4ECFF" : "#4A3B52" }} />
                </span>
                {s.themes[th]}
              </label>
            );
          })}
        </div>
      </Group>

      <Group title={s.wallpaper}>
        <div role="radiogroup" aria-label={s.wallpaper} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WALLPAPERS.map((wp) => (
            <label key={wp} className={choice(settings.wallpaper === wp)}>
              <input type="radio" name="wallpaper" value={wp} checked={settings.wallpaper === wp} onChange={() => { playSound("click"); update({ wallpaper: wp }); }} className="sr-only" />
              <span aria-hidden="true" data-wp={wp} className="wallpaper block h-14 w-full rounded-xl border-2 border-k-outline" />
              {s.wallpapers[wp]}
            </label>
          ))}
        </div>
      </Group>

      <Group title={s.sounds}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={settings.sounds}
            onClick={() => {
              const on = !settings.sounds;
              setSoundsEnabled(on); // so this very click can already go 'bleep'
              update({ sounds: on });
              playSound("success");
            }}
            className={`relative h-8 w-16 shrink-0 rounded-full border-2 border-k-outline transition-colors ${settings.sounds ? "bg-k-mint" : "bg-k-surface"}`}
          >
            <span className={`absolute top-0.5 grid h-6 w-6 place-items-center rounded-full border-2 border-k-outline bg-k-cream transition-all ${settings.sounds ? "left-[34px]" : "left-0.5"}`}>
              {settings.sounds ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </span>
            <span className="sr-only">{s.sounds}</span>
          </button>
          <span className="font-heading text-sm">{settings.sounds ? s.on : s.off}</span>
          <p className="w-full text-sm leading-6">{s.soundsHint}</p>
        </div>
      </Group>

      <Group title={t.ui.language}>
        <LangSwitcher />
      </Group>

      <p className="text-center font-heading text-xs">{s.saved}</p>
    </div>
  );
}
