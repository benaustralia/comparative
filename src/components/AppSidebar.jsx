import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Plus, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/schemas';
import { VCE_LIBRARY_2026 } from '@/lib/vce-data';
import { PredictiveInput } from '@/components/ui/predictive-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { createMap, getUserMaps } from '@/lib/db-service';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const findText = (title) => VCE_LIBRARY_2026.find(t => t.title.toLowerCase() === title.toLowerCase());
const sortByDate = (maps) => maps.sort((a, b) => ((b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0))));
const titles = VCE_LIBRARY_2026.map(t => t.title);

const Field = ({ control, name, children }) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem><FormControl>{children(field)}</FormControl><FormMessage /></FormItem>
  )} />
);

export default function AppSidebar() {
  const { user } = useUser();
  const { firebaseUid, isAuthReady } = useFirebaseAuth();
  const navigate = useNavigate();
  const { mapId } = useParams();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { titleA: "", yearA: "", authorA: "", formA: "", titleB: "", yearB: "", authorB: "", formB: "" },
  });

  const handlePredict = (side, text) => {
    form.setValue(`title${side}`, text);
    const data = VCE_LIBRARY_2026.find(t => t.title.toLowerCase() === text.toLowerCase());
    if (!data) return;

    form.setValue(`year${side}`, data.year);
    form.setValue(`author${side}`, data.author);
    form.setValue(`form${side}`, data.form);

    if (side === 'A' && data.suggestedB) {
      const sug = VCE_LIBRARY_2026.find(t => t.title === data.suggestedB.title);
      if (sug) {
        handlePredict('B', sug.title);
      } else {
        form.setValue('titleB', data.suggestedB.title);
        form.setValue('yearB', data.suggestedB.year);
        form.setValue('authorB', data.suggestedB.author);
        form.setValue('formB', data.suggestedB.form);
      }
    }
  };

  useEffect(() => {
    if (!user || !isAuthReady) return;
    const uid = firebaseUid || user?.id;
    if (!uid) return;
    setLoading(true);
    getUserMaps(uid, user?.primaryEmailAddress?.emailAddress)
      .then(m => setMaps(sortByDate(m)))
      .catch(err => console.error("Failed to load maps", err))
      .finally(() => setLoading(false));
  }, [user, isAuthReady, firebaseUid]);

  const onSubmit = async (data) => {
    const uid = firebaseUid || user?.id;
    const name = `${data.titleA} (${data.yearA}) vs. ${data.titleB} (${data.yearB})`;
    const id = await createMap(uid, { title: name, sourceA: data.titleA, sourceB: data.titleB, formA: data.formA, formB: data.formB, yearA: data.yearA, authorA: data.authorA, yearB: data.yearB, authorB: data.authorB });
    form.reset(); setDialogOpen(false);
    getUserMaps(uid, user?.primaryEmailAddress?.emailAddress).then(m => setMaps(sortByDate(m)));
    navigate(`/map/${id}`);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Comparative</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bridge Your Meanings</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="w-full justify-start" size="sm"><Plus className="mr-2 h-4 w-4" /> New Project</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif italic text-xl">
                {form.watch("titleA") || "Text A"} vs. {form.watch("titleB") || "Text B"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex justify-between">
                    <span>Text A</span><span className="text-[10px] text-slate-400 font-normal">Primary Text</span>
                  </div>
                  <Field control={form.control} name="titleA">{f => <PredictiveInput placeholder="Title (e.g. Macbeth)" className="h-9 text-sm" {...f} suggestions={titles} onPredictionAccept={(t) => handlePredict('A', t)} />}</Field>
                  <Field control={form.control} name="authorA">{f => <Input placeholder="Author" className="h-8 text-xs" {...f} />}</Field>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex justify-between">
                    <span>Text B</span><span className="text-[10px] text-slate-400 font-normal">Comparison</span>
                  </div>
                  <Field control={form.control} name="titleB">{f => <PredictiveInput placeholder="Title (e.g. Animal Farm)" className="h-9 text-sm" {...f} suggestions={titles} onPredictionAccept={(t) => handlePredict('B', t)} />}</Field>
                  <Field control={form.control} name="authorB">{f => <Input placeholder="Author" className="h-8 text-xs" {...f} />}</Field>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Project</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? <div className="px-4 py-2 text-xs text-slate-400">Loading...</div>
                : !maps.length ? (
                  <div className="text-center py-8 px-4">
                    <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No projects yet</p>
                    <p className="text-xs text-slate-400 mt-1">Create your first project above</p>
                  </div>
                ) : maps.map(map => (
                  <SidebarMenuItem key={map.id}>
                    <SidebarMenuButton asChild isActive={map.id === mapId} className="h-auto py-3">
                      <button onClick={() => navigate(`/map/${map.id}`)}>
                        <div className="w-full text-left">
                          <div className="text-sm font-semibold truncate">{map.title}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-blue-600 font-medium truncate">{map.sourceA}</span>
                            <span className="text-[10px] text-slate-300">vs</span>
                            <span className="text-[10px] text-orange-600 font-medium truncate">{map.sourceB}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{map.bridges?.length || 0} bridge{(map.bridges?.length || 0) !== 1 ? 's' : ''}</div>
                        </div>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2"><UserButton afterSignOutUrl="/" /></div>
      </SidebarFooter>
    </Sidebar>
  );
}
