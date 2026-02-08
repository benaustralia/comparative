import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebaseAuth } from './FirebaseAuthConfig';
import AppSidebar from './AppSidebar';
import MapEditor from './MapEditor';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import pace from 'pace-js';
import 'pace-js/themes/blue/pace-theme-minimal.css';

export default function WorkspaceLayout() {
  const { mapId } = useParams();
  const { isAuthLoading } = useFirebaseAuth();

  useEffect(() => { pace.start(); }, []);

  if (isAuthLoading) return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-slate-50 text-slate-400">
      <div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          {mapId && <><Separator orientation="vertical" className="mr-2 h-4" /><span className="font-semibold text-sm">Project Workspace</span></>}
        </header>
        {mapId ? (
          <div className="flex-1 overflow-hidden"><MapEditor mapId={mapId} /></div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400 text-center">
            <div>
              <p className="text-lg font-semibold">Select a project</p>
              <p className="text-sm mt-1">Choose a project from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
