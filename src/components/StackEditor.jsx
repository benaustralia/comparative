import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, GitMerge } from 'lucide-react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bridgeArraySchema, bridgesFormSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FORMS, TECHS } from '@/lib/form-data';

const LabelBadge = ({ color, label }) => (
  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
);

function StackCard({ index, control, remove, update }) {
  const [open, setOpen] = useState(true);
  
  // Watch fields to determine status and available techs
  const item = useWatch({
    control,
    name: `bridges.${index}`,
  });

  if (!item) return null;

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'}`}>
      <div onClick={() => setOpen(!open)} className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold ${item.status === 'bridge' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>{index + 1}</div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.status === 'bridge' ? 'Complete Bridge' : 'Building'}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="p-4 space-y-6">
          <div className="space-y-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-full" />
            <div className="pl-4 space-y-2">
              <LabelBadge color="text-blue-600" label="Source A" />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={control}
                  name={`bridges.${index}.sideA.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Form" /></SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {Object.entries(FORMS).map(([key, group], idx) => (
                            <React.Fragment key={key}>
                              {idx > 0 && <SelectSeparator />}
                              <SelectGroup>
                                <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                                {group.options.map(opt => (
                                  <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                                ))}
                              </SelectGroup>
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`bridges.${index}.sideA.tech`}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!item.sideA.type}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Technique" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!item.sideA.type ? (
                            <SelectItem value="hint" disabled className="text-slate-400 italic">
                              Select a Form first...
                            </SelectItem>
                          ) : (
                            (TECHS[item.sideA.type] || []).map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name={`bridges.${index}.sideA.ctx`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-8 text-xs" placeholder="Context (e.g. Chapter 1)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`bridges.${index}.sideA.ev`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea className="min-h-[50px] text-xs resize-none bg-slate-50 font-serif" placeholder="Evidence / Quote..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-1">
                <FormField
                  control={control}
                  name={`bridges.${index}.sideA.meaning`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="h-8 text-xs font-medium text-blue-900 bg-blue-50 border-blue-100 placeholder:text-blue-300 font-serif" placeholder="Meaning A (The Effect?)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 py-1">
             <div className="h-px bg-slate-200 flex-1"></div>
             <GitMerge size={16} />
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="space-y-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-200 rounded-full" />
            <div className="pl-4 space-y-2">
              <LabelBadge color="text-orange-600" label="Source B" />
              {!item.sideB.type ? (
                <FormField
                  control={control}
                  name={`bridges.${index}.sideB.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 text-xs border-dashed text-slate-400 hover:text-slate-600 hover:border-slate-300">
                            <SelectValue placeholder="+ Connect Source B" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {Object.entries(FORMS).map(([key, group], idx) => (
                            <React.Fragment key={key}>
                              {idx > 0 && <SelectSeparator />}
                              <SelectGroup>
                                <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                                {group.options.map(opt => (
                                  <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                                ))}
                              </SelectGroup>
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`bridges.${index}.sideB.type`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Form" /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {Object.entries(FORMS).map(([key, group], idx) => (
                                <React.Fragment key={key}>
                                  {idx > 0 && <SelectSeparator />}
                                  <SelectGroup>
                                    <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                                    {group.options.map(opt => (
                                      <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </React.Fragment>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`bridges.${index}.sideB.tech`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!item.sideB.type}>
                            <FormControl>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Technique" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!item.sideB.type ? (
                                <SelectItem value="hint" disabled className="text-slate-400 italic">
                                  Select a Form first...
                                </SelectItem>
                              ) : (
                                (TECHS[item.sideB.type] || []).map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name={`bridges.${index}.sideB.ctx`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="h-8 text-xs" placeholder="Context (e.g. Scene 1)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`bridges.${index}.sideB.ev`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea className="min-h-[50px] text-xs resize-none bg-slate-50 font-serif" placeholder="Evidence / Visuals..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-1">
                    <FormField
                      control={control}
                      name={`bridges.${index}.sideB.meaning`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="h-8 text-xs font-medium text-orange-900 bg-orange-50 border-orange-100 placeholder:text-orange-300 font-serif" placeholder="Meaning B (The Effect?)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {item.sideB.type && (
            <div className="pt-2 animate-in fade-in">
              <LabelBadge color="text-purple-600" label="The Synthesis (Shared Meaning)" />
              <FormField
                control={control}
                name={`bridges.${index}.synthesis`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea className="mt-1 min-h-[60px] text-xs resize-none !bg-slate-900 !text-white !border-slate-700 placeholder:!text-slate-400" placeholder="How does the meaning shift or evolve between texts?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" className="text-red-400 h-8 text-xs hover:text-red-600" onClick={() => remove(index)}>
              <Trash2 size={14} className="mr-1"/> Remove Bridge
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StackEditor({ bridges, onBridgesChange, sourceAForm, sourceBForm }) {
  const form = useForm({
    resolver: zodResolver(bridgesFormSchema),
    defaultValues: {
      bridges: bridges || []
    }
  });

  const { control, reset, watch, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bridges"
  });

  const watchedBridges = watch("bridges");

  // Debounced save
  useEffect(() => {
    const handler = setTimeout(() => {
      // Calculate status for each bridge before saving
      const updatedBridges = watchedBridges.map(b => ({
        ...b,
        status: (b.sideA.type && b.sideB.type) ? 'bridge' : 'cantilever'
      }));
      
      // Only trigger update if content is different from props to avoid loops
      // We check if the *processed* updatedBridges is different from input bridges
      if (JSON.stringify(updatedBridges) !== JSON.stringify(bridges)) {
        onBridgesChange(updatedBridges);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [watchedBridges, onBridgesChange, bridges]);

  // Sync from props (handle external updates)
  useEffect(() => {
    const currentValues = getValues().bridges;
    // Only reset if incoming bridges are different from current form state
    // This prevents resetting when the prop update is just an echo of our own change
    if (bridges && JSON.stringify(bridges) !== JSON.stringify(currentValues)) {
       reset({ bridges });
    }
  }, [bridges, reset, getValues]);

  const addBridge = () => {
    append({
      id: Date.now(),
      status: 'cantilever',
      sideA: { type: sourceAForm || '', tech: '', ctx: '', ev: '', meaning: '' },
      sideB: { type: sourceBForm || '', tech: '', ctx: '', ev: '', meaning: '' },
      synthesis: ''
    });
  };

  return (
    <Form {...form}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {fields.map((item, index) => (
            <StackCard 
              key={item.id} 
              index={index} 
              control={control} 
              remove={remove} 
            />
          ))}
          <Button onClick={addBridge} className="w-full py-8 border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl flex flex-col items-center gap-2 transition-all">
            <Plus size={24} />
            <span className="font-bold text-sm uppercase">Add Cantilever</span>
          </Button>
        </div>
      </div>
    </Form>
  );
}
