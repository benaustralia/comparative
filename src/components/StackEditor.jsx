import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { segmentsFormSchema } from '@/lib/schemas';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const BODY_LABELS = ['One', 'Two', 'Three', 'Four'];

const LabelBadge = ({ color, label }) => (
  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
);


const AreaField = ({ control, name, placeholder, className, disabled }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem><FormControl><Textarea className={className || "min-h-[50px] text-sm resize-none bg-slate-50 font-serif"} placeholder={placeholder} disabled={disabled} {...field} /></FormControl><FormMessage /></FormItem>
  )} />
);


function FoundationCard({ index, control, onFlushStatus }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'}`}>
      <div className="w-full p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold bg-white text-slate-800">I</div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">Introduction</span>
          <ChevronDown size={16} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <FormField control={control} name={`segments.${index}.status`} render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={field.value === 'final'} onCheckedChange={(checked) => { const s = checked ? 'final' : 'draft'; field.onChange(s); onFlushStatus(index, s); }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{field.value === 'final' ? 'Final' : 'Draft'}</span>
          </div>
        )} />
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <AreaField control={control} name={`segments.${index}.content`} placeholder="Write your introduction here. Introduce both texts, the essay question, and your contention..." className="min-h-[120px] text-sm resize-none bg-slate-50 font-serif" />
        </div>
      )}
    </div>
  );
}

function KeystoneCard({ index, control, onFlushStatus }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'}`}>
      <div className="w-full p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold bg-white text-slate-800">C</div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">Conclusion</span>
          <ChevronDown size={16} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <FormField control={control} name={`segments.${index}.status`} render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={field.value === 'final'} onCheckedChange={(checked) => { const s = checked ? 'final' : 'draft'; field.onChange(s); onFlushStatus(index, s); }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{field.value === 'final' ? 'Final' : 'Draft'}</span>
          </div>
        )} />
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <AreaField control={control} name={`segments.${index}.content`} placeholder="Write your conclusion here. Synthesise your arguments and restate your contention..." className="min-h-[120px] text-sm resize-none bg-slate-50 font-serif" />
        </div>
      )}
    </div>
  );
}

function CantileverCard({ index, control, bodyNumber, onFlushStatus, onToggleActive }) {
  const [open, setOpen] = useState(true);
  const item = useWatch({ control, name: `segments.${index}` });
  if (!item?.teel) return null;

  const label = BODY_LABELS[bodyNumber - 1] || bodyNumber;
  const isB4 = bodyNumber === 4;
  const isActive = item.isActive !== false;
  const showBody = isB4 ? open && isActive : open;

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'} ${isB4 && !isActive ? 'opacity-50' : ''}`}>
      <div className="w-full p-4 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold bg-slate-800 text-white">B{bodyNumber}</div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Body Paragraph {label}</span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex items-center gap-4">
          {isB4 && (
            <FormField control={control} name={`segments.${index}.isActive`} render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`include-b4-${index}`}
                  checked={field.value !== false}
                  onCheckedChange={(checked) => {
                    field.onChange(!!checked);
                    onToggleActive(index, !!checked);
                  }}
                />
                <label htmlFor={`include-b4-${index}`} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 cursor-pointer select-none">
                  Include
                </label>
              </div>
            )} />
          )}
          <FormField control={control} name={`segments.${index}.status`} render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch disabled={isB4 && !isActive} checked={field.value === 'final'} onCheckedChange={(checked) => { const s = checked ? 'final' : 'draft'; field.onChange(s); onFlushStatus(index, s); }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{field.value === 'final' ? 'Final' : 'Draft'}</span>
            </div>
          )} />
        </div>
      </div>
      {showBody && (
        <div className="p-4 space-y-4">
          <div>
            <LabelBadge color="text-slate-500" label="Topic Sentence" />
            <AreaField control={control} name={`segments.${index}.teel.topic`} placeholder="Your topic sentence for this paragraph..." className="min-h-[50px] text-sm resize-none bg-slate-50 font-serif" disabled={isB4 && !isActive} />
          </div>
          <div>
            <LabelBadge color="text-slate-500" label="Evidence Sentence" />
            <AreaField control={control} name={`segments.${index}.teel.blocks.0.evidence`} placeholder="Your evidence for this paragraph..." className="min-h-[50px] text-sm resize-none bg-slate-50 font-serif" disabled={isB4 && !isActive} />
          </div>
          <div>
            <LabelBadge color="text-slate-500" label="Explanation Sentence" />
            <AreaField control={control} name={`segments.${index}.teel.blocks.0.explanation`} placeholder="Your explanation of the evidence..." className="min-h-[50px] text-sm resize-none bg-slate-50 font-serif" disabled={isB4 && !isActive} />
          </div>
          <div>
            <LabelBadge color="text-slate-500" label="Link Sentence" />
            <AreaField control={control} name={`segments.${index}.teel.link`} placeholder="Link back to the essay question or transition to the next paragraph..." className="min-h-[50px] text-sm resize-none bg-slate-50 font-serif" disabled={isB4 && !isActive} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StackEditor({ segments, onSegmentsChange }) {
  const form = useForm({ resolver: zodResolver(segmentsFormSchema), defaultValues: { segments: segments || [] } });
  const { control, reset, watch, getValues } = form;
  const { fields } = useFieldArray({ control, name: "segments" });
  const watchedSegments = watch("segments");

  const flushStatus = (index, newStatus) => {
    const current = getValues().segments;
    const updated = current.map((s, i) => i === index ? { ...s, status: newStatus } : s);
    onSegmentsChange(updated);
  };

  const toggleActive = (index, active) => {
    const current = getValues().segments;
    const updated = current.map((s, i) => i === index ? { ...s, isActive: active } : s);
    onSegmentsChange(updated);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (JSON.stringify(watchedSegments) !== JSON.stringify(segments)) onSegmentsChange(watchedSegments);
    }, 800);
    return () => clearTimeout(handler);
  }, [watchedSegments, onSegmentsChange, segments]);

  useEffect(() => {
    if (segments && JSON.stringify(segments) !== JSON.stringify(getValues().segments)) reset({ segments });
  }, [segments, reset, getValues]);

  return (
    <Form {...form}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {(() => {
            let bodyNum = 0;
            return fields.map((item, i) => {
              const seg = watchedSegments?.[i];
              if (!seg) return null;
              if (seg.kind === 'foundation') return <FoundationCard key={item.id} index={i} control={control} onFlushStatus={flushStatus} />;
              if (seg.kind === 'keystone') return <KeystoneCard key={item.id} index={i} control={control} onFlushStatus={flushStatus} />;
              bodyNum++;
              return <CantileverCard key={item.id} index={i} control={control} bodyNumber={bodyNum} onFlushStatus={flushStatus} onToggleActive={toggleActive} />;
            });
          })()}
        </div>
      </div>
    </Form>
  );
}
