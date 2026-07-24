import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp, DEMO_PROFILE, type Profile } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";

export function TasteProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const lang = useApp((s) => s.lang);
  const setProfile = useApp((s) => s.setProfile);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const existing = useApp((s) => s.profile);
  const t = dict[lang];

  const [form, setForm] = useState<Profile>(existing ?? DEMO_PROFILE);
  useEffect(() => {
    if (open) setForm(existing ?? DEMO_PROFILE);
  }, [open, existing]);

  const toggleTaste = (id: string) =>
    setForm((f) => ({ ...f, taste: f.taste.includes(id) ? f.taste.filter((x) => x !== id) : [...f.taste, id] }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t.profile.title}</DialogTitle>
          <DialogDescription>{t.profile.subtitle}</DialogDescription>
        </DialogHeader>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-coral/40 bg-coral/5 hover:bg-coral/10 text-foreground"
          onClick={() => {
            useDemoProfile();
            onOpenChange(false);
          }}
        >
          <Sparkles className="h-4 w-4 text-coral" />
          {t.profile.useDemo}
          <span className="ml-auto text-xs text-muted-foreground">Taikoo Li · 4h · no spicy</span>
        </Button>

        <div className="grid grid-cols-3 gap-3">
          <FieldNum label={t.profile.time} value={form.hours} onChange={(v) => setForm({ ...form, hours: v })} min={1} max={12} suffix="h" />
          <Field label={t.profile.start} value={form.start} onChange={(v) => setForm({ ...form, start: v })} />
          <Field label={t.profile.endBy} value={form.endBy} onChange={(v) => setForm({ ...form, endBy: v })} />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.taste}</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {t.profile.tasteOptions.map((o) => {
              const on = form.taste.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggleTaste(o.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition",
                    on
                      ? "border-transparent bg-foreground text-background"
                      : "border-border bg-card hover:border-foreground/40",
                  )}
                >
                  {on && <Check className="h-3.5 w-3.5 inline -ml-0.5 mr-1" />}
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ChoiceGroup label={t.profile.diet} value={form.diet} options={t.profile.dietOptions} onChange={(v) => setForm({ ...form, diet: v })} />
          <ChoiceGroup label={t.profile.walking} value={form.walking} options={t.profile.walkingOptions} onChange={(v) => setForm({ ...form, walking: v })} />
          <ChoiceGroup label={t.profile.weather} value={form.weather} options={t.profile.weatherOptions} onChange={(v) => setForm({ ...form, weather: v })} />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.request}</Label>
          <Textarea
            className="mt-2"
            placeholder={t.profile.requestPh}
            value={form.request}
            onChange={(e) => setForm({ ...form, request: e.target.value })}
            rows={3}
          />
        </div>

        <Button
          className="w-full bg-coral text-coral-foreground hover:bg-coral/90"
          onClick={() => {
            setProfile(form);
            onOpenChange(false);
          }}
        >
          {t.profile.save}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input className="mt-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldNum({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || min)}
        />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function ChoiceGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string }[];
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="mt-2 flex flex-col gap-1.5">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition",
                on ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
