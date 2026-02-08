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
  const { isAuthReady, isAuthLoading } = useFirebaseAuth();

  useEffect(() => {
    pace.start();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-sm font-medium">Connecting to secure database...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {mapId ? (
           <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-2">
                 <span className="font-semibold text-sm">Project Workspace</span>
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <MapEditor mapId={mapId} />
            </div>
           </>
        ) : (
          <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
              <div className="text-center">
                <p className="text-lg font-semibold">Select a project</p>
                <p className="text-sm mt-1">Choose a project from the sidebar or create a new one</p>
              </div>
            </div>
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
