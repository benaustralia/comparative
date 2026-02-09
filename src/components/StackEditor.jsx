import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, GitMerge } from 'lucide-react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bridgesFormSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FORMS, TECHS } from '@/lib/form-data';

const LabelBadge = ({ color, label }) => (
  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
);

const FormsSelect = ({ control, name, placeholder, triggerClass }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem>
      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
        <FormControl><SelectTrigger className={triggerClass || "h-9 text-xs"}><SelectValue placeholder={placeholder || "Form"} /></SelectTrigger></FormControl>
        <SelectContent className="max-h-[300px]">
          {Object.entries(FORMS).map(([key, group], idx) => (
            <React.Fragment key={key}>
              {idx > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                {group.options.map(opt => <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>)}
              </SelectGroup>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )} />
);

const TechSelect = ({ control, name, type }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem>
      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!type}>
        <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Technique" /></SelectTrigger></FormControl>
        <SelectContent>
          {!type
            ? <SelectItem value="hint" disabled className="text-slate-400 italic">Select a Form first...</SelectItem>
            : (TECHS[type] || []).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )} />
);

const TextField = ({ control, name, placeholder, className }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem><FormControl><Input className={className || "h-8 text-xs"} placeholder={placeholder} {...field} /></FormControl><FormMessage /></FormItem>
  )} />
);

const AreaField = ({ control, name, placeholder, className }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem><FormControl><Textarea className={className || "min-h-[50px] text-xs resize-none bg-slate-50 font-serif"} placeholder={placeholder} {...field} /></FormControl><FormMessage /></FormItem>
  )} />
);

const SIDE_CFG = {
  a: { label: 'Source A', color: 'text-blue-600', bar: 'bg-blue-200', meaning: 'h-8 text-xs font-medium text-blue-900 bg-blue-50 border-blue-100 placeholder:text-blue-400 font-serif', meaningPh: 'Meaning A (The Effect?)', ctxPh: 'Context (e.g. Chapter 1)', evPh: 'Evidence / Quote...' },
  b: { label: 'Source B', color: 'text-orange-600', bar: 'bg-orange-200', meaning: 'h-8 text-xs font-medium text-orange-900 bg-orange-50 border-orange-100 placeholder:text-orange-400 font-serif', meaningPh: 'Meaning B (The Effect?)', ctxPh: 'Context (e.g. Scene 1)', evPh: 'Evidence / Visuals...' },
};

const SidePanel = ({ side, index, control, item }) => {
  const cfg = SIDE_CFG[side];
  const sideKey = `side${side.toUpperCase()}`;
  const prefix = `bridges.${index}.${sideKey}`;
  return (
    <div className="space-y-3 relative">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar} rounded-full`} />
      <div className="pl-4 space-y-2">
        <LabelBadge color={cfg.color} label={cfg.label} />
        <div className="grid grid-cols-2 gap-2">
          <FormsSelect control={control} name={`${prefix}.type`} />
          <TechSelect control={control} name={`${prefix}.tech`} type={item[sideKey].type} />
        </div>
        <TextField control={control} name={`${prefix}.ctx`} placeholder={cfg.ctxPh} />
        <AreaField control={control} name={`${prefix}.ev`} placeholder={cfg.evPh} />
        <div className="pt-1"><TextField control={control} name={`${prefix}.meaning`} placeholder={cfg.meaningPh} className={cfg.meaning} /></div>
      </div>
    </div>
  );
};

function StackCard({ index, control, remove }) {
  const [open, setOpen] = useState(true);
  const item = useWatch({ control, name: `bridges.${index}` });
  if (!item) return null;

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'}`}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold ${item.status === 'bridge' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>{index + 1}</div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.status === 'bridge' ? 'Complete Bridge' : 'Building'}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 space-y-6">
          <SidePanel side="a" index={index} control={control} item={item} />
          <div className="flex items-center gap-2 text-slate-300 py-1">
            <div className="h-px bg-slate-200 flex-1" /><GitMerge size={16} /><div className="h-px bg-slate-200 flex-1" />
          </div>
          {!item.sideB.type ? (
            <div className="space-y-3 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-200 rounded-full" />
              <div className="pl-4 space-y-2">
                <LabelBadge color="text-orange-600" label="Source B" />
                <FormsSelect control={control} name={`bridges.${index}.sideB.type`} placeholder="+ Connect Source B" triggerClass="h-10 text-xs border-dashed text-slate-400 hover:text-slate-600 hover:border-slate-300" />
              </div>
            </div>
          ) : (
            <SidePanel side="b" index={index} control={control} item={item} />
          )}
          {item.sideB.type && (
            <div className="pt-2 animate-in fade-in">
              <LabelBadge color="text-purple-600" label="The Synthesis (Shared Meaning)" />
              <AreaField control={control} name={`bridges.${index}.synthesis`} placeholder="How does the meaning shift or evolve between texts?" className="mt-1 min-h-[60px] text-xs resize-none !bg-slate-900 !text-white !border-slate-700 placeholder:!text-slate-400" />
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" className="text-red-400 h-8 text-xs hover:text-red-600" onClick={() => remove(index)}>
              <Trash2 size={14} className="mr-1" /> Remove Bridge
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StackEditor({ bridges, onBridgesChange, sourceAForm, sourceBForm }) {
  const form = useForm({ resolver: zodResolver(bridgesFormSchema), defaultValues: { bridges: bridges || [] } });
  const { control, reset, watch, getValues } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "bridges" });
  const watchedBridges = watch("bridges");

  useEffect(() => {
    const handler = setTimeout(() => {
      const updated = watchedBridges.map(b => ({ ...b, status: (b.sideA.type && b.sideB.type) ? 'bridge' : 'cantilever' }));
      if (JSON.stringify(updated) !== JSON.stringify(bridges)) onBridgesChange(updated);
    }, 800);
    return () => clearTimeout(handler);
  }, [watchedBridges, onBridgesChange, bridges]);

  useEffect(() => {
    if (bridges && JSON.stringify(bridges) !== JSON.stringify(getValues().bridges)) reset({ bridges });
  }, [bridges, reset, getValues]);

  return (
    <Form {...form}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {fields.map((item, i) => <StackCard key={item.id} index={i} control={control} remove={remove} />)}
          <Button variant="outline" onClick={() => append({ id: Date.now(), status: 'cantilever', sideA: { type: sourceAForm || '', tech: '', ctx: '', ev: '', meaning: '' }, sideB: { type: sourceBForm || '', tech: '', ctx: '', ev: '', meaning: '' }, synthesis: '' })}>
            <Plus size={16} className="mr-2" /> Add Cantilever
          </Button>
        </div>
      </div>
    </Form>
  );
}
