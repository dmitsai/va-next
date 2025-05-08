import { TopBar } from "~/widgets/topBar"
import React from "react";

export default ({ children }: Readonly<{ children: React.ReactNode }>) => (
<div className="min-h-screen h-screen flex flex-col">
    <TopBar  isAuth/>
   {children}
</div>
  
  );