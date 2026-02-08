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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { createMap, getUserMaps } from '@/lib/db-service';
import { FORMS } from '@/lib/form-data';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  const { user } = useUser();
  const { firebaseUid, isAuthReady } = useFirebaseAuth();
  const navigate = useNavigate();
  const { mapId } = useParams();

  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestedTitleB, setSuggestedTitleB] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titleA: "",
      yearA: "",
      authorA: "",
      formA: "",
      titleB: "",
      yearB: "",
      authorB: "",
      formB: "",
    },
  });

  const handleTitleAAccept = (titleA) => {
    // Populate form with Source A details
    form.setValue('titleA', titleA);
    const selected = VCE_LIBRARY_2026.find(t => t.title.toLowerCase() === titleA.toLowerCase());
    if (selected) {
      form.setValue('yearA', selected.year);
      form.setValue('authorA', selected.author);
      form.setValue('formA', selected.form);
      
      // If a pair is suggested, set it as the ghost text recommendation for Title B
      if (selected.suggestedB) {
        setSuggestedTitleB(selected.suggestedB.title);
        // Do NOT populate Title B yet - wait for user to accept the ghost text
      } else {
        setSuggestedTitleB("");
      }
    }
  };

  const handleTitleBAccept = (titleB) => {
    form.setValue('titleB', titleB);
    // Try to find if this title matches a suggested B from our library (either as a primary text or just by name)
    // We look for it in VCE_LIBRARY_2026 or check if it matches the current suggestedB
    
    // Check if it matches the currently suggested pair first
    const titleA = form.getValues('titleA');
    const selectedA = VCE_LIBRARY_2026.find(t => t.title.toLowerCase() === titleA.toLowerCase());
    
    if (selectedA && selectedA.suggestedB && selectedA.suggestedB.title.toLowerCase() === titleB.toLowerCase()) {
       const bData = selectedA.suggestedB;
       form.setValue('yearB', bData.year);
       form.setValue('authorB', bData.author);
       form.setValue('formB', bData.form);
       return;
    }

    // Fallback: Check if titleB is a primary text in our library (rare but possible to compare two Source As)
    const selectedB = VCE_LIBRARY_2026.find(t => t.title.toLowerCase() === titleB.toLowerCase());
    if (selectedB) {
       form.setValue('yearB', selectedB.year);
       form.setValue('authorB', selectedB.author);
       form.setValue('formB', selectedB.form);
    }
  };

  useEffect(() => {
    const loadMaps = async () => {
      try {
        setLoading(true);
        const email = user?.primaryEmailAddress?.emailAddress;
        const currentUserId = firebaseUid || user?.id;
        if (!currentUserId) return;
        const userMaps = await getUserMaps(currentUserId, email);
        console.log('Current Projects:', userMaps);
        const sorted = userMaps.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });
        setMaps(sorted);
      } catch (error) {
        console.error("Failed to load maps", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAuthReady) {
      loadMaps();
    }
  }, [user, isAuthReady, firebaseUid]);

  const onSubmit = async (data) => {
    try {
      const currentUserId = firebaseUid || user?.id;
      // High-legibility Serif display logic: ${sourceA.title} (${sourceA.year}) vs. ${sourceB.title} (${sourceB.year})
      const projectName = `${data.titleA} (${data.yearA}) vs. ${data.titleB} (${data.yearB})`;
      const mapIdNew = await createMap(
        currentUserId, 
        projectName, 
        data.titleA, 
        data.titleB, 
        data.formA, 
        data.formB,
        data.yearA,
        data.authorA,
        data.yearB,
        data.authorB
      );
      
      form.reset();
      setDialogOpen(false);
      
      // Reload maps
      const email = user?.primaryEmailAddress?.emailAddress;
      const userMaps = await getUserMaps(currentUserId, email);
      setMaps(userMaps.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA;
      }));
      navigate(`/map/${mapIdNew}`);
    } catch (error) {
      console.error("Failed to create map", error);
    }
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
        
        {/* New Project Dialog Trigger */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full justify-start" size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Comparative Project</DialogTitle>
              <DialogDescription>Enter the two texts you want to compare.</DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex justify-between">
                    <span>Text A</span>
                    <span className="text-[10px] text-slate-400 font-normal">Primary Text</span>
                  </div>
                  
                  {/* Predictive Title Select */}
                  <FormField
                    control={form.control}
                    name="titleA"
                    render={({ field }) => (
                      <FormItem>
                         <div className="relative">
                           <FormControl>
                              <PredictiveInput 
                                placeholder="Title (e.g. Macbeth)" 
                                className="h-9 text-sm" 
                                {...field} 
                                suggestions={VCE_LIBRARY_2026.map(t => t.title)}
                                onPredictionAccept={handleTitleAAccept}
                              />
                           </FormControl>
                         </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1">
                    <FormField
                      control={form.control}
                      name="authorA"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Author" className="h-8 text-xs" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex justify-between">
                    <span>Text B</span>
                    <span className="text-[10px] text-slate-400 font-normal">Comparison</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="titleB"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PredictiveInput 
                            placeholder="Title (e.g. Animal Farm)" 
                            className="h-9 text-sm" 
                            {...field}
                            suggestions={VCE_LIBRARY_2026.map(t => t.title)}
                            recommended={suggestedTitleB}
                            onPredictionAccept={handleTitleBAccept}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1">
                    <FormField
                      control={form.control}
                      name="authorB"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Author" className="h-8 text-xs" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">
                    Create Project
                  </Button>
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
              {loading ? (
                 <div className="px-4 py-2 text-xs text-slate-400">Loading...</div>
              ) : maps.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500">No projects yet</p>
                  <p className="text-xs text-slate-400 mt-1">Create your first project above</p>
                </div>
              ) : (
                maps.map(map => (
                  <SidebarMenuItem key={map.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={map.id === mapId}
                      className="h-auto py-3"
                    >
                      <button onClick={() => navigate(`/map/${map.id}`)}>
                        <div className="w-full text-left">
                          <div className="text-sm font-semibold truncate">{map.title}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-blue-600 font-medium truncate">{map.sourceA}</span>
                            <span className="text-[10px] text-slate-300">vs</span>
                            <span className="text-[10px] text-orange-600 font-medium truncate">{map.sourceB}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {map.bridges?.length || 0} bridge{(map.bridges?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
         <div className="flex items-center justify-between p-2">
            <UserButton afterSignOutUrl="/" />
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
