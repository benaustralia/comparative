import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, BookOpen, Sparkles, Languages, Network } from 'lucide-react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { segmentsFormSchema } from '@/lib/schemas';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";


function VocabularyRibbon({ words, content }) {
  if (!words || words.length === 0) return null;
  const contentLower = (content || '').toLowerCase();
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {words.map((word, i) => {
        const used = contentLower.includes(word.toLowerCase());
        return (
          <Badge
            key={i}
            variant={used ? 'secondary' : 'outline'}
            className={`text-xs transition-all ${used ? 'line-through opacity-60' : ''}`}
          >
            {word}
          </Badge>
        );
      })}
    </div>
  );
}


function ActionToolbar({ onExample, onMentor, onVocabulary, onBridge, isCantilever, loading }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 mt-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={onExample} disabled={loading}>
              <BookOpen size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Example</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={onMentor} disabled={loading}>
              <Sparkles size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mentor</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={onVocabulary} disabled={loading}>
              <Languages size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vocabulary</TooltipContent>
        </Tooltip>
        {isCantilever && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={onBridge}>
                <Network size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bridge Mode</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}


function FoundationCard({ index, control, onFlushStatus, vocabulary, onExample, onMentor, onVocabulary, loading }) {
  const [open, setOpen] = useState(true);
  const content = useWatch({ control, name: `segments.${index}.content` });
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
        <div className="p-4">
          <VocabularyRibbon words={vocabulary} content={content} />
          <FormField control={control} name={`segments.${index}.content`} render={({ field }) => (
            <FormItem><FormControl><Textarea className="min-h-[140px] text-sm resize-none bg-slate-50 font-serif" placeholder="Write your introduction here. Introduce both texts, the essay question, and your contention..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <ActionToolbar
            onExample={onExample}
            onMentor={onMentor}
            onVocabulary={onVocabulary}
            isCantilever={false}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}


function KeystoneCard({ index, control, onFlushStatus, vocabulary, onExample, onMentor, onVocabulary, loading }) {
  const [open, setOpen] = useState(true);
  const content = useWatch({ control, name: `segments.${index}.content` });
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
        <div className="p-4">
          <VocabularyRibbon words={vocabulary} content={content} />
          <FormField control={control} name={`segments.${index}.content`} render={({ field }) => (
            <FormItem><FormControl><Textarea className="min-h-[140px] text-sm resize-none bg-slate-50 font-serif" placeholder="Write your conclusion here. Synthesise your arguments and restate your contention..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <ActionToolbar
            onExample={onExample}
            onMentor={onMentor}
            onVocabulary={onVocabulary}
            isCantilever={false}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}


const BODY_LABELS = ['One', 'Two', 'Three', 'Four'];

function CantileverCard({ index, control, bodyNumber, onFlushStatus, onToggleActive, vocabulary, onExample, onMentor, onVocabulary, loading }) {
  const [open, setOpen] = useState(true);
  const item = useWatch({ control, name: `segments.${index}` });
  const content = item?.content || '';

  const label = BODY_LABELS[bodyNumber - 1] || bodyNumber;
  const isB4 = bodyNumber === 4;
  const isActive = item?.isActive !== false;
  const showBody = isB4 ? open && isActive : open;

  const handleBridge = useCallback(() => {
    console.log('Enter Bridge Mode');
  }, []);

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
        <div className="p-4">
          <VocabularyRibbon words={vocabulary} content={content} />
          <FormField control={control} name={`segments.${index}.content`} render={({ field }) => (
            <FormItem><FormControl><Textarea className="min-h-[180px] text-sm resize-none bg-slate-50 font-serif" placeholder={`Draft your body paragraph here. Use TEEL structure: Topic sentence, Evidence (quote), Explanation of technique, Link back to question...`} disabled={isB4 && !isActive} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <ActionToolbar
            onExample={onExample}
            onMentor={onMentor}
            onVocabulary={onVocabulary}
            onBridge={handleBridge}
            isCantilever={true}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}


export default function StackEditor({ segments, onSegmentsChange, onExample, onMentor, onVocabulary, vocabularyWords, aiLoading }) {
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
              if (seg.kind === 'foundation') return (
                <FoundationCard
                  key={item.id} index={i} control={control}
                  onFlushStatus={flushStatus}
                  vocabulary={vocabularyWords}
                  onExample={onExample}
                  onMentor={() => onMentor?.(seg)}
                  onVocabulary={onVocabulary}
                  loading={aiLoading}
                />
              );
              if (seg.kind === 'keystone') return (
                <KeystoneCard
                  key={item.id} index={i} control={control}
                  onFlushStatus={flushStatus}
                  vocabulary={vocabularyWords}
                  onExample={onExample}
                  onMentor={() => onMentor?.(seg)}
                  onVocabulary={onVocabulary}
                  loading={aiLoading}
                />
              );
              bodyNum++;
              return (
                <CantileverCard
                  key={item.id} index={i} control={control}
                  bodyNumber={bodyNum}
                  onFlushStatus={flushStatus} onToggleActive={toggleActive}
                  vocabulary={vocabularyWords}
                  onExample={onExample}
                  onMentor={() => onMentor?.(seg)}
                  onVocabulary={onVocabulary}
                  loading={aiLoading}
                />
              );
            });
          })()}
        </div>
      </div>
    </Form>
  );
}
