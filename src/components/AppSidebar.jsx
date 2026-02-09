import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/schemas';
import { PredictiveInput } from '@/components/ui/predictive-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { createMap, getUserMaps, getLibrary, deleteMap } from '@/lib/db-service';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const sortByDate = (maps) => maps.sort((a, b) => ((b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0))));

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
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { titleA: "", yearA: "", authorA: "", formA: "", titleB: "", yearB: "", authorB: "", formB: "" },
  });

  // Fetch library on mount/auth
  useEffect(() => {
    getLibrary().then(setLibrary);
  }, []);

  const handlePredict = (side, text) => {
    form.setValue(`title${side}`, text);
    const data = library.find(t => t.title.toLowerCase() === text.toLowerCase());
    if (!data) return;

    form.setValue(`year${side}`, data.year);
    form.setValue(`author${side}`, data.author);
    form.setValue(`form${side}`, data.form);

    if (side === 'A' && data.suggestedB) {
      const sug = library.find(t => t.title === data.suggestedB.title);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMap(deleteTarget.id);
    setMaps(prev => prev.filter(m => m.id !== deleteTarget.id));
    if (mapId === deleteTarget.id) navigate('/');
    setDeleteTarget(null);
  };

  const titles = library.map(t => t.title);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <h1 className="text-3xl font-black text-sidebar-foreground tracking-tight font-serif">Comparative</h1>
            <p className="text-sm font-semibold text-sidebar-foreground/60 uppercase tracking-widest">Bridge Your Meanings</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button size="sm" className="w-fit"><Plus className="mr-2 h-4 w-4" /> New Project</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif italic text-xl">
                {form.watch("titleA") || "Text A"} vs. {form.watch("titleB") || "Text B"}
              </DialogTitle>
              <DialogDescription>Select two texts to compare.</DialogDescription>
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
                  <SidebarMenuItem key={map.id} className="group/item">
                    <SidebarMenuButton asChild isActive={map.id === mapId} className="h-auto py-3">
                      <button onClick={() => navigate(`/map/${map.id}`)}>
                        <div className="w-full text-left pr-6">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="leading-tight">
                                <div className="text-sm font-semibold text-sidebar-foreground truncate">{map.sourceA || map.title}</div>
                                {map.sourceB && <div className="text-xs text-muted-foreground italic">vs. <span className="font-semibold">{map.sourceB}</span></div>}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">{map.sourceA || map.title}{map.sourceB ? ` vs. ${map.sourceB}` : ''}</TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-muted-foreground mt-1">{map.bridges?.length || 0} bridge{(map.bridges?.length || 0) !== 1 ? 's' : ''}</div>
                        </div>
                      </button>
                    </SidebarMenuButton>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setDeleteTarget(map); }} title="Delete project">
                      <Trash2 size={14} />
                    </Button>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2"><UserButton afterSignOutUrl="/" /></div>
      </SidebarFooter>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>This will permanently delete "{deleteTarget?.title}". This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
